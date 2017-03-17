using UnityEngine;
using System.Collections.Generic;
using System;
using v3 = UnityEngine.Vector3;
using APG;

public class Players:MonoBehaviour {
	public GameObject textName;
	public Sprite[] clouds, friends;
	public Sprite player, angel;
	public Sprite owMsg, ughMsg, thudMsg;
	public AudioClip blowSound, bumpSound, hurtSound, dieSound;
} 

public class PlayerSys {
	public ent playerEnt = null, player2Ent = null;

	GameSys gameSys;
	Players players;

	public void Setup(GameSys theGameSys, Players thePlayers, FoeSys foeSys, APG.AudienceSysInterface apgSys) {
		gameSys = theGameSys;
		players = thePlayers;

		Player(0, foeSys);
		//Player(1, foeSys);
		//Player(2, foeSys);
	}

	public void MakeBreath( List<Action<v3, float, float, float>> blow, List<Action<v3, float, float, float>> inhale, List<Action<v3, float, float, float>> inhaleBig ) {
		var src = new ent(gameSys) { name="breatheSet" };
		for( var k = 0; k < 20; k++ ) {
			float cloudRot = rd.f(-3f, 3f), fallSpeed = rd.f(.85f, .95f), chargeStrength = 1f;
			var b = new v3( 0f, 0f, 0f );
			var cloudNum = k;
			var blowing = false;
			var f = new ent(gameSys) {
				sprite = rd.Sprite(players.clouds), scale=0, name="playerbreath", parent = src,
				update = e => {
					if(e.scale < .01f) return;
					e.MoveBy(b);
					b *= fallSpeed;
					e.scale *= fallSpeed;
					if( e.scale < .01f )e.active=false;
					e.ang += cloudRot;
					e.vel = b;
					if(cloudNum == 0 && blowing && e.scale > .1f) {
						gameSys.grid.Find(e.pos, .5f+.5f*chargeStrength, e, (me, targ) => { targ.breathTouch(targ, me, new TouchInfo { useType= UseType.PlayerBlowing, strength=(int)chargeStrength });});
					}
				}
			};
			blow.Add((srcPos, blowVx, blowVy, chargeSize) => {
				f.active=true;
				var size = 1f;
				blowing = true;
				if(chargeSize == 3) { size = 4;}
				if(chargeSize == 2) { size = 2; }
				chargeStrength = chargeSize;
				if(cloudNum == 0) {
					var spd = size;
					b += new v3( blowVx * .4f*spd, blowVy * .4f*spd, 0 );
					b.z = 0;
					f.pos = srcPos;
					f.scale = size*.25f;
				}
				else {
					var spd = rd.f(.5f, size);
					b += new v3( blowVx * .4f*spd + rd.f(.02f), blowVy * .4f*spd + rd.f(.02f), rd.f(.03f) );
					f.pos = srcPos + nm.v3y( .2f );
					f.scale = size * rd.f(.05f, .25f);
				}
			});
			inhale.Add((srcPos, blowVx, blowVy, chargeSize) => {
				f.active=true;
				blowing = false;
				b = new v3( rd.f(.02f), rd.f(.02f), rd.f(.03f) );
				f.pos = srcPos + nm.v3y( .2f );
				f.scale = rd.f(.05f, .25f);
			});
			inhaleBig.Add((srcPos, blowVx, blowVy, chargeSize) => {
				f.active=true;
				blowing = false;
				b = new v3( 2*rd.f(.02f), 2*rd.f(.02f), 2*rd.f(.03f) );
				f.pos = srcPos + nm.v3y( .2f );
				f.scale = 2*rd.f(.05f, .25f);
			});
		}

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

		var blow = new List<Action<v3, float, float, float>>();
		var inhale = new List<Action<v3, float, float, float>>();
		var inhaleBig = new List<Action<v3, float, float, float>>();

		MakeBreath( blow, inhale, inhaleBig );

		var pl = new ent(gameSys) {
			sprite = pic, pos = nm.v3x( startingX ), scale = 1.5f, flipped=(id == 2) ? true : false, vel = new v3(0, 0, 0), knockback = new v3(0, 0, 0), name="player"+id, inGrid=true,
			update = e => {
				t++;
				if(Input.GetKey(left)) {
					e.flipped = true;
					nm.ease(ref e.vel.x, -1.0f, .3f);
				}
				else if(Input.GetKey(right)) {
					e.flipped = false;
					nm.ease(ref e.vel.x, 1.0f, .3f);
				}
				else nm.ease(ref e.vel.x, 0, .1f); ;

				if(Input.GetKey(up)) { nm.ease(ref e.vel.y, 1.0f, .3f); }
				else if(Input.GetKey(down)) { nm.ease(ref e.vel.y, -1.0f, .3f); }
				else nm.ease(ref e.vel.y, 0, .1f);

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
						var knockback2 = new v3(-e.vel.x, -e.vel.y, 0).normalized;
						var blowStrength = 1;
						if(t-useDownTime > 115) {
							knockback2 *= 1.5f;
							blowStrength = 3;
						}
						else if(t-useDownTime > 20) {
							knockback2 *= .8f;
							blowStrength = 2;
						}
						else { knockback2 *= .4f; }

						foreach(var b in blow) b(e.pos, e.vel.x, e.vel.y, blowStrength);

						e.knockback += knockback2;
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
				gameSys.grid.Find(e.pos - nm.v3y( .7f ), 1, e, (me, targ) => { targ.playerTouch(targ, me, new TouchInfo {useType= UseType.PlayerPush, strength= 1 });});
			},
			breathTouch = (e, user, info) => { e.knockback += user.vel * .16f;}
		};
		if(id == 2) player2Ent = pl;
		else playerEnt = pl;
	}

	void React(v3 pos, Sprite msg) {
		var delay = 30;
		new ent(gameSys) { sprite = msg, name="react", pos = pos, scale = 1, update = e => { delay--; if(delay <= 0) e.remove(); } };
	}
}