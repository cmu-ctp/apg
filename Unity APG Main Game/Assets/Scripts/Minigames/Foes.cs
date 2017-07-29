using UnityEngine;
using v3 = UnityEngine.Vector3;

// turn beard guy into treat
// powerup shots with bouncing

// microwave - bowls. or cups.
// Mustache guy - hats.
// plants - knives and spoons - move horizontally, dropping stuff on a timer.
// trash guy - random stuff.
// cloud boss - socks + shoes

// Mechanics I want for action phase:
// Timed bomb thing.  Counts down, then shots out attacks when timer is over.  Can be blown around.
// Merging guys - when they connect, attack.  So players have to push them around.
// Neutral guys who can be killed by attacks, producing treats.  Possibly either 1) blown around or 2) pushed around or 3) rubber band pushed.
// Mirror guys - react to player input
// Hard to get guys - dodge player, but drop stuff if player touches them

// Mechanics I want for audience phase:


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
	TreatSys treatSys;
	AudiencePlayerSys audiencePlayerSys;
	public SpawnEntry beardGuy, plantGuy, trashGuy, microwaveGuy, mustacheGuy, chaserGuy, nervousTouchGuy, smallChaserGuy, badRainGuy, eyebeamGuy, leaperGuy, overeatGuy, keydoorGuy, absentmindedGuy,chefGuy;
	public FoeSys(Foes theFoes, GameSys theGameSys, PlayerSys thePlayerSys, AudiencePlayerSys theAudiencePlayerSys, TreatSys theTreatSys ) {
		playerSys = thePlayerSys;
		audiencePlayerSys = theAudiencePlayerSys;
		treatSys = theTreatSys;
		foes = theFoes;
		gameSys = theGameSys;

		beardGuy= new SpawnEntry { icon = foes.beardguy, spawn = () => BeardyGuy(),scale=.7f, message="Deus Peduleus and Calceus Prime Approach!" };
		plantGuy= new SpawnEntry { icon = foes.plantguy, spawn = () => PlantGuy(), scale=2f, message="A Squadron of Utensil Vines Looms!" };
		trashGuy= new SpawnEntry { icon = foes.foeTrash, spawn = () => TrashGuy() };
		microwaveGuy= new SpawnEntry { icon = foes.foeMicrowave, spawn = () => MicrowaveGuy() };
		mustacheGuy= new SpawnEntry { icon = foes.foeMustache, spawn = () => MustacheGuy() };

		chaserGuy = new SpawnEntry { icon = foes.beardguy, spawn = () => Chaser(), scale = .7f, message = "" };
		nervousTouchGuy = new SpawnEntry { icon = foes.beardguy, spawn = () => NervousTouch(), scale = .7f, message = "" };
		smallChaserGuy = new SpawnEntry { icon = foes.beardguy, spawn = () => SmallChaser(), scale = .7f, message = "" };
		badRainGuy = new SpawnEntry { icon = foes.beardguy, spawn = () => BadRain(), scale = .7f, message = "" };
		eyebeamGuy = new SpawnEntry { icon = foes.beardguy, spawn = () => Eyebeam(), scale = .7f, message = "" };
		leaperGuy = new SpawnEntry { icon = foes.beardguy, spawn = () => Leaper(), scale = .7f, message = "" };
		overeatGuy = new SpawnEntry { icon = foes.beardguy, spawn = () => Overeat(), scale = .7f, message = "" };
		keydoorGuy = new SpawnEntry { icon = foes.beardguy, spawn = () => KeyDoor(), scale = .7f, message = "" };
		absentmindedGuy = new SpawnEntry { icon = foes.beardguy, spawn = () => AbsentMinded(), scale = .7f, message = "" };
		chefGuy = new SpawnEntry { icon = foes.beardguy, spawn = () => Chef(), scale = .7f, message = "" };

		foeEntPool = new FixedEntPool( gameSys, foeEntPoolSize, "foes", true );
		shotEntPool = new FixedEntPool( gameSys, shotEntPoolSize, "shots", true );
	}

	bool TryLeave( ent e, float startTime, ref v3 goal, v3 leaveTarget ) {
		if (tick - startTime > 60 * 30 || gameSys.gameOver) {
			goal = leaveTarget;
			goal.y = 50;
			e.pos = e.pos * .99f + .01f * goal;
			if (e.pos.y > 45) { e.remove(); return true; }
			return true;}
		return false;}
	ent NearPlayer( ent e ) {
		var dif1 = playerSys.playerEnt.pos - e.pos;
		var dif2 = playerSys.player2Ent.pos - e.pos;
		return (dif1.magnitude < dif2.magnitude) ? playerSys.playerEnt : playerSys.player2Ent;
	}
	ent FarPlayer(ent e) {
		var dif1 = playerSys.playerEnt.pos - e.pos;
		var dif2 = playerSys.player2Ent.pos - e.pos;
		return (dif1.magnitude < dif2.magnitude) ? playerSys.playerEnt : playerSys.player2Ent;
	}

	struct foeInfo {
		public v3 goal, slide; public bool doShoot, inBack, fading; public DualWave angAnim; public Sprite[] sprites;
		public float startTime, horizontal, vertOffset, zDepth, tickOffset, lastNoiseTime, shakeAmount, shootDelay, delay, horizontalDir, grav;

		public void baseInit( float tick ) {
			startTime = tick; goal = new v3(0, 4, 30); horizontal = rd.f(15); vertOffset = rd.f(2, 6); zDepth = rd.f(20, 50); tickOffset = rd.f(0, 500); doShoot = true; angAnim = new DualWave(12, .025f); fading = false; grav = 0;
		}
	}

	void React(v3 pos, Sprite msg) {
		var delay = 30;
		new ent(gameSys) { sprite = msg, pos = pos, scale = 1, update = e => { delay--; if(delay <= 0) e.remove(); } };}

	public void MakeShot(v3 pos, int j, ent src, Sprite[] sprites, float baseYVel = 0, bool ignorePlayer = false ) {
		if(gameSys.gameOver)return;
		var offset = rd.Ang(); var rotateSpeed = rd.f(.02f, .04f) * 80; var strength = 1; var lastHit = 0f; var bounceNum = 0; 
		var isPlayerAttack = false;
		new PoolEnt(shotEntPool) {
			sprite = rd.Sprite(sprites), pos = pos, scale = rd.f(.3f, .4f)*1.5f, name = "shot", inGrid=true, vel=new v3(j * .05f, -.04f + baseYVel, 0), shadow=gameSys.Shadow(foes.shadow, shotEntPool, 1, 1, 0 ),
			update = e => {
				if( gameSys.gameOver ) { e.remove(); return; }
				e.ang = tick * rotateSpeed + offset;
				e.vel.y -= .0008f;
				e.MoveBy(e.vel);
				if( e.pos.y < -5f && e.vel.y < 0 ) { e.vel.y *= -.6f; if( Mathf.Abs(e.vel.y )< .001f )e.remove(); }
				gameSys.grid.Find(e.pos - nm.v3y( .7f ), 1, e, (me, targ) => { targ.shotTouch(targ, me, new TouchInfo { isPlayer=isPlayerAttack });});
				e.removeIfOffScreen();},
			playerTouch = (e, user, info) => {
				if (ignorePlayer)return;
				if(tick - lastHit < 30) return;
					lastHit = tick;
					gameSys.Sound(foes.bumpSound, 1);
					React(e.pos + new v3(0, 0, -.2f), foes.thudMsg);
					strength++;
					e.vel.y *= -1f;
					if( e.vel.y < .1f )e.vel.y = .1f;
					e.vel.x = user.vel.x*.025f;
					if(bounceNum < 3) { bounceNum++; rotateSpeed*=2;} },
			buddyTouch = (e, user, info) => { user.onHurt(user, e, 1); e.remove(); },
			breathTouch = (e, user, info) => { isPlayerAttack = true; e.vel *= .3f; e.vel += user.vel * .05f; e.color = new Color(1.5f, 1.3f, .8f, .8f); }};}

	v3 SeekTarg( v3 pos, v3 src, float dist) {
		return ((pos - src).magnitude > dist) ? pos : src;
	}

	// bring keys to door to open door and make stuff come out.  Blow door around.
	void KeyDoor() {
		var i = new foeInfo();
		i.startTime = tick; i.goal = new v3(0, 4, 30); i.angAnim = new DualWave(4, .025f); i.shakeAmount = 0f; i.shootDelay = 0; i.sprites = foes.shoes; i.slide = new v3(0, 0, 0);
		new PoolEnt(foeEntPool) {
			sprite = foes.foeTrash, pos = new v3(rd.f(40), rd.f(-4, -7), rd.f(80, 100)), scale = 1f, name = "chaser1", inGrid = true, shadow = gameSys.Shadow(foes.shadow, foeEntPool, 3, 1, 0),
			update = e => {
				i.shootDelay--;
				if (TryLeave(e, i.startTime, ref i.goal, playerSys.playerEnt.pos + nm.v3z(.3f))) return;
				i.goal = SeekTarg(NearPlayer(e).pos, e.pos, 1);
				i.slide *= .9f;
				e.pos = e.pos * .99f + .01f * i.goal + i.slide;
				e.ang = i.angAnim.Val(tick) + rd.f(-i.shakeAmount, i.shakeAmount);
				nm.ease(ref i.shakeAmount, 0f, .05f);},
			shotTouch = (e, user, info) => {},
			breathTouch = (e, user, info) => {
				if (e.pos.z > 5) return;
				if(info.strength == 3) {
					i.slide += user.vel * .3f;
					if (i.shootDelay > 0) return;
					i.shootDelay = 90;
					gameSys.Sound(foes.guyThrowSound, 1);
					for (var j = -1; j < 2; j++) { MakeShot(new v3(e.pos.x, e.pos.y, playerSys.playerEnt.pos.z), j, e, i.sprites); }}
				else i.slide += user.vel*.3f;}};}


	// Blow falling food into eaters until they pop.  Push eaters around.
	void Overeat() {
		var i = new foeInfo();
		i.startTime = tick; i.goal = new v3(0, 4, 30); i.angAnim = new DualWave(4, .025f); i.shakeAmount = 0f; i.shootDelay = 0; i.sprites = foes.shoes; i.slide = new v3(0, 0, 0);
		new PoolEnt(foeEntPool) {
			sprite = foes.foeTrash, pos = new v3(rd.f(40), rd.f(-4, -7), rd.f(80, 100)), scale = 1f, name = "chaser1", inGrid = true, shadow = gameSys.Shadow(foes.shadow, foeEntPool, 3, 1, 0),
			update = e => {
				i.shootDelay--;
				if (TryLeave(e, i.startTime, ref i.goal, playerSys.playerEnt.pos + nm.v3z(.3f))) return;
				i.goal = SeekTarg(NearPlayer(e).pos, e.pos, 1);
				i.slide *= .9f;
				e.pos = e.pos * .99f + .01f * i.goal + i.slide;
				e.ang = i.angAnim.Val(tick) + rd.f(-i.shakeAmount, i.shakeAmount);
				nm.ease(ref i.shakeAmount, 0f, .05f);},
			shotTouch = (e, user, info) => {},
			breathTouch = (e, user, info) => {
				if (e.pos.z > 5) return;
				if(info.strength == 3) {
					i.slide += user.vel * .3f;
					if (i.shootDelay > 0) return;
					i.shootDelay = 90;
					gameSys.Sound(foes.guyThrowSound, 1);
					for (var j = -1; j < 2; j++) { MakeShot(new v3(e.pos.x, e.pos.y, playerSys.playerEnt.pos.z), j, e, i.sprites); }}
				else i.slide += user.vel*.3f;}};}


	//  Hop back and forth, dropping hurty things. - Guy who hops over screen, dropping attacks.
	void Leaper() {
		var i = new foeInfo();
		i.startTime = tick; i.goal = new v3(0, 4, 30); i.angAnim = new DualWave(4, .025f); i.shakeAmount = 0f; i.shootDelay = 0; i.sprites = foes.shoes; i.slide = new v3(0, 0, 0);
		new PoolEnt(foeEntPool) {
			sprite = foes.foeTrash, pos = new v3(rd.f(40), rd.f(-4, -7), rd.f(80, 100)), scale = 1f, name = "chaser1", inGrid = true, shadow = gameSys.Shadow(foes.shadow, foeEntPool, 3, 1, 0),
			update = e => {
				i.shootDelay--;
				if (TryLeave(e, i.startTime, ref i.goal, playerSys.playerEnt.pos + nm.v3z(.3f))) return;
				i.goal = SeekTarg(NearPlayer(e).pos, e.pos, 1);
				i.slide *= .9f;
				e.pos = e.pos * .99f + .01f * i.goal + i.slide;
				e.ang = i.angAnim.Val(tick) + rd.f(-i.shakeAmount, i.shakeAmount);
				nm.ease(ref i.shakeAmount, 0f, .05f);},
			shotTouch = (e, user, info) => {},
			breathTouch = (e, user, info) => {
				if (e.pos.z > 5) return;
				if(info.strength == 3) {
					i.slide += user.vel * .3f;
					if (i.shootDelay > 0) return;
					i.shootDelay = 90;
					gameSys.Sound(foes.guyThrowSound, 1);
					for (var j = -1; j < 2; j++) { MakeShot(new v3(e.pos.x, e.pos.y, playerSys.playerEnt.pos.z), j, e, i.sprites); }}
				else i.slide += user.vel*.3f;}};}

	// Eye beam trigger thing - float in air and hurl attacks if player trips trigger
	void Eyebeam() {
		var i = new foeInfo();
		i.startTime = tick; i.goal = new v3(0, 4, 30); i.angAnim = new DualWave(4, .025f); i.shakeAmount = 0f; i.shootDelay = 0; i.sprites = foes.shoes; i.slide = new v3(0, 0, 0);
		new PoolEnt(foeEntPool) {
			sprite = foes.foeTrash, pos = new v3(rd.f(40), rd.f(-4, -7), rd.f(80, 100)), scale = 1f, name = "chaser1", inGrid = true, shadow = gameSys.Shadow(foes.shadow, foeEntPool, 3, 1, 0),
			update = e => {
				i.shootDelay--;
				if (TryLeave(e, i.startTime, ref i.goal, playerSys.playerEnt.pos + nm.v3z(.3f))) return;
				i.goal = SeekTarg(NearPlayer(e).pos, e.pos, 1);
				i.slide *= .9f;
				e.pos = e.pos * .99f + .01f * i.goal + i.slide;
				e.ang = i.angAnim.Val(tick) + rd.f(-i.shakeAmount, i.shakeAmount);
				nm.ease(ref i.shakeAmount, 0f, .05f);},
			shotTouch = (e, user, info) => {},
			breathTouch = (e, user, info) => {
				if (e.pos.z > 5) return;
				if(info.strength == 3) {
					i.slide += user.vel * .3f;
					if (i.shootDelay > 0) return;
					i.shootDelay = 90;
					gameSys.Sound(foes.guyThrowSound, 1);
					for (var j = -1; j < 2; j++) { MakeShot(new v3(e.pos.x, e.pos.y, playerSys.playerEnt.pos.z), j, e, i.sprites); }}
				else i.slide += user.vel*.3f;}};}


	// Dog // Guy who chases player.  Drops attacking items when hit by a big breathe
	void Chaser() {
		var i = new foeInfo();
		i.startTime = tick; i.goal = new v3(0, 4, 30); i.angAnim = new DualWave(4, .025f); i.shakeAmount = 0f; i.shootDelay = 0; i.sprites = foes.shoes; i.slide = new v3(0, 0, 0);
		new PoolEnt(foeEntPool) {
			sprite = foes.foeTrash, pos = new v3(rd.f(40), rd.f(-4, -7), rd.f(80, 100)), scale = 1f, name = "chaser1", inGrid = true, shadow = gameSys.Shadow(foes.shadow, foeEntPool, 3, 1, 0),
			update = e => {
				i.shootDelay--;
				if (TryLeave(e, i.startTime, ref i.goal, playerSys.playerEnt.pos + nm.v3z(.3f))) return;
				i.goal = SeekTarg(NearPlayer(e).pos, e.pos, 1);
				i.slide *= .9f;
				e.pos = e.pos * .99f + .01f * i.goal + i.slide;
				e.ang = i.angAnim.Val(tick) + rd.f(-i.shakeAmount, i.shakeAmount);
				nm.ease(ref i.shakeAmount, 0f, .05f);},
			shotTouch = (e, user, info) => {},
			breathTouch = (e, user, info) => {
				if (e.pos.z > 5) return;
				if(info.strength == 3) {
					i.slide += user.vel * .3f;
					if (i.shootDelay > 0) return;
					i.shootDelay = 90;
					gameSys.Sound(foes.guyThrowSound, 1);
					for (var j = -1; j < 2; j++) { MakeShot(new v3(e.pos.x, e.pos.y, playerSys.playerEnt.pos.z), j, e, i.sprites); }}
				else i.slide += user.vel*.3f;}};}

	// 
	void SmallChaser() {
		for( var k = 0; k < 30; k++) { 
			var i = new foeInfo();
			i.startTime = tick; i.goal = new v3(0, 4, 30); i.angAnim = new DualWave(4, .025f); i.shakeAmount = 0f; i.shootDelay = 0; i.sprites = foes.shoes; i.slide = new v3(0, 0, 0);
			new PoolEnt(foeEntPool) {
				sprite = foes.foeTrash, pos = new v3(rd.f(40), rd.f(-4, -7), rd.f(80, 100)), scale = 1f, name = "chaser1", inGrid = true, shadow = gameSys.Shadow(foes.shadow, foeEntPool, 3, 1, 0),
				update = e => {
					i.shootDelay--;
					if (TryLeave(e, i.startTime, ref i.goal, playerSys.playerEnt.pos + nm.v3z(.3f))) return;
					i.goal = SeekTarg(NearPlayer(e).pos, e.pos, 1);
					i.slide *= .9f;
					e.pos = e.pos * .99f + .01f * i.goal + i.slide;
					e.ang = i.angAnim.Val(tick) + rd.f(-i.shakeAmount, i.shakeAmount);
					nm.ease(ref i.shakeAmount, 0f, .05f);},
				shotTouch = (e, user, info) => {},
				breathTouch = (e, user, info) => {
					if (e.pos.z > 5) return;
					if(info.strength == 3) {
						i.slide += user.vel * .3f;
						if (i.shootDelay > 0) return;
						i.shootDelay = 90;
						gameSys.Sound(foes.guyThrowSound, 1);
						for (var j = -1; j < 2; j++) { MakeShot(new v3(e.pos.x, e.pos.y, playerSys.playerEnt.pos.z), j, e, i.sprites); }}
					else i.slide += user.vel*.3f;}};}}


	// Guy who makes attacks when he collides with ... something.  Flees from players.  Can be blown.
	void NervousTouch() {
		for( var k = 0; k< 5; k++) { 
			var i = new foeInfo();
			i.startTime = tick; i.goal = new v3(rd.f(-4, 4), rd.f(2, 5), 30); i.angAnim = new DualWave(4, .025f); i.shakeAmount = 0f; i.shootDelay = 0; i.sprites = foes.shoes; i.slide = new v3(0, 0, 0); i.delay = k * 5*60+240;
			new PoolEnt(foeEntPool) {
				sprite = foes.foeMustache, pos = new v3(i.goal.x, i.goal.y, rd.f(80, 100)), scale = .3f, name = "nervous", inGrid = true, shadow = gameSys.Shadow(foes.shadow, foeEntPool, 3, 1, 0),
				update = e => {
					i.shootDelay--;
					if (TryLeave(e, i.startTime, ref i.goal, playerSys.playerEnt.pos + nm.v3z(.3f))) return;
					i.delay--;
					if (i.delay > 0) return;
					var moveDir = (e.pos - NearPlayer(e).pos);
					moveDir.z = 0;
					var len = moveDir.magnitude;
					v3 goal2;
					if (len < 6) {goal2 = e.pos + moveDir.normalized * (18f / len);}
					else {goal2 = e.pos;}
					goal2.z = 0;
					goal2.x = nm.Between(-8, goal2.x, 8);
					goal2.y = nm.Between(-5, goal2.y, 5);

					i.goal = i.goal * .9f + .1f * goal2;

					i.slide *= .9f;
					e.pos = e.pos * .99f + .01f * i.goal + i.slide;
					e.ang = i.angAnim.Val(tick) + rd.f(-i.shakeAmount, i.shakeAmount);
					nm.ease(ref i.shakeAmount, 0f, .05f);},
				shotTouch = (e, user, info) => {},
				objTouch = (e, user, info) => {
					if (e.pos.z > 5) return;
					if ( user.name == "nervousExploder") {
						// these should be shots that the players can't stop.
						for (var j = -1; j < 2; j++) { MakeShot(new v3(e.pos.x, e.pos.y, playerSys.playerEnt.pos.z), j, e, i.sprites, 0, true); }
						user.remove();
						e.remove();}},
				breathTouch = (e, user, info) => {
					if (e.pos.z > 5) return;
					if(info.strength == 3) {
						i.slide += user.vel * .1f;
						if (i.shootDelay > 0) return;}
					else i.slide += user.vel*.1f;}};}
		for( var k = 0; k< 12; k++) { 
			var i = new foeInfo();
			i.startTime = tick; i.goal = new v3(rd.f(-12,12), -1, 30); i.angAnim = new DualWave(4, .025f); i.shakeAmount = 0f; i.shootDelay = 0; i.sprites = foes.shoes; i.slide = new v3(0, 0, 0); i.delay = k * .5f*60;
			new PoolEnt(foeEntPool) {
				sprite = foes.foeMustache, pos = new v3(i.goal.x, i.goal.y, rd.f(80, 100)), scale = .1f, name = "nervousExploder", inGrid = true, color= new Color(0,0,0,1), shadow = gameSys.Shadow(foes.shadow, foeEntPool, 3, 1, 0),
				update = e => {
					if (TryLeave(e, i.startTime, ref i.goal, playerSys.playerEnt.pos + nm.v3z(.3f))) return;
					i.delay--;
					if (i.delay > 0) return;
					i.goal.z = 0;
					i.slide *= .9f;
					i.goal += i.slide;
					e.pos = e.pos * .99f + .01f * i.goal;
					e.ang = i.angAnim.Val(tick) + rd.f(-i.shakeAmount, i.shakeAmount);
					nm.ease(ref i.shakeAmount, 0f, .05f);
					if (e.pos.z > 5) return;
					gameSys.grid.Find(e.pos - nm.v3y(.7f), 1, e, (me, targ) => { targ.objTouch(targ, me, new TouchInfo { }); });
				},
				shotTouch = (e, user, info) => {},
				breathTouch = (e, user, info) => {
					if (e.pos.z > 5) return;
					if(info.strength == 3) {i.slide += user.vel * .3f;}
					else i.slide += user.vel*.3f;}};}
	}

	// Guy who wanders around stupidly.  Gotta blow spikes at him.
	void AbsentMinded() {
		for( var k = 0; k< 5; k++) { 
			var i = new foeInfo();
			i.startTime = tick; i.goal = new v3(rd.f(-4, 4), rd.f(2, 5), 30); i.angAnim = new DualWave(4, .025f); i.shakeAmount = 0f; i.shootDelay = 0; i.sprites = foes.shoes; i.slide = new v3(0, 0, 0); i.delay = k * 5*60+240;
			new PoolEnt(foeEntPool) {
				sprite = foes.foeMustache, pos = new v3(i.goal.x, i.goal.y, rd.f(80, 100)), scale = .3f, name = "nervous", inGrid = true, shadow = gameSys.Shadow(foes.shadow, foeEntPool, 3, 1, 0),
				update = e => {
					i.shootDelay--;
					if (TryLeave(e, i.startTime, ref i.goal, playerSys.playerEnt.pos + nm.v3z(.3f))) return;
					i.delay--;
					if (i.delay > 0) return;
					var moveDir = (e.pos - NearPlayer(e).pos);
					moveDir.z = 0;
					var len = moveDir.magnitude;
					v3 goal2;
					{goal2 = e.pos;}
					goal2.z = 0;
					goal2.x = nm.Between(-8, goal2.x, 8);
					goal2.y = nm.Between(-5, goal2.y, 5);

					i.goal = i.goal * .9f + .1f * goal2;

					i.slide *= .9f;
					e.pos = e.pos * .99f + .01f * i.goal + i.slide;
					e.ang = i.angAnim.Val(tick) + rd.f(-i.shakeAmount, i.shakeAmount);
					nm.ease(ref i.shakeAmount, 0f, .05f);},
				shotTouch = (e, user, info) => {},
				objTouch = (e, user, info) => {
					if (e.pos.z > 5) return;
					if ( user.name == "absentExploder") {
						// these should be shots that the players can't stop.
						for (var j = -1; j < 2; j++) { MakeShot(new v3(e.pos.x, e.pos.y, playerSys.playerEnt.pos.z), j, e, i.sprites, 0, true); }
						user.remove();
						e.remove();}},
				breathTouch = (e, user, info) => {
					if (e.pos.z > 5) return;
					if(info.strength == 3) {
						i.slide += user.vel * .1f;
						if (i.shootDelay > 0) return;}
					else i.slide += user.vel*.1f;}};}
		for( var k = 0; k< 12; k++) { 
			var i = new foeInfo();
			i.startTime = tick; i.goal = new v3(rd.f(-12,12), -1, 30); i.angAnim = new DualWave(4, .025f); i.shakeAmount = 0f; i.shootDelay = 0; i.sprites = foes.shoes; i.slide = new v3(0, 0, 0); i.delay = k * .5f*60;
			new PoolEnt(foeEntPool) {
				sprite = foes.foeMustache, pos = new v3(i.goal.x, i.goal.y, rd.f(80, 100)), scale = .1f, name = "absentExploder", inGrid = true, color= new Color(0,0,0,1), shadow = gameSys.Shadow(foes.shadow, foeEntPool, 3, 1, 0),
				update = e => {
					if (TryLeave(e, i.startTime, ref i.goal, playerSys.playerEnt.pos + nm.v3z(.3f))) return;
					i.delay--;
					if (i.delay > 0) return;
					i.goal.z = 0;
					i.slide *= .9f;
					i.goal += i.slide;
					e.pos = e.pos * .99f + .01f * i.goal;
					e.ang = i.angAnim.Val(tick) + rd.f(-i.shakeAmount, i.shakeAmount);
					nm.ease(ref i.shakeAmount, 0f, .05f);
					if (e.pos.z > 5) return;
					gameSys.grid.Find(e.pos - nm.v3y(.7f), 1, e, (me, targ) => { targ.objTouch(targ, me, new TouchInfo { }); });
				},
				shotTouch = (e, user, info) => {},
				breathTouch = (e, user, info) => {
					if (e.pos.z > 5) return;
					if(info.strength == 3) {i.slide += user.vel * .3f;}
					else i.slide += user.vel*.3f;}};}}

	// Guy who wanders around stupidly.  Gotta blow spikes at him.
	void Chef() {
		for( var k = 0; k< 5; k++) { 
			var i = new foeInfo();
			i.startTime = tick; i.goal = new v3(rd.f(-4, 4), rd.f(2, 5), 30); i.angAnim = new DualWave(4, .025f); i.shakeAmount = 0f; i.shootDelay = 0; i.sprites = foes.shoes; i.slide = new v3(0, 0, 0); i.delay = k * 5*60+240;
			new PoolEnt(foeEntPool) {
				sprite = foes.foeMustache, pos = new v3(i.goal.x, i.goal.y, rd.f(80, 100)), scale = .3f, name = "nervous", inGrid = true, shadow = gameSys.Shadow(foes.shadow, foeEntPool, 3, 1, 0),
				update = e => {
					i.shootDelay--;
					if (TryLeave(e, i.startTime, ref i.goal, playerSys.playerEnt.pos + nm.v3z(.3f))) return;
					i.delay--;
					if (i.delay > 0) return;
					var moveDir = (e.pos - NearPlayer(e).pos);
					moveDir.z = 0;
					var len = moveDir.magnitude;
					v3 goal2;
					{goal2 = e.pos;}
					goal2.z = 0;
					goal2.x = nm.Between(-8, goal2.x, 8);
					goal2.y = nm.Between(-5, goal2.y, 5);

					i.goal = i.goal * .9f + .1f * goal2;

					i.slide *= .9f;
					e.pos = e.pos * .99f + .01f * i.goal + i.slide;
					e.ang = i.angAnim.Val(tick) + rd.f(-i.shakeAmount, i.shakeAmount);
					nm.ease(ref i.shakeAmount, 0f, .05f);},
				shotTouch = (e, user, info) => {},
				objTouch = (e, user, info) => {
					if (e.pos.z > 5) return;
					if ( user.name == "absentExploder") {
						// these should be shots that the players can't stop.
						for (var j = -1; j < 2; j++) { MakeShot(new v3(e.pos.x, e.pos.y, playerSys.playerEnt.pos.z), j, e, i.sprites, 0, true); }
						user.remove();
						e.remove();}},
				breathTouch = (e, user, info) => {
					if (e.pos.z > 5) return;
					if(info.strength == 3) {
						i.slide += user.vel * .1f;
						if (i.shootDelay > 0) return;}
					else i.slide += user.vel*.1f;}};}
		for( var k = 0; k< 12; k++) { 
			var i = new foeInfo();
			i.startTime = tick; i.goal = new v3(rd.f(-12,12), -1, 30); i.angAnim = new DualWave(4, .025f); i.shakeAmount = 0f; i.shootDelay = 0; i.sprites = foes.shoes; i.slide = new v3(0, 0, 0); i.delay = k * .5f*60;
			new PoolEnt(foeEntPool) {
				sprite = foes.foeMustache, pos = new v3(i.goal.x, i.goal.y, rd.f(80, 100)), scale = .1f, name = "absentExploder", inGrid = true, color= new Color(0,0,0,1), shadow = gameSys.Shadow(foes.shadow, foeEntPool, 3, 1, 0),
				update = e => {
					if (TryLeave(e, i.startTime, ref i.goal, playerSys.playerEnt.pos + nm.v3z(.3f))) return;
					i.delay--;
					if (i.delay > 0) return;
					i.goal.z = 0;
					i.slide *= .9f;
					i.goal += i.slide;
					e.pos = e.pos * .99f + .01f * i.goal;
					e.ang = i.angAnim.Val(tick) + rd.f(-i.shakeAmount, i.shakeAmount);
					nm.ease(ref i.shakeAmount, 0f, .05f);
					if (e.pos.z > 5) return;
					gameSys.grid.Find(e.pos - nm.v3y(.7f), 1, e, (me, targ) => { targ.objTouch(targ, me, new TouchInfo { }); });
				},
				shotTouch = (e, user, info) => {},
				breathTouch = (e, user, info) => {
					if (e.pos.z > 5) return;
					if(info.strength == 3) {i.slide += user.vel * .3f;}
					else i.slide += user.vel*.3f;}};}}


	// evil cloud that drips hurting stuff.  Also umbrellas.  Players can grab umbrellas, stop the rain.  Stop enough rain and treats fall out of umbrellas.
	void BadRain() {
		for( var k = 0; k < 3; k++) { 
			var i = new foeInfo();
			i.startTime = tick; i.goal = new v3(0, 4, 30); i.angAnim = new DualWave(4, .025f); i.shakeAmount = 0f; i.shootDelay = 0; i.sprites = foes.shoes; i.slide = new v3(0, 0, 0);
			new PoolEnt(foeEntPool) {
				sprite = foes.foeTrash, pos = new v3(rd.f(40), rd.f(-4, -7), rd.f(80, 100)), scale = 1f, name = "chaser1", inGrid = true, shadow = gameSys.Shadow(foes.shadow, foeEntPool, 3, 1, 0),
				update = e => {
					i.shootDelay--;
					if (TryLeave(e, i.startTime, ref i.goal, playerSys.playerEnt.pos + nm.v3z(.3f))) return;
					i.goal = SeekTarg(NearPlayer(e).pos, e.pos, 1);
					i.slide *= .9f;
					e.pos = e.pos * .99f + .01f * i.goal + i.slide;
					e.ang = i.angAnim.Val(tick) + rd.f(-i.shakeAmount, i.shakeAmount);
					nm.ease(ref i.shakeAmount, 0f, .05f);},
				shotTouch = (e, user, info) => {},
				breathTouch = (e, user, info) => {
					if (e.pos.z > 5) return;
					if(info.strength == 3) {
						i.slide += user.vel * .3f;
						if (i.shootDelay > 0) return;
						i.shootDelay = 90;
						gameSys.Sound(foes.guyThrowSound, 1);
						for (var j = -1; j < 2; j++) { MakeShot(new v3(e.pos.x, e.pos.y, playerSys.playerEnt.pos.z), j, e, i.sprites); }}
					else i.slide += user.vel*.3f;}};}}


	void BeardyGuy() {
		for( var k = 0; k < 2; k++ ) {
			var i = new foeInfo();
			i.startTime = tick; i.goal = new v3(0, 3.5f, 30); i.horizontal = (k==0) ? -3f : 3f; i.vertOffset = 3.5f + (k == 0 ? 0 : 1); i.zDepth = (k == 0 ? 30 : 20); i.tickOffset = (k == 0 ? 0 : 200);
			i.lastNoiseTime = 0f; i.doShoot = true; i.angAnim = new DualWave(4, .025f); i.shakeAmount = 0f; i.shootDelay = 0; i.sprites = (k == 0) ? foes.shoes : foes.socks;
			new PoolEnt(foeEntPool) {
				sprite = (k == 0 ? foes.beardguy : foes.beardguy2), pos = new v3(rd.f(40), rd.f(-4, -7), rd.f(80, 100)), scale = 1f, name = "beardguy", inGrid=true, shadow=gameSys.Shadow(foes.shadow, foeEntPool, 3, 1, 0 ),
				update = e => {
					if (TryLeave(e, i.startTime, ref i.goal, new v3(i.horizontal, i.vertOffset, playerSys.playerEnt.pos.z + .3f))) return;
					if (i.fading) {
						e.ang += 3f;
						i.grav += .0025f;
						e.MoveBy(0, -i.grav, 0 );
						if (e.pos.y < -9f) e.remove();
						return;}
					i.shootDelay--;
					if((tick + i.tickOffset) % 600 < 200 && i.shakeAmount < .5f) {
						if((tick + i.tickOffset) % 600 > 100 && i.doShoot && i.shootDelay <= 0 && e.pos.z < playerSys.playerEnt.pos.z + 1) {
							i.doShoot = false;
							gameSys.Sound(foes.guyThrowSound, 1);
							for(var j = -1; j < 2; j++) { MakeShot(new v3(e.pos.x, e.pos.y, playerSys.playerEnt.pos.z), j, e, i.sprites); }}
						i.goal = new v3(i.horizontal, i.vertOffset, playerSys.playerEnt.pos.z + .3f);}
					else { i.doShoot = true; i.goal = new v3(i.horizontal, i.vertOffset, i.zDepth);}
					e.pos = e.pos * .98f + .02f * i.goal;
					e.ang = i.angAnim.Val(tick) + rd.f(-i.shakeAmount, i.shakeAmount);
					nm.ease(ref i.shakeAmount, 0f, .05f);},
				shotTouch = (e, user, info ) => {
					if (e.pos.z > 5) return;
					if (i.fading) { i.grav -= .2f; return;}
					if ( info.isPlayer ) {
						//e.remove();
						treatSys.SpecialTreat(e.pos);
						i.fading = true;
						i.grav = .2f;
						e.color = new Color(1, 1, 1, .7f);
						user.remove();}},
				breathTouch = (e, user, info) => {
					if(e.pos.z > 5)return;
					if (info.strength == 3) return;
					if(i.lastNoiseTime < tick - 10) {gameSys.Sound(foes.guySurpriseSound, 1); i.lastNoiseTime = tick;}
					i.shootDelay = 90;
					if(e.pos.z < 10) i.shakeAmount = 100;}
			};}}

	void PlantGuy() {
		for( var k = 0; k < 4; k++ ) {
			var i = new foeInfo();
			i.startTime = tick; i.goal = new v3(0, 4, 30); i.horizontal = rd.f(15); i.vertOffset = rd.f(2, 6); i.tickOffset = rd.f(0, 300); i.horizontalDir = rd.Test(.5f) ? 1:-1; i.sprites = rd.Test(.5f) ? foes.spoons:foes.knives; i.inBack = false; i.delay = rd.i(0,1200);
				var backDist = rd.f(10,30);var shotTimer = rd.i(0,300);
			new PoolEnt(foeEntPool) {
				sprite = foes.plantguy, pos = new v3((rd.Test(.5f) ? -1:1) * 12 * i.horizontalDir, rd.f(-2, 5), 0), scale = .8f, flipped= i.horizontalDir > 0 ? false:true, name = "plantguy",shadow=gameSys.Shadow(foes.shadow, foeEntPool, 2, 1, 0 ),
				update = e => {
					if(i.delay > 0 ) { i.delay--;return;}
					if (TryLeave(e, i.startTime, ref i.goal, new v3(i.horizontal, i.vertOffset, playerSys.playerEnt.pos.z + .3f))) return;
					if( !i.inBack ) {
						shotTimer++;
						if( shotTimer > 470 ) {e.ang = rd.f(-.5f, .5f );}
						if( shotTimer > 500 ) {MakeShot(new v3(e.pos.x, e.pos.y, playerSys.playerEnt.pos.z), 0, e, i.sprites, .1f);shotTimer=0;}}
					if(i.inBack )e.MoveBy(i.horizontalDir *.1f, Mathf.Cos( tick * .03f + i.tickOffset )*.02f , Mathf.Sin( 10+tick * .021f + i.tickOffset )*.02f );
					else {e.MoveBy(i.horizontalDir *.02f, Mathf.Cos( tick * .03f + i.tickOffset )*.002f , Mathf.Sin( 10+tick * .021f + i.tickOffset )*.002f );}
					if( !i.inBack ) {
						if( e.pos.x < -12 && i.horizontalDir < 0 ) {
							i.inBack = true;
							i.horizontalDir *= -1;
							e.flipped = !e.flipped;
							e.MoveTo( -22, e.pos.y, 10 );}
						if( e.pos.x > 12 && i.horizontalDir > 0 ) {
							i.inBack = true;
							i.horizontalDir *= -1;
							e.flipped = !e.flipped;
							e.MoveTo( 22, e.pos.y, 10 );}}
					else {
						if( e.pos.x < -22 && i.horizontalDir < 0 ) {
							i.inBack = false;
							i.horizontalDir *= -1;
							e.flipped = !e.flipped;
							e.MoveTo( -12, e.pos.y, 0 );}
						if( e.pos.x > 22 && i.horizontalDir > 0 ) {
							i.inBack = false;
							i.horizontalDir *= -1;
							e.flipped = !e.flipped;
							e.MoveTo( 12, e.pos.y, 0 );}}}};}}

	// Trashcan guys + garbage trucks.
	void TrashGuy() {
		for( var k = 0; k < 5; k++ ) {
			var i = new foeInfo();
			i.baseInit( tick  );
			new PoolEnt(foeEntPool) {
				sprite = foes.foeTrash, pos = new v3(rd.f(40), rd.f(-4, -7), rd.f(80, 100)), scale = .5f, flipped=rd.Test(.5f), name = "trashguy",shadow=gameSys.Shadow(foes.shadow, foeEntPool, 3, 1, 0 ),
				update = e => {
					if (TryLeave(e, i.startTime, ref i.goal, new v3(i.horizontal, i.vertOffset, playerSys.playerEnt.pos.z + .3f))) return;
					if((tick + i.tickOffset) % 600 < 200) {if((tick + i.tickOffset) % 600 > 100 && i.doShoot) { i.doShoot = false; } i.goal = new v3(i.horizontal, i.vertOffset, 3);}
					else { i.doShoot = true; i.goal = new v3(i.horizontal, i.vertOffset, i.zDepth);}
					e.pos = e.pos * .98f + .02f * i.goal;
					e.ang = i.angAnim.Val(tick);}};}}

	void MicrowaveGuy() {
		for( var k = 0; k < 5; k++ ) {
			var i = new foeInfo();
			i.baseInit(tick);
			new PoolEnt(foeEntPool) {
				sprite = foes.foeMicrowave, pos = new v3(rd.f(40), rd.f(-4, -7), rd.f(80, 100)), scale = 1f, flipped=rd.Test(.5f), name = "microwaveguy",shadow=gameSys.Shadow(foes.shadow, foeEntPool, 3, 1, 0 ),
				update = e => {
					if (TryLeave(e, i.startTime, ref i.goal, new v3(i.horizontal, i.vertOffset, playerSys.playerEnt.pos.z + .3f))) return;
					if((tick + i.tickOffset) % 600 < 200) {if((tick + i.tickOffset) % 600 > 100 && i.doShoot) { i.doShoot = false; } i.goal = new v3(i.horizontal, i.vertOffset, 3);}
					else { i.doShoot = true; i.goal = new v3(i.horizontal, i.vertOffset, i.zDepth);}
					e.pos = e.pos * .98f + .02f * i.goal;
					e.ang = i.angAnim.Val(tick);}};}}

	void MustacheGuy() {
		for( var k = 0; k < 5; k++ ) {
			var i = new foeInfo();
			i.baseInit(tick);
			new PoolEnt(foeEntPool) {
				sprite = foes.foeMustache, pos = new v3(rd.f(40), rd.f(-4, -7), rd.f(80, 100)), scale = 1f, flipped=rd.Test(.5f),name = "mustacheguy",shadow=gameSys.Shadow(foes.shadow, foeEntPool, 3, 1, 0 ),
				update = e => {
					if (TryLeave(e, i.startTime, ref i.goal, new v3(i.horizontal, i.vertOffset, playerSys.playerEnt.pos.z + .3f))) return;
					if((tick + i.tickOffset) % 600 < 200) {
						if((tick + i.tickOffset) % 600 > 100 && i.doShoot) { i.doShoot = false; }
						i.goal = new v3(i.horizontal, i.vertOffset, 3);}
					else { i.doShoot = true; i.goal = new v3(i.horizontal, i.vertOffset, i.zDepth);}
					e.pos = e.pos * .98f + .02f * i.goal;
					e.ang = i.angAnim.Val(tick);}};}}}