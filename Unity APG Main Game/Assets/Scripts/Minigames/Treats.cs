using UnityEngine;
using System.Collections.Generic;
using V3 = UnityEngine.Vector3;

public class Treats:MonoBehaviour {
	public Sprite[] balloons;
	public Sprite popMsg;
	public Sprite goodies;
	public AudioClip[] balloonPop;
	public AudioClip[] coinSound;
}

public class TreatSys {
	public SpawnEntry balloonClusterLeft, balloonClusterRight, balloonClusterBottomLeft, balloonClusterBottom, balloonClusterBottomRight;
	public SpawnEntry balloonGridLeft, balloonGridCenter, balloonGridRight, balloonGridAll;
	GameSys gameSys;
	Treats theTreats;
	ReactSys reactSys;
	public TreatSys(Treats treats, GameSys theGameSys, ReactSys theReactSys) {
		gameSys = theGameSys;
		theTreats = treats;
		reactSys = theReactSys;

		balloonClusterLeft= new SpawnEntry { icon = treats.balloons[0], iconYOffset=1, spawn = () => BalloonCluster(new V3(-11,0,0), new V3(.006f,0,0)), message="Delightful balloons are coming from the left!" };
		balloonClusterRight= new SpawnEntry { icon = treats.balloons[0], iconYOffset=-1,spawn = () => BalloonCluster(new V3(11,0,0), new V3(-.006f,0,0)), message="Cheerful balloons are coming from the right!" };
		balloonClusterBottomLeft= new SpawnEntry { icon = treats.balloons[0], iconYOffset=.5f, spawn = () => BalloonCluster(new V3(-5,-7,0), new V3(0,.006f,0)), message="Lovely balloons are rising from the left!" };
		balloonClusterBottom= new SpawnEntry { icon = treats.balloons[0], iconYOffset=0, spawn = () => BalloonCluster(new V3(0,-7,0), new V3(0,.006f,0)), message="Charming balloons are rising from below!" };
		balloonClusterBottomRight= new SpawnEntry { icon = treats.balloons[0], iconYOffset=-.5f, spawn = () => BalloonCluster(new V3(5,-7,0), new V3(0,.006f,0)), message="Nice balloons are rising from the right!" };

		balloonGridLeft= new SpawnEntry { icon = treats.balloons[0], iconYOffset=-.8f, spawn = () => BalloonGrid(-10, -6), message="A fleet of balloons emerges on the left!" };
		balloonGridCenter= new SpawnEntry { icon = treats.balloons[0], iconYOffset=0, spawn = () => BalloonGrid(-3, 3 ), message="A bevy of balloons is presently showing up!" };
		balloonGridRight= new SpawnEntry { icon = treats.balloons[0], iconYOffset=.8f, spawn = () => BalloonGrid( 6, 10), message="A throng of balloons ascends on the right!" };
		balloonGridAll= new SpawnEntry { icon = treats.balloons[0], iconYOffset=0, spawn = () => BalloonGrid( -11, 12 ), message="A MASSIVE balloon armada approaches!" };
	}

	// Events:
	// Definitely need some sort of Game Is Speeding Up Thingy
	// Pushing Player should impart velocity to balloon

	void React(V3 pos, Sprite msg) {
		var delay = 30;
		new Ent(gameSys) { sprite = msg, name="react", pos = pos, scale = 1, update = e => { delay--; if(delay <= 0) e.remove(); } };
	}

	void BasicTreat( V3 pos ) {
			var vel = Rd.Fl(.1f, .2f ); var spin = Rd.Fl(-6,6);
			new Ent(gameSys) {
				sprite = theTreats.goodies, pos = new V3( pos.x+ Rd.Fl(1), pos.y+Rd.Fl(.5f), Rd.Fl(1)), scale = .3f, flipped=Rd.Test(.5f), name="basicTreat", useGrid=true,
				update = e => {
					e.pos += new V3( 0,vel, 0);
					vel -= .005f;
					e.ang += spin;
					e.removeIfOffScreen();
				},
				buddyTouch = (e, user, useType, strength) => {
					gameSys.Sound(Rd.Sound( theTreats.coinSound ), 1);
					reactSys.React( e.pos+new V3(0,0,0), "+1 Taco", new Color( .3f,.5f,.8f,1));
					e.remove();
				}
			};
	}

	void BalloonCluster( V3 pos, V3 vel ) {
		foreach(var k in 5.Loop()) {
			V3 scaledVel = vel * Rd.Fl(1,1.3f), push=new V3(0,0,0);
			float bob = Rd.Fl( .002f, .004f ), bobt = Rd.Fl( .8f, 1.2f ), tick = Rd.Ang(), lastPush = 0.0f, goalScale = .3f;
			new Ent(gameSys) {
				sprite = Rd.Sprite( theTreats.balloons ), pos = new V3( pos.x+ Rd.Fl(1), pos.y+Rd.Fl(.5f), Rd.Fl(1)), scale = .3f, flipped=Rd.Test(.5f), name="balloon", useGrid=true,
				update = e => {
					tick+=.01f;
					e.pos += scaledVel + new V3( bob*Mathf.Sin( bobt * tick * 1.23f + 3.1f ), bob*Mathf.Cos( bobt * tick ), 0 );
					e.pos += push;
					Num.Ease( ref goalScale, .3f, .02f );
					e.scale = e.scale * .8f + .2f * goalScale;
					Num.Ease( ref push, new V3(0,0,0), .02f );
					e.removeIfOffScreen();
				},
				pushedByBreath = (e, user, useType, strength) => {
					if( tick - lastPush < .05f )return;
					var pushDir = (e.pos - user.pushCenter).normalized;
					pushDir.z = 0;
					push += pushDir * strength*.05f;
					lastPush = tick;
					goalScale += strength * .1f;
					if( goalScale > .55f ) {
						gameSys.Sound(Rd.Sound( theTreats.balloonPop ), 1);
						BasicTreat( e.pos );
						reactSys.React( e.pos + new V3(0, 0, -.2f), "Pop!", new Color(.9f, 1f, .7f, 1 ) );
						e.remove();
					}
				},
				playerTouch = (e, user, useType, strength) => {
					var pushDir = (e.pos - user.pushCenter).normalized;
					pushDir.z = 0;
					push += pushDir * .01f;
				}
			};
		}
	}

	void BalloonGrid( int leftBound, int rightBound ) {
		for( var k = leftBound; k < rightBound; k++ ) {
			for( var k2 = -2; k2 < 7; k2++ ) {
				float bob = Rd.Fl( .002f, .004f ), tick = Rd.Ang(), goalScale = .3f;
				V3 home = new V3(k,k2,0);
				float offset = Rd.Ang(), rotateRange = Rd.Fl(.1f, .2f) * 80, rotateSpeed = Rd.Fl(.02f, .04f), delay = Rd.Int(0,15) + 20 + 2*k, leaveDelay = delay + 60*12;
				new Ent(gameSys) {
					sprite = Rd.Sprite( theTreats.balloons ), pos = new V3((leftBound+rightBound)/2f, -7, 0), scale = Rd.Fl(.19f, .21f), flipped=Rd.Test(.5f), name="balloon", useGrid=true,
					update = e => {
						delay--;
						if( delay > 0 )return;
						if( leaveDelay <= 0 ) { if( e.removeIfOffScreen() ) return;}
						e.pos = e.pos * .98f + .02f * (home + new V3( .1f*Mathf.Cos( tick * bob ), .1f*Mathf.Sin( tick * bob ), 0 ) );
						e.ang = Mathf.Cos(tick * rotateSpeed + offset) * rotateRange;
						goalScale = .3f * .02f + .98f * goalScale;
						e.scale = e.scale * .8f + .2f * goalScale*.65f;
						tick++;
						leaveDelay--;
						if( leaveDelay == 0 ) home = new V3( Rd.Fl(-3,3), 9, Rd.Fl( -4, 4 ));
					},
					pushedByBreath = (e, user, useType, strength) => {
						var pushDir = (e.pos - user.pushCenter).normalized;
						pushDir.z = 0;
						e.pos += pushDir * strength*.8f;
						goalScale += strength * .1f;
						if( goalScale > .6f ) {
							BasicTreat( e.pos );
							gameSys.Sound(Rd.Sound( theTreats.balloonPop ), 1);
							reactSys.React( e.pos + new V3((leftBound+rightBound)/2f, 0, -.2f), "Pop!", new Color(.9f, 1f, .7f, 1 ) );
							e.remove();
						}
					},
					playerTouch = (e, user, useType, strength) => {
						var pushDir = (e.pos - user.pushCenter).normalized;
						pushDir.z = 0;
						e.pos += pushDir * .05f;
					}
				};
			}
		}
	}
	void BalloonGridDebug() {
		for( var k = -11; k < 12; k++ ) {
			for( var k2 = -6; k2 < 7; k2++ ) {
				float lastTouch = 0.0f;
				V3 home = new V3(k,k2,0);
				new Ent(gameSys) {
					sprite = Rd.Sprite( theTreats.balloons ), pos = new V3(k, k2, 0), scale = .2f, flipped=Rd.Test(.5f), name="balloon", useGrid=true,
					update = e => {
						lastTouch--;
						e.pos = e.pos * .95f + .05f * home;
						if( lastTouch == 0 )e.color = new Color( 1, 1, 1, 1 );
					},
					pushedByBreath = (e, user, useType, strength) => {
						var pushDir = (e.pos - user.pushCenter).normalized;
						pushDir.z = 0;
						e.pos += pushDir * strength*.8f;
						e.color = new Color( 1, 0, 0, 1 );
						lastTouch = 3;
					},
					playerTouch = (e, user, useType, strength) => {
						var pushDir = (e.pos - user.pushCenter).normalized;
						pushDir.z = 0;
						e.pos += pushDir * .05f;
						e.color = new Color( 0, 0, 1, 1 );
						lastTouch = 3;
					}
				};
			}
		}
	}
}