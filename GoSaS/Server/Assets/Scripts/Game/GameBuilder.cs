using UnityEngine;
using System;
using v3 = UnityEngine.Vector3;
using APG;

public class AudiencePhaseStatus {
	public float midpointTimer = 0;
	public bool doingEnd = false;
	public v3 audiencePos;
	public v3 cameraPos;
	public v3 lastLookAtPos = new v3(0, 0, 0);
	public v3 lastLookFromPos = new v3(0, 0, 0);}

class BackgroundUpdates{
    public static void Make( Transform transform ){
        var tick = 0f;
        var src = new ent() { name = "worldBkg" };
        new ent { sprite = Art.Backgrounds.sky.set.files[0].spr, parent = src, ignorePause=true, pos = new v3(0, 0, 60), scale = 50, name = "Sky1", layer=Layers.Background, update=e=> { tick++; e.pos = transform.position; } };
        new ent { sprite = Art.Backgrounds.sky.set.files[4].spr, parent = src, ignorePause = true, pos = new v3(0, 0, 59), scale = 50, name = "Sky2", layer = Layers.Background, update = e=> {  e.color = new Color(1f, 1f, 1f, tick * .001f); } };
        new ent { sprite = Art.Backgrounds.LandToHorizon.spr, parent = src, ignorePause = true, pos = new v3(0, -6, 9), scale3 = new v3(5,3,1), name = "Ground", layer = Layers.Background, update = e => { e.pos = new v3( transform.position.x, transform.position.y-6, 9); } };

        new ent { sprite = Art.Overlays.screenlight.spr, parent = src, ignorePause=true, pos = new v3(0, 0, -7f), scale = 1.4f, name = "Overlay1", layer = Layers.OverlayFX,
            update = e => {
                e.pos = new v3(  transform.position.x, transform.position.y, transform.position.z + 3);
                e.color = new Color(1f, 1f, .9f, .15f + .11f * Mathf.Cos(tick * .01f + 73.0f) + .13f * Mathf.Cos(tick * .0073f + 13.0f));
                e.ang = .2f + 21f * Mathf.Cos(tick * .01f + 73.0f) + 16f * Mathf.Cos(tick * .0153f + 13.0f); } };
        new ent { sprite = Art.Overlays.screenlight.spr, parent = src, ignorePause=true, pos = new v3(0, 0, 2f), scale = 6f, name = "Overlay2", layer = Layers.OverlayFX,
            update = e => {
                e.pos = new v3(  transform.position.x, transform.position.y, 2);
                e.color = new Color(1f, 1f, .9f, .22f + .09f * Mathf.Cos(tick * .0083f + 173.0f) + .17f * Mathf.Cos(tick * .0063f + 23.0f));
                e.ang = .2f + 11f * Mathf.Cos(tick * .0111f + 173.0f) + 23f * Mathf.Cos(tick * .0273f + 213.0f); } };
        new ent { sprite = Art.Overlays.screenlight.spr, parent = src, ignorePause=true, pos = new v3(0, 0, 6f), scale = 8f, name = "Overlay3", layer = Layers.OverlayFX,
            update = e => {
                e.pos = new v3(  transform.position.x, transform.position.y, 6);
                e.color = new Color(1f, 1f, .9f, .22f + .07f * Mathf.Cos(tick * .0113f + 273.0f) + .23f * Mathf.Cos(tick * .0093f + 33.0f));
                e.ang = .2f + 17f * Mathf.Cos(tick * .0131f + 273.0f) + 13f * Mathf.Cos(tick * .0193f + 313.0f); } };}}

class MusicInfo{
    float musicVol = 1f;
    AudioSource audio;
    bool doingSongFade = false;
    AudioClip nextSong = null;

    public void Init( GameObject assets ){
		audio = assets.GetComponent<AudioSource>();
        audio.clip = Art.Music.somenes19b.snd;
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

class MainGame{
    public static void Make( FullGame g, APGBasicGameLogic basicGameLogic, TwitchNetworking gameLogicChat ){
        bool exitingTitle = false;
        bool isPaused = false;
        float pauseRatio = 0;
        var backgrounds = new Backgrounds();

        var transform = basicGameLogic.gameCamera.transform;

        var aspect = Camera.main.aspect;
		g.gameSys = new GameSys(transform);
        ent.BaseGameSys = g.gameSys;
        var reactSys = new ReactSys();
        reactSys.Init();
        basicGameLogic.SetFields(g.aStatus, basicGameLogic.gameCamera.transform, backgrounds);
		basicGameLogic.SetGameSys(g.gameSys);
        IntroPlaques.MakeIntroPlaque(basicGameLogic.gameCamera, () => { exitingTitle = true; });
        var playerSys = new PlayerSys();
        basicGameLogic.SetPlayers(playerSys);
        var audiencePlayerSys = new AudiencePlayerSys();
        basicGameLogic.SetAudiencePlayers(audiencePlayerSys);
		var treatSys = new TreatSys(g.gameSys, reactSys);
		var foeSys = new FoeSys(g.gameSys, playerSys, audiencePlayerSys, treatSys);
		playerSys.Setup(g.gameSys, foeSys, reactSys, basicGameLogic.gameCamera.transform, basicGameLogic );
		audiencePlayerSys.Setup(g.gameSys, foeSys, playerSys, gameLogicChat.GetAudienceSys(), treatSys);
        backgrounds.Setup(g.gameSys, playerSys, treatSys);
        var spawnSys = new SpawnSys();
        SpawnContent.InitSpawns(spawnSys, foeSys, treatSys);
        var waveHUD = new WaveHUD(g.gameSys, transform, spawnSys, audiencePlayerSys, gameLogicChat.GetAudienceSys().MobileJoinQRCode(), playerSys, basicGameLogic );
        var musics = new MusicInfo();
        musics.Init( basicGameLogic.gameCamera );
        BackgroundUpdates.Make(transform);

        float tick2 = 0;
        bool DoEndOfGameFadeOut = true;
        bool pauseLatch = false;

        new ent { ignorePause = true, update = e => {
            FullGame.tick++;
		    if (!basicGameLogic.waitingForGameToStart) tick2++;
		    treatSys.soundTick = tick2;
		    audiencePlayerSys.soundTick = tick2;
		    foeSys.tick = tick2;
		    if (g.gameSys.gameOver) { if (DoEndOfGameFadeOut) { DoEndOfGameFadeOut = false; musics.FadeSongTo( Art.Music.somenes19b.snd );}}
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

		    if (basicGameLogic.waitingForGameToStart) {
			    if (exitingTitle && (Input.GetKey(KeyCode.Escape) || Input.GetKey(KeyCode.Space) || Input.GetButton("Fire1") || Input.GetButton("Fire2"))) {
				    basicGameLogic.OnGameStart();
				    basicGameLogic.waitingForGameToStart = false;
                    musics.FadeSongTo( Art.Music.GoSaS.snd );}}

		    if (aspect == 1.6f) {transform.position += new Vector3(0, .7f, -1.1f);}
		    if (aspect == 1.5f) {transform.position += new Vector3(0, 1.3f, -1.9f);} 
		    if (Mathf.Abs(aspect - 4f / 3f) < .001f) {transform.position += new Vector3(0, 1.9f, -3.3f);}

		    if (!isPaused && pauseRatio == 0 && g.gameSys.gameOver == false && basicGameLogic.waitingForGameToStart == false) {
			    spawnSys.Update(basicGameLogic.GetGameTime());
			    backgrounds.GameUpdate(basicGameLogic.GetRoundTime());}

            g.fullPauseActive = isPaused || pauseRatio > 0 || basicGameLogic.waitingForGameToStart;} };}}

public class FullGame {
    public static Action resetGame;
	public static float tick = 0;
    public static int ticksPerSecond = 60;
    public bool fullPauseActive;
    public GameSys gameSys;
    public AudiencePhaseStatus aStatus = new AudiencePhaseStatus();
	public void RunUpdate() { gameSys.Update( fullPauseActive );}
	public FullGame(APGBasicGameLogic basicGameLogic, TwitchNetworking gameLogicChat) {
        resetGame = () => { MainGame.Make(this, basicGameLogic, gameLogicChat ); };
        MainGame.Make(this, basicGameLogic, gameLogicChat );}}