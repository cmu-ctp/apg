using UnityEngine;
using System.Collections.Generic;
using System;
using V3 = UnityEngine.Vector3;
using APG;

public class Players:MonoBehaviour {
	public GameObject textName;
	public Sprite[] clouds, friends;
	public Sprite player, angel;
	public Sprite owMsg, ughMsg, thudMsg;
	public AudioClip blowSound, bumpSound, hurtSound, dieSound;
} 

public class PlayerSys {
	public Ent playerEnt = null, player2Ent = null;

	GameSys gameSys;
	Players players;

	public void Setup(GameSys theGameSys, Players thePlayers, FoeSys foeSys, APG.AudienceSysInterface apgSys) {
		gameSys = theGameSys;
		players = thePlayers;

		Player(0, foeSys);
		//Player(1, foeSys);
		//Player(2, foeSys);
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

	void Player(int id, FoeSys foeSys) {
		float t = 0.0f, rot = 0.0f, useDownTime = 0f;
		var useDown = false;
		KeyCode left, right, up, down, use;
		Sprite pic = players.player;
		left = KeyCode.LeftArrow; right = KeyCode.RightArrow; up = KeyCode.UpArrow; down = KeyCode.DownArrow; use = KeyCode.RightShift;
		var startingX = 0f;
		if( id == 0 ) { use = KeyCode.Space; }
		else if(id == 1) { left = KeyCode.A; right = KeyCode.D; up = KeyCode.W; down = KeyCode.S; use = KeyCode.LeftShift; startingX = -5f; }
		else {  pic = players.friends[0]; startingX = 5f;}

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
				sprite = Rd.Sprite(players.clouds), scale=0, name="playerbreath",
				update = e => {
					if(e.scale < .01f) return;
					e.MoveBy(b);
					b *= fallSpeed;
					e.scale *= fallSpeed;
					e.ang += cloudRot;
					e.vel = b;
					if(cloudNum == 0 && blowing && e.scale > .1f) {
						gameSys.grid.Find(e.pos, .5f+.5f*chargeStrength, e, (me, targ) => { targ.pushedByBreath(targ, me, UseType.PlayerBlowing, (int)chargeStrength);});
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
			sprite = pic, pos = new V3( startingX, 0, 0 ), scale = 1.5f, flipped=(id == 2) ? true : false, vel = new V3(0, 0, 0), knockback = new V3(0, 0, 0), name="player"+id,
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
					if(t-useDownTime == 135) {
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
						if(t-useDownTime > 135) {
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
							if(dif.magnitude < 4f) { f.pushedByBreath(f, e, UseType.PlayerBlowing, 1); }
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
				gameSys.grid.Find(e.pos - new V3(0,.7f,0), 1, e, (me, targ) => { targ.playerTouch(targ, me, UseType.PlayerPush, 1);});
			},
			pushedByBreath = (e, user, useType, useStrength) => { e.knockback += user.vel * .16f;}
		};
		if(id == 2) player2Ent = pl;
		else playerEnt = pl;
	}

	void React(V3 pos, Sprite msg) {
		var delay = 30;
		new Ent(gameSys) { sprite = msg, name="react", pos = pos, scale = 1, update = e => { delay--; if(delay <= 0) e.remove(); } };
	}
}