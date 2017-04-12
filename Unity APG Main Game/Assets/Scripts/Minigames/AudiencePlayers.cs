using System;
using UnityEngine;
using System.Collections.Generic;
using v3 = UnityEngine.Vector3;
using APG;

	// show aplayer stance
	// show aplayer action
	// show aplayer item
	// show aplayer equip

	// pause at beginning of game to let people connect

	// color code streamer player, audience players, buildings
	// show direction players is going to shoot
	// make players have a glowing halo
	
	// show round numbers in hud.  color code round numbers.

	// distribute aplayers better

	/*

	Get in rest of audiece player actions.

	Get in high level structure.  Game start, game end.

	Client turn sequencing: ?

	Get in between round stuff.  Need to pause game, show audience player actions.

	Players inhaling
	Players breath full flashing
	Maybe drop down to two breathing styles

	HUD round number
	Busted hud spawn thing

	Showing different damage numbers when players are hit by powerful attacks - different colors, different sizes, different lifetime, on react.  Really amp this up.

	parenting needs to work more reliably.

	.........................

	Look more carefully into whispers
	Look into twitch special account info stuff

	How to do multiple example projects?

	Some way to make Unity game and HTML5 clients interact without needing to connect to twitch?
	Easier way to test input, on both the server and the client?
	Keeping network messages in sync better?

	Whispers?

	Would be fun to have lots of quirky special one-off actions for audience players.

	What else do audience players need to see:
	Stats
	Other player stats
	Hints and Game Rules
	Surprising / funny things
	Teams queued up

	Other player category roles (in a fractal way)?

	Would be cool to have different player classes that have different impacts (to be selected when forming a team)

	Screen for turn effects

 */


public class AudiencePlayerSys {

	enum BuddyChoice { MoveTo = 0, Action, Stance, Item, Equip, END };
	enum BuddyMoveTo { StayPut = 0, Foundry, Hospital, Bank, Airport, Foodcart, SuperMarket, END };
	enum BuddyAction { Defend = 0, Harvest, Activate, ChargeUp, Assist, Hide, Give, END };
	enum BuddyStance { Industrious = 0, Reckless, Defensive, Soothing, Acquisitive, Helpful, END };

	public int team1Lives = 0;
	public int team2Lives = 0;

	public float team1Health = 0;
	public float team2Health = 0;

	public float team1MaxHealth = 0;
	public float team2MaxHealth = 0;


	GameSys gameSys;
	Players players;

	void RunDebug(PlayerSet playerSet, AudienceInterface apg) {
		var names = new string[] { "Taki", "Fin", "Castral Fex", "FireTiger", "Ribaeld", "Big Tong", "Gatekeeper", "KittyKat", "Purifier", "Flaer", "Soothsayer13", "xxxBarryxxx", "PlasterPant", "Kokirei", "Fighter", "Seer", "Paninea", "Graethei", "Magesty", "Revolution" };
		//for(var k = 0; k < 20; k++) playerSet.AddPlayer( names[k] );
		for(var k = 0; k < 16; k++) playerSet.AddPlayer( names[k] );
		var tick=0;
		new ent( gameSys ) {
			update = e => {
				tick++;
				if( tick > 60 * 7 ) {
					tick = 0;
					for( var k = 0; k < names.Length; k++ ) {
						apg.WriteLocal( names[k], "upd", new APGBasicGameLogic.SelectionParms{ choices= new int[] {rd.i(0,6),rd.i(0,5),rd.i(0,5),4,5, 6 } } );
					}
				}
			}
		};
	}

	public void Setup(GameSys theGameSys, Players thePlayers, FoeSys foeSys, PlayerSet playerSet, PlayerSys playerSys, AudienceInterface apg) {
		gameSys = theGameSys;
		players = thePlayers;

		Buddies(playerSet, playerSys );

		RunDebug( playerSet, apg );
	}

	void React(v3 pos, Sprite msg) {
		var delay = 30;
		new ent(gameSys) { sprite = msg, name="react", pos = pos, scale = 1, update = e => { delay--; if(delay <= 0) e.remove(); } };
	}

	public void Ghost(v3 pos, ent leader, int team ) {
		float stopDist = rd.f(-4, -2), fadeOffset = rd.Ang(), tick = 0;
		var goalOffset = rd.Vec(-2, 2); 
		new ent(gameSys) {
			sprite = ( team == 2 ? players.angel2 : players.angel1 ), pos = pos, scale = .35f, leader=leader,
			update = e => {
				tick++;
				e.color = nm.col(1, .5f + .5f * Mathf.Cos(tick * .02f + fadeOffset));
				var goal = e.leader.pos - e.pos + goalOffset;
				var spd = Mathf.Max( (goal.magnitude - stopDist)*.003f, 0 );
				if(spd > 0) e.MoveBy(goal.normalized * spd);
			}
		};
	}

	[Serializable]
	struct PlayerUpdate{
		public string nm;
		public int hp;
		public int money;
	}

	void Buddies(PlayerSet playerEvents, PlayerSys playerSys) {

		var actions = new string[]{"Defend", "Build", "Harvest", "Activate", "Assist", "Hide", "???" };
		var actionsZ = new float[]{-1f, 1f, 1f, 1f, 0f, 1.3f, 0f };

		var bsrc = new ent(gameSys) { name="buddySet" };
		for( var k2 = 0; k2 < 20; k2++ ) {

			var k = Mathf.Floor( k2 / 2 ) + (k2%2 == 1 ? 10:0);

			bool inUse = false;
			var nameColor = new Color( rd.f(0,.5f), rd.f(0,.5f), rd.f(0,.5f), 1 );

			var label = new ent(gameSys, players.textName) { pos = new v3(0, 0, 0), text="", textColor=nameColor };
			var labelBack = new ent(gameSys, players.textName) { pos = new v3(0, 0, 0), text="", textColor=new Color(0,0,0,1), children = new List<ent> { label }};

			var stance = new ent(gameSys) { pos = new v3(0, 0, 0), sprite = players.stances[2], color = new Color(1,1,1,0) };

			var healthLabel = new ent(gameSys, players.textName) { pos = new v3(0, 0, 0), text="", textColor=new Color(.5f,0,0,1) };

			var actionLabel = new ent(gameSys, players.textName) { pos = new v3(0, 0, 0), text="Defend", textColor=new Color(0,0,0,0) };

			var parms = new int[] { 0, 0, 0, 0, 0, 0, 0 };
			var bufferedParms = new int[] { 0, 0, 0, 0, 0, 0, 0 };
			var posx = (k<10) ? -10 + 9*(k/10f) : 10 - 9*((k-10)/10f);

			var team = (k < 10 ) ? 1:2;

			ent pl = null;

			var buildingGoal = 0;
			var goalx = 0f;
			var goalz = rd.f(.7f);

			playerEvents.RegisterHandler(new AudiencePlayerEventsHandler {
				onJoin = name => {
					label.text = name;
					labelBack.text = name;
					inUse = true;
					actionLabel.textColor=new Color(0,0,0,.4f);
					stance.color=new Color(1,1,1,.4f); },
				onInput = inputs => { bufferedParms = inputs; },
				getGoalBuilding = () => buildingGoal + ( team == 2 ? 6:0 ),
				setGoalX = x => goalx = x,
				onRoundEnd = () => {
					parms = bufferedParms;
					if( parms[(int)BuddyChoice.MoveTo] != (int)BuddyMoveTo.StayPut ){
						buildingGoal =  parms[(int)BuddyChoice.MoveTo] - 1;
					}
					goalz = actionsZ[parms[(int)BuddyChoice.Action]] +  rd.f(.3f);
					stance.sprite = players.stances[parms[(int)BuddyChoice.Stance]];
					actionLabel.text = actions[parms[(int)BuddyChoice.Action]]; },
				updateToClient = ( apg, userName ) => apg.WriteToClients( "pl", new PlayerUpdate { nm = userName, hp = pl.health, money=0 } )
			});

			
			var buddyID = k;
			var tick = 0;
			var spd = 0f;
			
			pl = new ent(gameSys) {
				sprite = rd.Sprite(players.friends), pos = new v3(posx, -5, goalz), scale = .3f * 4.5f, health = 3, children = new List<ent> { labelBack, stance, healthLabel, actionLabel }, flipped=(k<10) ? false : true, leader= (k < 10) ? playerSys.playerEnt : ( playerSys.player2Ent != null ) ? playerSys.player2Ent:playerSys.playerEnt,
					name = "buddy"+k, inGrid=true, parent = bsrc, shadow=gameSys.Shadow(players.shadow, null, 1, .4f, 0 ),
				onHurt = (e, src, dmg) => {
					e.health--;
					if( team == 1 ) {
						team1Health--;
					}
					else {
						team2Health--;
					}
					if(e.health > 0) {
						healthLabel.text = ""+Mathf.Floor(e.health / 3f * 100 )+"%";
						gameSys.Sound(players.hurtSound, 1);
						React(e.pos + new v3(0, 0, -.2f), players.owMsg);
					}
					else {
						gameSys.Sound(players.dieSound, 1);
						if( team == 2 )team2Lives--;
						else team1Lives--;
						label.text ="";
						labelBack.text ="";
						healthLabel.text = "";
						actionLabel.text = "";
						actionLabel.textColor = new Color(0,0,0,0);
						stance.color = new Color(0,0,0,0);
						Ghost(e.pos, e.leader, team );
						React(e.pos + new v3(0, 0, -.2f), players.ughMsg); e.color = new Color(1, 0, 0, .2f);
					}
				},
				update = e => {
					if(e.health <= 0) return;

					if( parms == null || parms.Length < 4 ) {
						return;
					}
					tick++;

					gameSys.grid.Find(e.pos - new v3(0,.7f,0), 1, e, (me, targ) => { targ.buddyTouch(targ, me, new TouchInfo {strength=1 });});

					if(parms[(int)BuddyChoice.MoveTo] != (int)BuddyMoveTo.StayPut) {
						var goalposx = goalx;//(-10 + 9 * (parms[(int)BuddyChoice.MoveTo]/6f)) * ((buddyID < 10) ? 1 : -1);
						var goal = new v3(goalposx, -5f, goalz);
						var immediateGoal = e.pos * .99f + .01f * goal;
						var dir = goal-e.pos;
						e.flipped = ( dir.x < 0 ) ? true:false;
						if(dir.magnitude > .4f) {
							nm.ease( ref spd, .017f * 3, .07f );
						}
						else if(dir.magnitude < .3f) {
							nm.ease( ref spd, 0, .05f );
						}
						e.MoveBy(dir.normalized * spd );
						if(dir.magnitude > .1f) {
							e.ang = spd * Mathf.Cos( tick * .1f );
						}
						else {
						}
					}
				}
			};
			if( k < 10 ) {
				team1Lives++;
				team1Health += pl.health;
				team1MaxHealth += pl.health;
			}
			else {
				team2Lives++;
				team2Health += pl.health;
				team2MaxHealth += pl.health;
			}

			labelBack.pos = new v3(0,-.4f, -.2f );
			label.pos = new v3(-.5f,.5f,-.01f);

			stance.pos = new v3(.2f, -.6f, -.2f );
			stance.scale = .15f;

			healthLabel.pos = new v3(0f, 0f, -.2f );
			healthLabel.scale = .02f;

			actionLabel.pos = new v3(-.2f, -.6f, -.2f );
			actionLabel.scale = .02f;

		}
	}
}