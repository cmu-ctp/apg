using System;
using System.Collections.Generic;
using v3 = UnityEngine.Vector3;
using UnityEngine;

namespace APG {
	class PlayerEntry { public string name; public int lastMessageTime; public int buddyID; public BuddyFuncs funcs;}

	public class APGBasicGameLogic:MonoBehaviour {
		public TwitchNetworking network;
        public GameObject gameCamera;
		public int secondsPerChoice = 40;

        public float player1ChargeRatio = 0f;
        public float player2ChargeRatio = 0f;

        public int GetRoundNumber() { return roundNumber; }
        public int GetRoundTime() { return nextAudiencePlayerChoice; }

        // ___________________________________

        [Serializable] struct RoundUpdate{ public int round; public int time; }
		[Serializable] struct EmptyParms{ }
        [Serializable] struct AliveParms { public int t; }
        [Serializable] struct RoundParms { public int health1; public int health2; }
		[Serializable] struct ClientJoinParms{ public string name; public int team; public int playerID; public bool started;}
		[Serializable] struct SelectionParms { public int[] choices; }

		// ___________________________________

        bool waitingForGameToStart = true;
        bool fullPauseActive;
        PlayerSys playerSys;
        Dictionary<string, PlayerEntry> playerMap = new Dictionary<string, PlayerEntry>();
        int activePlayers = 0;
        float nextChatInviteTime;
        int roundNumber = 1;
        GameSys gameSys;
        AudiencePlayerSys audiencePlayerSys;
        APGSys apg;
        Action timerUpdater;
        int maxPlayers = 10;
        int secondsAfterLockedInChoice = 7;
        int nextAudiencePlayerChoice;
        int gameTime = 0;
        int appTime = 0;
        AudiencePhaseStatus aStatus;
        Items items;
        BuildingActions buildingActions;

        // ___________________________________

        void Make(){
            bool exitingTitle = false;
            bool isPaused = false;
            float pauseRatio = 0;
            var transform = gameCamera.transform;
            aStatus = new AudiencePhaseStatus();

            var aspect = Camera.main.aspect;
		    gameSys = new GameSys(transform);
            ent.BaseGameSys = gameSys;
            var reactSys = new ReactSys();
            reactSys.Init();
            IntroPlaques.MakeIntroPlaque(transform, () => { exitingTitle = true; });
            playerSys = new PlayerSys();
            audiencePlayerSys = new AudiencePlayerSys();
		    var treatSys = new TreatSys(gameSys, reactSys);
		    var foeSys = new FoeSys(gameSys, playerSys, audiencePlayerSys, treatSys);
		    playerSys.Setup(gameSys, reactSys, this );
            audiencePlayerSys.Setup(gameSys, foeSys, playerSys, treatSys);
            Backgrounds.Setup();
            items = new Items(playerSys);
            buildingActions = new BuildingActions(gameSys, playerSys, treatSys);
            var spawnSys = new SpawnSys();
            SpawnContent.InitSpawns(spawnSys, foeSys, treatSys);
            var waveHUD = new WaveHUD(gameSys, transform, spawnSys, network.GetAudienceSys().MobileJoinQRCode(), playerSys, this );
            var musics = new MusicInfo();
            musics.Init( gameCamera.GetComponent<AudioSource>());
            BackgroundUpdates.Make(transform);

            float tick2 = 0f;
            bool DoEndOfGameFadeOut = true;
            bool pauseLatch = false;

            new ent { ignorePause = true, update = e => {
                FullGame.tick++;
		        if (!waitingForGameToStart) tick2++;
		        treatSys.soundTick = tick2;
                audiencePlayerSys.soundTick = tick2;
		        foeSys.tick = tick2;
		        if (gameSys.gameOver) { if (DoEndOfGameFadeOut) { DoEndOfGameFadeOut = false; musics.FadeSongTo( Art.Music.somenes19b.snd );}}
                musics.UpdateMusic();
		        pauseRatio = aStatus.midpointTimer;
		        v3 lookPos;
		        if (playerSys.player2Ent == null) {lookPos = playerSys.playerEnt.pos;}
		        else {lookPos = (playerSys.playerEnt.pos + playerSys.player2Ent.pos) / 2;}
		        lookPos.y -= 14f;// 10f;
		        if(aStatus.doingEnd ) waveHUD.pauseRatio = waveHUD.pauseRatio * .99f + .01f * 1;
		        else waveHUD.pauseRatio = waveHUD.pauseRatio * .9f + .1f * 0;
		        if (pauseRatio > 0 && pauseRatio < 1) {
			        AudiencePhase.EndOfRoundCamera(aStatus.cameraPos, ref aStatus.lastLookAtPos, ref aStatus.lastLookFromPos, ref lookPos, transform);}
		        else {
                    aStatus.lastLookAtPos = lookPos;
			        nm.ease(ref aStatus.lastLookFromPos, new v3(lookPos.x * .03f, lookPos.y * .03f, -10), .3f);
			        transform.LookAt(new v3(transform.position.x * .97f + .03f * lookPos.x, transform.position.y * .97f + .03f * lookPos.y, lookPos.z));
			        transform.position = aStatus.lastLookFromPos;}
		        if (Input.GetKey(KeyCode.Escape)) {if (!pauseLatch) {isPaused = !isPaused;pauseLatch = true;}}
		        else pauseLatch = false;

		        if (waitingForGameToStart) {
			        if (exitingTitle && (Input.GetKey(KeyCode.Escape) || Input.GetKey(KeyCode.Space) || Input.GetButton("Fire1") || Input.GetButton("Fire2"))) {
                        apg.WriteToClients("start", new EmptyParms { });
                        waitingForGameToStart = false;
                        musics.FadeSongTo( Art.Music.GoSaS.snd );}}

		        if (aspect == 1.6f) {transform.position += new Vector3(0, .7f, -1.1f);}
		        if (aspect == 1.5f) {transform.position += new Vector3(0, 1.3f, -1.9f);} 
		        if (Mathf.Abs(aspect - 4f / 3f) < .001f) {transform.position += new Vector3(0, 1.9f, -3.3f);}

		        if (!isPaused && pauseRatio == 0 && gameSys.gameOver == false && waitingForGameToStart == false) spawnSys.Update(gameTime);

                fullPauseActive = isPaused || pauseRatio > 0 || waitingForGameToStart;} };}
        void ClearDisconnectedPlayers() {
			var deadPlayers = new List<string>();
			foreach( var p in playerMap.Values) {
				if (appTime - p.lastMessageTime > 50 * 50) { activePlayers--; p.funcs.onLeave(); deadPlayers.Add(p.name); }}
			for (var k = 0; k < deadPlayers.Count; k++) playerMap.Remove(deadPlayers[k]);}
		void SetPlayerMessageTime( string user ) {
			if (playerMap.ContainsKey(user) == false) return;
			playerMap[user].lastMessageTime = appTime;}
		bool AddPlayer(string user) {
			if (playerMap.ContainsKey(user) == true) return false;
			var buddyID = -1;
			for( var k = 0; k < audiencePlayerSys.playGrid.buddies.Count; k++) { if( audiencePlayerSys.playGrid.buddies[k].funcs.inUse() == false) { buddyID = k; break; }}
			if( buddyID == -1) return false;
			playerMap[user] = new PlayerEntry { lastMessageTime=appTime, name=user, buddyID=buddyID, funcs = audiencePlayerSys.playGrid.buddies[buddyID].funcs  };
			playerMap[user].funcs.onJoin(user);
			activePlayers++;
			return true;}
		bool SetPlayerInput(string user, int[] parms) {
			if (playerMap.ContainsKey(user) == false) return false;
			playerMap[user].funcs.onInput(parms);
			return true;}

		void Start() {
            Application.runInBackground = true;
            Make();
            SetupAllTimers();
            nextChatInviteTime = FullGame.ticksPerSecond * 10;
			apg = network.GetAudienceSys();
			apg.ResetClientMessageRegistry()
				.Register<AliveParms>("alive", (user, p) => {SetPlayerMessageTime(user);})
				.Register<EmptyParms>("join", (user, p) => {
					if (AddPlayer(user)) {
						SetPlayerMessageTime(user);
						var id = playerMap[user].buddyID;
						apg.WriteToClients("join", new ClientJoinParms { name = user, started=!waitingForGameToStart, playerID=id/2, team= (id%2==0)?1:2 });}})
				.Register<SelectionParms>("upd", (user, p) => {
					SetPlayerMessageTime(user);
					SetPlayerInput(user, p.choices);});}
		void InviteAudience() {
			nextChatInviteTime--;
			if(activePlayers < maxPlayers) {
				if(nextChatInviteTime <= 0) {
					if(activePlayers == 0) {apg.WriteToChat("Up to 20 people can play!  Join here: " + apg.LaunchAPGClientURL());}
					else {apg.WriteToChat("" + activePlayers + " of " + maxPlayers + " are playing!  Join here: " + apg.LaunchAPGClientURL());}
					nextChatInviteTime = FullGame.ticksPerSecond * 30;}}
			else {
				if(nextChatInviteTime <= 0) {
					apg.WriteToChat("The game is full!  Get in line to play: " + apg.LaunchAPGClientURL());
					nextChatInviteTime = FullGame.ticksPerSecond * 60;}}}
		void FixedUpdate() {
            gameSys.Update(fullPauseActive);
            appTime++;
			if ((appTime % (50 * 2)) == 0) ClearDisconnectedPlayers();
			if (playerSys.team1Health == 0 ) {gameSys.gameOver=true;}
			else if(playerSys.team2Health == 0 ) {gameSys.gameOver=true;}
			else {
                InviteAudience();
                if ( !waitingForGameToStart ) timerUpdater();}
        }

        void SetupAllTimers(){
            bool pauseEnded = false;
            Action PlayersEnterChoicesTimer=null;
            Action SetupTimers = () =>{
                nextAudiencePlayerChoice = FullGame.ticksPerSecond * secondsPerChoice;
                pauseEnded = false;
                timerUpdater = PlayersEnterChoicesTimer; };
            Action PausedTimer = () => {
                if (pauseEnded) {
                    SetupTimers();
                    gameSys.Sound(Art.Sounds.boomend.snd, 1);
                    apg.WriteToClients("startround", new RoundParms { health1 = (int)playerSys.team1Health, health2 = (int)playerSys.team2Health });} };
            Action StartActionTimer = () => {
                gameTime++;
                nextAudiencePlayerChoice--;
                if (nextAudiencePlayerChoice <= 0) {
                    roundNumber++;
                    apg.WriteToClients("time", new RoundUpdate { time = secondsPerChoice, round = roundNumber + 1 });
                    gameSys.Sound(Art.Sounds.boomstart2.snd, 1);
                    AudiencePhase.MakeRoundEnd(aStatus, roundNumber, audiencePlayerSys.GetPlayerGrid(), () => pauseEnded = true, gameCamera.transform, buildingActions, items);
                    timerUpdater = PausedTimer; } };
            Action CollectPlayerChoicesTimer = () => {
                gameTime++;
                nextAudiencePlayerChoice--;
                if (nextAudiencePlayerChoice <= FullGame.ticksPerSecond * 2) {
                    audiencePlayerSys.RoundUpdate();
                    audiencePlayerSys.playGrid.SetGoalPositions();
                    audiencePlayerSys.UpdatePlayersToClients(apg);
                    timerUpdater = StartActionTimer; } };
            PlayersEnterChoicesTimer = () => {
                Func<int> ChoiceTime = () => { return nextAudiencePlayerChoice - FullGame.ticksPerSecond * 2 - FullGame.ticksPerSecond * secondsAfterLockedInChoice; };
                gameTime++;
			    if ((ChoiceTime() % (FullGame.ticksPerSecond * 5) == 0) || (ChoiceTime() % (FullGame.ticksPerSecond * 1) == 0 && ChoiceTime() < (FullGame.ticksPerSecond * 5))) {
				    apg.WriteToClients( "time", new RoundUpdate {time=(int)(ChoiceTime()/ 60),round= roundNumber+1});}
			    nextAudiencePlayerChoice--;
			    if ( nextAudiencePlayerChoice <= FullGame.ticksPerSecond * 2 + FullGame.ticksPerSecond * secondsAfterLockedInChoice) {
                    apg.WriteToClients("submit", new EmptyParms());
                    apg.WriteToClients("time", new RoundUpdate { time = (int)(ChoiceTime() / 60), round = roundNumber + 1 });
                    timerUpdater = CollectPlayerChoicesTimer;}};

            SetupTimers();}
    } }