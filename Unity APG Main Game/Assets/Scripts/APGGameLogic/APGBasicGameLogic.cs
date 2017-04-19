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

		public GameObject textName;
		public GameBuilder src;
		public Sprite introPlaque;
		public Sprite playerHighlight;

		public TwitchGameLogicChat network;
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
	
		AudienceInterface apg;

		PlayerSet players = new PlayerSet();

		public bool waitingForGameToStart = true;

		public float player1ChargeRatio = 0f;
		public float player2ChargeRatio = 0f;

		void PlayerJoin( string user, EmptyParms p ) {
			if( players.AddPlayer(user )) {
				apg.WriteToClients("join", new ClientJoinParms { name = user });
			}
		}
		void PlayerUpdate( string user, SelectionParms p ) {
			players.SetPlayerInput( user, p.choices );
		}

		void MakeHandlers() {
			var handlers = new NetworkMessageHandler();
			handlers.Add<EmptyParms>( "join", PlayerJoin );
			handlers.Add<SelectionParms>( "upd", PlayerUpdate );
			apg.SetHandlers( handlers );
		}

		void Start() {

			nextAudiencePlayerChoice = ticksPerSecond * secondsPerChoice;
			endOfRoundTimer = ticksPerSecond * secondsAfterLockedInChoice;
			startActionTimer = ticksPerSecond * 2;
			pausedTimer = ticksPerSecond * 12;

			timerUpdater = PlayersEnterChoicesTimer;

			nextChatInviteTime = ticksPerSecond * 10;

			apg = network.GetAudienceSys();

			MakeHandlers();

/*			apg.SetHandlers( new NetworkMessageHandler()
				.Add<EmptyParms>( "join", (user, p) => {
					if( players.AddPlayer(user )) {
						apg.WriteToClients("join", new ClientJoinParms { name = user });
					}
				} )
				.Add<SelectionParms>( "upd", (user, p) => {
					players.SetPlayerInput( user, p.choices );
				} ) );*/
		}

		public void MakeIntroPlaque() {
			new ent( gameSys) { ignorePause = true, sprite = introPlaque, parentMono=src, scale = 1.3f, pos= new v3( 0, 0, 10 ), health = 1,
				update = e2 => {
					if( Input.GetKey(KeyCode.Escape) || Input.GetKey(KeyCode.Space) || Input.GetButton("Fire1") || Input.GetButton("Fire2") ) e2.health = 0;
					if( e2.health > 0 ) {
						var v = e2.pos;
						nm.ease(ref v, new v3(0,0,10), .1f );
						e2.pos = v;
					}
					else {
						var v = e2.pos;
						nm.ease(ref v, new v3(0,-10,10), .1f );
						e2.pos = v;
					}
					if( e2.pos.y < -9f )e2.remove();
				}
			};
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

		void MakeRoundEnd() {
			var info = players.GetEndOfRoundInfo();

			Debug.Log( "The Length is " + info.Count );

			var tick = ticksPerSecond * (12 + 4 );
			new ent( gameSys ) { ignorePause = true,
				update = e => {
					tick--;

					if( tick == ticksPerSecond * (11 + 4) ) {
						new ent( gameSys, textName ) { ignorePause = true, text = "Round " + (roundNumber-1)+" is over!", parentMono=src, scale = .1f, pos= new v3( 0, 3, 10 ), health = ticksPerSecond * 2,
							update = e2 => {
								if( e2.health > 0 ) {
									var v = e2.pos;
									nm.ease(ref v, new v3(0,3,10), .1f );
									e2.pos = v;
								}
								else {
									var v = e2.pos;
									nm.ease(ref v, new v3(0,-10,10), .1f );
									e2.pos = v;
								}
								e2.health--;
								if( e2.pos.y < -9f )e2.remove();
							} };
					}

					if( tick == ticksPerSecond * (11 + 2) ) {

						new ent( gameSys, textName ) { ignorePause = true, text = "Audience Actions for Round " + (roundNumber), parentMono=src, scale = .1f, pos= new v3( 0, 4, 10 ), health = ticksPerSecond * 13,
							update = e2 => {
								if( e2.health > 0 ) {
									var v = e2.pos;
									nm.ease(ref v, new v3(0,4,10), .1f );
									e2.pos = v;
								}
								else {
									var v = e2.pos;
									nm.ease(ref v, new v3(0,-10,10), .1f );
									e2.pos = v;
								}
								e2.health--;
								if( e2.pos.y < -9f )e2.remove();
							}
						};

						var lastID = -1;

						new ent( gameSys ) { ignorePause = true, scale = 1f, pos= new v3( 0, 3, 10 ), health = ticksPerSecond * 13, sprite = playerHighlight, color=new Color(1,1,1,.5f),
							update = e2 => {
								int id = (int)Mathf.Floor( 20 * e2.health/ (ticksPerSecond*13f));
								if( id < 0 )id=0;
								if( id >= info.Count )id=info.Count-1;

								if( id != lastID ) {
									lastID = id;
									new ent( gameSys, textName ) { ignorePause = true, scale = .05f, pos = info[id].pos + new v3( 0, .5f, -.1f ), health = ticksPerSecond * 1, text = info[id].actionName, textColor=info[id].actionColor,
										update = e3 => {
											e3.health--;
											if( e3.health < 10 )e3.textAlpha = e3.health/10f;
											e3.pos = e3.pos + new v3(0,.01f, 0);
											if( e3.health <= 0f )e3.remove();
										}
									};
									new ent( gameSys, textName ) { ignorePause = true, scale = .05f, pos = info[id].pos + new v3( 0, .1f, -.1f ), health = ticksPerSecond * 1, text = info[id].stanceName, textColor=info[id].stanceColor,
										update = e3 => {
											e3.health--;
											if( e3.health < 10 )e3.textAlpha = e3.health/10f;
											e3.pos = e3.pos + new v3(0,.01f, 0);
											if( e3.health <= 0f )e3.remove();
										}
									};
								}

								e2.health--;
								if( e2.health <= 0f )e2.remove();
									var v = e2.pos;
									nm.ease(ref v, info[id].pos, .3f );
									e2.pos = v;
							}
						};
					}


					if( tick < 12 * ticksPerSecond ) {
						pausedTimer = tick;
					}

					if( tick == 0 ) {
						pausedTimer=0;
						e.remove();
					}
				}
			};
		}

		void PausedTimer() {
			//pausedTimer--;
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

				MakeRoundEnd();

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
				apg.WriteToClients("submit");
				roundNumber++;

				apg.WriteToClients( "time", new RoundUpdate {time=(int)(nextAudiencePlayerChoice/60),round= roundNumber+1});

				timerUpdater = CollectPlayerChoicesTimer;
			}
		}

		void Update() {

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