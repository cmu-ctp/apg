using System; using UnityEngine; using System.Collections.Generic; using v3 = UnityEngine.Vector3; using APG;

public class Items{
    PlayerSys playerSys;

    public Items( PlayerSys thePlayerSys){
        playerSys = thePlayerSys;}

    void checkColor( ent e,float alpha=1f ){
        if (((int)FullGame.tick) % 10 == 0) e.color = new Color(0, 0, 0, alpha);
        else if (((int)FullGame.tick) % 10 == 2) e.color = new Color(1, 1, 1, alpha);}

    void makeRocket(v3 pos, ent targ) {
		var turnSpd = .96f;
		new ent() {
			sprite = Art.Players.itemsFull.rocket2.spr, pos = new v3( pos.x, pos.y, .8f), flipped=false, name="rocket", inGrid=true, scale=.3f, health=60*7, vel= new v3(0, .035f, 0),
			update = e => {
                checkColor(e);
				turnSpd += .0001f;
				if (turnSpd > 1) turnSpd = 1;
				e.health--;
				var dif = targ.pos - e.pos;
				e.vel = e.vel * turnSpd + (1-turnSpd) * dif.normalized * .235f;
				e.ang = (float)((Math.Atan2(e.vel.y, e.vel.x)+3*Math.PI/2) * 360f / Math.PI / 2);
				e.pos += e.vel;
				e.removeIfOffScreen();
				if (e.health <= 0) { e.remove();return;}},
			playerTouch = (e, user, info) => {
				user.onHurt(user, e, new TouchInfo { flags = 0, damage = 1, showDamage = true });
				for ( var k = 0; k < 15; k++) {
					new ent() {
						sprite = Art.Props.Clouds.rand(), pos = new v3( e.pos.x+rd.f(-1.5f,1.5f), 1 + e.pos.y + rd.f(-1.5f, 1.5f), .8f + rd.f(-.05f, .05f)), flipped=rd.Test(.5f), name="rocketExplode", scale=.7f,
						update = e2 => { e2.scale *= .9f; if (e2.scale <= 0.01) { e2.remove(); return;}}};}
				e.remove();}};}
	void doItemRocket( v3 pos, ent targ ) {
		new ent() {
			sprite = Art.Buildings.Cows.rand(), pos = new v3( pos.x, pos.y, .9f), flipped=rd.Test(.5f), name="rocketMaker", inGrid=true, health=60*12,scale=0f,
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
		new ent() {
			sprite = Art.Players.itemsFull.bomb.spr, pos = new v3(pos.x + rd.f(1), pos.y + rd.f(.5f), rd.f(.5f)), scale = .3f, flipped = rd.Test(.5f), name = "bomb", health = 130,
			update = e => {
				e.health--;
				if(e.health <= 0) {
					var dif = targ.pos - e.pos;
					if (dif.magnitude < 3) { targ.onHurt(targ, e, new TouchInfo { flags = 0, damage = 5, showDamage = true }); }
					for ( var k = 0; k < 25; k++) {
						new ent() {
							sprite = Art.Props.Clouds.rand(), pos = new v3( e.pos.x+rd.f(-2f,2f), 1 + e.pos.y + rd.f(-2f, 2f), .8f + rd.f(-.05f, .05f)), flipped=rd.Test(.5f), name="rocketExplode", scale=.7f,
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
		new ent() {
			sprite = Art.Buildings.blimp.spr, pos = new v3( pos.x+ rd.f(1), 1f+pos.y+rd.f(.5f), rd.f(.5f)), scale = 0, flipped=rd.Test(.5f), name="treatBlimp", inGrid=true, health=3,
			update = e => {
				e.removeIfOffScreen();
				e.scale = e.scale * .9f + .1f * .4f;
				e.ang = rd.f(-20, 20) * shake + angAnim.Val(tick*10);
				tick += .01f;
				vel = vel * .99f + .01f * .01f;
				e.pos += new v3( 0,vel, 0);}};}
	void makeItemTennisBall(v3 pos, int side) {
		var vel = rd.f(.1f, .4f ); var spin = rd.f(-6,6); var firstBounce = true; var xvel = -side*rd.f(.15f,.4f); var numBounces = 0; var id = rd.i(0, 10);
		new ent() {
			sprite = Art.Players.itemsFull.tennisball.spr, pos = new v3( pos.x+ rd.f(1), pos.y+rd.f(.5f), rd.f(.5f)), scale = .3f, flipped=rd.Test(.5f), name="tennisball", inGrid=true, health=0,
			update = e => {
                checkColor(e);
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
					new ent() {
						sprite = Art.Props.Clouds.rand(), pos = new v3( e.pos.x+rd.f(-1.5f,1.5f), 1 + e.pos.y + rd.f(-1.5f, 1.5f), .8f + rd.f(-.05f, .05f)), flipped=rd.Test(.5f), name="hammerHit", scale=.7f,
						update = e2 => { e2.scale *= .9f; if (e2.scale <= 0.01) { e2.remove(); return;}}};}
				e.remove();}};}
	void doItemTennisBall( v3 pos, int side ) {
		new ent() {
			sprite = Art.Buildings.cannon.spr, pos = new v3( pos.x, pos.y, .9f), flipped= (side > 0 ) ? true:false, name="tennisBallSpewer", inGrid=true, health=60*10,scale=0f, 
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
		new ent() {
			sprite = Art.Players.itemsFull.hammer2.spr, pos = new v3( pos.x+ rd.f(1), pos.y+rd.f(.5f), rd.f(.5f)), scale = .3f, flipped=rd.Test(.5f), name="hammer", inGrid=true, health=0,
			update = e => {
                checkColor(e);
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
					new ent() {
						sprite = Art.Props.Clouds.rand(), pos = new v3( e.pos.x+rd.f(-1.5f,1.5f), 1 + e.pos.y + rd.f(-1.5f, 1.5f), .8f + rd.f(-.05f, .05f)), flipped=rd.Test(.5f), name="hammerHit", scale=.7f,
						update = e2 => { e2.scale *= .9f; if (e2.scale <= 0.01) { e2.remove(); return;}}};}
				e.remove();}};}
	void doItemHammer( v3 pos, int side ) {
		new ent() {
			sprite = Art.Buildings.cannon.spr, pos = new v3( pos.x, pos.y, .9f), flipped= (side > 0 ) ? true:false, name="hammerSpewer", inGrid=true, health=60*6,scale=0f, 
			update = e => {
				if (e.health > 60) {
					var cycle = e.health % 5;
					if (cycle == 0) { e.ang = 0; makeItemHammer(e.pos, -side ); }}
				e.health--;
				if (e.health < 0) {
					e.remove();
					return;}}};}
	void doItemScaryMask( v3 pos ) {
		new ent() {
			sprite = Art.Players.itemsFull.scarymask.spr, pos = new v3( pos.x+ rd.f(1), 1f+pos.y+rd.f(.5f), rd.f(.5f)), scale = .4f, flipped=rd.Test(.5f), name="scaryMask", health=120,
			update = e => {
				e.health--;
				e.scale *= 1.03f;
				e.pos = e.pos + new v3(0, .01f, 0);
				e.color = new Color(1, 1, 1, e.health / 120f);
				if (e.health < 0) { e.remove(); return;} } };}

	public void DoItem( ItemId id, int team, v3 pos ) {
		switch (id) {
			case ItemId.TennisBall: doItemTennisBall(pos, (team == 1) ? 1 : -1); break;
			case ItemId.Bomb: doItemBomb(pos, (team == 1) ? -1 : 1, (team == 1) ? playerSys.player2Ent : playerSys.playerEnt); break;
			case ItemId.Hammer: doItemHammer(pos, (team == 1) ? 1 : -1); break;
			case ItemId.ScaryMask: doItemScaryMask(pos); break;
			case ItemId.Rocket: doItemRocket(pos, (team == 1) ? playerSys.player2Ent : playerSys.playerEnt); break;
			case ItemId.Shield: doItemShield(pos, (team == 1) ? playerSys.player2Ent : playerSys.playerEnt);/*!!!*/ break;}}}