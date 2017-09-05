using UnityEngine;
using v3 = UnityEngine.Vector3;
using System;

public class Backgrounds:MonoBehaviour {
	public Sprite[] trees, bushes, clouds, buildings, skies;
	public Sprite flag1, flag2, overlay, land;
	Buildings buildingSet;

	GameSys gameSys;

	PlayerSys playerSys;
	TreatSys treatSys;

	public v3[] Setup(GameSys theGameSys, Buildings theBuildingSet, PlayerSys thePlayerSys, TreatSys theTreatSys ) {
		gameSys = theGameSys;
		playerSys = thePlayerSys;
		buildingSet = theBuildingSet;
		treatSys = theTreatSys;

		Clouds();
		Trees();
		Bushes();

		var lookPositions = Buildings();

		Flags();

		return lookPositions;
	}
	void Clouds() {
		var src = new ent(gameSys) { name="cloudSet" };
		for( var k = 0; k < 250; k++ ) {
			var zDist = rd.f(0, 50); var sideScale = zDist / 50; var goal = new v3(rd.f(28) * (1 + sideScale * 2), rd.f(0, 18) * (1 + sideScale * 2), 10 + zDist);
			var offset = rd.Ang(); var rotateRange = rd.f(.1f, .2f) * 80; var rotateSpeed = rd.f(.02f, .04f);
			var tick = 0f;
			new ent(gameSys) {
				sprite = rd.Sprite(clouds), pos = goal, scale = rd.f(.3f, .4f) * 1.7f, parent = src,
				name="cloud", 
				update = e => {
					tick++;
					if(rd.Test(.0003f)) { goal = e.pos + rd.Vec(-3, 3); }
					e.ang = Mathf.Cos(tick * rotateSpeed + offset) * rotateRange;
					var immediateGoal = e.pos * .99f + .01f * goal;
					if(immediateGoal.magnitude > .1f) e.MoveBy(immediateGoal - e.pos);
				}
			};
		}
	}
	void Trees() {
		var src = new ent(gameSys) { name="treeSet" };
		for( var k = 0; k < 300; k++ ) {
			var zDist = rd.f(7f, 60.0f); var sideScale = zDist / 60.0f;
			new ent(gameSys) {
				sprite = rd.Sprite(trees), pos = new v3(rd.f(23) * (1 + sideScale * 2), -5f+rd.f(0, .2f), zDist), scale = rd.f(.3f, .4f) * 2, name="tree", parent = src,
			};
		}
	}
	void Bushes() {
		var src = new ent(gameSys) { name="bushSet" };
		for( var k = 0; k < 100; k++ ) {
			var zDist = rd.f(3f, 27.0f); var sideScale = zDist / 60.0f;
			new ent(gameSys) { sprite = rd.Sprite(bushes), pos = new v3(rd.f(23) * (1 + sideScale * 2), -5f+rd.f(0, .2f), zDist), scale = rd.f(.3f, .4f), name="bush", parent = src };
		}
	}

	// _________________

	void makeCowToot(v3 pos, ent targ) {
		new ent(gameSys) {
			sprite = buildingSet.stinkLines[rd.i(0,2)], pos = new v3( pos.x, pos.y, .8f), flipped=rd.Test(.5f), name="cowstink", inGrid=true, scale=1f, color=new Color(1,1,1,1), health=6,
			update = e => {
				e.scale *= 1.001f;
				e.health--;
				e.color = new Color(1, 1, 1, e.health / 6f);
				if (e.health <= 0) {
					e.remove();
					return;}}};
		new ent(gameSys) {
			sprite = buildingSet.stinkCloud[rd.i(0,2)], pos = new v3( pos.x, pos.y, .8f), flipped=rd.Test(.5f), name="cowstinkball", inGrid=true, scale=.3f, color=new Color(1,1,1,.5f), health=60*10, vel= new v3(0, .035f, 0),
			update = e => {
				e.health--;
				e.scale = rd.f(.2f, .4f);
				e.ang = rd.f(0, 360);
				if(e.health < 7 )e.color = new Color(1, 1, 1, rd.f(.2f,.4f));
				var dif = targ.pos - e.pos;
				e.vel = e.vel * .9f + .1f * dif.normalized * .035f;
				e.pos += e.vel;
				e.removeIfOffScreen();
				if (e.health <= 0) {
					e.remove();
					return;}},
			playerTouch = (e, user, info) => {
				user.onHurt(user, e, new TouchInfo { flags = 0, damage = 1, showDamage = true });
				for ( var k = 0; k < 15; k++) {
					new ent(gameSys) {
						sprite = buildingSet.stinkCloud[rd.i(0,2)], pos = new v3( e.pos.x+rd.f(-1.5f,1.5f), 1 + e.pos.y + rd.f(-1.5f, 1.5f), .8f + rd.f(-.05f, .05f)), flipped=rd.Test(.5f), name="stinkExplode", scale=.7f, color = new Color(1, 1, 1, .5f),
						update = e2 => { e2.scale *= .9f; if (e2.scale <= 0.01) { e2.remove(); return;}}};}
				e.remove();}};}
	void doCow( v3 pos, ent targ ) {
		new ent(gameSys) {
			sprite = buildingSet.cows[rd.i(0,2)], pos = new v3( pos.x, pos.y, .9f), flipped=rd.Test(.5f), name="cow", inGrid=true, health=60*30,scale=0f,
			update = e => {
				if (e.health > 30) e.scale = e.scale * .9f + .1f * .7f;
				else e.scale = e.scale * .9f;
				if (e.health > 30) {
					var cycle = e.health % (60 * 2);
					if (cycle == 0) { e.ang = 0; makeCowToot(e.pos, targ); } // toot!
					else if (cycle < 60) e.ang = rd.f(-(60 - cycle), 60 - cycle) * .5f;}
				e.health--;
				if (e.health < 30 && e.scale < .01f) {
					e.remove();
					return;}}};}

	// _________________

	void makeBroccoli(v3 pos, int side) {
		new ent(gameSys) {
			sprite = buildingSet.cannonClouds[rd.i(0,4)], pos = new v3( pos.x+rd.f(-.5f,.5f), pos.y + rd.f(-.5f, .5f), .8f + rd.f(-.05f, .05f)), flipped=rd.Test(.5f), name="cowstink", inGrid=true, scale=.7f,
			update = e => {
				e.scale *= .9f;
				if (e.scale <= 0.01) {
					e.remove();
					return;}}};
		var vel = rd.f(.1f, .2f ); var spin = rd.f(-6,6); var firstBounce = true; var xvel = -side*.08f; var numBounces = 0; var id = rd.i(0, 10);
		new ent(gameSys) {
			sprite = buildingSet.broccoli[rd.i(0, 3)], pos = new v3( pos.x+ rd.f(1), pos.y+rd.f(.5f), rd.f(.5f)), scale = .3f, flipped=rd.Test(.5f), name="broccoli", inGrid=true, 
			update = e => {
				e.pos += new v3( xvel,vel, 0);
				vel -= .005f;
				e.ang += spin;
				e.removeIfOffScreen();
				if( e.pos.y < -5f && vel < 0 ) {
					numBounces++;
					if( firstBounce ) { firstBounce = false; xvel = rd.f(.1f); }
					vel *= -.4f;
					if( numBounces > 3 ) { e.remove(); } } }};}
	void doBroccoliCannon( v3 pos, int side ) {
		new ent(gameSys) {
			sprite = buildingSet.cannon, pos = new v3( pos.x, pos.y, .9f), flipped= (side > 0 ) ? true:false, name="cannon", inGrid=true, health=60*4,scale=0f, 
			update = e => {
				if (e.health > 30) e.scale = e.scale * .9f + .1f * .7f;
				else e.scale = e.scale * .9f;
				if (e.health < 60 * 3 && e.health > 60) {
					e.ang = rd.f(-30, 30);
					var cycle = e.health % 8;
					if (cycle == 0) { e.ang = 0; makeBroccoli(e.pos, side ); }}
				e.health--;
				if (e.health < 30 && e.scale < .01f) {
					e.remove();
					return;}}};}

	// _________________

	void doTurtle( v3 pos ) {
		var vel = rd.f(.1f, .2f ); var spin = rd.f(-6,6); var firstBounce = true; var xvel = 0f; var numBounces = 0; var id = rd.i(0, 10);
		new ent(gameSys) {
			sprite = buildingSet.turtle, pos = new v3( pos.x+ rd.f(1), pos.y+rd.f(.5f), rd.f(.5f)), scale = .3f, flipped=rd.Test(.5f), name="basicTreat", inGrid=true, 
			update = e => {
				e.pos += new v3( xvel,vel, 0);
				vel -= .005f;
				e.ang += spin;
				e.removeIfOffScreen();
				if( e.pos.y < -5f && vel < 0 ) {
					numBounces++;
					if( firstBounce ) { firstBounce = false; xvel = rd.f(.1f); }
					vel *= -.4f;
					if( numBounces > 3 ) { e.remove(); } } }};}
	void doFish( v3 pos, ent targ ) {
		var active = false; var activeTime = 0;
		new ent(gameSys) {
			sprite = buildingSet.tentacle, pos = new v3( pos.x+ rd.f(1), pos.y+rd.f(.5f), rd.f(.5f)), scale3 = new v3(1,0,1), flipped=rd.Test(.5f), name="basicTreat", inGrid=true, health=60*40,
			update = e => {
				e.health--;
				if (e.health <= 0) e.remove();
				e.removeIfOffScreen();
				if( !active) {
					if(rd.f(0, 1) < .01f) {
						new ent(gameSys) { // lil bubbles would be better
							sprite = buildingSet.cannonClouds[rd.i(0,4)], pos = new v3( e.pos.x, 1+e.pos.y, .8f + rd.f(-.05f, .05f)), flipped=rd.Test(.5f), name="oldOneBreathingExplode", scale=.7f,
							update = e2 => {e2.scale *= .9f; if (e2.scale <= 0.01) { e2.remove(); return;}}};}
					if( Math.Abs( targ.pos.x - pos.x ) < 1) {
						// make an explosion!
						for( var k = 0; k < 15; k++) {
							new ent(gameSys) {
								sprite = buildingSet.cannonClouds[rd.i(0,4)], pos = new v3( e.pos.x+rd.f(-1.5f,1.5f), 1 + e.pos.y + rd.f(-1.5f, 1.5f), .8f + rd.f(-.05f, .05f)), flipped=rd.Test(.5f), name="blimpExplode", scale=.7f,
								update = e2 => { e2.scale *= .9f; if (e2.scale <= 0.01) { e2.remove(); return;}}};}
						activeTime = -20;
						active = true;}}
				else {
					activeTime++;
					if (activeTime > 0) {
						// need to do damage in all this too.
						e.scale3 = new v3(1, (float)(4 * Math.Sin(activeTime / 30f * Math.PI)), 1);
						if (activeTime > 30) { e.remove(); }}}}};}

	// _________________

	void makeFlower(v3 pos, int side) {
		var vel = rd.f(.3f, .4f )*.6f; var spin = rd.f(-6,6); var firstBounce = true; var xvel = -side*rd.f(.04f,.1f); var numBounces = 0; var id = rd.i(0, 10);
		new ent(gameSys) {
			sprite = buildingSet.flowers[rd.i(0, 2)], pos = new v3( pos.x+ rd.f(1), pos.y+rd.f(.5f), rd.f(.5f)), scale = .3f, flipped=rd.Test(.5f), name="flower", inGrid=true, health=0,
			update = e => {
				e.health++;
				e.pos += new v3( xvel,vel, 0);
				vel -= .002f;
				e.ang += spin;
				e.removeIfOffScreen();
				if( e.pos.y < -5f && vel < 0 ) {
					numBounces++;
					if( firstBounce ) { firstBounce = false; xvel = rd.f(.1f); }
					vel *= -.4f;
					if( numBounces > 3 ) { e.remove(); } } },
			playerTouch = (e, user, info) => {
				user.onHurt(user, e, new TouchInfo { flags = 0, damage = 1, showDamage = true });
				for ( var k = 0; k < 7; k++) {
					new ent(gameSys) {
						sprite = buildingSet.cannonClouds[rd.i(0,4)], pos = new v3( e.pos.x+rd.f(-1.5f,1.5f), 1 + e.pos.y + rd.f(-1.5f, 1.5f), .8f + rd.f(-.05f, .05f)), flipped=rd.Test(.5f), name="flowerMaker", scale=.7f,
						update = e2 => { e2.scale *= .9f; if (e2.scale <= 0.01) { e2.remove(); return;}}};}
				e.remove();}};}
	void doFlowerBarrage( v3 pos, int side ) {
		new ent(gameSys) {
			sprite = buildingSet.flowers[rd.i(0, 2)], pos = new v3( pos.x, pos.y, .9f), flipped= (side > 0 ) ? true:false, name="tennisBallSpewer", inGrid=true, health=60*3,scale=0f, 
			update = e => {
				if (e.health > 60) {
					var cycle = e.health % 4;
					if (cycle == 0) { e.ang = 0; makeFlower(e.pos, -side ); }}
				e.health--;
				if (e.health < 0) {
					e.remove();
					return;}}};}
	void doSun( v3 pos ) {
		var vel = rd.f(.1f, .2f ); var spin = rd.f(-6,6); var firstBounce = true; var xvel = 0f; var numBounces = 0; var id = rd.i(0, 10);
		new ent(gameSys) {
			sprite = flag1, pos = new v3( pos.x+ rd.f(1), pos.y+rd.f(.5f), rd.f(.5f)), scale = .3f, flipped=rd.Test(.5f), name="basicTreat", inGrid=true, 
			update = e => {
				e.pos += new v3( xvel,vel, 0);
				vel -= .005f;
				e.ang += spin;
				e.removeIfOffScreen();
				if( e.pos.y < -5f && vel < 0 ) {
					numBounces++;
					if( firstBounce ) { firstBounce = false; xvel = rd.f(.1f); }
					vel *= -.4f;
					if( numBounces > 3 ) { e.remove(); } } }};}

	// _________________

	void makeDrunkPlane(v3 pos, ent targ) {
		var turnSpd = .96f;
		new ent(gameSys) {
			sprite = buildingSet.biplane, pos = new v3( pos.x, pos.y, .8f), flipped=false, name="drunkbiplane", inGrid=true, scale=.3f, health=60*7, vel= new v3(0, .035f, 0),
			update = e => {
				turnSpd += .0001f;
				if (turnSpd > 1) turnSpd = 1;
				e.health--;
				var dif = targ.pos - e.pos;
				e.vel = e.vel * turnSpd + (1-turnSpd) * dif.normalized * .235f;
				e.ang = (float)(Math.Atan2(e.vel.y, e.vel.x) * 360f / Math.PI / 2);
				e.pos += e.vel;
				e.removeIfOffScreen();
				if (e.health <= 0) {
					e.remove();
					return;}},
			playerTouch = (e, user, info) => {
				user.onHurt(user, e, new TouchInfo { flags = 0, damage = 1, showDamage = true });
				for ( var k = 0; k < 15; k++) {
					new ent(gameSys) {
						sprite = buildingSet.cannonClouds[rd.i(0,4)], pos = new v3( e.pos.x+rd.f(-1.5f,1.5f), e.pos.y + rd.f(-1.5f, 1.5f), .8f + rd.f(-.05f, .05f)), flipped=rd.Test(.5f), name="blimpExplode", scale=.7f,
						update = e2 => { e2.scale *= .9f; if (e2.scale <= 0.01) { e2.remove(); return;}}};}
				e.remove();}};}
	void doDrunkPlane( v3 pos, ent targ ) {
		new ent(gameSys) {
			sprite = buildingSet.cows[rd.i(0,2)], pos = new v3( pos.x, pos.y, .9f), flipped=rd.Test(.5f), name="drunkPlaneMaker", inGrid=true, health=60*6*1,scale=0f,
			update = e => {
				if (e.health > 30) {
					var cycle = e.health % 40;
					if (cycle == 0) { makeDrunkPlane(pos, targ); }}
				e.health--;
				if (e.health <= 0) {
					e.remove();
					return;}}};}
	void doBlimp( v3 pos ) {
		var vel = 0f; var shake = 0f; var lastPush = 0.0f; var tick = 0f;
		var angAnim = new DualWave(12, .025f);
		new ent(gameSys) {
			sprite = buildingSet.blimp, pos = new v3( pos.x+ rd.f(1), 1f+pos.y+rd.f(.5f), rd.f(.5f)), scale = 0, flipped=rd.Test(.5f), name="treatBlimp", inGrid=true, health=5,
			update = e => {
				e.removeIfOffScreen();
				e.scale = e.scale * .9f + .1f * .4f;
				shake *= .9f;
				e.ang = rd.f(-20, 20) * shake + angAnim.Val(tick*10);
				tick += .01f;
				vel = vel * .99f + .01f * .01f;
				e.pos += new v3( 0,vel, 0);},
			breathTouch = (e, user, info) => {
				if( tick - lastPush < .5f )return;
				lastPush = tick;
				if ( info.strength == 3 ) {
					e.health--;
					shake += 3f;
					if (e.health == 0) {
						for( var k = 0; k < 15; k++) {
							new ent(gameSys) {
								sprite = buildingSet.cannonClouds[rd.i(0,4)], pos = new v3( e.pos.x+rd.f(-1.5f,1.5f), e.pos.y + rd.f(-1.5f, 1.5f), .8f + rd.f(-.05f, .05f)), flipped=rd.Test(.5f), name="blimpExplode", scale=.7f,
								update = e2 => { e2.scale *= .9f; if (e2.scale <= 0.01) { e2.remove(); return;}}};}
						for( var k = 0; k < 3; k++ ) treatSys.SpecialTreat(e.pos + nm.v3x(rd.f(-1,1)));
						e.remove();}}}};}

	// _________________

	void doCopCar( v3 pos ) {
		var vel = rd.f(.1f, .2f ); var spin = rd.f(-6,6); var firstBounce = true; var xvel = 0f; var numBounces = 0; var id = rd.i(0, 10);
		new ent(gameSys) {
			sprite = flag1, pos = new v3( pos.x+ rd.f(1), pos.y+rd.f(.5f), rd.f(.5f)), scale = .3f, flipped=rd.Test(.5f), name="basicTreat", inGrid=true, 
			update = e => {
				e.pos += new v3( xvel,vel, 0);
				vel -= .005f;
				e.ang += spin;
				e.removeIfOffScreen();
				if( e.pos.y < -5f && vel < 0 ) {
					numBounces++;
					if( firstBounce ) { firstBounce = false; xvel = rd.f(.1f); }
					vel *= -.4f;
					if( numBounces > 3 ) { e.remove(); } } }};}
	void makeCopHelicopter(v3 pos) {
		var turnSpd = .96f;
		var dest = pos + new v3(rd.f(-3,3), 2+rd.f(-1,1), 0);var vel = 0f;
		new ent(gameSys) {
			sprite = buildingSet.policeHelicopter, pos = new v3( pos.x, pos.y, .8f), flipped=true, name= "copHelicopter", inGrid=true, scale=.5f, health=60*30, vel= new v3(0, .035f, 0),
			onHurt = (e, src, dmg) => {
				for( var k = 0; k < 7; k++) {
					new ent(gameSys) {
						sprite = buildingSet.cannonClouds[rd.i(0,4)], pos = new v3( e.pos.x+rd.f(-.75f,.75f), e.pos.y + rd.f(-.75f, .75f), .8f + rd.f(-.05f, .05f)), flipped=rd.Test(.5f), name="helicopterExplode", scale=.5f,
						update = e2 => { e2.scale *= .9f; if (e2.scale <= 0.01) { e2.remove(); return;}}};}
				e.remove(); },
			update = e => {
				if( rd.f(0,1) < .004f ) dest = pos + new v3(rd.f(-3, 3), 2 + rd.f(-1, 1), 0);
				e.health--;
				var dif = dest - e.pos;
				if (dif.magnitude > 1f) vel = vel * .9f + .1f * .2f;
				else if (dif.magnitude < .5f) vel = vel * .9f;
				e.vel = e.vel * turnSpd + (1-turnSpd) * dif.normalized * vel;
				e.ang = (float)(Math.Atan2(e.vel.y, e.vel.x) * 360f / Math.PI / 2) * .1f;
				if (e.vel.x > 0) { e.flipped = true; }
				else { e.flipped = false; e.ang *= -1; }
				e.pos += e.vel;
				e.removeIfOffScreen();
				gameSys.grid.Find(e.pos - new v3(0, .7f, 0), 1.75f, e, (me, targ) => { targ.buddyTouch(targ, me, new TouchInfo { flags = 0, strength = 1 }); });
				if (e.health <= 0) {
					e.remove();
					return;}}};}
	void doCopHelicopter( v3 pos ) {
		new ent(gameSys) {
			sprite = buildingSet.cows[rd.i(0,2)], pos = new v3( pos.x, pos.y, .9f), flipped=rd.Test(.5f), name="copHelicopterMaker", inGrid=true, health=60*6*1,scale=0f,
			update = e => {
				if (e.health > 30) {
					var cycle = e.health % (60 * 1);
					if (cycle == 0) { makeCopHelicopter(pos); }}
				e.health--;
				if (e.health <= 0) {
					e.remove();
					return;}}};}

	// _________________

	void makePills(v3 pos, int side) {
		new ent(gameSys) {
			sprite = buildingSet.cannonClouds[rd.i(0,4)], pos = new v3( pos.x+rd.f(-.5f,.5f), pos.y + rd.f(-.5f, .5f), .8f + rd.f(-.05f, .05f)), flipped=rd.Test(.5f), name="cowstink", inGrid=true, scale=.7f,
			update = e => {
				e.scale *= .9f;
				if (e.scale <= 0.01) {
					e.remove();
					return;}}};
		var vel = rd.f(.1f, .2f ); var spin = rd.f(-6,6); var firstBounce = true; var xvel = -side*.08f; var numBounces = 0; var id = rd.i(0, 10);
		new ent(gameSys) {
			sprite = buildingSet.pills, pos = new v3( pos.x+ rd.f(1), pos.y+rd.f(.5f), rd.f(.5f)), scale = .1f, flipped=rd.Test(.5f), name="broccoli", inGrid=true, 
			update = e => {
				e.pos += new v3( xvel,vel, 0);
				vel -= .005f;
				e.ang += spin;
				e.removeIfOffScreen();
				if( e.pos.y < -5f && vel < 0 ) {
					numBounces++;
					if( firstBounce ) { firstBounce = false; xvel = rd.f(.1f); }
					vel *= -.4f;
					if( numBounces > 3 ) { e.remove(); } } }};}
	void doPills( v3 pos, int side ) {
		new ent(gameSys) {
			sprite = buildingSet.cannon, pos = new v3( pos.x, pos.y, .9f), flipped= (side > 0 ) ? true:false, name="pillSpewer", inGrid=true, health=60*4,scale=0f, 
			update = e => {
				if (e.health < 60 * 3 && e.health > 60) {
					var cycle = e.health % 8;
					if (cycle == 0) { e.ang = 0; makePills(e.pos, -side ); }}
				e.health--;
				if (e.health < 0) {
					e.remove();
					return;}}};}
	void doFairyMD( v3 pos, ent targ ) {
		var vel = 0f; var tick = 0f; 
		var angAnim = new DualWave(12, .025f);
		new ent(gameSys) {
			sprite = buildingSet.fairy, pos = new v3( pos.x+ rd.f(1), 1f+pos.y+rd.f(.5f), rd.f(.5f)), scale = 0, flipped=rd.Test(.5f), name="treatBlimp", inGrid=true, health=1,
			update = e => {
				e.health++;
				var cycle = e.health % (60 * 3);
				e.color = new Color(1, 1, 1, .5f + .5f * (float)Math.Cos(cycle/180f*Math.PI*2));
				if ( cycle == 0) {
					var dif = targ.pos - e.pos;
					if( dif.magnitude < 2) { targ.onHurt(targ, e, new TouchInfo { flags = 0, damage = -1, showDamage = true }); }
					for( var k = 0; k < 7; k++) {
						new ent(gameSys) {
							sprite = buildingSet.sparkle[rd.i(0, 8)], pos = new v3( e.pos.x+rd.f(-.75f,.75f), e.pos.y + rd.f(-.75f, .75f), .8f + rd.f(-.05f, .05f)), flipped=rd.Test(.5f), name="helicopterExplode", scale=.5f, 
							update = e2 => { e2.scale *= .9f; if (e2.scale <= 0.01) { e2.remove(); return;}}};}}
				e.removeIfOffScreen();
				e.scale = e.scale * .9f + .1f * .2f;
				e.ang = angAnim.Val(tick*10);
				tick += .01f;
				vel = vel * .99f + .01f * .006f;
				e.pos += new v3( 0,vel, 0);}};}

	// _________________

	void makeRocket(v3 pos, ent targ) {
		var turnSpd = .96f;
		new ent(gameSys) {
			sprite = buildingSet.rocket, pos = new v3( pos.x, pos.y, .8f), flipped=false, name="rocket", inGrid=true, scale=.3f, health=60*7, vel= new v3(0, .035f, 0),
			update = e => {
				turnSpd += .0001f;
				if (turnSpd > 1) turnSpd = 1;
				e.health--;
				var dif = targ.pos - e.pos;
				e.vel = e.vel * turnSpd + (1-turnSpd) * dif.normalized * .235f;
				e.ang = (float)((Math.Atan2(e.vel.y, e.vel.x)+3*Math.PI/2) * 360f / Math.PI / 2);
				e.pos += e.vel;
				e.removeIfOffScreen();
				if (e.health <= 0) {
					e.remove();
					return;}},
			playerTouch = (e, user, info) => {
				user.onHurt(user, e, new TouchInfo { flags = 0, damage = 1, showDamage = true });
				for ( var k = 0; k < 15; k++) {
					new ent(gameSys) {
						sprite = buildingSet.cannonClouds[rd.i(0,4)], pos = new v3( e.pos.x+rd.f(-1.5f,1.5f), 1 + e.pos.y + rd.f(-1.5f, 1.5f), .8f + rd.f(-.05f, .05f)), flipped=rd.Test(.5f), name="rocketExplode", scale=.7f,
						update = e2 => { e2.scale *= .9f; if (e2.scale <= 0.01) { e2.remove(); return;}}};}
				e.remove();}};}
	void doItemRocket( v3 pos, ent targ ) {
		new ent(gameSys) {
			sprite = buildingSet.cows[rd.i(0,2)], pos = new v3( pos.x, pos.y, .9f), flipped=rd.Test(.5f), name="rocketMaker", inGrid=true, health=60*12,scale=0f,
			update = e => {
				if (e.health > 30) {
					var cycle = e.health % (60 * 1);
					if (cycle == 0) { makeRocket(pos, targ); }}
				e.health--;
				if (e.health <= 0) {
					e.remove();
					return;}}};}
	void doItemBomb( v3 pos, int side, ent targ) {
		var vel = .35f; var spin = rd.f(-6,6); var xvel = -side*rd.f(.09f, .11f);
		new ent(gameSys) {
			sprite = buildingSet.bomb, pos = new v3(pos.x + rd.f(1), pos.y + rd.f(.5f), rd.f(.5f)), scale = .3f, flipped = rd.Test(.5f), name = "bomb", health = 130,
			update = e => {
				e.health--;
				if(e.health <= 0) {
					var dif = targ.pos - e.pos;
					if (dif.magnitude < 3) { targ.onHurt(targ, e, new TouchInfo { flags = 0, damage = 5, showDamage = true }); }
					for ( var k = 0; k < 25; k++) {
						new ent(gameSys) {
							sprite = buildingSet.cannonClouds[rd.i(0,4)], pos = new v3( e.pos.x+rd.f(-2f,2f), 1 + e.pos.y + rd.f(-2f, 2f), .8f + rd.f(-.05f, .05f)), flipped=rd.Test(.5f), name="rocketExplode", scale=.7f,
							update = e2 => { e2.scale *= .9f; if (e2.scale <= 0.01) { e2.remove(); return;}}};}
					e.remove();
					return;}
				e.pos += new v3( xvel,vel, 0);
				vel -= .005f;
				e.ang += spin;
				e.removeIfOffScreen();}};}
	void doItemShield( v3 pos, ent targ) {
		var vel = 0f; var shake = 0f;var tick = 0f;
		var angAnim = new DualWave(12, .025f);
		new ent(gameSys) {
			sprite = buildingSet.blimp, pos = new v3( pos.x+ rd.f(1), 1f+pos.y+rd.f(.5f), rd.f(.5f)), scale = 0, flipped=rd.Test(.5f), name="treatBlimp", inGrid=true, health=3,
			update = e => {
				e.removeIfOffScreen();
				e.scale = e.scale * .9f + .1f * .4f;
				e.ang = rd.f(-20, 20) * shake + angAnim.Val(tick*10);
				tick += .01f;
				vel = vel * .99f + .01f * .01f;
				e.pos += new v3( 0,vel, 0);}};}
	void makeItemTennisBall(v3 pos, int side) {
		var vel = rd.f(.1f, .4f ); var spin = rd.f(-6,6); var firstBounce = true; var xvel = -side*rd.f(.15f,.4f); var numBounces = 0; var id = rd.i(0, 10);
		new ent(gameSys) {
			sprite = buildingSet.tennisBall, pos = new v3( pos.x+ rd.f(1), pos.y+rd.f(.5f), rd.f(.5f)), scale = .3f, flipped=rd.Test(.5f), name="tennisball", inGrid=true, health=0,
			update = e => {
				e.health++;
				e.pos += new v3( xvel,vel, 0);
				vel -= .005f;
				e.ang += spin;
				e.removeIfOffScreen();
				if( e.pos.y < -5f && vel < 0 ) {
					numBounces++;
					if( firstBounce ) { firstBounce = false; xvel = rd.f(.1f); }
					vel *= -.4f;
					if( numBounces > 3 ) { e.remove(); } } },
			playerTouch = (e, user, info) => {
				user.onHurt(user, e, new TouchInfo { flags = 0, damage = 1, showDamage = true });
				for ( var k = 0; k < 7; k++) {
					new ent(gameSys) {
						sprite = buildingSet.cannonClouds[rd.i(0,4)], pos = new v3( e.pos.x+rd.f(-1.5f,1.5f), 1 + e.pos.y + rd.f(-1.5f, 1.5f), .8f + rd.f(-.05f, .05f)), flipped=rd.Test(.5f), name="hammerHit", scale=.7f,
						update = e2 => { e2.scale *= .9f; if (e2.scale <= 0.01) { e2.remove(); return;}}};}
				e.remove();}};}
	void doItemTennisBall( v3 pos, int side ) {
		new ent(gameSys) {
			sprite = buildingSet.cannon, pos = new v3( pos.x, pos.y, .9f), flipped= (side > 0 ) ? true:false, name="tennisBallSpewer", inGrid=true, health=60*10,scale=0f, 
			update = e => {
				if (e.health > 60) {
					var cycle = e.health % 15;
					if (cycle == 0) { e.ang = 0; makeItemTennisBall(e.pos, -side ); }}
				e.health--;
				if (e.health < 0) {
					e.remove();
					return;}}};}
	void makeItemHammer(v3 pos, int side) {
		var vel = rd.f(.3f, .4f ); var spin = rd.f(-6,6); var firstBounce = true; var xvel = -side*rd.f(.01f,.2f); var numBounces = 0; var id = rd.i(0, 10);
		new ent(gameSys) {
			sprite = buildingSet.hammer, pos = new v3( pos.x+ rd.f(1), pos.y+rd.f(.5f), rd.f(.5f)), scale = .3f, flipped=rd.Test(.5f), name="hammer", inGrid=true, health=0,
			update = e => {
				e.health++;
				e.pos += new v3( xvel,vel, 0);
				vel -= .005f;
				e.ang += spin;
				e.removeIfOffScreen();
				if( e.pos.y < -5f && vel < 0 ) {
					numBounces++;
					if( firstBounce ) { firstBounce = false; xvel = rd.f(.1f); }
					vel *= -.4f;
					if( numBounces > 3 ) { e.remove(); } } },
			playerTouch = (e, user, info) => {
				user.onHurt(user, e, new TouchInfo { flags = 0, damage = 1, showDamage = true });
				for( var k = 0; k < 7; k++) {
					new ent(gameSys) {
						sprite = buildingSet.cannonClouds[rd.i(0,4)], pos = new v3( e.pos.x+rd.f(-1.5f,1.5f), 1 + e.pos.y + rd.f(-1.5f, 1.5f), .8f + rd.f(-.05f, .05f)), flipped=rd.Test(.5f), name="hammerHit", scale=.7f,
						update = e2 => { e2.scale *= .9f; if (e2.scale <= 0.01) { e2.remove(); return;}}};}
				e.remove();}};}
	void doItemHammer( v3 pos, int side ) {
		new ent(gameSys) {
			sprite = buildingSet.cannon, pos = new v3( pos.x, pos.y, .9f), flipped= (side > 0 ) ? true:false, name="hammerSpewer", inGrid=true, health=60*6,scale=0f, 
			update = e => {
				if (e.health > 60) {
					var cycle = e.health % 5;
					if (cycle == 0) { e.ang = 0; makeItemHammer(e.pos, -side ); }}
				e.health--;
				if (e.health < 0) {
					e.remove();
					return;}}};}
	void doItemScaryMask( v3 pos ) {
		new ent(gameSys) {
			sprite = buildingSet.scaryMask, pos = new v3( pos.x+ rd.f(1), 1f+pos.y+rd.f(.5f), rd.f(.5f)), scale = .4f, flipped=rd.Test(.5f), name="scaryMask", health=120,
			update = e => {
				e.health--;
				e.scale *= 1.03f;
				e.pos = e.pos + new v3(0, .01f, 0);
				e.color = new Color(1, 1, 1, e.health / 120f);
				if (e.health < 0) { e.remove(); return;} } };}

	public void DoBuilding( int id, int team, v3 pos) {
		switch (id) {
			case 0:
				doCow(pos, (team == 1) ? playerSys.player2Ent : playerSys.playerEnt);
				break;
			case 1:
				doBroccoliCannon(pos, (team == 1) ? -1 : 1);                                            //!!!
				break;
			case 2:
				doFish(pos, (team == 1) ? playerSys.player2Ent : playerSys.playerEnt);                    //!!!
				break;
			case 3:
				doTurtle(pos);                  //!!!
				break;
			case 4:
				doFlowerBarrage(pos, (team == 1) ? 1 : -1);
				break;
			case 5:
				doSun(pos);                   //!!!
				break;
			case 6:
				doDrunkPlane(pos, (team==1) ? playerSys.player2Ent: playerSys.playerEnt);
				break;
			case 7:
				doBlimp(pos);
				break;
			case 8:
				doCopHelicopter(pos);
				break;
			case 9:
				doCopCar(pos);                  //!!!
				break;
			case 10:
				doPills(pos, (team == 1) ? -1 : 1);					//!!!
				break;
			case 11:
				doFairyMD(pos, (team == 1) ? playerSys.playerEnt : playerSys.player2Ent);                 //!!!
				break;
		}
	}

	public void DoItem( int id, int team, v3 pos ) {
		switch (id) {
			case 0:
				doItemTennisBall(pos, (team == 1) ? 1 : -1);
				break;
			case 1:
				doItemBomb(pos, (team == 1) ? -1 : 1, (team == 1) ? playerSys.player2Ent : playerSys.playerEnt);
				break;
			case 2:
				doItemHammer(pos, (team == 1) ? 1 : -1);
				break;
			case 3:
				doItemScaryMask(pos);
				break;
			case 4:
				doItemRocket(pos, (team == 1) ? playerSys.player2Ent : playerSys.playerEnt);
				break;
			case 5:
				doItemShield(pos, (team == 1) ? playerSys.player2Ent : playerSys.playerEnt);                  //!!!
				break;
		}
	}

	v3[] Buildings() {

		v3[] lookPos = new v3[12];

		var bList = new Sprite[] { buildingSet.barn, buildingSet.pond, buildingSet.greenhouse, buildingSet.airport, buildingSet.policeStation, buildingSet.hospital };
		var scList = new float[] { .7f, 1, .6f, 1, 1, 1 };

		var src = new ent(gameSys) { name = "buildingSet" };
		for (var k = 0; k < 6; k++) {
			var zDist = 1f; var posx = -9.5f + 8.5f * (k / 6f);
			lookPos[k] = new v3(posx, -5f + rd.f(0, .2f), zDist);
			lookPos[12 - 1 - k] = new v3(-posx, -5f + rd.f(0, .2f), zDist);
			new ent(gameSys) { sprite = bList[k], pos = lookPos[k], scale = .4f * scList[k], name = "building", parent = src };
			new ent(gameSys) { sprite = bList[k], pos = lookPos[12 - 1 - k], scale = .4f * scList[k], name = "building", parent = src };}

		return lookPos;}
	public void GameUpdate( double roundTime ) {}
	void Flags() {
		var f1 = 7.8f;
		var f2 = 4.8f;

		var src = new ent(gameSys) { name="flagSet" };
		new ent(gameSys) { sprite = flag1, pos=new Vector3( -1.5f, -5f, -3f ), scale = .3f, name="flags", parent = src };
		new ent(gameSys) { sprite = flag1, pos=new Vector3( -1.5f, -5f, 3f ), scale = .3f, name="flags", parent = src };

		new ent(gameSys) { sprite = flag1, pos = new Vector3(-f1, -5f, -.4f), scale = .15f, name = "flags", parent = src };
		new ent(gameSys) { sprite = flag1, pos = new Vector3(-f1, -5f, 0f), scale = .15f, name = "flags", parent = src };
		new ent(gameSys) { sprite = flag1, pos = new Vector3(-f1, -5f, .4f), scale = .15f, name = "flags", parent = src };

		new ent(gameSys) { sprite = flag1, pos = new Vector3(-f2, -5f, -.4f), scale = .15f, name = "flags", parent = src };
		new ent(gameSys) { sprite = flag1, pos = new Vector3(-f2, -5f, 0f), scale = .15f, name = "flags", parent = src };
		new ent(gameSys) { sprite = flag1, pos = new Vector3(-f2, -5f, .4f), scale = .15f, name = "flags", parent = src };

		new ent(gameSys) { sprite = flag2, pos=new Vector3( 1.5f, -5f, -3f ), scale = .3f, name="flags", parent = src };
		new ent(gameSys) { sprite = flag2, pos=new Vector3( 1.5f, -5f, 3f ), scale = .3f, name="flags", parent = src };

		new ent(gameSys) { sprite = flag2, pos = new Vector3(f1, -5f, -.4f), scale = .15f, name = "flags", parent = src };
		new ent(gameSys) { sprite = flag2, pos = new Vector3(f1, -5f, 0f), scale = .15f, name = "flags", parent = src };
		new ent(gameSys) { sprite = flag2, pos = new Vector3(f1, -5f, .4f), scale = .15f, name = "flags", parent = src };

		new ent(gameSys) { sprite = flag2, pos = new Vector3(f2, -5f, -.4f), scale = .15f, name = "flags", parent = src };
		new ent(gameSys) { sprite = flag2, pos = new Vector3(f2, -5f, 0f), scale = .15f, name = "flags", parent = src };
		new ent(gameSys) { sprite = flag2, pos = new Vector3(f2, -5f, .4f), scale = .15f, name = "flags", parent = src };

	}
}