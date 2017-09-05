using UnityEngine;
using v3 = UnityEngine.Vector3;

public class Treats:MonoBehaviour {
	public Sprite[] balloons;
	public Sprite popMsg, shadow;
	public Sprite goodies;
	public AudioClip[] balloonPop;
	public AudioClip[] coinSound;
	public Sprite[] resources, items;
}

public enum Resource { FrothyDrink=0, Burger=1, Beans=2, Goo=3, Acid=4, Corn=5, Bribe=6, Fries=7, Taco=8, TBone=9 }
public enum ItemIds { TennisBall = 0, Bomb = 1, Hammer = 2, ScaryMask = 3, Rocket = 4, Shield = 5 }

public class TreatSys {
	public SpawnEntry balloonClusterLeft, balloonClusterRight, balloonClusterBottomLeft, balloonClusterBottom, balloonClusterBottomRight;
	public SpawnEntry balloonGridLeft, balloonGridCenter, balloonGridRight, balloonGridAll;
	GameSys gameSys;
	public Treats theTreats;
	ReactSys reactSys;

	const int entPoolSize = 600;
	FixedEntPool entPool;

	public float soundTick;

	float lastSoundTime = 0;

	// http://bit.ly/2iC8WhQ
	// upu8scu61zxcbxd05puyu4gorvxnek
	// http://dev.icecreambreakfast.com/apg/gosas.html
	// https://api.twitch.tv/kraken/oauth2/authorize?response_type=token&client_id=upu8scu61zxcbxd05puyu4gorvxnek&state=hjgrph2akqwki1617ac5rdq9rqiep0k+ludolab+ludolab_&redirect_uri=http://dev.icecreambreakfast.com/apg/gosas.html&scope=user_read+channel_read+chat_login

	public TreatSys(Treats treats, GameSys theGameSys, ReactSys theReactSys) {
		gameSys = theGameSys;
		theTreats = treats;
		reactSys = theReactSys;

		balloonClusterLeft= new SpawnEntry { icon = treats.balloons[0], iconYOffset=1, spawn = () => BalloonCluster(new v3(-11,0,0), new v3(.006f,0,0)), message="Delightful balloons are coming from the left!" };
		balloonClusterRight= new SpawnEntry { icon = treats.balloons[0], iconYOffset=-1,spawn = () => BalloonCluster(new v3(11,0,0), new v3(-.006f,0,0)), message="Cheerful balloons are coming from the right!" };
		balloonClusterBottomLeft= new SpawnEntry { icon = treats.balloons[0], iconYOffset=.5f, spawn = () => BalloonCluster(new v3(-5,-7,0), new v3(0,.006f,0)), message="Lovely balloons are rising from the left!" };
		balloonClusterBottom= new SpawnEntry { icon = treats.balloons[0], iconYOffset=0, spawn = () => BalloonCluster(new v3(0,-7,0), new v3(0,.006f,0)), message="Charming balloons are rising from below!" };
		balloonClusterBottomRight= new SpawnEntry { icon = treats.balloons[0], iconYOffset=-.5f, spawn = () => BalloonCluster(new v3(5,-7,0), new v3(0,.006f,0)), message="Nice balloons are rising from the right!" };

		balloonGridLeft= new SpawnEntry { icon = treats.balloons[0], iconYOffset=-.8f, spawn = () => BalloonGrid(-10, -5), message="A fleet of balloons emerges on the left!" };
		balloonGridCenter= new SpawnEntry { icon = treats.balloons[0], iconYOffset=0, spawn = () => BalloonGrid(-3, 3 ), message="A bevy of balloons is presently showing up!" };
		balloonGridRight= new SpawnEntry { icon = treats.balloons[0], iconYOffset=.8f, spawn = () => BalloonGrid( 6, 10), message="A throng of balloons ascends on the right!" };
		balloonGridAll= new SpawnEntry { icon = treats.balloons[0], iconYOffset=0, spawn = () => BalloonGrid( -11, 12 ), message="A MASSIVE balloon armada approaches!" };

		entPool = new FixedEntPool( gameSys, entPoolSize, "treats", true );
	}

	// Events:
	// Definitely need some sort of Game Is Speeding Up Thingy
	// Pushing Player should impart velocity to balloon

	void React(v3 pos, Sprite msg) {
		var delay = 30;
		new ent(gameSys) { sprite = msg, name="react", pos = pos, scale = 1, update = e => { delay--; if(delay <= 0) e.remove(); } };
	}

	

	public static string[] treatStyles = new string[] { "Adult Drink", "Burger", "Beans", "Goo", "Acid", "Corn", "Bribe", "Fries", "Taco", "T-Bone" };
	public static string[] itemStyles = new string[] { "Tennis Ball", "Bomb", "Hammer", "Scary Mask", "Rocket", "Shield" };

	public void SpecialTreat( v3 pos ) {
		var vel = rd.f(.1f, .2f ); var spin = rd.f(-6,6); var firstBounce = true; var xvel = 0f; var numBounces = 0; var id = rd.i(0, itemStyles.Length);
		new PoolEnt( entPool ) {
			sprite = theTreats.items[id], pos = new v3( pos.x+ rd.f(1), pos.y+rd.f(.5f), rd.f(.5f)), scale = .25f, flipped=rd.Test(.5f), name="specialTreat", inGrid=true, shadow=gameSys.Shadow(theTreats.shadow, entPool, 1, .4f, 0 ), 
			update = e => {
				e.pos += new v3( xvel,vel, 0);
				vel -= .005f;
				e.ang += spin;
				e.removeIfOffScreen();
				if( e.pos.y < -5f && vel < 0 ) {
					numBounces++;
					if( firstBounce ) { firstBounce = false; xvel = rd.f(.1f); }
					vel *= -.4f;
					if( numBounces > 3 ) { e.remove(); } } },
			buddyTouch = (e, user, info) => {
				var styleStr = itemStyles[id];
				if (soundTick - lastSoundTime > 5) { gameSys.Sound(rd.Sound(theTreats.coinSound), 1); lastSoundTime = soundTick; }
				user.itemTouch(e, user, new TouchInfo { flags = 0, style = id, count = 1, isItem=true });
				reactSys.React( e.pos+new v3(0,0,0), ""+itemStyles[id], new Color( .3f,.5f,.8f,1));
				e.remove(); }};}

	public void BasicTreat( v3 pos ) {
		if( rd.f(0,1)<.08f) { // this is not how we'd ultimately like to do this.
			SpecialTreat(pos);
			return;}
		var vel = rd.f(.1f, .2f ); var spin = rd.f(-6,6); var firstBounce = true; var xvel = 0f; var numBounces = 0; var id = rd.i(0, treatStyles.Length);
		new PoolEnt( entPool ) {
			sprite = theTreats.resources[id], pos = new v3( pos.x+ rd.f(1), pos.y+rd.f(.5f), rd.f(.5f)), scale = .3f, flipped=rd.Test(.5f), name="basicTreat", inGrid=true, shadow=gameSys.Shadow(theTreats.shadow, entPool, 1, .4f, 0 ),
			update = e => {
				e.pos += new v3( xvel,vel, 0);
				vel -= .005f;
				e.ang += spin;
				e.removeIfOffScreen();
				if( e.pos.y < -5f && vel < 0 ) {
					numBounces++;
					if( firstBounce ) { firstBounce = false; xvel = rd.f(.1f); }
					vel *= -.4f;
					if( numBounces > 3 ) { e.remove(); } } },
			buddyTouch = (e, user, info) => {
				var styleStr = treatStyles[id];
				if (soundTick - lastSoundTime > 5) { gameSys.Sound(rd.Sound(theTreats.coinSound), 1); lastSoundTime = soundTick; }
				user.itemTouch(e, user, new TouchInfo { flags = 0, style = id, count = 1, isItem=false});
				reactSys.React( e.pos+new v3(0,0,0), " " + styleStr, new Color( .3f,.5f,.8f,1));
				e.remove(); }};}

	void BalloonCluster( v3 pos, v3 vel ) {
		for( var k = 0; k < 4; k++ ) {
			v3 scaledVel = vel * rd.f(1,1.3f), push=new v3(0,0,0);
			float bob = rd.f( .002f, .004f ), bobt = rd.f( .8f, 1.2f ), tick = rd.Ang(), lastPush = 0.0f, goalScale = .3f;
			new PoolEnt( entPool ) {
				sprite = rd.Sprite( theTreats.balloons ), pos = new v3( pos.x+ rd.f(1), pos.y+rd.f(.5f), rd.f(.7f)), scale = .3f, flipped=rd.Test(.5f), name="balloon", inGrid=true, shadow=gameSys.Shadow(theTreats.shadow, entPool, .4f, .4f, 0 ),
				update = e => {
					tick+=.01f;
					e.pos += scaledVel + new v3( bob*Mathf.Sin( bobt * tick * 1.23f + 3.1f ), bob*Mathf.Cos( bobt * tick ), 0 );
					e.pos += push;
					nm.ease( ref goalScale, .3f, .02f );
					e.scale = e.scale * .8f + .2f * goalScale;
					nm.ease( ref push, new v3(0,0,0), .02f );
					e.removeIfOffScreen( false );
				},
				breathTouch = (e, user, info) => {
					if( tick - lastPush < .05f )return;
					var pushDir = user.vel.normalized;//(e.pos - user.pushCenter).normalized;
					pushDir.y = 0;
					pushDir.z = 0;
					push += pushDir * info.strength*.02f;
					lastPush = tick;
					goalScale += info.strength * .04f;
					if( info.strength == 3 || gameSys.gameOver  ) {
						if (soundTick - lastSoundTime > 5) { gameSys.Sound(rd.Sound(theTreats.balloonPop), 1); lastSoundTime = soundTick; }
						BasicTreat( e.pos );
						reactSys.React( e.pos + new v3(0, 0, -.2f), "Pop!", new Color(.9f, 1f, .7f, 1 ) );
						e.remove();
					}
				},
				playerTouch = (e, user, info) => {
					var pushDir = (e.pos - user.pushCenter).normalized;
					pushDir.y = 0;
					pushDir.z = 0;
					push += pushDir * .01f;
				}
			};
		}
	}

	void BalloonGrid( int leftBound, int rightBound ) {
		for( var k = leftBound; k < rightBound; k++ ) {
			for( var k2 = -2; k2 < 7; k2++ ) {
				float bob = rd.f( .002f, .004f ), tick = rd.Ang(), goalScale = .3f;
				v3 home = new v3(k,k2,0);
				float offset = rd.Ang(), rotateRange = rd.f(.1f, .2f) * 80, rotateSpeed = rd.f(.02f, .04f), delay = rd.i(0,15) + 20 + 2*k, leaveDelay = delay + 60*12;
				new PoolEnt( entPool ) {
					sprite = rd.Sprite( theTreats.balloons ), pos = new v3((leftBound+rightBound)/2f, -7, 0), scale = rd.f(.19f, .21f), flipped=rd.Test(.5f), name="balloon", inGrid=true, shadow=gameSys.Shadow(theTreats.shadow, entPool, .4f, .4f, 0 ),
					update = e => {
						delay--;
						if( delay > 0 )return;
						if( leaveDelay <= 0 ) { if( e.removeIfOffScreen( false ) ) return;}
						e.pos = e.pos * .98f + .02f * (home + new v3( .1f*Mathf.Cos( tick * bob ), .1f*Mathf.Sin( tick * bob ), 0 ) );
						e.ang = Mathf.Cos(tick * rotateSpeed + offset) * rotateRange;
						goalScale = .3f * .02f + .98f * goalScale;
						e.scale = e.scale * .8f + .2f * goalScale*.65f;
						tick++;
						leaveDelay--;
						if( leaveDelay == 0 ) home = new v3( rd.f(-3,3), 9, rd.f( -4, 4 ));
					},
					breathTouch = (e, user, info) => {
						var pushDir = (e.pos - user.pushCenter).normalized;
						pushDir.z = 0;
						e.pos += pushDir * info.strength*.8f;
						goalScale += info.strength * .1f;
						if( goalScale > .6f ) {
							BasicTreat( e.pos );
							if (soundTick - lastSoundTime > 5) { gameSys.Sound(rd.Sound(theTreats.balloonPop), 1); lastSoundTime = soundTick; }
							reactSys.React( e.pos + new v3((leftBound+rightBound)/2f, 0, -.2f), "Pop!", new Color(.9f, 1f, .7f, 1 ) );
							e.remove();
						}
					},
					playerTouch = (e, user, info) => {
						var pushDir = (e.pos - user.pushCenter).normalized;
						pushDir.z = 0;
						pushDir.y *= .2f;
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
				v3 home = new v3(k,k2,0);
				new PoolEnt( entPool ) {
					sprite = rd.Sprite( theTreats.balloons ), pos = new v3(k, k2, 0), scale = .2f, flipped=rd.Test(.5f), name="balloon", inGrid=true,
					update = e => {
						lastTouch--;
						e.pos = e.pos * .95f + .05f * home;
						if( lastTouch == 0 )e.color = new Color( 1, 1, 1, 1 );
					},
					breathTouch = (e, user, info) => {
						var pushDir = (e.pos - user.pushCenter).normalized;
						pushDir.z = 0;
						e.pos += pushDir * info.strength*.8f;
						e.color = new Color( 1, 0, 0, 1 );
						lastTouch = 3;
					},
					playerTouch = (e, user, info) => {
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