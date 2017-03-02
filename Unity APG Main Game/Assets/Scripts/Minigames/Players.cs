using UnityEngine;
using System.Collections.Generic;
using System;
using V3 = UnityEngine.Vector3;
using APG;

/*
 * How exactly is blowing handled right now?
 * 
 * And bumping into?
 * 
	Player blow balloons.
	Player push balloons.
	Player pop balloons.
	Balloons remove themselves.
 */

public class BuddyChoice { public const int MoveTo = 0; public const int Action = 1; public const int Stance = 2; public const int Item = 3; public const int Equip = 4; };
public class BuddyMoveTo { public const int StayPut = 0; public const int Foundry = 1; public const int Hospital = 2; public const int Bank = 3; public const int Airport = 4; public const int Foodcart = 5; public const int SuperMarket = 6; };
public class BuddyAction { public const int Wait = 0; public const int Attack = 1; public const int Defend = 2; public const int Heal = 3; public const int MegaAttack = 4; public const int Protect = 5; };
public class BuddyStance { public const int Wait = 0; public const int Attack = 1; public const int Defend = 2; public const int Heal = 3; public const int MegaAttack = 4; public const int Protect = 5; };
public class BuddyItems { public const int Wait = 0; public const int Attack = 1; public const int Defend = 2; public const int Heal = 3; public const int MegaAttack = 4; public const int Protect = 5; };
public class BuddyEquip { public const int Wait = 0; public const int Attack = 1; public const int Defend = 2; public const int Heal = 3; public const int MegaAttack = 4; public const int Protect = 5; };

public class Players:MonoBehaviour {
	public GameObject textName;
	public Sprite[] clouds, friends;
	public Sprite player, angel;
	public Sprite owMsg, ughMsg, thudMsg;
	public AudioClip blowSound, bumpSound, hurtSound, dieSound;
} 

public class PlayerSys {
	public Ent playerEnt = null, player2Ent = null;
	public List<Ent> buddies = new List<Ent>();
	public int liveBuddies = 0;

	GameSys gameSys;
	Players players;

	public void Setup(GameSys theGameSys, Players thePlayers, FoeSys foeSys, APG.AudienceSysInterface apgSys) {
		gameSys = theGameSys;
		players = thePlayers;

		Player(1, foeSys);
		Player(2, foeSys);
		Buddies(apgSys);

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
	public void Ghost(V3 pos, Ent leader) {
		float stopDist = Rd.Fl(-4, -2), fadeOffset = Rd.Ang(), tick = 0;
		var goalOffset = Rd.Vec(-2, 2); 
		new Ent(gameSys) {
			sprite = players.angel, pos = pos, scale = .35f, leader=leader,
			update = e => {
				tick++;
				e.color = new Color(1, 1, 1, .5f + .5f * Mathf.Cos(tick * .02f + fadeOffset));
				var goal = e.leader.pos - e.pos + goalOffset;
				var spd = Mathf.Max( (goal.magnitude - stopDist)*.003f, 0 );
				if(spd > 0) e.MoveBy(goal.normalized * spd);
			}
		};
	}
	public void TryHitPlayers(Ent e, float dist, Action<Ent> onHit) {
		var dif = playerEnt.pos - e.pos;
		dif.z = 0;
		if(dif.magnitude < dist) {
			onHit(playerEnt);
			return;
		}
		if( player2Ent == null)return;
		dif = player2Ent.pos - e.pos;
		dif.z = 0;
		if(dif.magnitude < dist)onHit(player2Ent);
	}
	public void TryHitBuddies(Ent e, float dist, bool stopOnHit, Action<Ent> onHit) {
		foreach(var b in buddies) {
			if(b.health <= 0) continue;
			var dif = b.pos - e.pos;
			dif.z = 0;
			if(dif.magnitude < dist) {
				onHit(b);
				if(stopOnHit) return;
			}
		}
	}

	void Player(int id, FoeSys foeSys) {
		float t = 0.0f, rot = 0.0f, useDownTime = 0f;
		var useDown = false;
		KeyCode left, right, up, down, use;
		Sprite pic = players.player;
		left = KeyCode.LeftArrow; right = KeyCode.RightArrow; up = KeyCode.UpArrow; down = KeyCode.DownArrow; use = KeyCode.RightShift;
		if(id == 1) { left = KeyCode.A; right = KeyCode.D; up = KeyCode.W; down = KeyCode.S; use = KeyCode.LeftShift; }
		else pic = players.friends[0];

		var cloudSet = new List<Ent>();
		var blow = new List<Action<V3, float, float, float>>();
		var inhale = new List<Action<V3, float, float, float>>();
		var inhaleBig = new List<Action<V3, float, float, float>>();
		foreach(var k in 20.Loop()) {
			float cloudRot = Rd.Fl(-3f, 3f), fallSpeed = Rd.Fl(.85f, .95f), chargeStrength = 1f;
			var b = new V3( 0f, 0f, 0f );
			var cloudNum = k;
			var blowing = false;
			var f = new Ent(gameSys) {
				sprite = Rd.Sprite(players.clouds), scale=0,
				update = e => {
					if(e.scale < .01f) return;
					e.MoveBy(b);
					b *= fallSpeed;
					e.scale *= fallSpeed;
					e.ang += cloudRot;
					e.vel = b;
					if(cloudNum == 0 && blowing && e.scale > .1f) {
						gameSys.grid.Find(e.pos, 1+chargeStrength, e, (me, targ) => { targ.use(targ, me, UseType.PlayerBlowing, (int)chargeStrength);});
					}
				}
			};
			blow.Add((srcPos, blowVx, blowVy, chargeSize) => {
				var size = 1f;
				blowing = true;
				if(chargeSize == 3) { size = 4;}
				if(chargeSize == 2) { size = 2; }
				chargeStrength = chargeSize;
				if(cloudNum == 0) {
					var spd = size;
					b += new V3( blowVx * .4f*spd, blowVy * .4f*spd, 0 );
					b.z = 0;
					f.pos = srcPos;
					f.scale = size*.25f;
				}
				else {
					var spd = Rd.Fl(.5f, size);
					b += new V3( blowVx * .4f*spd + Rd.Fl(-.02f, .02f), blowVy * .4f*spd + Rd.Fl(-.02f, .02f), Rd.Fl(-.03f, .03f) );
					f.pos = srcPos + new V3(0, .2f, 0);
					f.scale = size * Rd.Fl(.05f, .25f);
				}
			});
			inhale.Add((srcPos, blowVx, blowVy, chargeSize) => {
				blowing = false;
				b = new V3( Rd.Fl(-.02f, .02f), Rd.Fl(-.02f, .02f), Rd.Fl(-.03f, .03f) );
				f.pos = srcPos + new V3(0, .2f, 0);
				f.scale = Rd.Fl(.05f, .25f);
			});
			inhaleBig.Add((srcPos, blowVx, blowVy, chargeSize) => {
				blowing = false;
				b = new V3( 2*Rd.Fl(-.02f, .02f), 2*Rd.Fl(-.02f, .02f), 2*Rd.Fl(-.03f, .03f) );
				f.pos = srcPos + new V3(0, .2f, 0);
				f.scale = 2*Rd.Fl(.05f, .25f);
			});
		}

		var pl = new Ent(gameSys) {
			sprite = pic, pos = new V3((id==1) ? -5f : 5f, 0, 0), scale = 1.5f, flipped=(id == 2) ? true : false, vel = new V3(0, 0, 0), knockback = new V3(0, 0, 0),
			update = e => {
				t++;
				if(Input.GetKey(left)) {
					e.flipped = true;
					Num.Ease(ref e.vel.x, -1.0f, .3f);
				}
				else if(Input.GetKey(right)) {
					e.flipped = false;
					Num.Ease(ref e.vel.x, 1.0f, .3f);
				}
				else Num.Ease(ref e.vel.x, 0, .1f); ;
				if(Input.GetKey(up)) { Num.Ease(ref e.vel.y, 1.0f, .3f); }
				else if(Input.GetKey(down)) { Num.Ease(ref e.vel.y, -1.0f, .3f); }
				else Num.Ease(ref e.vel.y, 0, .1f);
				rot = e.vel.x * 360 / Mathf.PI;
				if(Input.GetKey(use)) {
					if(useDown == false) { useDownTime = t; }
					if(t-useDownTime == 90) {
						foreach(var b in inhaleBig) b(e.pos, e.vel.x, e.vel.y, 1);
					}
					else if(t-useDownTime == 30) {
						foreach(var b in inhale) b(e.pos, e.vel.x, e.vel.y, 1);
					}
					useDown = true;
				}
				else {
					if(useDown == true) {
						gameSys.Sound(players.blowSound, 1);
						var knockback2 = new V3(-e.vel.x, -e.vel.y, 0).normalized;
						var blowStrength = 1;
						if(t-useDownTime > 90) {
							knockback2 *= 1.5f;
							blowStrength = 3;
						}
						else if(t-useDownTime > 30) {
							knockback2 *= .8f;
							blowStrength = 2;
						}
						else { knockback2 *= .4f; }
						foreach(var b in blow) b(e.pos, e.vel.x, e.vel.y, blowStrength);
						e.knockback += knockback2;
						foreach(var f in foeSys.foeList) {
							var dif = e.pos - f.pos;
							dif.z = 0;
							if(dif.magnitude < 4f) { f.use(f, e, UseType.PlayerBlowing, 1); }
						}
					}
					useDown = false;
				}
				e.knockback *= .8f;
				if(Mathf.Abs(e.vel.x) < .001f) e.vel.x = 0;
				if(Mathf.Abs(e.vel.y) < .001f) e.vel.y = 0;
				if(e.pos.x < -11.0f && e.vel.x < 0) e.vel.x = 0;
				if(e.pos.x > 11.0f && e.vel.x > 0) e.vel.x = 0;
				if(e.pos.y < -6.0f && e.vel.y < 0) e.vel.y = 0;
				if(e.pos.y > 6.0f && e.vel.y > 0) e.vel.y = 0;
				e.MoveBy(e.vel.x * .15f + e.knockback.x, e.vel.y * .15f+e.knockback.y, .01f * Mathf.Cos(t * .04f));
				e.ang = -rot * .1f;
			},
			use = (e, user, useType, useStrength) => { e.knockback += user.vel * .16f;}
		};
		if(id == 2) player2Ent = pl;
		else playerEnt = pl;
	}

	void React(V3 pos, Sprite msg) {
		var delay = 30;
		new Ent(gameSys) { sprite = msg, pos = pos, scale = 1, update = e => { delay--; if(delay <= 0) e.remove(); } };
	}

	void Buddies(AudienceSysInterface playerEvents) {
		foreach(var k in 20.Loop()) {
			liveBuddies++;
			var label = new Ent(gameSys, players.textName) { pos = new V3(0, 0, 0) };
			var t = label.src.GetComponent<TextMesh>();
			t.text = "Type join "+(k+1);
			var parms = new List<int> { 0, 0, 0, 0, 0, 0, 0 };
			var posx = (k<10) ? -11 + 9*(k/10f) : 11 - 9*((k-10)/10f);
			playerEvents.RegisterHandler(new AudiencePlayerEventHandler {
				onJoin = name => t.text = name,
				onInput = inputs => parms = inputs,
				updateClient = () => ""
			});
			var goalz = .8f + Rd.Fl(0, 1.5f);
			var buddyID = k;
			buddies.Add(new Ent(gameSys) {
				sprite = Rd.Sprite(players.friends), pos = new V3(posx, -6, goalz), scale = .3f * 4.5f, health = 3, children = new List<Ent> { label }, flipped=(k<10) ? false : true, leader= (k < 10) ? playerEnt : ( player2Ent != null ) ? player2Ent:playerEnt,
				onHurt = (e, src, dmg) => {
					e.health--;
					if(e.health > 0) {
						gameSys.Sound(players.hurtSound, 1);
						React(e.pos + new V3(0, 0, -.2f), players.owMsg);
					}
					else {
						gameSys.Sound(players.dieSound, 1);
						liveBuddies--;
						Ghost(e.pos, e.leader);
						React(e.pos + new V3(0, 0, -.2f), players.ughMsg); e.color = new Color(1, 0, 0, .5f);
					}
				},
				update = e => {
					if(e.health <= 0) return;

					if( parms == null || parms.Count < 4 ) {
						return;
					}

					if(parms[BuddyChoice.MoveTo] != BuddyMoveTo.StayPut) {
						var goalposx = (-13 + 12 * (parms[BuddyChoice.MoveTo]/6f)) * ((buddyID < 10) ? 1 : -1);
						var goal = new V3(goalposx, -6, goalz);
						var immediateGoal = e.pos * .99f + .01f * goal;
						if(immediateGoal.magnitude > .1f) e.MoveBy(immediateGoal - e.pos);
					}
				}
			});
		}
	}
}