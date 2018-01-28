using UnityEngine;
using System;
using v3 = UnityEngine.Vector3;
using APG;
using System.Collections.Generic;

public class GameBuilder : MonoBehaviour {
	public GameObject basicSpriteObject;
	public Material glowMaterial;
	public GameObject textName;

	public Sprite introPlaque;
	public Sprite playerHighlight;

	public IncomingWaveHUD incomingWaveHUD;
	public Backgrounds backgrounds;
	public Foes foes;
	public Players players;
	public Treats treats;
	public Reacts reacts;
	public Buildings buildings;
    public Title title;

    public ArtSet art;

    public TwitchNetworking gameLogicChat;
	public APGBasicGameLogic basicGameLogic;

	public MusicSet musicSet;

	FullGame fullGame;

	public void MakeRoundEnd(int roundNumber, APlayerInfo[,]  grid, Action audienceActionsEnded) {
        AudiencePhase.MakeRoundEnd( fullGame.aStatus, roundNumber, grid, audienceActionsEnded, transform, textName,playerHighlight, glowMaterial, players.actionBkg, players, backgrounds);
    }
	void Start() { Application.runInBackground = true; fullGame = new FullGame(this, transform);}
	void FixedUpdate() {fullGame.RunUpdate();}}








class IntroPlaques{
    static void MakeIntroPlaque2(GameBuilder assets, Transform transform ){
        new ent() { ignorePause = true, sprite = assets.introPlaque, parentTrans = transform, scale = 1.3f, pos = new v3(0, 0, 10), health = 1,
            update = e2 => {
                if (Input.GetKey(KeyCode.Escape) || Input.GetKey(KeyCode.Space) || Input.GetButton("Fire1") || Input.GetButton("Fire2")) e2.health = 0;
                if (e2.health > 0) { var v = e2.pos; nm.ease(ref v, new v3(0, 0, 10), .1f); e2.pos = v; }
                else { var v = e2.pos; nm.ease(ref v, new v3(0, -10, 10), .1f); e2.pos = v; }
                if (e2.pos.y < -9f) e2.remove();}};}

    public static void MakeIntroPlaque(GameBuilder assets, Action doExit ) {
        var xs = new float[] {-4, 4, -3f, 4, -2f };
        var ys = new float[] {4, 2.5f, 1, -.5f, -2 };
        var scs = new float[] { .6f, .4f, .6f,.4f,.6f };
        var side = new float[] { 2, .5f, 2, .7f, 2f };
        var balloonx = new float[] { 0, 0, 0, 0, 0 };
        for (var k2 = 0; k2 < 5;k2++) {
            var balloons = new List<ent>();
            for (var j = 0; j < 3; j++)
                balloons.Add(new ent() { ignorePause = true, name="titleWordBalloon", sprite = assets.title.balloons[(k2*3+j)%8], scale = .35f, pos = new v3(0, 0, 1) });
            var k = k2;
            var tick = 0;
            var center = new v3(rd.f(-20, 20), rd.f(15, 30), rd.f(-15, 15));
            var centerGoal = new v3(0, 0, 0);
            var delay = k2 * 20;
            var escape = false;
		    new ent() { ignorePause = true, sprite = assets.title.words[k2], parentTrans = assets.transform, scale = scs[k2]+.15f, pos = center, health = 1, children = balloons, name="titleWord",
			    update = e2 => {
                    if (Input.GetKey(KeyCode.Escape) || Input.GetKey(KeyCode.Space) || Input.GetButton("Fire1") || Input.GetButton("Fire2")) { escape = true; centerGoal= new v3(rd.f(-20, 20), rd.f(15, 30), rd.f(-15, 15)); delay = k * 2; }
                    if (escape == true){
                        if (delay > 0) delay--;
                        else center = center * .99f + .01f * centerGoal;
                        e2.ang = .2f + 3f * Mathf.Cos(tick * .01f + 73.0f+k*77) + 2.3f * Mathf.Cos(tick * .0153f + 13.0f+k*47);
                        e2.pos = center+new v3(
                            xs[k] + .3f * Mathf.Cos(tick * .008f + 73.0f+k*32) + .13f * Mathf.Cos(tick * .0123f + 13.0f+k*71), 
                            ys[k] + .1f * Mathf.Cos(tick * .009f + 73.0f+k*66) + .17f * Mathf.Cos(tick * .0133f + 13.0f+k*83), 
                            10  + .5f * Mathf.Cos(tick * .011f + 73.0f+k*44) + .3f * Mathf.Cos(tick * .0143f + 13.0f+k*21));
                        if (e2.pos.y > 12f) { e2.remove(); if (k == 0) { /*exitingTitle = true;*/ doExit(); MakeIntroPlaque2( assets, assets.transform ); } }
                        return;}
                    if (delay > 0) { delay--; return; }
                    center = center * .98f + .02f * centerGoal;
                    tick++;
                    e2.ang = .2f + 3f * Mathf.Cos(tick * .01f + 73.0f+k*77) + 2.3f * Mathf.Cos(tick * .0153f + 13.0f+k*47);
                    e2.pos = center+new v3(
                        xs[k] + .3f * Mathf.Cos(tick * .008f + 73.0f+k*32) + .13f * Mathf.Cos(tick * .0123f + 13.0f+k*71), 
                        ys[k] + .1f * Mathf.Cos(tick * .009f + 73.0f+k*66) + .17f * Mathf.Cos(tick * .0133f + 13.0f+k*83), 
                        10  + .5f * Mathf.Cos(tick * .011f + 73.0f+k*44) + .3f * Mathf.Cos(tick * .0143f + 13.0f+k*21));
                    for (var j = 0; j < 3; j++) balloons[j].ang = -e2.ang;}};
            for (var j = 0; j < 3; j++) balloons[j].pos = new v3(balloonx[k2]+ -side[k2] + 2 * j*side[k2], 2, 1);}}}

class SpawnContent{
	public static void InitSpawns(SpawnSys spawnSys, IncomingWaveHUD incomingWaveHUD, FoeSys foeSys, TreatSys treatSys) {

		var foeTime = 50;
		var foeOffset = 6;

		var turnEnd = new SpawnEntry { icon = incomingWaveHUD.phaseDivider, spawn = () => { }, message = "", scale = 5 };
		var roundMarker = new SpawnEntry { icon = incomingWaveHUD.phaseDivider, spawn = () => { }, message = "", scale = 2, iconYOffset = -.7f };
		for (var k = 1; k < 20; k++) spawnSys.Add(5+50 * k, turnEnd);
		for (var k = 0; k < 12; k++) spawnSys.Add(5 + 50 * k + 36, new SpawnEntry { icon = incomingWaveHUD.roundNums[k], spawn = () => { }, message = "", scale = 8, iconYOffset = -.9f });

		var smallPositive = new SpawnEntry[] { treatSys.balloonClusterLeft, treatSys.balloonClusterBottomLeft, treatSys.balloonClusterRight, treatSys.balloonClusterBottomRight };
		var smallPositiveUnbiased = new SpawnEntry[] { treatSys.balloonClusterBottom };
		var bigPositive = new SpawnEntry[] { treatSys.balloonGridLeft, treatSys.balloonGridRight };
		var bigPositiveUnbiased = new SpawnEntry[] { treatSys.balloonGridAll, treatSys.balloonGridCenter };

        var normalFoes = new SpawnEntry[] { foeSys.beardGame.beardGuy, foeSys.beardGame.beardGuy, foeSys.plantGame.plantGuy};
        //var normalFoes = new SpawnEntry[] { foeSys.dogGame.dog };

        //var normalFoeGames = new Subgame[] { foeSys.dogGame };
        var normalFoeGames = new Subgame[] { foeSys.beardGame };
        //var normalFoeGames = new Subgame[] { foeSys.plantGame };

        Func<SpawnEntry[], SpawnEntry> rs = choices => choices[rd.i(0, choices.Length)];

		Action<SpawnEntry[], int, int> addTwo = (choices, time, timeAdd) => {
			var id = rd.i(0, choices.Length);
			var id2 = (id + choices.Length / 2) % choices.Length;
			spawnSys.Add(time, choices[id]);
			spawnSys.Add(time + timeAdd, choices[id2]);};

		addTwo(smallPositive, 6, 6);
		spawnSys.Add(18, rs(smallPositiveUnbiased));

        //spawnSys.Add(foeOffset, rs(normalFoes));
        normalFoeGames[rd.i(0, normalFoeGames.Length)].Run(foeOffset, spawnSys);

        addTwo(smallPositive, 24, 6);

		addTwo(smallPositive, 46, 6);

		spawnSys.Add(foeOffset + foeTime, rs(normalFoes));

		spawnSys.Add(68, rs(smallPositiveUnbiased));

		spawnSys.Add(foeOffset + foeTime*2, rs(normalFoes));

		addTwo(smallPositive, 90, 6);

		spawnSys.Add(110, rs(bigPositiveUnbiased));

		spawnSys.Add(foeOffset + foeTime*3, rs(normalFoes));

		addTwo(bigPositive, 140, 6);

		addTwo(smallPositive, 160, 6);

		spawnSys.Add(foeOffset + foeTime*4, rs(normalFoes));

		addTwo(smallPositive, 190, 6);

		addTwo(smallPositive, 200 + 6, 6);
		spawnSys.Add(200 + 18, rs(smallPositiveUnbiased));

		spawnSys.Add(foeOffset + foeTime*5, rs(normalFoes));

		addTwo(smallPositive, 200 + 24, 6);

		addTwo(smallPositive, 200 + 46, 6);

		spawnSys.Add(foeOffset + foeTime*6, rs(normalFoes));

		spawnSys.Add(200 + 68, rs(smallPositiveUnbiased));

		spawnSys.Add(foeOffset + foeTime*7, rs(normalFoes));

		addTwo(smallPositive, 200 + 90, 6);

		spawnSys.Add(200 + 110, rs(bigPositiveUnbiased));

		spawnSys.Add(foeOffset + foeTime*8, rs(normalFoes));

		addTwo(bigPositive, 200 + 140, 6);

		addTwo(smallPositive, 200 + 160, 6);

		spawnSys.Add(foeOffset + foeTime*9, rs(normalFoes));

		addTwo(smallPositive, 200 + 190, 6);

		spawnSys.Sort();}}

public class AudiencePhaseStatus {
	public float midpointTimer = 0;
	public bool doingEnd = false;
	public v3 audiencePos;
	public v3 cameraPos;
	public v3 lastLookAtPos = new v3(0, 0, 0);
	public v3 lastLookFromPos = new v3(0, 0, 0);}

class BackgroundUpdates{
    public static void Make( GameBuilder assets, Transform transform ){
        var tick = 0f;
        var src = new ent() { name = "worldBkg" };
        new ent { sprite = assets.backgrounds.skies[0], parent = src, ignorePause=true, pos = new v3(0, 0, 60), scale = 50, name = "Sky1", layer=Layers.Background, update=e=> { tick++; e.pos = transform.position; } };
        new ent { sprite = assets.backgrounds.skies[4], parent = src, ignorePause = true, pos = new v3(0, 0, 59), scale = 50, name = "Sky2", layer = Layers.Background, update = e=> {  e.color = new Color(1f, 1f, 1f, tick * .001f); } };
        new ent { sprite = assets.backgrounds.land, parent = src, ignorePause = true, pos = new v3(0, -6, 9), scale3 = new v3(5,3,1), name = "Ground", layer = Layers.Background, update = e => { e.pos = new v3( transform.position.x, transform.position.y-6, 9); } };

        new ent { sprite = assets.backgrounds.overlay, parent = src, ignorePause=true, pos = new v3(0, 0, -7f), scale = 1.4f, name = "Overlay1", layer = Layers.OverlayFX,
            update = e => {
                e.pos = new v3(  transform.position.x, transform.position.y, transform.position.z + 3);
                e.color = new Color(1f, 1f, .9f, .15f + .11f * Mathf.Cos(tick * .01f + 73.0f) + .13f * Mathf.Cos(tick * .0073f + 13.0f));
                e.ang = .2f + 21f * Mathf.Cos(tick * .01f + 73.0f) + 16f * Mathf.Cos(tick * .0153f + 13.0f); } };
        new ent { sprite = assets.backgrounds.overlay, parent = src, ignorePause=true, pos = new v3(0, 0, 2f), scale = 6f, name = "Overlay2", layer = Layers.OverlayFX,
            update = e => {
                e.pos = new v3(  transform.position.x, transform.position.y, 2);
                e.color = new Color(1f, 1f, .9f, .22f + .09f * Mathf.Cos(tick * .0083f + 173.0f) + .17f * Mathf.Cos(tick * .0063f + 23.0f));
                e.ang = .2f + 11f * Mathf.Cos(tick * .0111f + 173.0f) + 23f * Mathf.Cos(tick * .0273f + 213.0f); } };
        new ent { sprite = assets.backgrounds.overlay, parent = src, ignorePause=true, pos = new v3(0, 0, 6f), scale = 8f, name = "Overlay3", layer = Layers.OverlayFX,
            update = e => {
                e.pos = new v3(  transform.position.x, transform.position.y, 6);
                e.color = new Color(1f, 1f, .9f, .22f + .07f * Mathf.Cos(tick * .0113f + 273.0f) + .23f * Mathf.Cos(tick * .0093f + 33.0f));
                e.ang = .2f + 17f * Mathf.Cos(tick * .0131f + 273.0f) + 13f * Mathf.Cos(tick * .0193f + 313.0f); } };}}

class MusicInfo{
    float musicVol = 1f;
    AudioSource audio;
    bool doingSongFade = false;
    AudioClip nextSong = null;

    public void Init( GameBuilder assets ){
		audio = assets.GetComponent<AudioSource>();
        audio.clip = assets.musicSet.titleSong;
        audio.loop = true;
        audio.Play();}
	public void FadeSongTo(AudioClip theNextSong) {
        nextSong = theNextSong;
        doingSongFade = true;}
    public void UpdateMusic() {
		if (doingSongFade) {
            musicVol *= .9f;
            audio.volume = musicVol;
			if (musicVol < .01f) {
                audio.Stop();
                audio.clip = nextSong;
                musicVol = audio.volume = 0;
                audio.Play();
                nextSong = null;
                doingSongFade = false;}}
		else {if (musicVol < .99f) { musicVol = musicVol * .9f + .1f * 1; audio.volume = musicVol;}}}}















class TitleGame{
    public static void Make( FullGame g, GameBuilder a, Transform transform){
        bool exitingTitle = false;
        bool isPaused = false;
        float pauseRatio = 0;

        var aspect = Camera.main.aspect;
		g.gameSys = new GameSys(a.basicSpriteObject, transform);
        ent.BaseGameSys = g.gameSys;
        var reactSys = new ReactSys();
        reactSys.Init(a.reacts);
        a.basicGameLogic.SetFields(g.aStatus, a.transform, a.textName, a.playerHighlight, a.glowMaterial, a.players.actionBkg, a.players, a.backgrounds);
		a.basicGameLogic.SetGameSys(g.gameSys);
        IntroPlaques.MakeIntroPlaque(a, () => { exitingTitle = true; });
        var playerSys = new PlayerSys();
        a.basicGameLogic.SetPlayers(playerSys);
        var audiencePlayerSys = new AudiencePlayerSys();
        a.basicGameLogic.SetAudiencePlayers(audiencePlayerSys);
		//var treatSys = new TreatSys(a.treats, g.gameSys, reactSys);
		//var foeSys = new FoeSys(a.foes, g.gameSys, playerSys, audiencePlayerSys, treatSys, a.art);
		//playerSys.Setup(g.gameSys, a.players, foeSys, reactSys);
		//audiencePlayerSys.Setup(g.gameSys, a.players, foeSys, playerSys, a.gameLogicChat.GetAudienceSys(), treatSys);
        a.backgrounds.Title(g.gameSys, a.buildings, playerSys, null);
        //var spawnSys = new SpawnSys();
        //SpawnContent.InitSpawns(spawnSys, a.incomingWaveHUD, foeSys, treatSys);
        //var waveHUD = new WaveHUD(g.gameSys, a.incomingWaveHUD, transform, spawnSys, audiencePlayerSys, a.gameLogicChat.GetAudienceSys().MobileJoinQRCode(), playerSys );
        var musics = new MusicInfo();
        musics.Init( a );
        BackgroundUpdates.Make(a, transform);

        float tick2 = 0;
        bool DoEndOfGameFadeOut = true;
        bool pauseLatch = false;

        new ent { ignorePause = true, update = e => {
            FullGame.tick++;
		    if (!a.basicGameLogic.waitingForGameToStart) tick2++;
		    //treatSys.soundTick = tick2;
		    audiencePlayerSys.soundTick = tick2;
		    //foeSys.tick = tick2;
		    if (g.gameSys.gameOver) { if (DoEndOfGameFadeOut) { DoEndOfGameFadeOut = false; musics.FadeSongTo(a.musicSet.titleSong);}}
            musics.UpdateMusic();
		    pauseRatio = g.aStatus.midpointTimer;
		    v3 lookPos = new v3(0,0,0);
		    //if (playerSys.player2Ent == null) {lookPos = playerSys.playerEnt.pos;}
		    //else {lookPos = (playerSys.playerEnt.pos + playerSys.player2Ent.pos) / 2;}
		    lookPos.y -= 14f;// 10f;
		    //if(g.aStatus.doingEnd ) waveHUD.pauseRatio = waveHUD.pauseRatio * .99f + .01f * 1;
		    //else waveHUD.pauseRatio = waveHUD.pauseRatio * .9f + .1f * 0;
		    if (pauseRatio > 0 && pauseRatio < 1) {
			    AudiencePhase.EndOfRoundCamera(g.aStatus.cameraPos, ref g.aStatus.lastLookAtPos, ref g.aStatus.lastLookFromPos, pauseRatio, ref lookPos, transform);}
		    else {
                g.aStatus.lastLookAtPos = lookPos;
			    nm.ease(ref g.aStatus.lastLookFromPos, new v3(lookPos.x * .03f, lookPos.y * .03f, -10), .3f);
			    transform.LookAt(new v3(transform.position.x * .97f + .03f * lookPos.x, transform.position.y * .97f + .03f * lookPos.y, lookPos.z));
			    transform.position = g.aStatus.lastLookFromPos;}
		    if (Input.GetKey(KeyCode.Escape)) {if (!pauseLatch) {isPaused = !isPaused;pauseLatch = true;}}
		    else pauseLatch = false;

		    if (a.basicGameLogic.waitingForGameToStart) {
			    if (exitingTitle && (Input.GetKey(KeyCode.Escape) || Input.GetKey(KeyCode.Space) || Input.GetButton("Fire1") || Input.GetButton("Fire2"))) {
				    a.basicGameLogic.OnGameStart();
				    a.basicGameLogic.waitingForGameToStart = false;
                    musics.FadeSongTo(a.musicSet.mainSongs[2]);}}

		    if (aspect == 1.6f) {transform.position += new Vector3(0, .7f, -1.1f);}
		    if (aspect == 1.5f) {transform.position += new Vector3(0, 1.3f, -1.9f);} 
		    if (Mathf.Abs(aspect - 4f / 3f) < .001f) {transform.position += new Vector3(0, 1.9f, -3.3f);}

		    if (!isPaused && pauseRatio == 0 && g.gameSys.gameOver == false && a.basicGameLogic.waitingForGameToStart == false) {
			    //spawnSys.Update(a.basicGameLogic.GetGameTime());
			    a.backgrounds.GameUpdate(a.basicGameLogic.GetRoundTime());}

            g.fullPauseActive = isPaused || pauseRatio > 0 || a.basicGameLogic.waitingForGameToStart;} };}}


class MainGame{
    public static void Make( FullGame g, GameBuilder a, Transform transform){
        bool exitingTitle = false;
        bool isPaused = false;
        float pauseRatio = 0;

        var aspect = Camera.main.aspect;
		g.gameSys = new GameSys(a.basicSpriteObject, transform);
        ent.BaseGameSys = g.gameSys;
        var reactSys = new ReactSys();
        reactSys.Init(a.reacts);
        a.basicGameLogic.SetFields(g.aStatus, a.transform, a.textName, a.playerHighlight, a.glowMaterial, a.players.actionBkg, a.players, a.backgrounds);
		a.basicGameLogic.SetGameSys(g.gameSys);
        IntroPlaques.MakeIntroPlaque(a, () => { exitingTitle = true; });
        var playerSys = new PlayerSys();
        a.basicGameLogic.SetPlayers(playerSys);
        var audiencePlayerSys = new AudiencePlayerSys();
        a.basicGameLogic.SetAudiencePlayers(audiencePlayerSys);
		var treatSys = new TreatSys(a.treats, g.gameSys, reactSys);
		var foeSys = new FoeSys(a.foes, g.gameSys, playerSys, audiencePlayerSys, treatSys, a.art);
		playerSys.Setup(g.gameSys, a.players, foeSys, reactSys, a.introPlaque, a.transform);
		audiencePlayerSys.Setup(g.gameSys, a.players, foeSys, playerSys, a.gameLogicChat.GetAudienceSys(), treatSys);
        a.backgrounds.Setup(g.gameSys, a.buildings, playerSys, treatSys);
        var spawnSys = new SpawnSys();
        SpawnContent.InitSpawns(spawnSys, a.incomingWaveHUD, foeSys, treatSys);
        var waveHUD = new WaveHUD(g.gameSys, a.incomingWaveHUD, transform, spawnSys, audiencePlayerSys, a.gameLogicChat.GetAudienceSys().MobileJoinQRCode(), playerSys );
        var musics = new MusicInfo();
        musics.Init( a );
        BackgroundUpdates.Make(a, transform);

        float tick2 = 0;
        bool DoEndOfGameFadeOut = true;
        bool pauseLatch = false;

        new ent { ignorePause = true, update = e => {
            FullGame.tick++;
		    if (!a.basicGameLogic.waitingForGameToStart) tick2++;
		    treatSys.soundTick = tick2;
		    audiencePlayerSys.soundTick = tick2;
		    foeSys.tick = tick2;
		    if (g.gameSys.gameOver) { if (DoEndOfGameFadeOut) { DoEndOfGameFadeOut = false; musics.FadeSongTo(a.musicSet.titleSong);}}
            musics.UpdateMusic();
		    pauseRatio = g.aStatus.midpointTimer;
		    v3 lookPos;
		    if (playerSys.player2Ent == null) {lookPos = playerSys.playerEnt.pos;}
		    else {lookPos = (playerSys.playerEnt.pos + playerSys.player2Ent.pos) / 2;}
		    lookPos.y -= 14f;// 10f;
		    if(g.aStatus.doingEnd ) waveHUD.pauseRatio = waveHUD.pauseRatio * .99f + .01f * 1;
		    else waveHUD.pauseRatio = waveHUD.pauseRatio * .9f + .1f * 0;
		    if (pauseRatio > 0 && pauseRatio < 1) {
			    AudiencePhase.EndOfRoundCamera(g.aStatus.cameraPos, ref g.aStatus.lastLookAtPos, ref g.aStatus.lastLookFromPos, pauseRatio, ref lookPos, transform);}
		    else {
                g.aStatus.lastLookAtPos = lookPos;
			    nm.ease(ref g.aStatus.lastLookFromPos, new v3(lookPos.x * .03f, lookPos.y * .03f, -10), .3f);
			    transform.LookAt(new v3(transform.position.x * .97f + .03f * lookPos.x, transform.position.y * .97f + .03f * lookPos.y, lookPos.z));
			    transform.position = g.aStatus.lastLookFromPos;}
		    if (Input.GetKey(KeyCode.Escape)) {if (!pauseLatch) {isPaused = !isPaused;pauseLatch = true;}}
		    else pauseLatch = false;

		    if (a.basicGameLogic.waitingForGameToStart) {
			    if (exitingTitle && (Input.GetKey(KeyCode.Escape) || Input.GetKey(KeyCode.Space) || Input.GetButton("Fire1") || Input.GetButton("Fire2"))) {
				    a.basicGameLogic.OnGameStart();
				    a.basicGameLogic.waitingForGameToStart = false;
                    musics.FadeSongTo(a.musicSet.mainSongs[2]);}}

		    if (aspect == 1.6f) {transform.position += new Vector3(0, .7f, -1.1f);}
		    if (aspect == 1.5f) {transform.position += new Vector3(0, 1.3f, -1.9f);} 
		    if (Mathf.Abs(aspect - 4f / 3f) < .001f) {transform.position += new Vector3(0, 1.9f, -3.3f);}

		    if (!isPaused && pauseRatio == 0 && g.gameSys.gameOver == false && a.basicGameLogic.waitingForGameToStart == false) {
			    spawnSys.Update(a.basicGameLogic.GetGameTime());
			    a.backgrounds.GameUpdate(a.basicGameLogic.GetRoundTime());}

            g.fullPauseActive = isPaused || pauseRatio > 0 || a.basicGameLogic.waitingForGameToStart;} };}}

class FullGame {

    public static Action resetGame;

	public static float tick = 0;
    public static int ticksPerSecond = 60;
    public bool fullPauseActive;
    public GameSys gameSys;
    public AudiencePhaseStatus aStatus = new AudiencePhaseStatus();
	public void RunUpdate() { gameSys.Update( fullPauseActive );}
	public FullGame(GameBuilder assets, Transform transform) {

        resetGame = () => { MainGame.Make(this, assets, transform); };

        MainGame.Make(this, assets, transform);
        //TitleGame.Make(this, assets, transform);

    } }