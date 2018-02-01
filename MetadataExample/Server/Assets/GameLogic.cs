/* Basic Server and Client Example
 */

using System;
using UnityEngine;

public class GameLogic : MonoBehaviour {

	// These two structs are the parameters for the network messages.  They'll be serialized into JSON and then trasmitted across Twitch's IRC.
	// Note that these fields need the [Serializable] attribute.
	// These need to stay in sync (by both type and name) with the Typescript code.

	[Serializable]
	struct ServerFirefly {
		public int x;
		public int y;
        public int scale;
    }
    [Serializable]
    struct ServerFireflies
    {
        public ServerFirefly[] items;
    }

    public Firefly[] fireflies;

    // This is the monobehavior the takes care of all IRC networking.

    public Camera camera;

    public TwitchNetworking networking;
    APG.APGSys apg;

    ServerFireflies metadataUpdate;

	void Start () {
		Application.runInBackground = true;

        apg = networking.GetAudienceSys();

        metadataUpdate = new ServerFireflies();
        metadataUpdate.items = new ServerFirefly[fireflies.Length];
    }

    public int GetCurrentFrame() { return time; }

    int time = 0;

	void FixedUpdate () {
        time++;

        var time2 = time*.3f;

        camera.transform.position = new Vector3( 
            400 + 100 * Mathf.Cos( time2 * .013f + 72) + 100 * Mathf.Cos(time2 * .0065f + 172), 
            225 + 80 * Mathf.Cos(time2 * .011f + 372) + 70 * Mathf.Cos(time2 * .0071f + 672), 
            -400 + 10 * Mathf.Cos(time2 * .0073f + 1372) + 8 * Mathf.Cos(time2 * .0087f + 1672));

        camera.transform.rotation = Quaternion.Euler( new Vector3(
            4 * Mathf.Cos(time2 * .013f + 172) + 3 * Mathf.Cos(time2 * .0065f + 1172),
            3 * Mathf.Cos(time2 * .011f + 1372) + 2 * Mathf.Cos(time2 * .0071f + 1672),
            0 ) );

        for ( var k = 0; k < fireflies.Length; k++ ){
            var screenPos = APG.Helper.ScreenPosition(camera, fireflies[k]);
            metadataUpdate.items[k].x = (int)screenPos.x;
            metadataUpdate.items[k].y = (int)screenPos.y;

            metadataUpdate.items[k].scale = (int)(10000 * fireflies[k].transform.localScale.x / 48f);
        }
        apg.WriteMetadata<ServerFireflies>("fireflies", metadataUpdate);
	}
}