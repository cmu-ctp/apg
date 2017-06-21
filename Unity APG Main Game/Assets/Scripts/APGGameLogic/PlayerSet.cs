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
		public int GetPlayerID( string user) {
			return playerMap[user];
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
		public void UpdatePlayersToClients( APGSys apg ) {
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
			var allocs = new AudiencePlayerEventsHandler[12, 3];
			for (var k = 0; k < 12; k++) {
				for (var j = 0; j < 3; j++) {
					allocs[k, j] = null;
				}
			}
			var offset = rd.i(0, 1000);
			var blocked = new List<AudiencePlayerEventsHandler>();
			for (var k2 = 0; k2 < playerNames.Count; k2++) {
				var k = (k2 + offset) % playerNames.Count;
				if (playerEvents[k].getHealth() <= 0) continue;
				int building = playerEvents[k].getGoalBuilding();
				int layer = playerEvents[k].getLayer();
				if (allocs[building, layer] == null) allocs[building, layer] = playerEvents[k];
				else {
					Debug.Log("Blocked at " + building + " " + layer + " - " + playerNames[k]);
					blocked.Add(playerEvents[k]);
				}
			}
			var reallyBlocked = new List<AudiencePlayerEventsHandler>();
			for( var k = 0; k < blocked.Count; k++) {
				int building = blocked[k].getGoalBuilding();
				int layer = blocked[k].getLayer();
				var building2 = (building) % 6;
				if (layer > 0 && allocs[building, layer - 1] == null) allocs[building, layer - 1] = blocked[k];
				else if (layer < 2 && allocs[building, layer + 1] == null) allocs[building, layer + 1] = blocked[k];
				else if (building2 > 0 && allocs[building - 1, layer] == null) allocs[building - 1, layer] = blocked[k];
				else if (building2 < 5 && allocs[building + 1, layer] == null) allocs[building + 1, layer] = blocked[k];
				else if (building2 > 0 && layer > 0 && allocs[building - 1, layer - 1] == null) allocs[building - 1, layer - 1] = blocked[k];
				else if (building2 < 5 && layer > 0 && allocs[building + 1, layer - 1] == null) allocs[building + 1, layer - 1] = blocked[k];
				else if (building2 > 0 && layer < 2 && allocs[building - 1, layer + 1] == null) allocs[building - 1, layer + 1] = blocked[k];
				else if (building2 < 5 && layer < 2 && allocs[building + 1, layer + 1] == null) allocs[building + 1, layer + 1] = blocked[k];
				else {
					reallyBlocked.Add(blocked[k]);
				}
			}
			if (reallyBlocked.Count > 0) {
				for( var k = 0; k < reallyBlocked.Count; k++) {
					int baseVal = blocked[k].getGoalBuilding() < 6 ? 0:6;
					bool found = false;
					for( var l = 0; l < 3 && !found; l++ )
						for( var j = 0; j < 6 && !found; j++ )
							if(allocs[j + baseVal, l] == null) {
								found = true;
								allocs[j + baseVal, l] = reallyBlocked[k];
							}
				}
			}
			for( var k = 0; k < 12; k++ )
				for( var l = 0; l < 3; l++)
					if( allocs[k,l] != null) {
						allocs[k, l].setBuilding(k);
						allocs[k, l].setGoalLayer(l);
					}
		}
	}
}
