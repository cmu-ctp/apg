using UnityEngine;
using System.Collections.Generic;
using V3 = UnityEngine.Vector3;

public class Foes:MonoBehaviour {
	public Sprite[] shoes, socks;
	public Sprite beardguy, beardguy2, plantguy, boulder, foeTrash, foeMicrowave, foeMustache;
	public Sprite thudMsg;
	public AudioClip bumpSound, guySurpriseSound, guyThrowSound;
}

public class FoeSys {
	public float tick = 0;
	Foes foes;
	GameSys gameSys;
	PlayerSys playerSys;
	AudiencePlayerSys audiencePlayerSys;
	public SpawnEntry beardGuy, plantGuy, trashGuy, microwaveGuy, mustacheGuy;
	public FoeSys(Foes theFoes, GameSys theGameSys, PlayerSys thePlayerSys, AudiencePlayerSys theAudiencePlayerSys) {
		playerSys = thePlayerSys;
		audiencePlayerSys = theAudiencePlayerSys;
		foes = theFoes;
		gameSys = theGameSys;
		beardGuy= new SpawnEntry { icon = foes.beardguy, spawn = () => BeardyGuy(), message="Deus Peduleus and Calceus Prime Approach!" };
		plantGuy= new SpawnEntry { icon = foes.plantguy, spawn = () => PlantGuy() };
		trashGuy= new SpawnEntry { icon = foes.foeTrash, spawn = () => TrashGuy() };
		microwaveGuy= new SpawnEntry { icon = foes.foeMicrowave, spawn = () => MicrowaveGuy() };
		mustacheGuy= new SpawnEntry { icon = foes.foeMustache, spawn = () => MustacheGuy() };
	}

	void React(V3 pos, Sprite msg) {
		var delay = 30;
		new Ent(gameSys) { sprite = msg, pos = pos, scale = 1, update = e => { delay--; if(delay <= 0) e.remove(); } };
	}

	public void MakeShot(V3 pos, int j, Ent src, Sprite[] sprites) {
		var offset = Rd.Ang(); var rotateSpeed = Rd.Fl(.02f, .04f) * 80; var vel = new V3(j * .05f, -.04f, 0); var strength = 1; var lastHit = 0f; var bounceNum = 0;
		var isPlayerAttack = false;
		new Ent(gameSys) {
			sprite = Rd.Sprite(sprites), pos = pos, scale = Rd.Fl(.3f, .4f)*1.5f, name = "shot",
			update = e => {
				e.ang = tick * rotateSpeed + offset;

				if( isPlayerAttack ) {

				}

				playerSys.TryHitPlayers(e, 1, player => {
					if(tick - lastHit < 30) return;
					lastHit = tick;
					gameSys.Sound(foes.bumpSound, 1);
					React(e.pos + new V3(0, 0, -.2f), foes.thudMsg);
					strength++;
					vel.y *= -1f;
					if( vel.y < .1f )vel.y = .1f;
					vel.x = player.vel.x*.025f;
					if(bounceNum < 3) {
						bounceNum++;
						rotateSpeed*=2;
					}
				});

				vel.y -= .0008f;
				e.MoveBy(vel);
				e.removeIfOffScreen();

			},
			buddyTouch = (e, user, useType, touchStrength) => {
				user.onHurt(user, e, 1);
				e.remove();
			},
			pushedByBreath = (e, user, useType, useStrength) => {
				isPlayerAttack = true;
				vel *= .3f;
				vel += user.vel * .05f;
			}
		};
	}

	void BeardyGuy() {
		var startTime = tick;
		foreach(var k in 2.Loop()) {
			var goal = new V3(0, 4, 30); var horizontal = (k==0) ? -3f : 3f; var vertOffset = 4 + (k == 0 ? 0 : 2); var zDepth = (k == 0 ? 30 : 20); var tickOffset = (k == 0 ? 0 : 200); var doShoot = true; var angAnim = new DualWave(4, .025f);
			var shakeAmount = 0f; var shootDelay = 0;
			var sprites = (k == 0) ? foes.shoes : foes.socks;
			new Ent(gameSys) {
				sprite = (k == 0 ? foes.beardguy : foes.beardguy2), pos = new V3(Rd.Fl(40), Rd.Fl(-4, -7), Rd.Fl(80, 100)), scale = 1f, name = "beardguy", useGrid=true,
				update = e => {
					if(tick - startTime > 60 * 40) {
						goal = new V3(horizontal, vertOffset, playerSys.playerEnt.pos.z + .3f);
						goal.y = 50;
						e.pos = e.pos * .98f + .02f * goal;
						if( e.pos.y > 45) {
							Debug.Log( "Removing beard guy!!");
							e.remove(); return;
						}
					}
					shootDelay--;
					if((tick + tickOffset) % 600 < 200 && shakeAmount < .5f) {
						if((tick + tickOffset) % 600 > 100 && doShoot && shootDelay <= 0 && e.pos.z < playerSys.playerEnt.pos.z + 1) {
							doShoot = false;
							gameSys.Sound(foes.guyThrowSound, 1);
							for(var j = -1; j < 2; j++) { MakeShot(new V3(e.pos.x, e.pos.y, playerSys.playerEnt.pos.z), j, e, sprites); }
						}
						goal = new V3(horizontal, vertOffset, playerSys.playerEnt.pos.z + .3f);
					}
					else {
						doShoot = true;
						goal = new V3(horizontal, vertOffset, zDepth);
					}
					e.pos = e.pos * .98f + .02f * goal;
					e.ang = angAnim.Val(tick) + Rd.Fl(-shakeAmount, shakeAmount);
					Num.Ease(ref shakeAmount, 0f, .05f);
				},
				pushedByBreath = (e, user, useType, strength) => {
					if(e.pos.z > 5)return;
					gameSys.Sound(foes.guySurpriseSound, 1);
					shootDelay = 90;
					if(e.pos.z < 10) shakeAmount = 100;
				}
			};
		}
	}
	void PlantGuy() {
		var startTime = tick;
		foreach(var k in 5.Loop()) {
			var goal = new V3(0, 4, 30);
			float horizontal = Rd.Fl(15), vertOffset = Rd.Fl(2, 6), zDepth = Rd.Fl(20, 50), tickOffset = Rd.Fl(0, 500);
			var doShoot = true;
			var angAnim = new DualWave(12, .025f);
			new Ent(gameSys) {
				sprite = foes.plantguy, pos = new V3(Rd.Fl(40), Rd.Fl(-4, -7), Rd.Fl(80, 100)), scale = 1f, flipped=Rd.Test(.5f), name = "plantguy",
				update = e => {
					if(tick - startTime > 60 * 40) {
						e.remove();
						return;
					}
					if((tick + tickOffset) % 600 < 200) {
						if((tick + tickOffset) % 600 > 100 && doShoot) { doShoot = false; }
						goal = new V3(horizontal, vertOffset, 3);
					}
					else {
						doShoot = true;
						goal = new V3(horizontal, vertOffset, zDepth);
					}
					e.pos = e.pos * .98f + .02f * goal;
					e.ang = angAnim.Val(tick);
				}
			};
		}
	}
	void TrashGuy() {
		var startTime = tick;
		foreach(var k in 5.Loop()) {
			var goal = new V3(0, 4, 30);
			float horizontal = Rd.Fl(15), vertOffset = Rd.Fl(2, 6), zDepth = Rd.Fl(20, 50), tickOffset = Rd.Fl(0, 500);
			var doShoot = true;
			var angAnim = new DualWave(12, .025f);
			new Ent(gameSys) {
				sprite = foes.foeTrash, pos = new V3(Rd.Fl(40), Rd.Fl(-4, -7), Rd.Fl(80, 100)), scale = .5f, flipped=Rd.Test(.5f), name = "trashguy",
				update = e => {
					if(tick - startTime > 60 * 40) {
						e.remove();
						return;
					}
					if((tick + tickOffset) % 600 < 200) {
						if((tick + tickOffset) % 600 > 100 && doShoot) { doShoot = false; }
						goal = new V3(horizontal, vertOffset, 3);
					}
					else {
						doShoot = true;
						goal = new V3(horizontal, vertOffset, zDepth);
					}
					e.pos = e.pos * .98f + .02f * goal;
					e.ang = angAnim.Val(tick);
				}
			};
		}
	}
	void MicrowaveGuy() {
		var startTime = tick;
		foreach(var k in 5.Loop()) {
			var goal = new V3(0, 4, 30);
			float horizontal = Rd.Fl(15), vertOffset = Rd.Fl(2, 6), zDepth = Rd.Fl(20, 50), tickOffset = Rd.Fl(0, 500);
			var doShoot = true;
			var angAnim = new DualWave(12, .025f);
			new Ent(gameSys) {
				sprite = foes.foeMicrowave, pos = new V3(Rd.Fl(40), Rd.Fl(-4, -7), Rd.Fl(80, 100)), scale = 1f, flipped=Rd.Test(.5f), name = "microwaveguy",
				update = e => {
					if(tick - startTime > 60 * 40) {
						e.remove();
						return;
					}
					if((tick + tickOffset) % 600 < 200) {
						if((tick + tickOffset) % 600 > 100 && doShoot) { doShoot = false; }
						goal = new V3(horizontal, vertOffset, 3);
					}
					else {
						doShoot = true;
						goal = new V3(horizontal, vertOffset, zDepth);
					}
					e.pos = e.pos * .98f + .02f * goal;
					e.ang = angAnim.Val(tick);
				}
			};
		}
	}
	void MustacheGuy() {
		var startTime = tick;
		foreach(var k in 5.Loop()) {
			var goal = new V3(0, 4, 30);
			float horizontal = Rd.Fl(15), vertOffset = Rd.Fl(2, 6), zDepth = Rd.Fl(20, 50), tickOffset = Rd.Fl(0, 500);
			var doShoot = true;
			var angAnim = new DualWave(12, .025f);
			new Ent(gameSys) {
				sprite = foes.foeMustache, pos = new V3(Rd.Fl(40), Rd.Fl(-4, -7), Rd.Fl(80, 100)), scale = 1f, flipped=Rd.Test(.5f),name = "mustacheguy",
				update = e => {
					if(tick - startTime > 60 * 40) {
						e.remove();
						return;
					}
					if((tick + tickOffset) % 600 < 200) {
						if((tick + tickOffset) % 600 > 100 && doShoot) { doShoot = false; }
						goal = new V3(horizontal, vertOffset, 3);
					}
					else {
						doShoot = true;
						goal = new V3(horizontal, vertOffset, zDepth);
					}
					e.pos = e.pos * .98f + .02f * goal;
					e.ang = angAnim.Val(tick);
				}
			};
		}
	}
}