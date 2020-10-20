/*

How do I make this work?
Players connect.
We check to see if we have a record of them.
If we do, we send info about the current state of their account, along with information about what kinds of idle updates there are,
   as well as game world updates they need to know about.
Then they get to playing locally.  And then they send updates about what they're up to every so often.
Meanwhile, the main game cycles through visuals of interesting updates in the shared game world, leaderboards, etc.
 */

using System; using System.Collections.Generic; using v3 = UnityEngine.Vector3; using UnityEngine;

namespace APG {
	class PlayerEntry { public string name; public int lastMessageTime; public int buddyID; }

    class BackgroundUpdates{
        public static void Make( Transform transform ){
            var tick = 0f;
            var src = new ent() { name = "worldBkg" };
			//new ent { sprite = Art.Backgrounds.sun.sunset.rand(), parent = src, ignorePause=true, pos = new v3(0, 0, 60), scale = 15, name = "Sky1", layer=Layers.Background };
			new ent { sprite = Art.Backgrounds.sun.rainy.rand(), parent = src, ignorePause=true, pos = new v3(0, 30, 60), scale = 8, name = "Sky1", layer=Layers.Background, update = e => { e.pos = new v3( transform.position.x, transform.position.y+9, 60); } };
            new ent { sprite = Art.Backgrounds.LandToHorizon.spr, parent = src, ignorePause = true, pos = new v3(0, -6, 9), scale3 = new v3(5,3,1), name = "Ground", layer = Layers.Background, update = e => { tick+=.2f; e.pos = new v3( transform.position.x, transform.position.y-6, 9); } };

            new ent { sprite = Art.Overlays.screenlight.spr, parent = src, ignorePause=true, pos = new v3(0, 0, -7f), scale = 1.8f, name = "Overlay1", layer = Layers.OverlayFX,
                update = e => {
                    e.pos = new v3(  transform.position.x, transform.position.y, -7);
                    e.color = new Color(1f, 1f, .9f, .15f + .11f * Mathf.Cos(tick * .01f + 73.0f) + .13f * Mathf.Cos(tick * .0073f + 13.0f));
                    e.ang = .2f + 21f * Mathf.Cos(tick * .01f + 73.0f) + 16f * Mathf.Cos(tick * .0153f + 13.0f); } };
            new ent { sprite = Art.Overlays.screenlight.spr, parent = src, ignorePause=true, pos = new v3(0, 0, 2f), scale = 1.8f, name = "Overlay2", layer = Layers.OverlayFX,
                update = e => {
                    e.pos = new v3(  transform.position.x, transform.position.y, -7);
                    e.color = new Color(1f, 1f, .9f, .22f + .09f * Mathf.Cos(tick * .0083f + 173.0f) + .17f * Mathf.Cos(tick * .0063f + 23.0f));
                    e.ang = .2f + 11f * Mathf.Cos(tick * .0111f + 173.0f) + 23f * Mathf.Cos(tick * .0273f + 213.0f); } };
            new ent { sprite = Art.Overlays.screenlight.spr, parent = src, ignorePause=true, pos = new v3(0, 0, 2f), scale = 1.8f, name = "Overlay3", layer = Layers.OverlayFX,
                update = e => {
                    e.pos = new v3(  transform.position.x, transform.position.y, -7);
                    e.color = new Color(1f, 1f, .9f, .22f + .07f * Mathf.Cos(tick * .0113f + 273.0f) + .23f * Mathf.Cos(tick * .0093f + 33.0f));
                    e.ang = .2f + 17f * Mathf.Cos(tick * .0131f + 273.0f) + 13f * Mathf.Cos(tick * .0193f + 313.0f); } };
        }}

    class MusicInfo{
        float musicVol = 1f;
        AudioSource audio;
        bool doingSongFade = false;
        AudioClip nextSong = null;

        public void Init( AudioSource srcAudio ){
		    audio = srcAudio;
			audio.clip = Art.Sounds.ambient.rain.rand();
            audio.loop = true;
            audio.Play();
		}
	    public void FadeSongTo(AudioClip theNextSong) {
            nextSong = theNextSong;
            doingSongFade = true;}
        public void UpdateMusic() {
            if (doingSongFade) {
                musicVol *= .9f;
                audio.volume = musicVol;
			    if (musicVol < .01f) {
                    audio.Stop();
                    audio.clip = nextSong;
                    musicVol = audio.volume = 0;
                    audio.Play();
                    nextSong = null;
                    doingSongFade = false;}}
		    else {if (musicVol < .99f) { musicVol = musicVol * .9f + .1f * 1; audio.volume = musicVol;}}}}

	public class APGBasicGameLogic:MonoBehaviour {
		public TwitchNetworking network;
        public GameObject gameCamera;

        public static int ticksPerSecond = 60;

        // ___________________________________

        [Serializable] struct EmptyParms{ }
        [Serializable] struct AliveParms { public int t; }
		[Serializable] struct ClientJoinParms{ public string name; public int team; public int playerID; public bool started;}
		[Serializable] struct SelectionParms { public int[] choices; }

		// ___________________________________

        Dictionary<string, PlayerEntry> playerMap = new Dictionary<string, PlayerEntry>();
        float nextChatInviteTime;
        GameSys gameSys;
        APGSys apg;
        int appTime = 0;

        // ___________________________________

        void Make(){
            var transform = gameCamera.transform;

            var aspect = Camera.main.aspect;
		    gameSys = new GameSys(transform);
            ent.BaseGameSys = gameSys;

            Backgrounds.Setup();
            var musics = new MusicInfo();
            musics.Init( gameCamera.GetComponent<AudioSource>());
            BackgroundUpdates.Make(transform);

            v3 lastLookFromPos = new v3(0, 0, 0);

			var wanderx = new DualWave( 1, .1f );
			var wandery = new DualWave( 1, .1f );

			var tick = 0f;

            new ent { ignorePause = true, update = e => {
				tick++;
                musics.UpdateMusic();
		        v3 lookPos = new v3(3*wanderx.Val(tick*.05f),-14 + 1*wandery.Val(tick*.05f),0);
			    nm.ease(ref lastLookFromPos, new v3(lookPos.x * .03f, lookPos.y * .03f, -10), .3f);
			    transform.LookAt(new v3(transform.position.x * .97f + .03f * lookPos.x, transform.position.y * .97f + .03f * lookPos.y, lookPos.z));
			    transform.position = lastLookFromPos;
		        if (aspect == 1.6f) {transform.position += new Vector3(0, .7f, -1.1f);}
		        if (aspect == 1.5f) {transform.position += new Vector3(0, 1.3f, -1.9f);} 
		        if (Mathf.Abs(aspect - 4f / 3f) < .001f) {transform.position += new Vector3(0, 1.9f, -3.3f);}
                } };}
        void ClearDisconnectedPlayers() {
			var deadPlayers = new List<string>();
			foreach( var p in playerMap.Values) {
				if (appTime - p.lastMessageTime > 50 * 50) { deadPlayers.Add(p.name); }}
			for (var k = 0; k < deadPlayers.Count; k++) playerMap.Remove(deadPlayers[k]);}
		void SetPlayerMessageTime( string user ) {
			if (playerMap.ContainsKey(user) == false) return;
			playerMap[user].lastMessageTime = appTime;}
		bool AddPlayer(string user) {
			if (playerMap.ContainsKey(user) == true) return false;
            playerMap[user] = new PlayerEntry { lastMessageTime = appTime, name = user};
            return true;}
		bool SetPlayerInput(string user, int[] parms) {
			if (playerMap.ContainsKey(user) == false) return false;
			return true;}

		void Start() {

            //AssetLister.BuildFileList();

            Application.runInBackground = true;
            Make();
            nextChatInviteTime = ticksPerSecond * 10;
			apg = network.GetAudienceSys();
			apg.ResetClientMessageRegistry()
				.Register<AliveParms>("alive", (user, p) => {SetPlayerMessageTime(user);})
				.Register<EmptyParms>("join", (user, p) => {
					if (AddPlayer(user)) {
                        SetPlayerMessageTime(user);
						var id = playerMap[user].buddyID;
                        apg.WriteToClients("join", new ClientJoinParms { name = user, started=true, playerID=id/2, team= (id%2==0)?1:2 });}})
				.Register<SelectionParms>("upd", (user, p) => {
					SetPlayerMessageTime(user);
					SetPlayerInput(user, p.choices);});}
		void InviteAudience() {
			nextChatInviteTime--;
			if(nextChatInviteTime <= 0) {
				apg.WriteToChat("Join here: " + apg.LaunchAPGClientURL());
				nextChatInviteTime = ticksPerSecond * 30;}}
		void FixedUpdate() {
            gameSys.Update(false);
            appTime++;
			if ((appTime % (50 * 2)) == 0) ClearDisconnectedPlayers();
            InviteAudience();}
    } }