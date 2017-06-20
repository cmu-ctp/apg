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

	public int team1Lives = 0;
	public int team2Lives = 0;

	public float team1Health = 0;
	public float team2Health = 0;

	public float team1MaxHealth = 0;
	public float team2MaxHealth = 0;


	GameSys gameSys;
	Players players;

	void RunDebug(PlayerSet playerSet, APGSys apg) {
		var names = new string[] { "Taki", "Fin", "Castral Fex", "FireTiger", "Ribaeld", "Big Tong", "Gatekeeper", "KittyKat", "Purifier", "Flaer", "Soothsayer13", "xxxBarryxxx", "PlasterPant", "Kokirei", "Fighter", "Seer", "Paninea", "Graethei", "Magesty", "Revolution" };
		for(var k = 0; k < 20; k++) playerSet.AddPlayer( names[k] );
		//for(var k = 0; k < 10; k++) playerSet.AddPlayer( names[k] );
		var tick=0;
		new ent( gameSys ) {
			update = e => {
				tick++;
				if( tick > 60 * 7 ) {
					tick = 0;
					for( var k = 0; k < names.Length; k++ ) {
						apg.WriteLocal( names[k], "upd", new APGBasicGameLogic.SelectionParms{ choices= new int[] {rd.i(0,6),rd.i(0,3),rd.i(0,6), rd.i(0, 7), rd.i(0, 6), 1 } } );
					}
				}
			}
		};
	}

	public void Setup(GameSys theGameSys, Players thePlayers, FoeSys foeSys, PlayerSet playerSet, PlayerSys playerSys, APGSys apg) {
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
		public int[] st;
		public int[] rs;
	}

	void Buddies(PlayerSet playerEvents, PlayerSys playerSys) {

		var bsrc = new ent(gameSys) { name="buddySet" };

		var nameColors = new Color[] { new Color(.2f, .4f, .6f, 1f), new Color(.4f, .6f, .2f, 1f), new Color(.6f, .2f, .4f, 1f), new Color(.6f, .4f, .2f, 1f), new Color(.4f, .2f, .6f, 1f), new Color(.2f, .6f, .4f, 1f), new Color(.533f, .533f, .533f, 1f), new Color(.6f, .2f, .2f, 1f), new Color(.2f, .6f, .2f, 1f), new Color(.2f, .2f, .6f, 1f) };

		for ( var k2 = 0; k2 < 20; k2++ ) {

			var k = Mathf.Floor( k2 / 2 ) + (k2%2 == 1 ? 10:0);

			bool inUse = false;
			var nameColor = nameColors[(int)k % 10];

			var label = new ent(gameSys, players.textName) { pos = new v3(0, 0, 0), text="", textColor=nameColor };
			var action1 = new ent(gameSys) { sprite=players.actions[0], pos = new v3(0, 0, 0),scale=.5f, active=false};
			var action2 = new ent(gameSys) { sprite = players.actions[1], pos = new v3(0, 0, 0), scale = .5f, active = false };
			var action3 = new ent(gameSys) { sprite = players.actions[2], pos = new v3(0, 0, 0), scale = .5f, active = false };
			var healthBar = new ent(gameSys) { sprite = players.healthBar, pos = new v3(0, 0, 0), scale=.07f, color=new Color(.33f,0,0, .5f) };
			var staminaBar = new ent(gameSys) { sprite = players.staminaBar, pos = new v3(0, 0, 0), scale = .07f, color=new Color(.33f,.33f,.15f,.5f), active = false };
			var labelBack = new ent(gameSys, players.textName) { pos = new v3(0, 0, 0), text="", textColor=new Color(0,0,0,1), children = new List<ent> { label, action1, action2, action3, healthBar, staminaBar }};

			var head = new ent(gameSys) { pos = new v3(0, 0, 0), sprite = players.heads[(int)k], color = new Color(1, 1, 1, 1) };

			var parms = new int[] { 0, 0, 0, 0, 0, 0, 0 };
			var bufferedParms = new int[] { 0, 0, 0, 0, 0, 0, 0 };
			var posx = (k<10) ? -9.5f + 8.5f*((k%6)/6f) : 9.5f - 8.5f*(((k-10)%6)/6f);
			var goalz = (k<6 || (k>9&&k<16))?-.4f:.4f;

			var team = (k < 10 ) ? 1:2;

			ent pl = null;

			var buildingGoal = (int)((k < 10) ? (k % 6) : (k - 10) % 6);
			var goalx = posx;
			var goalLayer = (k < 6 || (k > 9 && k < 16)) ? 0 : 2;
			var action1id = 0; var action2id = 0; var action3id = 0;
			var stamina = 10;

			playerEvents.RegisterHandler(new AudiencePlayerEventsHandler {
				onJoin = name => {
					label.text = name;
					labelBack.text = name;
					action1.active = true; action2.active = true; action3.active = true; staminaBar.active = true;
					healthBar.pos = new v3(-.5f, -5f, -.1f);
					inUse = true;},
				getName = () => label.text,
				getHealth = () => pl.health,
				onInput = inputs => { bufferedParms = inputs; },
				getGoalBuilding = () => buildingGoal + ( team == 2 ? 6:0 ),
				getLayer = () => goalLayer,
				setBuilding = building => { buildingGoal = building; goalx = (-9.5f + 8.5f * ((building % 6) / 6f)) * ((building < 6) ? 1 : -1); },
				setGoalLayer = layer => { goalLayer = layer;  goalz = -.4f + .4f * layer; },
				getEndOfRoundInfo = () => new PlayerEndOfRoundInfo { pos = pl.pos, nameColor = nameColor, name = label.text, actionName = "", stanceIcon = null, stanceName="", stanceColor=new Color(1,1,1,1), actionColor= new Color(1, 1, 1, 1) },
				onRoundEnd = () => {
					parms = bufferedParms;
					parms[0] = nm.Between(0, parms[0], 5);
					parms[1] = nm.Between(0, parms[1], 2);
					parms[2] = nm.Between(0, parms[2], 8);
					parms[3] = nm.Between(0, parms[3], 8);
					parms[4] = nm.Between(0, parms[4], 8);
					buildingGoal =  parms[0];
					goalLayer = parms[1];
					action1.sprite = players.actions[parms[2]];
					action2.sprite = players.actions[parms[3]];
					action3.sprite = players.actions[parms[4]];
					action1id = parms[2];
					action2id = parms[3];
					action3id = parms[4];
				},
				updateToClient = ( apg, userName ) => {
					Debug.Log("Writing client " + userName);
					apg.WriteToClients("pl", new PlayerUpdate { nm = userName, st=new int[] { pl.health, stamina, buildingGoal, goalLayer }, rs=new int[] { 0,0,0,0,0,0,0,0} });
					}
			});

			
			var buddyID = k;
			var tick = 0;
			var spd = 0f;

			var nameFlash = 0f;
			var nameFlashColor = new Color(0, 0, 0, 0);

			var healthRatio = 1f;
			var goalHealthRatio = 1f;

			pl = new ent(gameSys) {
				sprite = players.anims[14], pos = new v3(posx, -5, goalz), scale = .3f*.3f * 4.5f, health = 5, children = new List<ent> { labelBack, head }, flipped=(k<10) ? false : true, leader= (k < 10) ? playerSys.playerEnt : ( playerSys.player2Ent != null ) ? playerSys.player2Ent:playerSys.playerEnt,
					name = "buddy"+k, inGrid=true, parent = bsrc, shadow=gameSys.Shadow(players.shadow, null, 1, .4f, 0 ), color= nameColors[(int)k % 10],
				onHurt = (e, src, dmg) => {
					e.health--;
					goalHealthRatio = (e.health / 5f);
					if( team == 1 ) {
						team1Health--;
					}
					else {
						team2Health--;
					}
					if(e.health > 0) {
						gameSys.Sound(players.hurtSound, 1);
						React(e.pos + new v3(0, 0, -.2f), players.owMsg);
						nameFlash = 1f;
						nameFlashColor = new Color(1, 0, 0, 1);
					}
					else {
						gameSys.Sound(players.dieSound, 1);
						if( team == 2 )team2Lives--;
						else team1Lives--;
						label.text ="";
						labelBack.text ="";
						action1.active = action2.active = action3.active = healthBar.active = staminaBar.active = false;
						Ghost(e.pos, e.leader, team );
						React(e.pos + new v3(0, 0, -.2f), players.ughMsg);
						e.color = new Color(1, 0, 0, .2f);
						head.color = new Color(1, 0, 0, .2f);
					}
				},
				update = e => {
					if(e.health <= 0) return;

					if( healthRatio <= .25f) {
						if( tick % 30 == 0) {
							healthBar.color = new Color(1, 0, 0, 1);
						}
						if (tick % 30 == 5) {
							healthBar.color = new Color(.33f, 0, 0, .5f);
						}
					}
					if (healthRatio <= .5f) {
						if (tick % 120 == 0) {
							healthBar.color = new Color(1, 0, 0, 1);
						}
						if (tick % 120 == 5) {
							healthBar.color = new Color(.33f, 0, 0, .5f);
						}
					}

					if ( Math.Abs( healthRatio - goalHealthRatio ) > .01f) {
						healthRatio = healthRatio * .93f + .07f * goalHealthRatio;
						healthBar.scale3 = new v3(1.75f * healthRatio, 1.75f, .07f);
					}

					if( nameFlash > 0.01f) {
						nameFlash *= .99f;
						label.textColor = new Color( nameFlashColor.r * nameFlash + (1-nameFlash) * nameColor.r, nameFlashColor.g * nameFlash + (1 - nameFlash) * nameColor.g, nameFlashColor.b * nameFlash + (1 - nameFlash) * nameColor.b, 1 );
						label.scale = 1 + nameFlash*.25f;
					}

					if( parms == null || parms.Length < 4 ) {
						return;
					}
					tick++;

					gameSys.grid.Find(e.pos - new v3(0,.7f,0), 1, e, (me, targ) => { targ.buddyTouch(targ, me, new TouchInfo {strength=1 });});

					var goalposx = goalx;
					var goal = new v3(goalposx, -5f, goalz);
					var dir = goal-e.pos;
					if (dir.magnitude > .2f) {
						e.flipped = (dir.x < 0) ? true : false;
					}
					if(dir.magnitude > .4f) {
						nm.ease( ref spd, .017f * 3, .07f );
					}
					else if(dir.magnitude < .3f) {
						nm.ease( ref spd, 0, .05f );
						e.flipped = team==1 ? false : true;
					}
					e.MoveBy(dir.normalized * spd );
					labelBack.pos = new v3(labelBack.pos.x, -1.2f + (-.4f+e.pos.z)*1.3f, labelBack.pos.z);
					if (dir.magnitude > .1f) {
						e.ang = spd * Mathf.Cos( tick * .1f );
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

			labelBack.pos = new v3(0,-1.4f, -.2f );
			labelBack.scale *= .8f;
			label.pos = new v3(-.5f,.5f,-.1f);
			healthBar.pos = new v3(-.5f, 15f, -.1f);
			staminaBar.pos = new v3(-.5f, -7f, -.1f);
			action1.pos = new v3(17f, 0f, -.1f);
			action2.pos = new v3(17f, -4f, -.1f);
			action3.pos = new v3(17f, -8f, -.1f);

			head.pos = new v3(0f, 1.1f, -.001f);
			head.scale = .5f/.3f;
			if (k > 10) head.flipped = true;
		}
	}
}