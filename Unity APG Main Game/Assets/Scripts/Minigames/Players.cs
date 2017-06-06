using UnityEngine;
using System.Collections.Generic;
using System;
using v3 = UnityEngine.Vector3;

public class Players:MonoBehaviour {
	public GameObject textName;
	public Sprite[] clouds, friends;
	public Sprite player, angel, shadow, player1, player2, angel1, angel2, player1flash, player2flash;
	public Sprite owMsg, ughMsg, thudMsg;
	public Sprite[] stances;
	public AudioClip blowSound, bumpSound, hurtSound, dieSound;

	public APG.APGBasicGameLogic basicGameLogic;
} 

public class PlayerSys {
	public ent playerEnt = null, player2Ent = null;

	GameSys gameSys;
	Players players;

	ReactSys reactSys;

	public void Setup(GameSys theGameSys, Players thePlayers, FoeSys foeSys, ReactSys theReactSys) {
		gameSys = theGameSys;
		players = thePlayers;
		reactSys = theReactSys;

		Player(1, foeSys);
		Player(2, foeSys);
	}

	public void MakeBreath( ent owner, List<Action<v3, float, float, float>> blow, List<Action<v3, float, float, float>> inhale, List<Action<v3, float, float, float>> inhaleBig ) {
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
						gameSys.grid.Find(e.pos, .5f+.5f*chargeStrength, e, (me, targ) => { targ.breathTouch(targ, me, new TouchInfo { strength=(int)chargeStrength, src=owner });});
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
		float tick = 0.0f, rot = 0.0f, useDownTime = 0f;
		var useDown = false;
		KeyCode left, right, up, down, use;
		Sprite pic = players.player1;
		left = KeyCode.LeftArrow; right = KeyCode.RightArrow; up = KeyCode.UpArrow; down = KeyCode.DownArrow; use = KeyCode.Space;
		//left = KeyCode.Keypad1; right = KeyCode.Keypad3; up = KeyCode.Keypad5; down = KeyCode.Keypad2; use = KeyCode.Return;
		var startingX = 0f;
		if( id == 0 ) { use = KeyCode.Space; }
		//else if(id == 1) { left = KeyCode.A; right = KeyCode.D; up = KeyCode.W; down = KeyCode.S; use = KeyCode.LeftShift; startingX = -5f; }
		else if(id == 1) { left = KeyCode.A; right = KeyCode.D; up = KeyCode.W; down = KeyCode.S; use = KeyCode.LeftShift; startingX = -8f; }
		else {  pic = players.player2; startingX = 8f;}

		var blow = new List<Action<v3, float, float, float>>();
		var inhale = new List<Action<v3, float, float, float>>();
		var inhaleBig = new List<Action<v3, float, float, float>>();

		var lastChat = 0f;

		var lastAimDir = new v3( 0, 0, 0 );

		var pl = new ent(gameSys) {
			sprite = pic, pos = nm.v3x( startingX ), scale = 1.5f, flipped=(id == 2) ? true : false, vel = new v3(0, 0, 0), knockback = new v3(0, 0, 0), name="player"+id, inGrid=true, shadow=gameSys.Shadow(players.shadow, null, 1, 1, 0 ),
			update = e => {
				tick++;

				bool joyStickLeft = false, joystickRight = false, joystickUp = false, joystickDown = false, joystickButton = false;
				if( id == 1 || id == 0 ) {
					if( Input.GetButton("Fire1") ) {
						joystickButton = true;
					}

					if( Input.GetAxis("Vertical" ) > 0.4f ) {
						joystickUp = true;
					}
					if( Input.GetAxis("Vertical" ) < -0.4f ) {
						joystickDown = true;
					}

					if( Input.GetAxis("Horizontal" ) > 0.4f ) {
						joystickRight = true;
					}
					if( Input.GetAxis("Horizontal" ) < -0.4f ) {
						joyStickLeft = true;
					}
				}
				if( id == 2 ) {
					if( Input.GetButton("Fire2") ) {
						joystickButton = true;
					}

					if( Input.GetAxis("Vertical2" ) > 0.4f ) {
						joystickUp = true;
					}
					if( Input.GetAxis("Vertical2" ) < -0.4f ) {
						joystickDown = true;
					}

					if( Input.GetAxis("Horizontal2" ) > 0.4f ) {
						joystickRight = true;
					}
					if( Input.GetAxis("Horizontal2" ) < -0.4f ) {
						joyStickLeft = true;
					}
				}

				if( gameSys.gameOver ) {
					e.MoveBy(0, 0, .01f * Mathf.Cos(tick * .04f));
					return;
				}

				if(Input.GetKey(left) || joyStickLeft ) { 
					e.flipped = true;
					nm.ease(ref e.vel.x, -1.0f, .3f);
				}
				else if(Input.GetKey(right) || joystickRight ) {
					e.flipped = false;
					nm.ease(ref e.vel.x, 1.0f, .3f);
				}
				else nm.ease(ref e.vel.x, 0, .15f); ;

				if(Input.GetKey(up) || joystickUp ) { nm.ease(ref e.vel.y, 1.0f, .3f); }
				else if(Input.GetKey(down) || joystickDown) { nm.ease(ref e.vel.y, -1.0f, .3f); }
				else nm.ease(ref e.vel.y, 0, .15f);

				rot = e.vel.x * 360 / Mathf.PI;

				if( e.vel.sqrMagnitude > .1f ) {
					lastAimDir = e.vel;
				}

				if(Input.GetKey(use) || joystickButton ) {
					if(useDown == false) { useDownTime = tick; }
					if(tick-useDownTime == 135) {
						foreach(var b in inhaleBig) b(e.pos, lastAimDir.x, lastAimDir.y, 1);
					}
					else if(tick-useDownTime == 30) {
						foreach(var b in inhale) b(e.pos, lastAimDir.x, lastAimDir.y, 1);
					}
					useDown = true;

					if( id == 1 || id == 0 ) {
						players.basicGameLogic.player1ChargeRatio = (tick-useDownTime)/115f;
						if( players.basicGameLogic.player1ChargeRatio > 1f ) {
							players.basicGameLogic.player1ChargeRatio = 1f;
							if( tick % 45 == 0 ) {
								//e.sprite = players.player1flash;
								foreach(var b in inhale) b(e.pos, lastAimDir.x, lastAimDir.y, 1);
							}
							//if( tick % 45 == 4 )e.sprite = players.player1;
						}
					}
					else {
						players.basicGameLogic.player2ChargeRatio = (tick-useDownTime)/115f;
						if( players.basicGameLogic.player2ChargeRatio > 1f ) {
							players.basicGameLogic.player2ChargeRatio = 1f;
							if( tick % 45 == 0 ) {
								//e.sprite = players.player2flash;
								foreach(var b in inhale) b(e.pos, lastAimDir.x, lastAimDir.y, 1);
							}
							//if( tick % 45 == 4 )e.sprite = players.player2;
						}
					}
				}
				else {

					/*if( id == 1 || id == 0 ) {
						if( e.sprite == players.player1flash) e.sprite = players.player1;
					}
					else {
						if( e.sprite == players.player2flash) e.sprite = players.player2;
					}*/

					if(useDown == true) {
						gameSys.Sound(players.blowSound, 1);
						var knockback2 = new v3(-lastAimDir.x, -lastAimDir.y, 0).normalized;
						var blowStrength = 1;
						if(tick-useDownTime > 115) {
							knockback2 *= 1.5f;
							blowStrength = 3;
						}
						else if(tick-useDownTime > 20) {
							knockback2 *= .8f;
							blowStrength = 2;
						}
						else { knockback2 *= .05f; }

						foreach(var b in blow) b(e.pos, lastAimDir.x, lastAimDir.y, blowStrength);

						e.knockback += knockback2;
					}
					else {
						if( id == 1 || id == 0 ) {
							players.basicGameLogic.player1ChargeRatio = 0;
						}
						else {
							players.basicGameLogic.player2ChargeRatio = 0;
						}
					}
					useDown = false;
				}
				e.knockback *= .8f;
				if(Mathf.Abs(e.vel.x) < .001f) e.vel.x = 0;
				if(Mathf.Abs(e.vel.y) < .001f) e.vel.y = 0;
				if(e.pos.x < -10.25f && e.vel.x < 0) e.vel.x = 0;
				if(e.pos.x > 10.25f && e.vel.x > 0) e.vel.x = 0;
				if(e.pos.y < -5.0f && e.vel.y < 0) e.vel.y = 0;
				if(e.pos.y > 5.5f && e.vel.y > 0) e.vel.y = 0;
				e.MoveBy(e.vel.x * .15f + e.knockback.x, e.vel.y * .15f+e.knockback.y, .01f * Mathf.Cos(tick * .04f));
				if( e.pos.y < -5.0f )e.MoveTo(e.pos.x, -5f, e.pos.z);
				if( e.pos.y > 5.5f )e.MoveTo(e.pos.x, 5.5f, e.pos.z);
				if( e.pos.x < -10.25f )e.MoveTo(-10.25f, e.pos.y, e.pos.z);
				if( e.pos.x > 10.25f )e.MoveTo(10.25f, e.pos.y, e.pos.z);
				e.ang = -rot * .1f;
				gameSys.grid.Find(e.pos - nm.v3y( .7f ), 1, e, (me, targ) => { targ.playerTouch(targ, me, new TouchInfo {strength= 1 });});

			},
			breathTouch = (e, user, info) => {
				if( info.src == e )return;
				e.knockback += user.vel * .16f;
				if( info.strength == 3 ) { 
					e.knockback += user.vel * .16f;
					if( tick - lastChat > 120 )
					{
						lastChat = tick;
						reactSys.Chat( e.pos+new v3(0,0,0), "Oooof!", new Color( .3f,.5f,.8f,1));
					}
				}
			}
		};

		MakeBreath( pl, blow, inhale, inhaleBig );

		var halotick = 0;
		var alpha = 0f;
		new ent(gameSys) {
			parent = pl, sprite = (id == 2 ? players.player2flash:players.player1flash ), pos = new v3(0,0,0), scale = 1f, name="playerhalo",
			update = e => {
				if( pl.flipped != e.flipped )e.flipped = pl.flipped;
				halotick++;
				if(tick-useDownTime > 135)halotick+=3;
				e.color  = new Color( 1,1,1, .3f+.3f * Mathf.Cos( halotick*.015f ) );
			} };

		if(id == 2) player2Ent = pl;
		else playerEnt = pl;
	}

	void React(v3 pos, Sprite msg) {
		var delay = 30;
		new ent(gameSys) { sprite = msg, name="react", pos = pos, scale = 1, update = e => { delay--; if(delay <= 0) e.remove(); } };
	}
}