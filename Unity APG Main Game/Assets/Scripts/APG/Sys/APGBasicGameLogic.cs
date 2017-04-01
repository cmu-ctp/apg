using System;
using UnityEngine;

namespace APG {

	[Serializable]
	public struct RoundUpdate{
		public int round;
		public int time;
	}
	[Serializable]
	public struct EmptyMsg{
	}

	[Serializable]
	struct EmptyParms{
	}

	// join
	[Serializable]
	struct ClientJoinParms{
		public string name;
	}

	// upd
	[Serializable]
	struct SelectionParms {
		public int[] choices;
	}

		public class APGBasicGameLogic:MonoBehaviour {

		public TwitchGameLogicChat network;

		int ticksPerSecond = 60;
		float nextAudienceTimer;
		float nextAudiencePlayerChoice;
		int roundNumber = 1;
		int secondsPerChoice = 20;

		int maxPlayers = 20;

		AudienceSysInterface apgSys;

		public void Start() {

			apgSys = network.GetAudienceSys();

			nextAudiencePlayerChoice = ticksPerSecond * secondsPerChoice;
			nextAudienceTimer = ticksPerSecond * 10;

			network.SetHandlers( new NetworkMessageHandler()
				.Add<EmptyParms>( "join", (user, p) => {
					// need game logic to determine if this player should be allowed to join - need multiple ways to join, too - join in different roles
					if( apgSys.AddPlayer(user )) {
						network.SendMsg<ClientJoinParms>("join", new ClientJoinParms { name = user });
					}
				} )
				.Add<SelectionParms>( "upd", (user, p) => {
					apgSys.SetPlayerInput( user, p.choices );
				} ) );

		}
		void InviteAudience() {
			nextAudienceTimer--;
			if(apgSys.PlayerCount() < maxPlayers) {
				if(nextAudienceTimer <= 0) {
					if(apgSys.PlayerCount() == 0) {
						network.SendChatText("Up to 20 people can play!  Join here: " + network.LaunchAPGClientURL());
					}
					else {
						network.SendChatText("" + apgSys.PlayerCount() + " of " + maxPlayers + " are playing!  Join here: " + network.LaunchAPGClientURL());
					}
					nextAudienceTimer = ticksPerSecond * 30;
				}
			}
			else {
				if(nextAudienceTimer <= 0) {
					network.SendChatText("The game is full!  Get in line to play: " + network.LaunchAPGClientURL());
					nextAudienceTimer = ticksPerSecond * 60;
				}
			}
		}
		void RunPlayerChoice() {
			nextAudiencePlayerChoice--;
			if(nextAudiencePlayerChoice <= 0) {
				nextAudiencePlayerChoice = ticksPerSecond * secondsPerChoice;
				// update game state
				network.SendMsg("submit", new EmptyMsg());
				roundNumber++;

				network.SendMsg( "time", new RoundUpdate {time=(int)(nextAudiencePlayerChoice/60),round= roundNumber});

				/*foreach(var key in apgSys.playerMap.Keys) {
					//network.UpdatePlayer( key, apgSys.GetPlayerEvents( apgSys.playerMap[key] ).updateClient());
				}*/
			}
			else if((nextAudiencePlayerChoice % (ticksPerSecond * 5) == 0) || (nextAudiencePlayerChoice % (ticksPerSecond * 1) == 0 && nextAudiencePlayerChoice < (ticksPerSecond * 5))) {

				network.SendMsg( "time", new RoundUpdate {time=(int)(nextAudiencePlayerChoice/60),round= roundNumber});

			}
		}
		public void Update() {
			InviteAudience();
			RunPlayerChoice();
		}
	}
}
