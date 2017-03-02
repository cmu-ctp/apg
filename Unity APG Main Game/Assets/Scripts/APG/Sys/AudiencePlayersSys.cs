using UnityEngine;
using System.Collections.Generic;

namespace APG {
	public class AudiencePlayersSys : AudienceSysInterface {

		List<AudiencePlayerEventsHandler> playerEvents = new List<AudiencePlayerEventsHandler>();
		List<string> playerNames = new List<string>();
		List<List<int>> playerInput = new List<List<int>>();

		AudiencePlayerEventsHandler nullEvents = new AudiencePlayerEventsHandler();

		public Dictionary<string, int> playerMap = new Dictionary<string, int>();
		public int activePlayers = 0;

		ChatSys chatSys;

		public AudiencePlayersSys() {
			chatSys = new ChatSys( this );
		}

		public int time = 0;

		public void RegisterHandler( AudiencePlayerEventsHandler events ) {
			playerEvents.Add( events );
		}
		public int PlayerCount() {
			return activePlayers;
		}
		public void Update() {
			time++;
		}
		bool ValidPlayer( int playerNumber ) {
			if( playerNumber < 0 || playerNumber >= playerEvents.Count || playerEvents[playerNumber] == null )return false;
			return true;
		}

		public AudiencePlayerEventsHandler GetPlayerEvents( int playerNumber ) {
			if( !ValidPlayer( playerNumber ) )return nullEvents;
			return playerEvents[playerNumber];
		}
		public string PlayerName( int playerNumber ) {
			if( !ValidPlayer( playerNumber ) )return "";
			return playerNames[playerNumber];
		}
		public List<int> PlayerInput( int playerNumber ) {
			if( !ValidPlayer( playerNumber ) )return null;
			return playerInput[playerNumber];
		}
		public bool AddPlayer( string playerName ) {
			if( playerMap.ContainsKey(playerName) == true)return false;

			GetPlayerEvents( activePlayers ).onJoin(playerName);
			playerNames.Add( playerName );
			playerInput.Add( new List<int>() );
			playerMap[playerName] = activePlayers;
			activePlayers++;
			return true;
		}
		public bool SetPlayerInput( string user, List<int> parms ) {
			if(playerMap.ContainsKey(user) == false) return false;

			var id = playerMap[user];
			GetPlayerEvents( id ).onInput(parms);
			if( id < 0 || id >= playerInput.Count ) {
				Debug.Log( "SetPlayerInput: Player ID is out of range: " + id + " (should be between 0 and " + playerInput.Count + ")" );
			}
			playerInput[id] = parms;
			return true;
		}
		public void LogChat( string name, string msg) {
			chatSys.Log( name, msg, time );
		}
		public ChatterInterface Chatters() {
			return chatSys;
		}
	}

}
