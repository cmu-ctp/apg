using System;
using UnityEngine;

namespace APG {

	public class APGBasicGameLogic:MonoBehaviour {

		[Serializable]
		struct RoundUpdate{
			public int round;
			public int time;
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

		public TwitchGameLogicChat network;

		int ticksPerSecond = 60;
		float nextAudienceTimer;
		float nextAudiencePlayerChoice;
		int roundNumber = 1;
		int secondsPerChoice = 20;

		int maxPlayers = 20;

		AudiencePlayersSys apg;

		public PlayerSet players = new PlayerSet();

		public void Start() {

			apg = network.GetAudienceSys();

			nextAudiencePlayerChoice = ticksPerSecond * secondsPerChoice;
			nextAudienceTimer = ticksPerSecond * 10;

			apg.SetHandlers( new NetworkMessageHandler()
				.Add<EmptyParms>( "join", (user, p) => {
					// need game logic to determine if this player should be allowed to join - need multiple ways to join, too - join in different roles
					if( players.AddPlayer(user )) {
						apg.SendMsg("join", new ClientJoinParms { name = user });
					}
				} )
				.Add<SelectionParms>( "upd", (user, p) => {
					players.SetPlayerInput( user, p.choices );
				} ) );

		}
		void InviteAudience() {
			nextAudienceTimer--;
			if(players.PlayerCount() < maxPlayers) {
				if(nextAudienceTimer <= 0) {
					if(players.PlayerCount() == 0) {
						apg.SendChatText("Up to 20 people can play!  Join here: " + apg.LaunchAPGClientURL());
					}
					else {
						apg.SendChatText("" + players.PlayerCount() + " of " + maxPlayers + " are playing!  Join here: " + apg.LaunchAPGClientURL());
					}
					nextAudienceTimer = ticksPerSecond * 30;
				}
			}
			else {
				if(nextAudienceTimer <= 0) {
					apg.SendChatText("The game is full!  Get in line to play: " + apg.LaunchAPGClientURL());
					nextAudienceTimer = ticksPerSecond * 60;
				}
			}
		}
		void RunPlayerChoice() {
			nextAudiencePlayerChoice--;
			if(nextAudiencePlayerChoice <= 0) {
				nextAudiencePlayerChoice = ticksPerSecond * secondsPerChoice;
				// update game state
				apg.SendMsg("submit");
				roundNumber++;

				apg.SendMsg( "time", new RoundUpdate {time=(int)(nextAudiencePlayerChoice/60),round= roundNumber});

				/*foreach(var key in apgSys.playerMap.Keys) {
					//apg.UpdatePlayer( key, apgSys.GetPlayerEvents( apgSys.playerMap[key] ).updateClient());
				}*/
			}
			else if((nextAudiencePlayerChoice % (ticksPerSecond * 5) == 0) || (nextAudiencePlayerChoice % (ticksPerSecond * 1) == 0 && nextAudiencePlayerChoice < (ticksPerSecond * 5))) {
				apg.SendMsg( "time", new RoundUpdate {time=(int)(nextAudiencePlayerChoice/60),round= roundNumber});
			}
		}
		public void Update() {
			InviteAudience();
			RunPlayerChoice();
		}
	}
}
