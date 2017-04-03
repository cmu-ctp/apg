using UnityEngine;
using System.Collections.Generic;
using v3 = UnityEngine.Vector3;
using APG;

public class BuddyChoice { public const int MoveTo = 0; public const int Action = 1; public const int Stance = 2; public const int Item = 3; public const int Equip = 4; };
public class BuddyMoveTo { public const int StayPut = 0; public const int Foundry = 1; public const int Hospital = 2; public const int Bank = 3; public const int Airport = 4; public const int Foodcart = 5; public const int SuperMarket = 6; };
public class BuddyAction { public const int Wait = 0; public const int Attack = 1; public const int Defend = 2; public const int Heal = 3; public const int MegaAttack = 4; public const int Protect = 5; };
public class BuddyStance { public const int Wait = 0; public const int Attack = 1; public const int Defend = 2; public const int Heal = 3; public const int MegaAttack = 4; public const int Protect = 5; };
public class BuddyItems { public const int Wait = 0; public const int Attack = 1; public const int Defend = 2; public const int Heal = 3; public const int MegaAttack = 4; public const int Protect = 5; };
public class BuddyEquip { public const int Wait = 0; public const int Attack = 1; public const int Defend = 2; public const int Heal = 3; public const int MegaAttack = 4; public const int Protect = 5; };

public class AudiencePlayerSys {

	public int liveBuddies = 0;

	GameSys gameSys;
	Players players;

	public void Setup(GameSys theGameSys, Players thePlayers, FoeSys foeSys, PlayerSet apgSys, PlayerSys playerSys) {
		gameSys = theGameSys;
		players = thePlayers;

		Buddies(apgSys, playerSys );

		//var names = new string[] { "Taki", "Fin", "Castral Fex", "FireTiger", "Ribaeld", "Big Tong", "Gatekeeper", "KittyKat", "Purifier", "Flaer", "Soothsayer13", "xxxBarryxxx", "PlasterPant", "Kokirei", "Fighter", "Seer", "Paninea", "Graethei", "Magesty", "Revolution" };
		//for(var k = 0; k < 20; k++) apgSys.AddPlayer( names[k] );
		/*ForcePlayersUpdate = () => {
			for(var id = 0; id < 20; id++) {
				var parms = new List<int>();
				for(var k = 1; k < 5; k++) parms.Add((int)UnityEngine.Random.Range(1, 6));
				apgSys.SetPlayerInput( names[id], parms );
			}
		};*/
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


			var label = new ent(gameSys, players.textName) { pos = new v3(0, 0, 0), text="null", textColor=nameColor };
			var parms = new int[] { 0, 0, 0, 0, 0, 0, 0 };
			var posx = (k<10) ? -11 + 9*(k/10f) : 11 - 9*((k-10)/10f);

			playerEvents.RegisterHandler(new AudiencePlayerEventsHandler {
				onJoin = name => { label.text = name; inUse = true; Debug.Log( "Got join" ); },
				onInput = inputs => { parms = inputs; Debug.Log( "Got input of " + inputs ); }
			});

			var goalz = .8f + rd.f(0, 1.5f);
			var buddyID = k;
			var tick = 0;
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

					if(parms[BuddyChoice.MoveTo] != BuddyMoveTo.StayPut) {
						var goalposx = (-13 + 12 * (parms[BuddyChoice.MoveTo]/6f)) * ((buddyID < 10) ? 1 : -1);
						var goal = new v3(goalposx, -6, goalz);
						var immediateGoal = e.pos * .99f + .01f * goal;
						if(immediateGoal.magnitude > .1f) e.MoveBy(immediateGoal - e.pos);
					}
				}
			};
		}
	}
}