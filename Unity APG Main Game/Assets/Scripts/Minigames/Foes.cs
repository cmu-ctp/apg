using UnityEngine;
using v3 = UnityEngine.Vector3;

public class Foes:MonoBehaviour {
	public Sprite[] shoes, socks, bowls, cups, spoons, knives, hats;
	public Sprite beardguy, beardguy2, plantguy, boulder, foeTrash, foeMicrowave, foeMustache, shadow;
	public Sprite thudMsg;
	public AudioClip bumpSound, guySurpriseSound, guyThrowSound;
}

public class FoeSys {
	public float tick = 0;

	const int shotEntPoolSize = 100;
	FixedEntPool shotEntPool;

	const int foeEntPoolSize = 30;
	FixedEntPool foeEntPool;

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
		beardGuy= new SpawnEntry { icon = foes.beardguy, spawn = () => BeardyGuy(),scale=.7f, message="Deus Peduleus and Calceus Prime Approach!" };
		plantGuy= new SpawnEntry { icon = foes.plantguy, spawn = () => PlantGuy(), scale=2f, message="A Squadron of Utensil Vines Looms!" };
		trashGuy= new SpawnEntry { icon = foes.foeTrash, spawn = () => TrashGuy() };
		microwaveGuy= new SpawnEntry { icon = foes.foeMicrowave, spawn = () => MicrowaveGuy() };
		mustacheGuy= new SpawnEntry { icon = foes.foeMustache, spawn = () => MustacheGuy() };

		foeEntPool = new FixedEntPool( gameSys, foeEntPoolSize, "foes", true );
		shotEntPool = new FixedEntPool( gameSys, shotEntPoolSize, "shots", true );
	}

	void React(v3 pos, Sprite msg) {
		var delay = 30;
		new ent(gameSys) { sprite = msg, pos = pos, scale = 1, update = e => { delay--; if(delay <= 0) e.remove(); } };
	}

	public void MakeShot(v3 pos, int j, ent src, Sprite[] sprites, float baseYVel = 0) {
		if(gameSys.gameOver)return;

		var offset = rd.Ang(); var rotateSpeed = rd.f(.02f, .04f) * 80; var strength = 1; var lastHit = 0f; var bounceNum = 0; 
		var isPlayerAttack = false;
		new PoolEnt(shotEntPool) {
			sprite = rd.Sprite(sprites), pos = pos, scale = rd.f(.3f, .4f)*1.5f, name = "shot", inGrid=true, vel=new v3(j * .05f, -.04f + baseYVel, 0), shadow=gameSys.Shadow(foes.shadow, shotEntPool, 1, 1, 0 ),
			update = e => {
				if( gameSys.gameOver ) {
					e.remove();
					return;
				}
				e.ang = tick * rotateSpeed + offset;

				if( isPlayerAttack ) {

				}

				e.vel.y -= .0008f;

				e.MoveBy(e.vel);

				if( e.pos.y < -5f && e.vel.y < 0 ) {
					e.vel.y *= -.6f;
					if( Mathf.Abs(e.vel.y )< .001f )e.remove();
				}

				e.removeIfOffScreen();
			},
			playerTouch = (e, user, info) => {
				if(tick - lastHit < 30) return;
					lastHit = tick;
					gameSys.Sound(foes.bumpSound, 1);
					React(e.pos + new v3(0, 0, -.2f), foes.thudMsg);
					strength++;
					e.vel.y *= -1f;
					if( e.vel.y < .1f )e.vel.y = .1f;
					e.vel.x = user.vel.x*.025f;
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
				e.vel *= .3f;
				e.vel += user.vel * .05f;
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
			new PoolEnt(foeEntPool) {
				sprite = (k == 0 ? foes.beardguy : foes.beardguy2), pos = new v3(rd.f(40), rd.f(-4, -7), rd.f(80, 100)), scale = 1f, name = "beardguy", inGrid=true, shadow=gameSys.Shadow(foes.shadow, foeEntPool, 3, 1, 0 ),
				update = e => {
					if(tick - startTime > 60 * 30 || gameSys.gameOver ) {
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
		for( var k = 0; k < 4; k++ ) {
			var goal = new v3(0, 4, 30);
			float horizontal = rd.f(15), vertOffset = rd.f(2, 6), tickOffset = rd.f(0, 300);
			var horizontalDir = rd.Test(.5f) ? 1:-1;
			var sprites = rd.Test(.5f) ? foes.spoons:foes.knives;
			var inBack = false;
			var delay = rd.i(0,1200);
			var backDist = rd.f(10,30);
			var shotTimer = rd.i(0,300);
			new PoolEnt(foeEntPool) {
				sprite = foes.plantguy, pos = new v3((rd.Test(.5f) ? -1:1) * 12 * horizontalDir, rd.f(-2, 5), 0), scale = .8f, flipped=horizontalDir > 0 ? false:true, name = "plantguy",shadow=gameSys.Shadow(foes.shadow, foeEntPool, 2, 1, 0 ),
				update = e => {
					if( delay > 0 ) {
						delay--;
						return;
					}
					if(tick - startTime > 60 * 40 || gameSys.gameOver ) {
						goal = new v3(horizontal, vertOffset, playerSys.playerEnt.pos.z + .3f);
						goal.y = 50;
						e.pos = e.pos * .99f + .01f * goal;
						if( e.pos.y > 45) {
							e.remove(); return;
						}
						return;
					}
					if( !inBack ) {
						shotTimer++;
						if( shotTimer > 470 ) {
							e.ang = rd.f(-.5f, .5f );
						}
						if( shotTimer > 500 ) {
							MakeShot(new v3(e.pos.x, e.pos.y, playerSys.playerEnt.pos.z), 0, e, sprites, .1f);
							shotTimer=0;
						}
					}

					if( inBack )
						e.MoveBy(horizontalDir*.1f, Mathf.Cos( tick * .03f + tickOffset )*.02f , Mathf.Sin( 10+tick * .021f + tickOffset )*.02f );
					else {
						e.MoveBy(horizontalDir*.02f, Mathf.Cos( tick * .03f + tickOffset )*.002f , Mathf.Sin( 10+tick * .021f + tickOffset )*.002f );
					}
					if( !inBack ) {
						if( e.pos.x < -12 && horizontalDir < 0 ) {
							inBack = true;
							horizontalDir *= -1;
							e.flipped = !e.flipped;
							e.MoveTo( -22, e.pos.y, 10 );
						}
						if( e.pos.x > 12 && horizontalDir > 0 ) {
							inBack = true;
							horizontalDir *= -1;
							e.flipped = !e.flipped;
							e.MoveTo( 22, e.pos.y, 10 );
						}
					}
					else {
						if( e.pos.x < -22 && horizontalDir < 0 ) {
							inBack = false;
							horizontalDir *= -1;
							e.flipped = !e.flipped;
							e.MoveTo( -12, e.pos.y, 0 );
						}
						if( e.pos.x > 22 && horizontalDir > 0 ) {
							inBack = false;
							horizontalDir *= -1;
							e.flipped = !e.flipped;
							e.MoveTo( 12, e.pos.y, 0 );
						}
					}
				}
			};
		}
	}

	// microwave - bowls. or cups.
	// Mustache guy - hats.
	// plants - knives and spoons - move horizontally, dropping stuff on a timer.
	// trash guy - random stuff.
	// cloud boss - socks + shoes

	void TrashGuy() {
		var startTime = tick;
		for( var k = 0; k < 5; k++ ) {
			var goal = new v3(0, 4, 30);
			float horizontal = rd.f(15), vertOffset = rd.f(2, 6), zDepth = rd.f(20, 50), tickOffset = rd.f(0, 500);
			var doShoot = true;
			var angAnim = new DualWave(12, .025f);
			new PoolEnt(foeEntPool) {
				sprite = foes.foeTrash, pos = new v3(rd.f(40), rd.f(-4, -7), rd.f(80, 100)), scale = .5f, flipped=rd.Test(.5f), name = "trashguy",shadow=gameSys.Shadow(foes.shadow, foeEntPool, 3, 1, 0 ),
				update = e => {
					if(tick - startTime > 60 * 30 || gameSys.gameOver ) {
						goal = new v3(horizontal, vertOffset, playerSys.playerEnt.pos.z + .3f);
						goal.y = 50;
						e.pos = e.pos * .99f + .01f * goal;
						if( e.pos.y > 45) {
							e.remove(); return;
						}
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
			new PoolEnt(foeEntPool) {
				sprite = foes.foeMicrowave, pos = new v3(rd.f(40), rd.f(-4, -7), rd.f(80, 100)), scale = 1f, flipped=rd.Test(.5f), name = "microwaveguy",shadow=gameSys.Shadow(foes.shadow, foeEntPool, 3, 1, 0 ),
				update = e => {
					if(tick - startTime > 60 * 30 || gameSys.gameOver ) {
						goal = new v3(horizontal, vertOffset, playerSys.playerEnt.pos.z + .3f);
						goal.y = 50;
						e.pos = e.pos * .99f + .01f * goal;
						if( e.pos.y > 45) {
							e.remove(); return;
						}
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
			new PoolEnt(foeEntPool) {
				sprite = foes.foeMustache, pos = new v3(rd.f(40), rd.f(-4, -7), rd.f(80, 100)), scale = 1f, flipped=rd.Test(.5f),name = "mustacheguy",shadow=gameSys.Shadow(foes.shadow, foeEntPool, 3, 1, 0 ),
				update = e => {
					if(tick - startTime > 60 * 30 || gameSys.gameOver ) {
						goal = new v3(horizontal, vertOffset, playerSys.playerEnt.pos.z + .3f);
						goal.y = 50;
						e.pos = e.pos * .99f + .01f * goal;
						if( e.pos.y > 45) {
							e.remove(); return;
						}
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