using UnityEngine;
using System.Collections.Generic;
using v3 = UnityEngine.Vector3;
using APG;


public class AudiencePlayerSys {

	enum BuddyChoice { MoveTo = 0, Action, Stance, Item, Equip, END };
	enum BuddyMoveTo { StayPut = 0, Foundry, Hospital, Bank, Airport, Foodcart, SuperMarket, END };
	enum BuddyAction { Defend = 0, Harvest, Activate, ChargeUp, Assist, Hide, Give, END };
	enum BuddyStance { Industrious = 0, Reckless, Defensive, Soothing, Acquisitive, Helpful, END };

	public int liveBuddies = 0;

	GameSys gameSys;
	Players players;

	void RunDebug(PlayerSet playerSet, AudienceInterface apg) {
		var names = new string[] { "Taki", "Fin", "Castral Fex", "FireTiger", "Ribaeld", "Big Tong", "Gatekeeper", "KittyKat", "Purifier", "Flaer", "Soothsayer13", "xxxBarryxxx", "PlasterPant", "Kokirei", "Fighter", "Seer", "Paninea", "Graethei", "Magesty", "Revolution" };
		for(var k = 0; k < 20; k++) playerSet.AddPlayer( names[k] );
		var tick=0;
		new ent( gameSys ) {
			update = e => {
				tick++;
				if( tick > 60 * 7 ) {
					tick = 0;
					for( var k = 0; k < names.Length; k++ ) {
						apg.WriteLocal( names[k], "upd", new APGBasicGameLogic.SelectionParms{ choices= new int[] {rd.i(0,6),2,3,4,5, 6 } } );
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

	public void Ghost(v3 pos, ent leader) {
		float stopDist = rd.f(-4, -2), fadeOffset = rd.Ang(), tick = 0;
		var goalOffset = rd.Vec(-2, 2); 
		new ent(gameSys) {
			sprite = players.angel, pos = pos, scale = .35f, leader=leader,
			update = e => {
				tick++;
				e.color = nm.col(1, .5f + .5f * Mathf.Cos(tick * .02f + fadeOffset));
				var goal = e.leader.pos - e.pos + goalOffset;
				var spd = Mathf.Max( (goal.magnitude - stopDist)*.003f, 0 );
				if(spd > 0) e.MoveBy(goal.normalized * spd);
			}
		};
	}

	void Buddies(PlayerSet playerEvents, PlayerSys playerSys) {
		var bsrc = new ent(gameSys) { name="buddySet" };
		for( var k = 0; k < 20; k++ ) {
			liveBuddies++;

			bool inUse = false;
			var nameColor = new Color( rd.f(0,.5f), rd.f(0,.5f), rd.f(0,.5f), 1 );


			var label = new ent(gameSys, players.textName) { pos = new v3(0, 0, 0), text="", textColor=nameColor };
			var parms = new int[] { 0, 0, 0, 0, 0, 0, 0 };
			var posx = (k<10) ? -11 + 9*(k/10f) : 11 - 9*((k-10)/10f);

			playerEvents.RegisterHandler(new AudiencePlayerEventsHandler {
				onJoin = name => { label.text = name; inUse = true;  },
				onInput = inputs => { parms = inputs;  }
			});

			var goalz = .8f + rd.f(0, 1.5f);
			var buddyID = k;
			var tick = 0;
			var spd = 0f;
			new ent(gameSys) {
				sprite = rd.Sprite(players.friends), pos = new v3(posx, -6, goalz), scale = .3f * 4.5f, health = 3, children = new List<ent> { label }, flipped=(k<10) ? false : true, leader= (k < 10) ? playerSys.playerEnt : ( playerSys.player2Ent != null ) ? playerSys.player2Ent:playerSys.playerEnt,
					name = "buddy"+k, inGrid=true, parent = bsrc,
				onHurt = (e, src, dmg) => {
					e.health--;
					if(e.health > 0) {
						gameSys.Sound(players.hurtSound, 1);
						React(e.pos + new v3(0, 0, -.2f), players.owMsg);
					}
					else {
						gameSys.Sound(players.dieSound, 1);
						liveBuddies--;
						Ghost(e.pos, e.leader);
						React(e.pos + new v3(0, 0, -.2f), players.ughMsg); e.color = new Color(1, 0, 0, .5f);
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
						var goalposx = (-13 + 12 * (parms[(int)BuddyChoice.MoveTo]/6f)) * ((buddyID < 10) ? 1 : -1);
						var goal = new v3(goalposx, -6, goalz);
						var immediateGoal = e.pos * .99f + .01f * goal;
						var dir = goal-e.pos;
						e.flipped = ( dir.x < 0 ) ? true:false;
						if(dir.magnitude > .4f) {
							nm.ease( ref spd, .017f, .05f );
						}
						else if(dir.magnitude < .3f) {
							nm.ease( ref spd, 0, .05f );
						}
						e.MoveBy(dir.normalized * spd );
						if(dir.magnitude > .1f) {
							//e.MoveBy(immediateGoal - e.pos);
							e.ang = spd * Mathf.Cos( tick * .1f );
						}
						else {

						}
					}
				}
			};
		}
	}
}