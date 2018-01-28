using UnityEngine; using v3 = UnityEngine.Vector3; using System.Collections.Generic;

public class FriendlyDogGame:MonoBehaviour {
	public Sprite[] bones;
	public Sprite dogbody;
	public Sprite doghead;
	public Sprite doghouse;
	public Sprite firehydrant;}

public class DogGameLogic : Subgame {
    public SpawnEntry dog, fireHydrant, dogHouse;
    FoeSys f;
    ArtSet art;
    public DogGameLogic( Foes theSrc, FoeSys theFoeSys, ArtSet theArt ){
        art = theArt;
        f = theFoeSys;
        dog = new SpawnEntry { icon = f.foes.dogGame.doghead, spawn = () => Dog(), scale = .7f, message = "Look out!  A Co-dependent Canine!" };
        fireHydrant = new SpawnEntry { icon = f.foes.dogGame.firehydrant, spawn = () => FireHydrant(), scale = .7f, message = "Oh no!  Incoming Glamorous Fire Hydrant!" };
        dogHouse = new SpawnEntry { icon = f.foes.dogGame.doghouse, spawn = () => DogHouse(), scale = .7f, message = "What?!?  A Hundehütte?!?" };}
    public void Run( int baseTime, SpawnSys spawnSys){
        spawnSys.Add(f.foeOffset + baseTime, dogHouse);
        spawnSys.Add(f.foeOffset + baseTime+3, dog);
        spawnSys.Add(f.foeOffset + baseTime + 20, fireHydrant);}
    // Dog // Guy who chases player.  Drops attacking items when hit by a big breathe
    void FireHydrant(){
        var i = new FoeSys.foeInfo();
		i.startTime = f.tick; i.goal = new v3(0, 4, 30); i.angAnim = new DualWave(4, .025f); i.shakeAmount = 0f; i.shootDelay = 0; i.slide = new v3(0, 0, 0);
		new PoolEnt(f.foeEntPool) {
			sprite = f.foes.dogGame.firehydrant, pos = new v3(0, 3, 40), scale = .4f, name = "fireHydrant", inGrid = true, team = Team.None,
			update = e => {if (f.TryLeave(e, i.startTime, ref i.goal, f.playerSys.playerEnt.pos + nm.v3z(.3f))) return;}};}
    void DogHouse() {
        var i = new FoeSys.foeInfo();
		i.startTime = f.tick; i.goal = new v3(0, 4, 30); i.angAnim = new DualWave(4, .025f); i.shakeAmount = 0f; i.shootDelay = 0; i.slide = new v3(0, 0, 0);
		new PoolEnt(f.foeEntPool) {
			sprite = f.foes.dogGame.doghouse, pos = new v3(0, -5, 40), scale = 1, name = "doghouse", inGrid = false, team = Team.None,
			update = e => {if (f.TryLeave(e, i.startTime, ref i.goal, f.playerSys.playerEnt.pos + nm.v3z(.3f))) return;}};}
    void Dog() {
        // need a cloud
        // need a dog head
        // need a bone in the mouth when it's time to be shot

        var dogHead = new ent() { pos = new v3(0, 0, 0), sprite = f.foes.dogGame.doghead, name="doghead" };
        var cloud = new ent() { pos = new v3(0, 0, 0), sprite = art.skyThings.clouds[0], name = "cloud" };

        var i = new FoeSys.foeInfo();
		i.startTime = f.tick; i.goal = new v3(0, 4, 30); i.angAnim = new DualWave(4, .025f); i.shakeAmount = 0f; i.shootDelay = 0; i.sprites = f.foes.dogGame.bones; i.slide = new v3(0, 0, 0);
		new PoolEnt(f.foeEntPool) {
			sprite = f.foes.dogGame.dogbody, pos = new v3(0, -5, 40), scale = .4f, name = "dog", inGrid = true, shadow = f.gameSys.Shadow(f.foes.shadow, f.foeEntPool, 3, 1, 0), children = new List<ent> { dogHead, cloud },  team = Team.None,
			update = e => {
				i.shootDelay--;
				if (f.TryLeave(e, i.startTime, ref i.goal, f.playerSys.playerEnt.pos + nm.v3z(.3f))) return;

                if (rd.f(0, 1) < .003f && f.tick-f.lastChatTime > 60*12){
                    f.lastChatTime = f.tick;
                    f.treatSys.reactSys.Chat(e.pos + new v3(3, 2, -3), "Woof!\nWoof!\nWoof!", new Color(.3f, .5f, .8f, 1), .5f);}

				i.goal = f.SeekTarg(f.NearPlayer(e).pos, e.pos, 1);
				i.slide *= .9f;
				e.pos = e.pos * .99f + .01f * i.goal + i.slide;
				e.ang = i.angAnim.Val(f.tick) + rd.f(-i.shakeAmount, i.shakeAmount);
				nm.ease(ref i.shakeAmount, 0f, .05f);},
			shotTouch = (e, user, info) => {},
			breathTouch = (e, user, info) => {
				if (e.pos.z > 5) return;
				if(info.strength == 3) {
					i.slide += user.vel * .3f;
					if (i.shootDelay > 0) return;
					i.shootDelay = 90;
                    f.gameSys.Sound(f.foes.guyThrowSound, 1);
					for (var j = -1; j < 2; j++) { f.MakeShot(new v3(e.pos.x, e.pos.y, f.playerSys.playerEnt.pos.z), j, e, i.sprites, rd.f(-2f, 2f ), false, .5f ); }}
				else i.slide += user.vel*.3f;}};

        dogHead.pos = new v3(2, 3, 0);
        dogHead.scale = 2;

        cloud.pos = new v3(0, 0, .1f);} }