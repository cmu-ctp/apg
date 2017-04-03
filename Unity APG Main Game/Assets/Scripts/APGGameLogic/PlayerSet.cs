using UnityEngine;
using System.Collections.Generic;

namespace APG {

	public class PlayerSet {
		/*
			So, how should the player system work here?

			Obviously, many game types might not have persistent, limited players at all.
			Others might have a number of different types of player roles, of probably limited number.

			But it should also be convenient.
		 */

		List<AudiencePlayerEventsHandler> playerEvents = new List<AudiencePlayerEventsHandler>();
		List<string> playerNames = new List<string>();
		List<int[]> playerInput = new List<int[]>();
		AudiencePlayerEventsHandler nullEvents = new AudiencePlayerEventsHandler();
		Dictionary<string, int> playerMap = new Dictionary<string, int>();
		int activePlayers = 0;

		public void RegisterHandler( AudiencePlayerEventsHandler events ) {
			playerEvents.Add( events );
		}
		public int PlayerCount() {
			return activePlayers;
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
		public int[] PlayerInput( int playerNumber ) {
			if( !ValidPlayer( playerNumber ) )return null;
			return playerInput[playerNumber];
		}
		public bool AddPlayer( string playerName ) {
			if( playerMap.ContainsKey(playerName) == true)return false;

			GetPlayerEvents( activePlayers ).onJoin(playerName);
			playerNames.Add( playerName );
			playerInput.Add( new int[6] );
			playerMap[playerName] = activePlayers;
			activePlayers++;
			return true;
		}
		public bool SetPlayerInput( string user, int[] parms ) {
			if(playerMap.ContainsKey(user) == false) return false;

			var id = playerMap[user];
			GetPlayerEvents( id ).onInput(parms);
			if( id < 0 || id >= playerInput.Count ) {
				Debug.Log( "SetPlayerInput: Player ID is out of range: " + id + " (should be between 0 and " + playerInput.Count + ")" );
			}
			playerInput[id] = parms;
			return true;
		}
	}
}
