using System;
using UnityEngine;
using v3 = UnityEngine.Vector3;

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


 */

namespace APG {

	public class APGBasicGameLogic:MonoBehaviour {

		public GameBuilder src;

		public TwitchNetworking network;
		public int maxPlayers = 20;
		public int secondsPerChoice = 40;
		public int secondsAfterLockedInChoice = 7;

		public AudioClip timerCountDown, roundOver, roundStart;

		// ___________________________________

		public PlayerSet GetPlayers() { return players; }
		
		public void SetGameSys( GameSys theSys ) {
			gameSys = theSys;
		}

		public void SetAudiencePlayers( AudiencePlayerSys audiencePlayerSys ) {
			buddies = audiencePlayerSys;
		}

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
			public int playerID;
		}

		// upd
		[Serializable]
		public struct SelectionParms {
			public int[] choices;
		}

		int ticksPerSecond = 60;
		float nextChatInviteTime;
		int nextAudiencePlayerChoice;
		int endOfRoundTimer;
		int roundNumber = 1;
		int pausedTimer = 0;
		int startActionTimer;
		
		GameSys gameSys;
		AudiencePlayerSys buddies;

		Action timerUpdater;
	
		APGSys apg;

		PlayerSet players = new PlayerSet();

		public bool waitingForGameToStart = true;

		public float player1ChargeRatio = 0f;
		public float player2ChargeRatio = 0f;

		void Start() {

			nextAudiencePlayerChoice = ticksPerSecond * secondsPerChoice;
			endOfRoundTimer = ticksPerSecond * secondsAfterLockedInChoice;
			startActionTimer = ticksPerSecond * 2;
			pausedTimer = ticksPerSecond * 12;

			timerUpdater = PlayersEnterChoicesTimer;

			nextChatInviteTime = ticksPerSecond * 10;

			apg = network.GetAudienceSys();

			apg.ResetClientMessageRegistry()
				.Register<EmptyParms>("join", (user, p) => {
					if (players.AddPlayer(user)) {
						apg.WriteToClients("join", new ClientJoinParms { name = user, playerID=players.GetPlayerID(user)+1 });
					}
				})
				.Register<SelectionParms>("upd", (user, p) => {
					players.SetPlayerInput(user, p.choices);
				});
		}

		void InviteAudience() {
			nextChatInviteTime--;
			if(players.PlayerCount() < maxPlayers) {
				if(nextChatInviteTime <= 0) {
					if(players.PlayerCount() == 0) {
						apg.WriteToChat("Up to 20 people can play!  Join here: " + apg.LaunchAPGClientURL());
					}
					else {
						apg.WriteToChat("" + players.PlayerCount() + " of " + maxPlayers + " are playing!  Join here: " + apg.LaunchAPGClientURL());
					}
					nextChatInviteTime = ticksPerSecond * 30;
				}
			}
			else {
				if(nextChatInviteTime <= 0) {
					apg.WriteToChat("The game is full!  Get in line to play: " + apg.LaunchAPGClientURL());
					nextChatInviteTime = ticksPerSecond * 60;
				}
			}
		}

		public int GetRoundNumber() {
			return roundNumber;
		}

		public int GetRoundTime() {
			return endOfRoundTimer + nextAudiencePlayerChoice + startActionTimer;
		}

		public float BetweenRoundPauseRatio() {
			if( timerUpdater != PausedTimer ) {
				return 0;
			}

			return pausedTimer/(ticksPerSecond * 12f );
		}

		void PausedTimer() {
			if( pausedTimer == 0 ) {
				endOfRoundTimer = ticksPerSecond * secondsAfterLockedInChoice;
				nextAudiencePlayerChoice = ticksPerSecond * secondsPerChoice;
				startActionTimer = ticksPerSecond * 2;
				pausedTimer = ticksPerSecond * 12;

				gameSys.Sound( roundStart, 1 );

				timerUpdater = PlayersEnterChoicesTimer;
			}
		}

		void StartActionTimer() {
			startActionTimer--;
			if( startActionTimer == 0 ) {

				// Run some sort of between round thinker here.
				gameSys.Sound( roundOver, 1 );

				src.MakeRoundEnd( roundNumber, ticksPerSecond, players.GetEndOfRoundInfo(), val => pausedTimer = val );

				timerUpdater = PausedTimer;
			}
		}

		void CollectPlayerChoicesTimer() {
			endOfRoundTimer--;
			if( endOfRoundTimer == 0 ) {
				players.UpdatePlayersToClients( apg );
				players.RoundUpdate();
				players.SetGoalPositions();

				timerUpdater = StartActionTimer;
			}
		}

		void PlayersEnterChoicesTimer() {
			nextAudiencePlayerChoice--;

			if((nextAudiencePlayerChoice % (ticksPerSecond * 5) == 0) || (nextAudiencePlayerChoice % (ticksPerSecond * 1) == 0 && nextAudiencePlayerChoice < (ticksPerSecond * 5))) {
				apg.WriteToClients( "time", new RoundUpdate {time=(int)(nextAudiencePlayerChoice/60),round= roundNumber+1});
			}

			if( nextAudiencePlayerChoice == 0 ) {
				apg.WriteToClients("submit", new EmptyParms() );
				roundNumber++;

				apg.WriteToClients( "time", new RoundUpdate {time=(int)(nextAudiencePlayerChoice/60),round= roundNumber+1});

				timerUpdater = CollectPlayerChoicesTimer;
			}
		}

		void FixedUpdate() {

			if( buddies.team1Health == 0 ) {
				gameSys.gameOver=true;
			}
			else if( buddies.team2Health == 0 ) {
				gameSys.gameOver=true;
			}
			else { 
				InviteAudience();
				// FIXME - this isn't handling framerate drops correctly.
				if( !waitingForGameToStart ) {
					timerUpdater();
				}
			}
			// 
		}
	}
}