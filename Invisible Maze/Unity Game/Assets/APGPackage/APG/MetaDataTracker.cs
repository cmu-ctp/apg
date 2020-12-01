using UnityEngine;
using UnityEngine.SceneManagement;
using APG;
using System.Collections.Generic;
using System.Collections;
using System.Linq;
using System;
using StackExchange.Redis;
using Newtonsoft.Json;

namespace APG {

    public class MetaDataTracker : MonoBehaviour {

        private static MetaDataTracker _instance = null;
        public static MetaDataTracker Instance {  get { return _instance; } }

        private List<IMetaDataTrackable> mdItems = new List<IMetaDataTrackable>();

        private long keyFrameNum = 0;
        private int inbetweenNum = 0;
        private float lastKeyTime = 0;

        private List<Hashtable> tweens = new List<Hashtable>();
        private Hashtable currentFrameData = new Hashtable();

        public string metaDataURL = "localhost";
        public int metaDataPort = 6379;
        public int metaDataKeepAlive = 180;
        public string metaDataPassword = "changeme";
        public bool connectOnStart = false;

        [Tooltip("Name of your game, hardcoded for the start message")]
        public string gameName = "";
        [Tooltip("Name of the streamer, ideally set before connection")]
        public string streamerName = "";

        private ConnectionMultiplexer redisConn;
        private IDatabase redDb = null;
        private const string LATEST_FRAME = "latest";
        private const string START_FRAME = "start_frame";
        private const string END_FRAME = "end_frame";

        [Tooltip("The number of seconds per keyframe")]
        public float keyFrameRate = 1.0f;

        // Use this for initialization
        void Awake() {
            if(_instance != null) {
                Debug.LogWarning("Multiple MetaDataTrackers in Scene");
                Destroy(this.gameObject);
            }
            else {
                _instance = this;
                DontDestroyOnLoad(this);
                SceneManager.activeSceneChanged += OnSceneChange;
            }
        }

        IEnumerator Start() {
            yield return new WaitForEndOfFrame();
            if (connectOnStart) {
                StartMetaDataConnection();
            }
            SnapKeyFrame();
        }

        public void StartMetaDataConnection() {
            ConfigurationOptions config = new ConfigurationOptions {
                EndPoints = {
                    { metaDataURL, metaDataPort },
                },
                KeepAlive = metaDataKeepAlive,
                Password = metaDataPassword
            };

            redisConn = ConnectionMultiplexer.Connect(config);
            redDb = redisConn.GetDatabase();

            var startMessage = new Hashtable() {
                { "game_name", gameName },
                {"streamer_name", streamerName },
                {"key_frame_rate", keyFrameRate },
                {"tween_frame_rate", Application.targetFrameRate }, // I am not confident this is the right value but conceptually this is the idea. Ultimately we probably want this living in its own coroutine.
                {"game_secs", Time.fixedTime },
                {"clock_mills",DateTimeOffset.Now.ToUnixTimeMilliseconds().ToString() },
            };
            string mess = JsonConvert.SerializeObject(startMessage);
            Debug.Log("Start Metadata:" + mess);
            redDb.StringSet(START_FRAME, mess);
        }

        public void EndMetaDataConnection() {
            var endMessage = new Hashtable() {
                {"final_frame_num", keyFrameNum },
                {"game_secs", Time.fixedTime },
                {"clock_mills",DateTimeOffset.Now.ToUnixTimeMilliseconds().ToString() },
            };
            string mess = JsonConvert.SerializeObject(endMessage);
            Debug.Log("End Metadata:" + mess);
            redDb.StringSet(END_FRAME, mess);
        }

        /** General Data Schema
         * keyFrameNum: {"key":{"obj_id1":{...}, "obj_id2":{...}, ...}, 
         *               "tweens": [{"obj_id1":{...}, "obj_id2":{...}, ...},
         *                          {"obj_id1":{...}, "obj_id2":{...}, ...}]}
         *                    
         * Would be nice to have this as a low-bandwidth option
         * keyFrameNum: {"key":{"obj_id1":{}, "obj_id2":{}, ...}}
         * 
         * Possible Future Schema
         * keyFrameNum: {"key":{"obj_id1":{...}, "obj_id2":{...}, ...}, 
         *               "tweens": [{"obj_id1":{...}, "obj_id2":{...}, ...},
         *                          {"obj_id1":{...}, "obj_id2":{...}, ...}],
         *               "events": [{"event1"}, {"event2"}]}
         * 
         */
        void FixedUpdated() {
            if (Time.fixedTime - lastKeyTime > keyFrameRate) {
                // add the tweens to the previous keyframe
                currentFrameData["tweens"] = tweens;

                string frameString = JsonConvert.SerializeObject(currentFrameData);
                redDb.StringSetAsync(keyFrameNum.ToString(), frameString, flags: CommandFlags.FireAndForget);
                redDb.StringSetAsync(LATEST_FRAME, frameString, flags: CommandFlags.FireAndForget);



                inbetweenNum = 0;
                keyFrameNum += 1;
                lastKeyTime = Time.fixedTime;
                SnapKeyFrame();
            }
            else {
                inbetweenNum += 1;
                Hashtable newInbetween = new Hashtable() {
                    {"dt", Time.fixedDeltaTime },
                    {"frame_num", inbetweenNum }
                };
                foreach(IMetaDataTrackable mdo in mdItems) {
                    if (mdo.FrameType == MetaDataFrameType.Inbetween) {
                        newInbetween[mdo.ObjectKey] = mdo.InbetweenData();
                    }
                }
                tweens.Add(newInbetween);
            }
        }

        private void SnapKeyFrame() {
            currentFrameData = new Hashtable() {
                {"game_secs", Time.fixedTime },
                {"frame_num", keyFrameNum }
            };
            Hashtable key = new Hashtable();
            foreach (IMetaDataTrackable mdo in mdItems) {
                key[mdo.ObjectKey] = mdo.KeyFrameData();
            }
            currentFrameData["key"] = key;
            currentFrameData["frame"] = keyFrameNum;
        }

        void OnSceneChange(Scene current, Scene next) {
            mdItems = mdItems.Where(md => md.PersistAcrossScenes).ToList();
        }

        public void AddTrackableObject(IMetaDataTrackable mdo) {
            this.mdItems.Add(mdo);
        }

        public void RemoveTrackableObject(IMetaDataTrackable mdo) {
            this.mdItems.Remove(mdo);
        }
    }
}
