using UnityEngine;
using System.Collections.Generic;
using System;
using v3 = UnityEngine.Vector3;

class PlayerAttacks{
	public static void MakeBreath( GameSys gameSys, ent owner, List<Action<v3, float, float, float>> blow, List<Action<v3, float, float, float>> inhale, List<Action<v3, float, float, float>> inhaleBig ) {
		var src = new ent() { name="breatheSet" };
		for( var k = 0; k < 20; k++ ) {
			float cloudRot = rd.f(-3f, 3f), fallSpeed = rd.f(.85f, .95f), chargeStrength = 1f;
			var b = new v3( 0f, 0f, 0f );
			var cloudNum = k;
			var blowing = false;
			var f = new ent() {
				sprite = Art.Props.Clouds.rand(), scale=0, name="playerbreath", parent = src,
				update = e => {
					if(e.scale < .01f) return;
					e.MoveBy(b);
					b *= fallSpeed;
					e.scale *= fallSpeed;
					if( e.scale < .01f )e.active=false;
					e.ang += cloudRot;
					e.vel = b;
					if(cloudNum == 0 && blowing && e.scale > .1f) {gameSys.grid.Find(e.pos, .5f+.5f*chargeStrength, e, (me, targ) => { targ.breathTouch(targ, me, new TouchInfo { flags = 0, strength = (int)chargeStrength, src=owner });});}}};
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
					f.scale = size*.25f;}
				else {
					var spd = rd.f(.5f, size);
					b += new v3( blowVx * .4f*spd + rd.f(.02f), blowVy * .4f*spd + rd.f(.02f), rd.f(.03f) );
					f.pos = srcPos + nm.v3y( .2f );
					f.scale = size * rd.f(.05f, .25f);}});
			inhale.Add((srcPos, blowVx, blowVy, chargeSize) => {
				f.active=true;
				blowing = false;
				b = new v3( rd.f(.02f), rd.f(.02f), rd.f(.03f) );
				f.pos = srcPos + nm.v3y( .2f );
				f.scale = rd.f(.05f, .25f);});
			inhaleBig.Add((srcPos, blowVx, blowVy, chargeSize) => {
				f.active=true;
				blowing = false;
				b = new v3( 2*rd.f(.02f), 2*rd.f(.02f), 2*rd.f(.03f) );
				f.pos = srcPos + nm.v3y( .2f );
				f.scale = 2*rd.f(.05f, .25f);});}}}

class EndPlaque{
    public static void MakeEndPlaque( Transform transform ){
        new ent() { ignorePause = true, sprite = Art.UI.Title.howtoplay.spr, parentTrans = transform, scale = 1.3f * 0f, pos = new v3(0, 0, 10), health = 1,
            update = e2 => {
                //if (Input.GetKey(KeyCode.Escape) || Input.GetKey(KeyCode.Space) || Input.GetButton("Fire1") || Input.GetButton("Fire2")) e2.health = 0;
                if (e2.health > 0) { var v = e2.pos; nm.ease(ref v, new v3(0, 0, 10), .1f); e2.pos = v; }
                else { var v = e2.pos; nm.ease(ref v, new v3(0, -10, 10), .1f); e2.pos = v; }
                if (e2.pos.y < -9f) e2.remove();}};}}

public class PlayerSys {

	public float team1Health = 30;
	public float team2Health = 30;
	public float team1MaxHealth = 30;
	public float team2MaxHealth = 30;

	public ent playerEnt = null, player2Ent = null;

    const float breathChargeTime = 45;

    GameSys gameSys;
	ReactSys reactSys;

	public void Setup(GameSys theGameSys, ReactSys theReactSys, APG.APGBasicGameLogic basicGameLogic) {
		gameSys = theGameSys;
		reactSys = theReactSys;

		Player(1, basicGameLogic);
		Player(2, basicGameLogic);}

	void Player(int id, APG.APGBasicGameLogic basicGameLogic) {
		float tick = 0.0f, rot = 0.0f, useDownTime = 0f;
		var useDown = false;
		KeyCode left, right, up, down, use;
		Sprite pic = Art.Players.girlyellow.spr;
		left = KeyCode.LeftArrow; right = KeyCode.RightArrow; up = KeyCode.UpArrow; down = KeyCode.DownArrow; use = KeyCode.Space;
		var startingX = 0f;
		if( id == 0 ) { use = KeyCode.Space; }
		else if(id == 1) { left = KeyCode.A; right = KeyCode.D; up = KeyCode.W; down = KeyCode.S; use = KeyCode.LeftShift; startingX = -8f; }
		else {  pic = Art.Players.girlpurple.spr; startingX = 8f;}

		var blow = new List<Action<v3, float, float, float>>();
		var inhale = new List<Action<v3, float, float, float>>();
		var inhaleBig = new List<Action<v3, float, float, float>>();
		var lastChat = 0f;
		var lastAimDir = new v3( 0, 0, 0 );

		var stunTime = 0;

        var fallSideVel = rd.f(-.05f, .05f);
        var fallVel = .5f;
        var fallEnd = false;
        var fallRotVel = rd.f(2f, 2f);

		var pl = new ent() {
			sprite = pic, pos = nm.v3x( startingX ), scale = 1.5f, flipped=(id == 2) ? true : false, vel = new v3(0, 0, 0), knockback = new v3(0, 0, 0), name="player"+id, inGrid=true, shadow=gameSys.Shadow(null, 1, 1, 0 ), team= (id==1)?Team.Player1:Team.Player2,
			update = e => {
				tick++;

                if (( team1Health < 1 && id==1 ) || ( team2Health < 1 && id == 2 )) {
                    e.color = new Color(1, 0, 0, .5f);
                    if (fallEnd == false){ e.ang += fallRotVel; fallVel += -.02f; e.MoveBy(fallSideVel, fallVel, 0); }
                    if(e.pos.y < -5 && fallVel < 0 ) { fallVel *= -.6f; fallSideVel *= .8f; fallRotVel *= .8f; if (fallVel < .02f) fallEnd = true; } }
                if (( team1Health < 1 && id == 2 ) || ( team2Health < 1 && id == 1 )) { e.MoveBy(0, 0, .01f * Mathf.Cos(tick * .04f));}

                bool joyStickLeft = false, joystickRight = false, joystickUp = false, joystickDown = false, joystickButton = false;
				if( id == 1 || id == 0 ) {
					if( Input.GetButton("Fire1") ) { joystickButton = true; }
					if( Input.GetAxis("Vertical" ) > 0.4f ) { joystickUp = true; }
					if( Input.GetAxis("Vertical" ) < -0.4f ) { joystickDown = true; }
					if( Input.GetAxis("Horizontal" ) > 0.4f ) { joystickRight = true; }
					if( Input.GetAxis("Horizontal" ) < -0.4f ) { joyStickLeft = true; } }
				if( id == 2 ) {
					if( Input.GetButton("Fire2") ) { joystickButton = true; }
					if( Input.GetAxis("Vertical2" ) > 0.4f ) { joystickUp = true; }
					if( Input.GetAxis("Vertical2" ) < -0.4f ) { joystickDown = true; }
					if( Input.GetAxis("Horizontal2" ) > 0.4f ) { joystickRight = true; }
					if( Input.GetAxis("Horizontal2" ) < -0.4f ) { joyStickLeft = true; } }
				stunTime--;
				if( gameSys.gameOver ) {  return; }
				if (stunTime > 0) {
					nm.ease(ref e.vel.x, 0, .15f);
					nm.ease(ref e.vel.y, 0, .15f);}
				else {
					if (Input.GetKey(left) || joyStickLeft) { e.flipped = true; nm.ease(ref e.vel.x, -1.0f, .3f); }
					else if (Input.GetKey(right) || joystickRight) { e.flipped = false; nm.ease(ref e.vel.x, 1.0f, .3f); }
					else nm.ease(ref e.vel.x, 0, .15f);
					if (Input.GetKey(up) || joystickUp) { nm.ease(ref e.vel.y, 1.0f, .3f); }
					else if (Input.GetKey(down) || joystickDown) { nm.ease(ref e.vel.y, -1.0f, .3f); }
					else nm.ease(ref e.vel.y, 0, .15f);}
				rot = e.vel.x * 360 / Mathf.PI;
				if( e.vel.sqrMagnitude > .1f ) {lastAimDir = e.vel;}

                // if (joystickButton){ gameSys.ClearEnts(); FullGame.resetGame(); return;}
                /*if (joystickButton){
                    if(team2Health != 0){EndPlaque.MakeEndPlaque( introPlaque, transform);}
                    team2Health = 0;}*/

                    if ( stunTime > 0) {}
				else { 
					if(Input.GetKey(use) || joystickButton ) {
						if(useDown == false) { useDownTime = tick; }
						if(tick-useDownTime == breathChargeTime) {foreach(var b in inhaleBig) b(e.pos, lastAimDir.x, lastAimDir.y, 1);}
						useDown = true;
						if( id == 1 || id == 0 ) {
							basicGameLogic.player1ChargeRatio = (tick-useDownTime)/ breathChargeTime;
							if( basicGameLogic.player1ChargeRatio > 1f ) {
								basicGameLogic.player1ChargeRatio = 1f;
								if( tick % 45 == 0 ) {e.sprite =  Art.Players.girlyellowglow.spr; foreach(var b in inhale) b(e.pos, lastAimDir.x, lastAimDir.y, 1);}
								if( tick % 45 == 4 )e.sprite = Art.Players.girlyellow.spr;}}
						else {
							basicGameLogic.player2ChargeRatio = (tick-useDownTime)/ breathChargeTime;
							if( basicGameLogic.player2ChargeRatio > 1f ) {
								basicGameLogic.player2ChargeRatio = 1f;
								if( tick % 45 == 0 ) {e.sprite = Art.Players.girlpurpleglow.spr;foreach(var b in inhale) b(e.pos, lastAimDir.x, lastAimDir.y, 1);}
								if( tick % 45 == 4 )e.sprite = Art.Players.girlpurple.spr;}}}
					else {
						if(useDown == true) {
							gameSys.Sound( Art.Sounds.flick.snd, 1);
							var knockback2 = new v3(-lastAimDir.x, -lastAimDir.y, 0).normalized;
							var blowStrength = 1;
							if(tick-useDownTime > breathChargeTime) {knockback2 *= 1.5f;blowStrength = 3;}
							else { knockback2 *= .05f; blowStrength = 2; }
							foreach(var b in blow) b(e.pos, lastAimDir.x, lastAimDir.y, blowStrength);
							e.knockback += knockback2;}
						else {
							if( id == 1 || id == 0 ) {basicGameLogic.player1ChargeRatio = 0;}
							else {basicGameLogic.player2ChargeRatio = 0;}}
						useDown = false;}}
				if( useDown ) {e.vel *= .7f;}
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
				gameSys.grid.Find(e.pos - nm.v3y( .7f ), 1, e, (me, targ) => { targ.playerTouch(targ, me, new TouchInfo { flags = 0, strength = 1 });});},
			onHurt = (e, src, dmg) => {
				if (id == 1) {
					if (dmg.damage < 0) { team1Health++; if (team1Health > team1MaxHealth) team1Health = team1MaxHealth; }
					else team1Health -= dmg.damage;}
				if (id == 2) {
					if (dmg.damage < 0) { team2Health++; if (team2Health > team2MaxHealth) team2Health = team2MaxHealth; }
					else team2Health -= dmg.damage;}},
			breathTouch = (e, user, info) => {
				if( info.src == e )return;
				e.knockback += user.vel * .08f;
				if( info.strength == 3 ) { 
					e.knockback += user.vel * .16f;
					stunTime = 30;
					if ( tick - lastChat > 120 ){
						// do stun!
						lastChat = tick;
						reactSys.Chat( e.pos+new v3(1,1,0), "Oooof!", new Color( .3f,.5f,.8f,1),.5f);}}}};
		PlayerAttacks.MakeBreath( gameSys, pl, blow, inhale, inhaleBig );
		var halotick = 0;
		new ent() {
			parent = pl, sprite = (id == 2 ? Art.Players.girlpurpleglow.spr: Art.Players.girlyellowglow.spr), pos = new v3(0,0,0), scale = 1f, name="playerhalo",
			update = e => {
				if( pl.flipped != e.flipped )e.flipped = pl.flipped;
				halotick++;
				if(tick-useDownTime > breathChargeTime) halotick+=3;
                    if(id == 2 ? team2Health <1: team1Health<1) e.color = new Color(1, 1, 1, 0);
                else e.color  = new Color( 1,1,1, .3f+.3f * Mathf.Cos( halotick*.015f ) );} };
		if(id == 2) player2Ent = pl;
		else playerEnt = pl;}}