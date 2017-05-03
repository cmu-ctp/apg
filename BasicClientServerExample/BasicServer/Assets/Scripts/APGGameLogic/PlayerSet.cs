using UnityEngine;
using System.Collections.Generic;
using v3 = UnityEngine.Vector3;

namespace APG {

	public struct PlayerEndOfRoundInfo {
		public v3 pos;
		public string name;
		public Color nameColor;
		public Color stanceColor;
		public Color actionColor;
		public Sprite stanceIcon;
		public string stanceName;
		public string actionName;
	}

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
		public void RoundUpdate() {
			for( var k = 0; k < playerNames.Count; k++ ) {
				playerEvents[k].onRoundEnd();
			}
		}
		public void UpdatePlayersToClients( AudienceInterface apg ) {
			for( var k = 0; k < playerNames.Count; k++ ) {
				playerEvents[k].updateToClient( apg, playerNames[k] );
			}
		}
		public List<PlayerEndOfRoundInfo> GetEndOfRoundInfo() {
			List<PlayerEndOfRoundInfo> infos = new List<PlayerEndOfRoundInfo>();
			for( var k = 0; k < playerNames.Count; k++ ) {
				infos.Add( playerEvents[k].getEndOfRoundInfo() );
			}
			infos.Sort((x, y) => x.pos.x.CompareTo(y.pos.x));
			return infos;
		}

		public void SetGoalPositions() {
			var spots = new List<AudiencePlayerEventsHandler>[12];  // fixme.  Don't hardcode.
			for( var k = 0; k < 12; k++ ) {
				spots[k] = new List<AudiencePlayerEventsHandler>();
			}
			for( var k = 0; k < playerNames.Count; k++ ) {
				spots[ playerEvents[k].getGoalBuilding() ].Add( playerEvents[k] );
			}
			for( var k = 0; k < spots.Length; k++ ) {

				var goalposx = (-10 + 9 * ((k%6)/6f)) * ((k < 6) ? 1 : -1);

				for( var j = 0; j < spots[k].Count; j++ ) {
					var rat = 2*(float)j/(spots[k].Count -1 ) - 1;
					spots[k][j].setGoalX( goalposx + rat * .4f );
				}
			}
		}
	}
}
