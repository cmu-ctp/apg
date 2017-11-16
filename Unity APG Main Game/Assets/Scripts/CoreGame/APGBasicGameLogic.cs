using System;
using System.Collections.Generic;
using UnityEngine;

//	This shouldn't be smeared out between here and gamebuilder...
 
namespace APG {

	class PlayerEntry { public string name; public int lastMessageTime; public int buddyID; public BuddyFuncs funcs;}



	public class APGBasicGameLogic:MonoBehaviour {

		public TwitchNetworking network;
		public int secondsPerChoice = 40;
		public AudioClip timerCountDown, roundOver, roundStart;

		// ___________________________________

        public void SetFields( AudiencePhaseStatus theAStatus, Transform theStransform,GameObject theTextName,Sprite thePlayerHighlight,Material theGlowMaterial,Sprite theActionBkg,Players thePlayers,Backgrounds theBackgrounds){
            aStatus = theAStatus;
            stransform = theStransform;
            textName = theTextName;
            playerHighlight = thePlayerHighlight;
            glowMaterial = theGlowMaterial;
            actionBkg = theActionBkg;
            players = thePlayers;
            backgrounds = theBackgrounds;}
        public void SetGameSys( GameSys theSys ) { gameSys = theSys;}
		public void SetAudiencePlayers( AudiencePlayerSys audiencePlayerSys ) { buddies = audiencePlayerSys; }
		public void SetPlayers(PlayerSys thePlayerSys) { playerSys = thePlayerSys; }

        PlayerSys playerSys;

        // ___________________________________

        [Serializable]
		struct RoundUpdate{ public int round; public int time; }
		[Serializable]
		struct EmptyParms{ }
        [Serializable]
        struct AliveParms { public int t; }
        [Serializable]
		struct RoundParms { public int health1; public int health2; }
		// join
		[Serializable]
		struct ClientJoinParms{ public string name; public int team; public int playerID; public bool started;}
		// upd
		[Serializable]
		struct SelectionParms { public int[] choices; }

		// ___________________________________

		public bool waitingForGameToStart = true;
        public float player1ChargeRatio = 0f;
        public float player2ChargeRatio = 0f;

		public void OnGameStart() { apg.WriteToClients("start", new EmptyParms { }); }
		public int GetRoundNumber() { return roundNumber; }
		public int GetRoundTime() { return nextAudiencePlayerChoice; }
		public int GetGameTime() { return gameTime; }

		// ___________________________________

		Dictionary<string, PlayerEntry> playerMap = new Dictionary<string, PlayerEntry>();
		int activePlayers = 0;
		float nextChatInviteTime;
        int roundNumber = 1; 
		GameSys gameSys;
        AudiencePlayerSys buddies;
        APGSys apg; 
		Action timerUpdater;
		int maxPlayers = 20;
		int secondsAfterLockedInChoice = 7;
		int nextAudiencePlayerChoice;
		bool pauseEnded = false;
		int gameTime = 0;
		int appTime = 0;

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
			for( var k = 0; k < buddies.playGrid.buddies.Count; k++) { if( buddies.playGrid.buddies[k].funcs.inUse() == false) { buddyID = k; break; }}
			if( buddyID == -1) return false;
			playerMap[user] = new PlayerEntry { lastMessageTime=appTime, name=user, buddyID=buddyID, funcs = buddies.playGrid.buddies[buddyID].funcs  };
			playerMap[user].funcs.onJoin(user);
			activePlayers++;
			return true;}
		bool SetPlayerInput(string user, int[] parms) {
			if (playerMap.ContainsKey(user) == false) return false;
			playerMap[user].funcs.onInput(parms);
			return true;}
		int ChoiceTime() { return nextAudiencePlayerChoice - FullGame.ticksPerSecond * 2 - FullGame.ticksPerSecond * secondsAfterLockedInChoice; }
		void Start() {
			SetupTimers();
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
			appTime++;
			if ((appTime % (50 * 2)) == 0) ClearDisconnectedPlayers();
			if (playerSys.team1Health == 0 ) {gameSys.gameOver=true;}
			else if(playerSys.team2Health == 0 ) {gameSys.gameOver=true;}
			else {  InviteAudience(); if( !waitingForGameToStart ) timerUpdater();}}
		void SetupTimers() {
			nextAudiencePlayerChoice = FullGame.ticksPerSecond * secondsPerChoice;
			pauseEnded = false;
			timerUpdater = PlayersEnterChoicesTimer;}

		void AtEnterChoicesEnd() {
			apg.WriteToClients("submit", new EmptyParms());
			apg.WriteToClients("time", new RoundUpdate { time = (int)(ChoiceTime() / 60), round = roundNumber + 1 });}
		void AtCollectPlayerActionsEnd() {
			buddies.RoundUpdate();
			buddies.playGrid.SetGoalPositions();
			buddies.UpdatePlayersToClients(apg);}

        AudiencePhaseStatus aStatus;
        Transform stransform;
        GameObject textName;
        Sprite playerHighlight;
        Material glowMaterial;
        Sprite actionBkg;
        Players players;
        Backgrounds backgrounds;

        void AtStartActionEnd() {
			roundNumber++;
			apg.WriteToClients("time", new RoundUpdate { time = secondsPerChoice, round = roundNumber + 1 });
			gameSys.Sound(roundOver, 1);
            AudiencePhase.MakeRoundEnd(aStatus, roundNumber, buddies.GetPlayerGrid(), () => pauseEnded = true, stransform, textName, playerHighlight, glowMaterial, players.actionBkg, players, backgrounds);}
		void AtPausedTimerEnd() {
			SetupTimers();
			gameSys.Sound(roundStart, 1);
			apg.WriteToClients("startround", new RoundParms { health1=(int)playerSys.team1Health, health2 = (int)playerSys.team2Health  });}
		void PausedTimer() {
			if( pauseEnded ) {
				AtPausedTimerEnd();}}
		void StartActionTimer() {
			gameTime++;
			nextAudiencePlayerChoice--;
			if(nextAudiencePlayerChoice <= 0 ) {
				AtStartActionEnd();
				timerUpdater = PausedTimer;}}
		void CollectPlayerChoicesTimer() {
			gameTime++;
			nextAudiencePlayerChoice--;
			if(nextAudiencePlayerChoice <= FullGame.ticksPerSecond * 2) {
				AtCollectPlayerActionsEnd();
				timerUpdater = StartActionTimer;}}
		void PlayersEnterChoicesTimer() {
			gameTime++;
			if ((ChoiceTime() % (FullGame.ticksPerSecond * 5) == 0) || (ChoiceTime() % (FullGame.ticksPerSecond * 1) == 0 && ChoiceTime() < (FullGame.ticksPerSecond * 5))) {
				apg.WriteToClients( "time", new RoundUpdate {time=(int)(ChoiceTime()/ 60),round= roundNumber+1});}
			nextAudiencePlayerChoice--;
			if ( nextAudiencePlayerChoice <= FullGame.ticksPerSecond * 2 + FullGame.ticksPerSecond * secondsAfterLockedInChoice) {
				AtEnterChoicesEnd();
				timerUpdater = CollectPlayerChoicesTimer;}}}}