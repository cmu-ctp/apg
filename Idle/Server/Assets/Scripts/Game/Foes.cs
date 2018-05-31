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

public interface Subgame{
    void Run(int baseTime, SpawnSys spawnSys);
}

public class RainGameLogic : Subgame{
    public SpawnEntry rainGuy;
    FoeSys f;
    /*
     * Barrel
     * Fish
     * Fishbowl
     * Lightning Bolt
     * Lightning Rod
     * Dark cloud
     * Gray Cloud
     * White Cloud
     * Water Surface
     * Umbrella
     * Fan
    */
    public void Run(int baseTime, SpawnSys spawnSys) { spawnSys.Add(f.foeOffset + baseTime, rainGuy); }
    public RainGameLogic( FoeSys theFoeSys ){
        f = theFoeSys;
        rainGuy = new SpawnEntry { icon = Art.Bosses.beardface.spr, spawn = () => Make(), scale = .7f, message = "Deus Peduleus and Calceus Prime Approach!" };}
    public void Make() { }
}

public class DoorGameLogic : Subgame{
    public SpawnEntry chefGuy;
    FoeSys f;
    /*
     */
    public void Run(int baseTime, SpawnSys spawnSys) { spawnSys.Add(f.foeOffset + baseTime, chefGuy); }
    public DoorGameLogic( FoeSys theFoeSys ){
        f = theFoeSys;
        chefGuy = new SpawnEntry { icon = Art.Bosses.beardface.spr, spawn = () => Make(), scale = .7f, message = "Deus Peduleus and Calceus Prime Approach!" };}
    public void Make() { }
}

public class TrashGameLogic : Subgame{
    public SpawnEntry trashGuy;
    FoeSys f;
    /*
     */
    public void Run(int baseTime, SpawnSys spawnSys) { spawnSys.Add(f.foeOffset + baseTime, trashGuy); }
    public TrashGameLogic( FoeSys theFoeSys ){
        f = theFoeSys;
        trashGuy = new SpawnEntry { icon = Art.Bosses.beardface.spr, spawn = () => Make(), scale = .7f, message = "Deus Peduleus and Calceus Prime Approach!" };}
    public void Make() { }
}

public class BeardyGameLogic : Subgame{
    public SpawnEntry beardGuy;
    FoeSys f;
    /*
     */
    public void Run(int baseTime, SpawnSys spawnSys) { spawnSys.Add(f.foeOffset + baseTime, beardGuy); }
    public BeardyGameLogic( FoeSys theFoeSys ){
        f = theFoeSys;
        beardGuy = new SpawnEntry { icon = Art.Bosses.beardface.spr, spawn = () => BeardyGuy(), scale = .7f, message = "Deus Peduleus and Calceus Prime Approach!" };}
	void BeardyGuy() {
		for( var k = 0; k < 2; k++ ) {
			var i = new FoeSys.foeInfo();
			i.startTime = f.tick; i.goal = new v3(0, 3.5f, 30); i.horizontal = (k==0) ? -3f : 3f; i.vertOffset = 3.5f + (k == 0 ? 0 : 1); i.zDepth = (k == 0 ? 30 : 20); i.tickOffset = (k == 0 ? 0 : 200);
			i.lastNoiseTime = 0f; i.doShoot = true; i.angAnim = new DualWave(4, .025f); i.shakeAmount = 0f; i.shootDelay = 0; i.sprites = (k == 0) ? Art.Clothes.Shoes.set : Art.Clothes.Socks.set;
			new PoolEnt(f.foeEntPool) {
				sprite = (k == 0 ? Art.Bosses.beardface.spr : Art.Bosses.beardface2.spr), pos = new v3(rd.f(40), rd.f(-4, -7), rd.f(80, 100)), scale = 1f, name = "beardguy", inGrid=true, shadow= f.gameSys.Shadow(f.foeEntPool, 3, 1, 0 ), team=Team.None,
				update = e => {
					if (f.TryLeave(e, i.startTime, ref i.goal, new v3(i.horizontal, i.vertOffset, f.playerSys.playerEnt.pos.z + .3f))) return;

                    if (e.pos.z > 15 && rd.f(0, 1) < .003f && f.tick-f.lastChatTime > 60*12){
                        f.lastChatTime = f.tick;
                        f.treatSys.reactSys.Chat(e.pos + new v3(3, 2, -3), "I am coming for\nyou, cowards!\nYou will see!", new Color(.3f, .5f, .8f, 1), 1);}

                    if (i.fading) {
						e.ang += 3f;
						i.grav += .0025f;
						e.MoveBy(0, -i.grav, 0 );
						if (e.pos.y < -9f) e.remove();
						return;}
					i.shootDelay--;
					if((f.tick + i.tickOffset) % 600 < 200 && i.shakeAmount < .5f) {
						if((f.tick + i.tickOffset) % 600 > 100 && i.doShoot && i.shootDelay <= 0 && e.pos.z < f.playerSys.playerEnt.pos.z + 1) {
							i.doShoot = false;
                            f.gameSys.Sound(Art.Sounds.salute.snd, 1);
							for(var j = -1; j < 2; j++) { f.MakeShot(new v3(e.pos.x, e.pos.y, f.playerSys.playerEnt.pos.z), j, e, i.sprites); }}
						i.goal = new v3(i.horizontal, i.vertOffset, f.playerSys.playerEnt.pos.z + .3f);}
					else { i.doShoot = true; i.goal = new v3(i.horizontal, i.vertOffset, i.zDepth);}
					e.pos = e.pos * .98f + .02f * i.goal;
					e.ang = i.angAnim.Val(f.tick) + rd.f(-i.shakeAmount, i.shakeAmount);
					nm.ease(ref i.shakeAmount, 0f, .05f);},
				shotTouch = (e, user, info ) => {
					if (e.pos.z > 5) return;
					if (i.fading) { i.grav -= .2f; return;}
					if ( info.isPlayer ) {
                        //e.remove();
                        f.treatSys.SpecialTreat(e.pos);
						i.fading = true;
						i.grav = .2f;
						e.color = new Color(1, 1, 1, .7f);
						user.remove();}},
				breathTouch = (e, user, info) => {
					if(e.pos.z > 5)return;
					if (info.strength == 3) return;
					if(i.lastNoiseTime < f.tick - 10) { f.gameSys.Sound( Art.Sounds.up1.snd, 1); i.lastNoiseTime = f.tick;}
					i.shootDelay = 90;
					if(e.pos.z < 10) i.shakeAmount = 100;}};}}}

public class PlantGameLogic : Subgame{
    public SpawnEntry plantGuy;
    FoeSys f;
    /*
     * Sun
     * Cloud
     * Saw
     * Bag of Seeds(?)
     * Empty Plant Pot (one cup art looks okay)
     * Cloud guy
     * Rain Cloud
     * Rain
     */
    public PlantGameLogic( FoeSys theFoeSys ){
        f = theFoeSys;
        plantGuy = new SpawnEntry { icon = Art.Foes.foePlantHead.spr, spawn = () => PlantGuy(), scale=2f, message="A Squadron of Utensil Vines Looms!" };}
    public void Run(int baseTime, SpawnSys spawnSys){ spawnSys.Add(f.foeOffset + baseTime, plantGuy); }
    void PlantGuy() {
		for( var k = 0; k < 4; k++ ) {
			var i = new FoeSys.foeInfo();
			i.startTime = f.tick; i.goal = new v3(0, 4, 30); i.horizontal = rd.f(15); i.vertOffset = rd.f(2, 6); i.tickOffset = rd.f(0, 300); i.horizontalDir = rd.Test(.5f) ? 1:-1; i.sprites = rd.Test(.5f) ? Art.Dishes.Spoons.set : Art.Dishes.Knives.set; i.inBack = false; i.delay = rd.i(0,1200);
				var shotTimer = rd.i(0,300);
			new PoolEnt(f.foeEntPool) {
				sprite = Art.Foes.foePlantHead.spr, pos = new v3((rd.Test(.5f) ? -1:1) * 12 * i.horizontalDir, rd.f(-2, 5), 0), scale = .8f, flipped= i.horizontalDir > 0 ? false:true, name = "plantguy",shadow= f.gameSys.Shadow(f.foeEntPool, 2, 1, 0 ), team = Team.None,
                update = e => {
					if(i.delay > 0 ) { i.delay--;return;}
					if (f.TryLeave(e, i.startTime, ref i.goal, new v3(i.horizontal, i.vertOffset, f.playerSys.playerEnt.pos.z + .3f))) return;

                    if (e.pos.z > 8 && rd.f(0, 1) < .003f && f.tick-f.lastChatTime > 60*12){
                        f.lastChatTime = f.tick;
                        f.treatSys.reactSys.Chat(e.pos + new v3(3, 2, -3), "Plant guy!\nPlant guy!\nPlant guy!", new Color(.3f, .5f, .8f, 1), 1);}

					if( !i.inBack ) {
						shotTimer++;
						if( shotTimer > 470 ) {e.ang = rd.f(-.5f, .5f );}
						if( shotTimer > 500 ) { f.MakeShot(new v3(e.pos.x, e.pos.y, f.playerSys.playerEnt.pos.z), 0, e, i.sprites, .1f);shotTimer=0;}}
					if(i.inBack )e.MoveBy(i.horizontalDir *.1f, Mathf.Cos(f.tick * .03f + i.tickOffset )*.02f , Mathf.Sin( 10+ f.tick * .021f + i.tickOffset )*.02f );
					else {e.MoveBy(i.horizontalDir *.02f, Mathf.Cos(f.tick * .03f + i.tickOffset )*.002f , Mathf.Sin( 10+ f.tick * .021f + i.tickOffset )*.002f );}
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
							e.MoveTo( 12, e.pos.y, 0 );}}}};}}}















public class FoeSys {
	public float tick = 0;
    public float lastChatTime = 0;
    public int foeOffset = 6;

	const int shotEntPoolSize = 100;
	FixedEntPool shotEntPool;

	const int foeEntPoolSize = 30;
	public FixedEntPool foeEntPool;

	public GameSys gameSys;
    public PlayerSys playerSys;
    public TreatSys treatSys;
    public AudiencePlayerSys audiencePlayerSys;

    public BeardyGameLogic beardGame;
    public DogGameLogic dogGame;
    public PlantGameLogic plantGame;

    public SpawnEntry trashGuy, microwaveGuy, mustacheGuy, nervousTouchGuy, smallChaserGuy, badRainGuy, eyebeamGuy, leaperGuy, overeatGuy, keydoorGuy, absentmindedGuy,chefGuy;

	public FoeSys(GameSys theGameSys, PlayerSys thePlayerSys, AudiencePlayerSys theAudiencePlayerSys, TreatSys theTreatSys ) {
		playerSys = thePlayerSys;
		audiencePlayerSys = theAudiencePlayerSys;
		treatSys = theTreatSys;
		gameSys = theGameSys;

        beardGame = new BeardyGameLogic(this);
        dogGame = new DogGameLogic( this );
        plantGame = new PlantGameLogic(this);

		trashGuy= new SpawnEntry { icon = Art.Foes.foeTrash.spr, spawn = () => TrashGuy() };
		microwaveGuy= new SpawnEntry { icon = Art.Foes.foeMicrowave.spr, spawn = () => MicrowaveGuy() };
		mustacheGuy= new SpawnEntry { icon = Art.Foes.foeCloudMustache.spr, spawn = () => MustacheGuy() };

		nervousTouchGuy = new SpawnEntry { icon = Art.Bosses.beardface.spr, spawn = () => NervousTouch(), scale = .7f, message = "" };
		smallChaserGuy = new SpawnEntry { icon = Art.Bosses.beardface.spr, spawn = () => SmallChaser(), scale = .7f, message = "" };
		badRainGuy = new SpawnEntry { icon = Art.Bosses.beardface.spr, spawn = () => BadRain(), scale = .7f, message = "" };
		eyebeamGuy = new SpawnEntry { icon = Art.Bosses.beardface.spr, spawn = () => Eyebeam(), scale = .7f, message = "" };
		leaperGuy = new SpawnEntry { icon = Art.Bosses.beardface.spr, spawn = () => Leaper(), scale = .7f, message = "" };
		overeatGuy = new SpawnEntry { icon = Art.Bosses.beardface.spr, spawn = () => Overeat(), scale = .7f, message = "" };
		keydoorGuy = new SpawnEntry { icon = Art.Bosses.beardface.spr, spawn = () => KeyDoor(), scale = .7f, message = "" };
		absentmindedGuy = new SpawnEntry { icon = Art.Bosses.beardface.spr, spawn = () => AbsentMinded(), scale = .7f, message = "" };
		chefGuy = new SpawnEntry { icon = Art.Bosses.beardface.spr, spawn = () => Chef(), scale = .7f, message = "" };

		foeEntPool = new FixedEntPool( foeEntPoolSize, "foes", true );
		shotEntPool = new FixedEntPool( shotEntPoolSize, "shots", true );
	}

	public bool TryLeave( ent e, float startTime, ref v3 goal, v3 leaveTarget ) {
		if (tick - startTime > 60 * 40 || gameSys.gameOver) {
			goal = leaveTarget;
			goal.y = 50;
			e.pos = e.pos * .99f + .01f * goal;
			if (e.pos.y > 45) { e.remove(); return true; }
			return true;}
		return false;}
    public ent NearPlayer( ent e ) {
		var dif1 = playerSys.playerEnt.pos - e.pos;
		var dif2 = playerSys.player2Ent.pos - e.pos;
		return (dif1.magnitude < dif2.magnitude) ? playerSys.playerEnt : playerSys.player2Ent;
	}
    public ent FarPlayer(ent e) {
		var dif1 = playerSys.playerEnt.pos - e.pos;
		var dif2 = playerSys.player2Ent.pos - e.pos;
		return (dif1.magnitude < dif2.magnitude) ? playerSys.playerEnt : playerSys.player2Ent;
	}

	public struct foeInfo {
		public v3 goal, slide; public bool doShoot, inBack, fading; public DualWave angAnim; public ImageSet sprites;
		public float startTime, horizontal, vertOffset, zDepth, tickOffset, lastNoiseTime, shakeAmount, shootDelay, delay, horizontalDir, grav;

		public void baseInit( float tick ) {
			startTime = tick; goal = new v3(0, 4, 30); horizontal = rd.f(15); vertOffset = rd.f(2, 6); zDepth = rd.f(20, 50); tickOffset = rd.f(0, 500); doShoot = true; angAnim = new DualWave(12, .025f); fading = false; grav = 0;
		}
	}

    public void React(v3 pos, ImageEntry msg) {
		var delay = 30;
		new ent() { sprite = msg.spr, pos = pos, scale = 1, update = e => { delay--; if(delay <= 0) e.remove(); } };}

	public void MakeShot(v3 pos, int j, ent src, ImageSet sprites, float baseYVel = 0, bool ignorePlayer = false, float sc = 1 ) {
		if(gameSys.gameOver)return;
		var offset = rd.Ang(); var rotateSpeed = rd.f(.02f, .04f) * 80; var strength = 1; var lastHit = 0f; var bounceNum = 0; var flashColor = new Color(1, 0, 0, 1);
		var isPlayerAttack = false;
		new PoolEnt(shotEntPool) {
			sprite = sprites.rd(), pos = pos, scale = rd.f(.3f, .4f)*1.5f * sc, name = "shot", inGrid=true, vel=new v3(j * .05f, -.04f + baseYVel, 0), shadow=gameSys.Shadow( shotEntPool, 1, 1, 0 ), team=Team.None,
			update = e => {
				if( gameSys.gameOver ) { e.remove(); return; }
                var mod = 30-(strength - 1)*10;
                if (((int)FullGame.tick) % mod == 0) e.color = flashColor;
                else if (((int)FullGame.tick) % mod == 2) e.color = new Color(1, 1, 1, 1);
                e.ang = tick * rotateSpeed + offset;
				e.vel.y -= .0008f;
				e.MoveBy(e.vel);
				if( e.pos.y < -5f && e.vel.y < 0 ) { e.vel.y *= -.6f; if( Mathf.Abs(e.vel.y )< .001f )e.remove(); }
				gameSys.grid.Find(e.pos - nm.v3y( .7f ), 1, e, (me, targ) => { targ.shotTouch(targ, me, new TouchInfo { flags = 0, isPlayer = isPlayerAttack });});
				e.removeIfOffScreen();},
			playerTouch = (e, user, info) => {
				if (ignorePlayer)return;
				if(tick - lastHit < 30) return;
					lastHit = tick;
					gameSys.Sound( Art.Sounds.bump.snd, 1);
					React(e.pos + new v3(0, 0, -.2f), Art.Reacts.thud);
					strength++;
                    if (strength > 3) strength = 3;
					e.vel.y *= -1f;
					if( e.vel.y < .1f )e.vel.y = .1f;
					e.vel.x = user.vel.x*.025f;
					if(bounceNum < 3) { bounceNum++; rotateSpeed*=2;} },
			buddyTouch = (e, user, info) => { user.onHurt(user, e, new TouchInfo { flags = (int)TouchFlag.IsAirbourne, damage = 1, showDamage = true }); e.remove(); },
			breathTouch = (e, user, info) => {
                if (info.strength == 3) {
                    flashColor = (info.src.name == "player1") ? new Color(245f/255,252f/255,76f/255,1) : new Color(240f/255, 76f/255,255f/255,1);
                    e.team = info.src.team;
                    isPlayerAttack = true;
                    e.vel *= .3f;
                    e.vel += user.vel * .05f;
                    //flashColor = new Color(1, 0, 0, 1)
                }
                /*e.color = new Color(1.5f, 1.3f, .8f, .8f);*/ }
        };}

	public v3 SeekTarg( v3 pos, v3 src, float dist) { return ((pos - src).magnitude > dist) ? pos : src; }

	// bring keys to door to open door and make stuff come out.  Blow door around.
	void KeyDoor() {
		var i = new foeInfo();
		i.startTime = tick; i.goal = new v3(0, 4, 30); i.angAnim = new DualWave(4, .025f); i.shakeAmount = 0f; i.shootDelay = 0; i.sprites = Art.Clothes.Shoes.set; i.slide = new v3(0, 0, 0);
		new PoolEnt(foeEntPool) {
			sprite = Art.Foes.foeTrash.spr, pos = new v3(rd.f(40), rd.f(-4, -7), rd.f(80, 100)), scale = 1f, name = "chaser1", inGrid = true, shadow = gameSys.Shadow( foeEntPool, 3, 1, 0), team = Team.None,
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
					gameSys.Sound(Art.Sounds.salute.snd, 1);
					for (var j = -1; j < 2; j++) { MakeShot(new v3(e.pos.x, e.pos.y, playerSys.playerEnt.pos.z), j, e, i.sprites); }}
				else i.slide += user.vel*.3f;}};}

	// Blow falling food into eaters until they pop.  Push eaters around.
	void Overeat() {
		var i = new foeInfo();
		i.startTime = tick; i.goal = new v3(0, 4, 30); i.angAnim = new DualWave(4, .025f); i.shakeAmount = 0f; i.shootDelay = 0; i.sprites = Art.Clothes.Shoes.set; i.slide = new v3(0, 0, 0);
		new PoolEnt(foeEntPool) {
			sprite = Art.Foes.foeTrash.spr, pos = new v3(rd.f(40), rd.f(-4, -7), rd.f(80, 100)), scale = 1f, name = "chaser1", inGrid = true, shadow = gameSys.Shadow( foeEntPool, 3, 1, 0), team = Team.None,
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
					gameSys.Sound(Art.Sounds.salute.snd, 1);
					for (var j = -1; j < 2; j++) { MakeShot(new v3(e.pos.x, e.pos.y, playerSys.playerEnt.pos.z), j, e, i.sprites); }}
				else i.slide += user.vel*.3f;}};}

	//  Hop back and forth, dropping hurty things. - Guy who hops over screen, dropping attacks.
	void Leaper() {
		var i = new foeInfo();
		i.startTime = tick; i.goal = new v3(0, 4, 30); i.angAnim = new DualWave(4, .025f); i.shakeAmount = 0f; i.shootDelay = 0; i.sprites = Art.Clothes.Shoes.set; i.slide = new v3(0, 0, 0);
		new PoolEnt(foeEntPool) {
			sprite = Art.Foes.foeTrash.spr, pos = new v3(rd.f(40), rd.f(-4, -7), rd.f(80, 100)), scale = 1f, name = "chaser1", inGrid = true, shadow = gameSys.Shadow( foeEntPool, 3, 1, 0), team = Team.None,
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
					gameSys.Sound(Art.Sounds.salute.snd, 1);
					for (var j = -1; j < 2; j++) { MakeShot(new v3(e.pos.x, e.pos.y, playerSys.playerEnt.pos.z), j, e, i.sprites); }}
				else i.slide += user.vel*.3f;}};}

	// Eye beam trigger thing - float in air and hurl attacks if player trips trigger
	void Eyebeam() {
		var i = new foeInfo();
		i.startTime = tick; i.goal = new v3(0, 4, 30); i.angAnim = new DualWave(4, .025f); i.shakeAmount = 0f; i.shootDelay = 0; i.sprites = Art.Clothes.Shoes.set; i.slide = new v3(0, 0, 0);
		new PoolEnt(foeEntPool) {
			sprite = Art.Foes.foeTrash.spr, pos = new v3(rd.f(40), rd.f(-4, -7), rd.f(80, 100)), scale = 1f, name = "chaser1", inGrid = true, shadow = gameSys.Shadow( foeEntPool, 3, 1, 0), team = Team.None,
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
					gameSys.Sound(Art.Sounds.salute.snd, 1);
					for (var j = -1; j < 2; j++) { MakeShot(new v3(e.pos.x, e.pos.y, playerSys.playerEnt.pos.z), j, e, i.sprites); }}
				else i.slide += user.vel*.3f;}};}

	// 
	void SmallChaser() {
		for( var k = 0; k < 30; k++) { 
			var i = new foeInfo();
			i.startTime = tick; i.goal = new v3(0, 4, 30); i.angAnim = new DualWave(4, .025f); i.shakeAmount = 0f; i.shootDelay = 0; i.sprites = Art.Clothes.Shoes.set; i.slide = new v3(0, 0, 0);
			new PoolEnt(foeEntPool) {
				sprite = Art.Foes.foeTrash.spr, pos = new v3(rd.f(40), rd.f(-4, -7), rd.f(80, 100)), scale = 1f, name = "chaser1", inGrid = true, shadow = gameSys.Shadow( foeEntPool, 3, 1, 0), team = Team.None,
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
						gameSys.Sound(Art.Sounds.salute.snd, 1);
						for (var j = -1; j < 2; j++) { MakeShot(new v3(e.pos.x, e.pos.y, playerSys.playerEnt.pos.z), j, e, i.sprites); }}
					else i.slide += user.vel*.3f;}};}}

	// Guy who makes attacks when he collides with ... something.  Flees from players.  Can be blown.
	void NervousTouch() {
		for( var k = 0; k< 5; k++) { 
			var i = new foeInfo();
			i.startTime = tick; i.goal = new v3(rd.f(-4, 4), rd.f(2, 5), 30); i.angAnim = new DualWave(4, .025f); i.shakeAmount = 0f; i.shootDelay = 0; i.sprites = Art.Clothes.Shoes.set; i.slide = new v3(0, 0, 0); i.delay = k * 5*60+240;
			new PoolEnt(foeEntPool) {
				sprite = Art.Foes.foeCloudMustache.spr, pos = new v3(i.goal.x, i.goal.y, rd.f(80, 100)), scale = .3f, name = "nervous", inGrid = true, shadow = gameSys.Shadow( foeEntPool, 3, 1, 0), team = Team.None,
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
			i.startTime = tick; i.goal = new v3(rd.f(-12,12), -1, 30); i.angAnim = new DualWave(4, .025f); i.shakeAmount = 0f; i.shootDelay = 0; i.sprites = Art.Clothes.Shoes.set; i.slide = new v3(0, 0, 0); i.delay = k * .5f*60;
			new PoolEnt(foeEntPool) {
				sprite = Art.Foes.foeCloudMustache.spr, pos = new v3(i.goal.x, i.goal.y, rd.f(80, 100)), scale = .1f, name = "nervousExploder", inGrid = true, color= new Color(0,0,0,1), shadow = gameSys.Shadow( foeEntPool, 3, 1, 0), team = Team.None,
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
					gameSys.grid.Find(e.pos - nm.v3y(.7f), 1, e, (me, targ) => { targ.objTouch(targ, me, new TouchInfo { flags = 0}); });
				},
				shotTouch = (e, user, info) => {},
				breathTouch = (e, user, info) => {
					if (e.pos.z > 5) return;
					if(info.strength == 3) {i.slide += user.vel * .3f;}
					else i.slide += user.vel*.3f;}};}}

	// Guy who wanders around stupidly.  Gotta blow spikes at him.
	void AbsentMinded() {
		for( var k = 0; k< 5; k++) { 
			var i = new foeInfo();
			i.startTime = tick; i.goal = new v3(rd.f(-4, 4), rd.f(2, 5), 30); i.angAnim = new DualWave(4, .025f); i.shakeAmount = 0f; i.shootDelay = 0; i.sprites = Art.Clothes.Shoes.set; i.slide = new v3(0, 0, 0); i.delay = k * 5*60+240;
			new PoolEnt(foeEntPool) {
				sprite = Art.Foes.foeCloudMustache.spr, pos = new v3(i.goal.x, i.goal.y, rd.f(80, 100)), scale = .3f, name = "nervous", inGrid = true, shadow = gameSys.Shadow( foeEntPool, 3, 1, 0), team = Team.None,
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
			i.startTime = tick; i.goal = new v3(rd.f(-12,12), -1, 30); i.angAnim = new DualWave(4, .025f); i.shakeAmount = 0f; i.shootDelay = 0; i.sprites = Art.Clothes.Shoes.set; i.slide = new v3(0, 0, 0); i.delay = k * .5f*60;
			new PoolEnt(foeEntPool) {
				sprite = Art.Foes.foeCloudMustache.spr, pos = new v3(i.goal.x, i.goal.y, rd.f(80, 100)), scale = .1f, name = "absentExploder", inGrid = true, color= new Color(0,0,0,1), shadow = gameSys.Shadow( foeEntPool, 3, 1, 0), team = Team.None,
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
					gameSys.grid.Find(e.pos - nm.v3y(.7f), 1, e, (me, targ) => { targ.objTouch(targ, me, new TouchInfo { flags = 0}); });},
				shotTouch = (e, user, info) => {},
				breathTouch = (e, user, info) => {
					if (e.pos.z > 5) return;
					if(info.strength == 3) {i.slide += user.vel * .3f;}
					else i.slide += user.vel*.3f;}};}}

	// Guy who wanders around stupidly.  Gotta blow spikes at him.
	void Chef() {
		for( var k = 0; k< 5; k++) { 
			var i = new foeInfo();
			i.startTime = tick; i.goal = new v3(rd.f(-4, 4), rd.f(2, 5), 30); i.angAnim = new DualWave(4, .025f); i.shakeAmount = 0f; i.shootDelay = 0; i.sprites = Art.Clothes.Shoes.set; i.slide = new v3(0, 0, 0); i.delay = k * 5*60+240;
			new PoolEnt(foeEntPool) {
				sprite = Art.Foes.foeCloudMustache.spr, pos = new v3(i.goal.x, i.goal.y, rd.f(80, 100)), scale = .3f, name = "nervous", inGrid = true, shadow = gameSys.Shadow( foeEntPool, 3, 1, 0), team = Team.None,
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
			i.startTime = tick; i.goal = new v3(rd.f(-12,12), -1, 30); i.angAnim = new DualWave(4, .025f); i.shakeAmount = 0f; i.shootDelay = 0; i.sprites = Art.Clothes.Shoes.set; i.slide = new v3(0, 0, 0); i.delay = k * .5f*60;
			new PoolEnt(foeEntPool) {
				sprite = Art.Foes.foeCloudMustache.spr, pos = new v3(i.goal.x, i.goal.y, rd.f(80, 100)), scale = .1f, name = "absentExploder", inGrid = true, color= new Color(0,0,0,1), shadow = gameSys.Shadow( foeEntPool, 3, 1, 0), team = Team.None,
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
					gameSys.grid.Find(e.pos - nm.v3y(.7f), 1, e, (me, targ) => { targ.objTouch(targ, me, new TouchInfo { flags = 0}); });},
				shotTouch = (e, user, info) => {},
				breathTouch = (e, user, info) => {
					if (e.pos.z > 5) return;
					if(info.strength == 3) {i.slide += user.vel * .3f;}
					else i.slide += user.vel*.3f;}};}}


	// evil cloud that drips hurting stuff.  Also umbrellas.  Players can grab umbrellas, stop the rain.  Stop enough rain and treats fall out of umbrellas.
	void BadRain() {
		for( var k = 0; k < 3; k++) { 
			var i = new foeInfo();
			i.startTime = tick; i.goal = new v3(0, 4, 30); i.angAnim = new DualWave(4, .025f); i.shakeAmount = 0f; i.shootDelay = 0; i.sprites = Art.Clothes.Shoes.set; i.slide = new v3(0, 0, 0);
			new PoolEnt(foeEntPool) {
				sprite = Art.Foes.foeTrash.spr, pos = new v3(rd.f(40), rd.f(-4, -7), rd.f(80, 100)), scale = 1f, name = "chaser1", inGrid = true, shadow = gameSys.Shadow( foeEntPool, 3, 1, 0), team = Team.None,
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
						gameSys.Sound(Art.Sounds.salute.snd, 1);
						for (var j = -1; j < 2; j++) { MakeShot(new v3(e.pos.x, e.pos.y, playerSys.playerEnt.pos.z), j, e, i.sprites); }}
					else i.slide += user.vel*.3f;}};}}

	// Trashcan guys + garbage trucks.
	void TrashGuy() {
		for( var k = 0; k < 5; k++ ) {
			var i = new foeInfo();
			i.baseInit( tick  );
			new PoolEnt(foeEntPool) {
				sprite = Art.Foes.foeTrash.spr, pos = new v3(rd.f(40), rd.f(-4, -7), rd.f(80, 100)), scale = .5f, flipped=rd.Test(.5f), name = "trashguy",shadow=gameSys.Shadow( foeEntPool, 3, 1, 0 ), team = Team.None,
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
				sprite = Art.Foes.foeMicrowave.spr, pos = new v3(rd.f(40), rd.f(-4, -7), rd.f(80, 100)), scale = 1f, flipped=rd.Test(.5f), name = "microwaveguy",shadow=gameSys.Shadow( foeEntPool, 3, 1, 0 ), team = Team.None,
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
				sprite = Art.Foes.foeCloudMustache.spr, pos = new v3(rd.f(40), rd.f(-4, -7), rd.f(80, 100)), scale = 1f, flipped=rd.Test(.5f),name = "mustacheguy",shadow=gameSys.Shadow( foeEntPool, 3, 1, 0 ), team = Team.None,
				update = e => {
					if (TryLeave(e, i.startTime, ref i.goal, new v3(i.horizontal, i.vertOffset, playerSys.playerEnt.pos.z + .3f))) return;
					if((tick + i.tickOffset) % 600 < 200) {
						if((tick + i.tickOffset) % 600 > 100 && i.doShoot) { i.doShoot = false; }
						i.goal = new v3(i.horizontal, i.vertOffset, 3);}
					else { i.doShoot = true; i.goal = new v3(i.horizontal, i.vertOffset, i.zDepth);}
					e.pos = e.pos * .98f + .02f * i.goal;
					e.ang = i.angAnim.Val(tick);}};}}}