using UnityEngine;
using System.Collections.Generic;
using v3 = UnityEngine.Vector3;

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

	void React(v3 pos, Sprite msg) {
		var delay = 30;
		new ent(gameSys) { sprite = msg, pos = pos, scale = 1, update = e => { delay--; if(delay <= 0) e.remove(); } };
	}

	public void MakeShot(v3 pos, int j, ent src, Sprite[] sprites) {
		var offset = rd.Ang(); var rotateSpeed = rd.f(.02f, .04f) * 80; var vel = new v3(j * .05f, -.04f, 0); var strength = 1; var lastHit = 0f; var bounceNum = 0;
		var isPlayerAttack = false;
		new ent(gameSys) {
			sprite = rd.Sprite(sprites), pos = pos, scale = rd.f(.3f, .4f)*1.5f, name = "shot", inGrid=true,
			update = e => {
				e.ang = tick * rotateSpeed + offset;

				if( isPlayerAttack ) {

				}

				vel.y -= .0008f;
				e.MoveBy(vel);
				e.removeIfOffScreen();
			},
			playerTouch = (e, user, info) => {
				if(tick - lastHit < 30) return;
					lastHit = tick;
					gameSys.Sound(foes.bumpSound, 1);
					React(e.pos + new v3(0, 0, -.2f), foes.thudMsg);
					strength++;
					vel.y *= -1f;
					if( vel.y < .1f )vel.y = .1f;
					vel.x = user.vel.x*.025f;
					if(bounceNum < 3) {
						bounceNum++;
						rotateSpeed*=2;
					}
			},
			buddyTouch = (e, user, info) => {
				user.onHurt(user, e, 1);
				e.remove();
			},
			breathTouch = (e, user, info) => {
				isPlayerAttack = true;
				vel *= .3f;
				vel += user.vel * .05f;
			}
		};
	}

	void BeardyGuy() {
		var startTime = tick;
		for( var k = 0; k < 2; k++ ) {
			var goal = new v3(0, 4, 30); var horizontal = (k==0) ? -3f : 3f; var vertOffset = 4 + (k == 0 ? 0 : 2); var zDepth = (k == 0 ? 30 : 20); var tickOffset = (k == 0 ? 0 : 200);
			var lastNoiseTime = 0f;
			var doShoot = true;
			var angAnim = new DualWave(4, .025f);
			var shakeAmount = 0f; var shootDelay = 0; 
			var sprites = (k == 0) ? foes.shoes : foes.socks;
			new ent(gameSys) {
				sprite = (k == 0 ? foes.beardguy : foes.beardguy2), pos = new v3(rd.f(40), rd.f(-4, -7), rd.f(80, 100)), scale = 1f, name = "beardguy", inGrid=true,
				update = e => {
					if(tick - startTime > 60 * 30) {
						goal = new v3(horizontal, vertOffset, playerSys.playerEnt.pos.z + .3f);
						goal.y = 50;
						e.pos = e.pos * .99f + .01f * goal;
						if( e.pos.y > 45) {
							e.remove(); return;
						}
						return;
					}
					shootDelay--;
					if((tick + tickOffset) % 600 < 200 && shakeAmount < .5f) {
						if((tick + tickOffset) % 600 > 100 && doShoot && shootDelay <= 0 && e.pos.z < playerSys.playerEnt.pos.z + 1) {
							doShoot = false;
							gameSys.Sound(foes.guyThrowSound, 1);
							for(var j = -1; j < 2; j++) { MakeShot(new v3(e.pos.x, e.pos.y, playerSys.playerEnt.pos.z), j, e, sprites); }
						}
						goal = new v3(horizontal, vertOffset, playerSys.playerEnt.pos.z + .3f);
					}
					else {
						doShoot = true;
						goal = new v3(horizontal, vertOffset, zDepth);
					}
					e.pos = e.pos * .98f + .02f * goal;
					e.ang = angAnim.Val(tick) + rd.f(-shakeAmount, shakeAmount);
					nm.ease(ref shakeAmount, 0f, .05f);
				},
				breathTouch = (e, user, info) => {
					if(e.pos.z > 5)return;
					if( lastNoiseTime < tick - 10) {
						gameSys.Sound(foes.guySurpriseSound, 1);
						lastNoiseTime = tick;
					}
					shootDelay = 90;
					if(e.pos.z < 10) shakeAmount = 100;
				}
			};
		}
	}
	void PlantGuy() {
		var startTime = tick;
		for( var k = 0; k < 5; k++ ) {
			var goal = new v3(0, 4, 30);
			float horizontal = rd.f(15), vertOffset = rd.f(2, 6), zDepth = rd.f(20, 50), tickOffset = rd.f(0, 500);
			var doShoot = true;
			var angAnim = new DualWave(12, .025f);
			new ent(gameSys) {
				sprite = foes.plantguy, pos = new v3(rd.f(40), rd.f(-4, -7), rd.f(80, 100)), scale = 1f, flipped=rd.Test(.5f), name = "plantguy",
				update = e => {
					if(tick - startTime > 60 * 40) {
						e.remove();
						return;
					}
					if((tick + tickOffset) % 600 < 200) {
						if((tick + tickOffset) % 600 > 100 && doShoot) { doShoot = false; }
						goal = new v3(horizontal, vertOffset, 3);
					}
					else {
						doShoot = true;
						goal = new v3(horizontal, vertOffset, zDepth);
					}
					e.pos = e.pos * .98f + .02f * goal;
					e.ang = angAnim.Val(tick);
				}
			};
		}
	}
	void TrashGuy() {
		var startTime = tick;
		for( var k = 0; k < 5; k++ ) {
			var goal = new v3(0, 4, 30);
			float horizontal = rd.f(15), vertOffset = rd.f(2, 6), zDepth = rd.f(20, 50), tickOffset = rd.f(0, 500);
			var doShoot = true;
			var angAnim = new DualWave(12, .025f);
			new ent(gameSys) {
				sprite = foes.foeTrash, pos = new v3(rd.f(40), rd.f(-4, -7), rd.f(80, 100)), scale = .5f, flipped=rd.Test(.5f), name = "trashguy",
				update = e => {
					if(tick - startTime > 60 * 40) {
						e.remove();
						return;
					}
					if((tick + tickOffset) % 600 < 200) {
						if((tick + tickOffset) % 600 > 100 && doShoot) { doShoot = false; }
						goal = new v3(horizontal, vertOffset, 3);
					}
					else {
						doShoot = true;
						goal = new v3(horizontal, vertOffset, zDepth);
					}
					e.pos = e.pos * .98f + .02f * goal;
					e.ang = angAnim.Val(tick);
				}
			};
		}
	}
	void MicrowaveGuy() {
		var startTime = tick;
		for( var k = 0; k < 5; k++ ) {
			var goal = new v3(0, 4, 30);
			float horizontal = rd.f(15), vertOffset = rd.f(2, 6), zDepth = rd.f(20, 50), tickOffset = rd.f(0, 500);
			var doShoot = true;
			var angAnim = new DualWave(12, .025f);
			new ent(gameSys) {
				sprite = foes.foeMicrowave, pos = new v3(rd.f(40), rd.f(-4, -7), rd.f(80, 100)), scale = 1f, flipped=rd.Test(.5f), name = "microwaveguy",
				update = e => {
					if(tick - startTime > 60 * 40) {
						e.remove();
						return;
					}
					if((tick + tickOffset) % 600 < 200) {
						if((tick + tickOffset) % 600 > 100 && doShoot) { doShoot = false; }
						goal = new v3(horizontal, vertOffset, 3);
					}
					else {
						doShoot = true;
						goal = new v3(horizontal, vertOffset, zDepth);
					}
					e.pos = e.pos * .98f + .02f * goal;
					e.ang = angAnim.Val(tick);
				}
			};
		}
	}
	void MustacheGuy() {
		var startTime = tick;
		for( var k = 0; k < 5; k++ ) {
			var goal = new v3(0, 4, 30);
			float horizontal = rd.f(15), vertOffset = rd.f(2, 6), zDepth = rd.f(20, 50), tickOffset = rd.f(0, 500);
			var doShoot = true;
			var angAnim = new DualWave(12, .025f);
			new ent(gameSys) {
				sprite = foes.foeMustache, pos = new v3(rd.f(40), rd.f(-4, -7), rd.f(80, 100)), scale = 1f, flipped=rd.Test(.5f),name = "mustacheguy",
				update = e => {
					if(tick - startTime > 60 * 40) {
						e.remove();
						return;
					}
					if((tick + tickOffset) % 600 < 200) {
						if((tick + tickOffset) % 600 > 100 && doShoot) { doShoot = false; }
						goal = new v3(horizontal, vertOffset, 3);
					}
					else {
						doShoot = true;
						goal = new v3(horizontal, vertOffset, zDepth);
					}
					e.pos = e.pos * .98f + .02f * goal;
					e.ang = angAnim.Val(tick);
				}
			};
		}
	}
}