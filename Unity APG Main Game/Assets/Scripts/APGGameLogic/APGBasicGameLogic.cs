using System;
using UnityEngine;

/*

	So what can I pull out here?

	Inviting
	______
	Inviter: Everyone gets invited to play.
	Invite-up-to-max-players.


	Player Choice Framework
	_____________________


	Player Joining / Leaving / Being Kicked Framework
	_________________________________________


	Lobby for Team Joining
	___________________


	Teams
	______


	Persistent Accounts
	________________



	Also, make html5 client handle screen being turned sideways
	Find out why fullscreen stopped working

	Look more carefully into whispers
	Look into twitch special account info stuff

	How to do multiple example projects?

	Some way to make Unity game and HTML5 clients interact without needing to connect to twitch?
	Easier way to test input, on both the server and the client?
	Keeping network messages in sync better?

	Need to make it clear I'm loading on the HTML5 client at the beginning of the process.

	Maybe don't make phaser be in charge of big update loop.

 */

namespace APG {

	public class APGBasicGameLogic:MonoBehaviour {

		public TwitchGameLogicChat network;
		public int maxPlayers = 20;
		public int secondsPerChoice = 20;

		// ___________________________________

		public PlayerSet GetPlayers() { return players; }

		// ___________________________________

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

		int ticksPerSecond = 60;
		float nextAudienceTimer;
		float nextAudiencePlayerChoice;
		int roundNumber = 1;
		
		AudienceInterface apg;

		PlayerSet players = new PlayerSet();

		void Start() {

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
		void Update() {
			InviteAudience();
			RunPlayerChoice();
		}
	}
}
