using UnityEngine;
using System;
using System.Collections.Generic;
using v3 = UnityEngine.Vector3;
using APG;

public class GameBuilder : MonoBehaviour {
	public GameObject basicSpriteObject;

	public GameObject sky, sky2, ground, overlay1, overlay2, overlay3;

	public Sprite introPlaque;
	public Sprite playerHighlight;
	public GameObject textName;

	public IncomingWaveHUD incomingWaveHUD;
	public Backgrounds backgrounds;
	public Foes foes;
	public Players players;
	public Treats treats;
	public Props props;
	public Reacts reacts;

	public TwitchNetworking gameLogicChat;
	public APGBasicGameLogic basicGameLogic;

	public MusicSet musicSet;

	FullGame fullGame;

	public void MakeRoundEnd(int roundNumber, int ticksPerSecond, AudiencePlayerEventsHandler[,]  grid, List<PlayerEndOfRoundInfo> info, Action<int> setPauseTimer) { fullGame.MakeRoundEnd(roundNumber, ticksPerSecond, grid, info, setPauseTimer);}
	void Start() {
		Application.runInBackground = true;
		overlay2.GetComponent<SpriteRenderer>().sortingOrder = Math.Min(Math.Max((int)(-(2)* 1024.0f), -32768), 32767);
		overlay3.GetComponent<SpriteRenderer>().sortingOrder = Math.Min(Math.Max((int)(-(6) * 1024.0f), -32768), 32767);
		fullGame = new FullGame(this);
		fullGame.Init(this);}
	void Update() {}
	void FixedUpdate() {fullGame.RunUpdate(transform);}}

class FullGame {

	public static float xForSlot(int x, float z) {
		return 0;//
	}

	float tick = 0;
	float tick2 = 0;

	GameSys gameSys;
	FoeSys foeSys;
	PlayerSys playerSys = new PlayerSys();
	AudiencePlayerSys audiencePlayerSys = new AudiencePlayerSys();
	TreatSys treatSys;
	PropSys propSys;
	ReactSys reactSys = new ReactSys();
	SpawnSys spawnSys = new SpawnSys();
	WaveHUD waveHUD;

	bool pauseLatch = false;
	bool isPaused = false;

	GameBuilder assets;

	v3[] buildingPos;
	float baseCameraZ;
	float aspect;

	float musicVol = 1f;
	AudioSource audio;
	bool fadedOutGameMusic = false;
	v3 lastLookAtPos = new v3(0, 0, 0);
	v3 lastLookFromPos = new v3(0, 0, 0);
	bool doingSongFade = false;
	AudioClip nextSong = null;
	bool DoEndOfGameFadeOut = true;

	void InitSpawnsTest() {
		//beardGuy, plantGuy, trashGuy, microwaveGuy, mustacheGuy;
		spawnSys.Add(1, foeSys.beardGuy);
		//spawnSys.Add(1, foeSys.nervousTouchGuy);
		//spawnSys.Add(1, foeSys.absentmindedGuy);
	}
	void InitSpawns() {

		var turnEnd = new SpawnEntry { icon = assets.incomingWaveHUD.phaseDivider, spawn = () => { }, message = "", scale = 5 };
		var roundMarker = new SpawnEntry { icon = assets.incomingWaveHUD.phaseDivider, spawn = () => { }, message = "", scale = 2, iconYOffset = -.7f };
		for (var k = 1; k < 20; k++) spawnSys.Add(-3 + (1 + 7 + 40) * k, turnEnd);
		for (var k = 0; k < 12; k++) spawnSys.Add(-3 + (1 + 7 + 40) * k + 36, new SpawnEntry { icon = assets.incomingWaveHUD.roundNums[k], spawn = () => { }, message = "", scale = 8, iconYOffset = -.9f });

		var smallPositive = new SpawnEntry[] { treatSys.balloonClusterLeft, treatSys.balloonClusterBottomLeft, treatSys.balloonClusterRight, treatSys.balloonClusterBottomRight };
		var smallPositiveUnbiased = new SpawnEntry[] { treatSys.balloonClusterBottom };
		var bigPositive = new SpawnEntry[] { treatSys.balloonGridLeft, treatSys.balloonGridRight };
		var bigPositiveUnbiased = new SpawnEntry[] { treatSys.balloonGridAll, treatSys.balloonGridCenter };

		//var normalFoes = new SpawnEntry[] { foeSys.beardGuy, foeSys.microwaveGuy, foeSys.mustacheGuy, foeSys.plantGuy, foeSys.trashGuy };
		var normalFoes = new SpawnEntry[] { foeSys.beardGuy, foeSys.beardGuy, foeSys.plantGuy };

		Func<SpawnEntry[], SpawnEntry> rs = choices => choices[rd.i(0, choices.Length)];

		Action<SpawnEntry[], int, int> addTwo = (choices, time, timeAdd) => {
			var id = rd.i(0, choices.Length);
			var id2 = (id + choices.Length / 2) % choices.Length;
			spawnSys.Add(time, choices[id]);
			spawnSys.Add(time + timeAdd, choices[id2]);};

		addTwo(smallPositive, 6, 6);
		spawnSys.Add(18, rs(smallPositiveUnbiased));

		spawnSys.Add(20, rs(normalFoes));

		addTwo(smallPositive, 24, 6);

		addTwo(smallPositive, 46, 6);

		spawnSys.Add(60, rs(normalFoes));

		spawnSys.Add(68, rs(smallPositiveUnbiased));

		spawnSys.Add(90, rs(normalFoes));

		addTwo(smallPositive, 90, 6);

		spawnSys.Add(110, rs(bigPositiveUnbiased));

		spawnSys.Add(130, rs(normalFoes));

		addTwo(bigPositive, 140, 6);

		addTwo(smallPositive, 160, 6);

		spawnSys.Add(170, rs(normalFoes));

		addTwo(smallPositive, 190, 6);

		addTwo(smallPositive, 200 + 6, 6);
		spawnSys.Add(200 + 18, rs(smallPositiveUnbiased));

		spawnSys.Add(200 + 20, rs(normalFoes));

		addTwo(smallPositive, 200 + 24, 6);

		addTwo(smallPositive, 200 + 46, 6);

		spawnSys.Add(200 + 60, rs(normalFoes));

		spawnSys.Add(200 + 68, rs(smallPositiveUnbiased));

		spawnSys.Add(200 + 90, rs(normalFoes));

		addTwo(smallPositive, 200 + 90, 6);

		spawnSys.Add(200 + 110, rs(bigPositiveUnbiased));

		spawnSys.Add(200 + 130, rs(normalFoes));

		addTwo(bigPositive, 200 + 140, 6);

		addTwo(smallPositive, 200 + 160, 6);

		spawnSys.Add(200 + 170, rs(normalFoes));

		addTwo(smallPositive, 200 + 190, 6);

		spawnSys.Sort();
	}

	void InitSpawnsDemo() {

		var turnEnd = new SpawnEntry { icon = assets.incomingWaveHUD.phaseDivider, spawn = () => { }, message = "", scale = 5 };
		var roundMarker = new SpawnEntry { icon = assets.incomingWaveHUD.phaseDivider, spawn = () => { }, message = "", scale = 2, iconYOffset = -.7f };
		for (var k = 1; k < 20; k++) spawnSys.Add(-3 + (1 + 7 + 40) * k, turnEnd);
		for (var k = 0; k < 12; k++) spawnSys.Add(-3 + (1 + 7 + 40) * k + 36, new SpawnEntry { icon = assets.incomingWaveHUD.roundNums[k], spawn = () => { }, message = "", scale = 8, iconYOffset = -.9f });

		var smallPositive = new SpawnEntry[] { treatSys.balloonClusterLeft, treatSys.balloonClusterBottomLeft, treatSys.balloonClusterRight, treatSys.balloonClusterBottomRight };
		var smallPositiveUnbiased = new SpawnEntry[] { treatSys.balloonClusterBottom };
		var bigPositive = new SpawnEntry[] { treatSys.balloonGridLeft, treatSys.balloonGridRight };
		var bigPositiveUnbiased = new SpawnEntry[] { treatSys.balloonGridAll, treatSys.balloonGridCenter };

		Func<SpawnEntry[], SpawnEntry> rs = choices => choices[rd.i(0, choices.Length)];

		Action<SpawnEntry[], int, int> addTwo = (choices, time, timeAdd) => {
			var id = rd.i(0, choices.Length);
			var id2 = (id + choices.Length / 2) % choices.Length;
			spawnSys.Add(time, choices[id]);
			spawnSys.Add(time + timeAdd, choices[id2]);
		};

		addTwo(smallPositive, 6, 6);

		spawnSys.Add(18, rs(smallPositiveUnbiased));

		spawnSys.Add(30, foeSys.beardGuy);

		addTwo(smallPositive, 48, 6);

		spawnSys.Add(60, foeSys.beardGuy);

		spawnSys.Add(72, rs(smallPositiveUnbiased));

		spawnSys.Add(90, foeSys.plantGuy);

		spawnSys.Add(110, rs(bigPositiveUnbiased));

		spawnSys.Add(130, foeSys.beardGuy);

		addTwo(smallPositive, 160, 6);

		spawnSys.Add(170, foeSys.beardGuy);

		addTwo(smallPositive, 190, 6);

		addTwo(smallPositive, 200 + 6, 6);
		spawnSys.Add(200 + 18, rs(smallPositiveUnbiased));

		spawnSys.Add(200 + 20, foeSys.plantGuy);

		addTwo(smallPositive, 200 + 24, 6);

		addTwo(smallPositive, 200 + 46, 6);

		spawnSys.Add(200 + 60, foeSys.beardGuy);

		spawnSys.Add(200 + 68, rs(smallPositiveUnbiased));

		spawnSys.Add(200 + 90, foeSys.beardGuy);

		addTwo(smallPositive, 200 + 90, 6);

		spawnSys.Add(200 + 110, rs(bigPositiveUnbiased));

		spawnSys.Add(200 + 130, foeSys.plantGuy);

		addTwo(bigPositive, 200 + 140, 6);

		addTwo(smallPositive, 200 + 160, 6);

		spawnSys.Add(200 + 170, foeSys.beardGuy);

		addTwo(smallPositive, 200 + 190, 6);

		spawnSys.Sort();}
	void MakeIntroPlaque() {
		new ent(gameSys) { ignorePause = true, sprite = assets.introPlaque, parentMono = assets, scale = 1.3f, pos = new v3(0, 0, 10), health = 1,
			update = e2 => {
				if (Input.GetKey(KeyCode.Escape) || Input.GetKey(KeyCode.Space) || Input.GetButton("Fire1") || Input.GetButton("Fire2")) e2.health = 0;
				if (e2.health > 0) { var v = e2.pos; nm.ease(ref v, new v3(0, 0, 10), .1f); e2.pos = v; }
				else { var v = e2.pos; nm.ease(ref v, new v3(0, -10, 10), .1f); e2.pos = v; }
				if (e2.pos.y < -9f) e2.remove();}};}

	float midpointTimer = 0; v3 audiencePos; v3 cameraPos;

	void EndOfRoundCamera(float pauseRatio, ref v3 lookPos, Transform transform) {
		// got to be a better way to do this.

		/*var id = (int)( pauseRatio * buildingPos.Length );
		if( id < 0 )id = 0;
		if( id >= buildingPos.Length )id = buildingPos.Length-1;
		var newLookPos = buildingPos[ id ];*/

		var newLookPos = cameraPos; newLookPos.y -= 10f;

		//var newLookPos = new v3(-12 + 24 * pauseRatio, -5, 2.5f);
		//var newLookPos = new v3(-12 + 24 * .5f, -5, 2.5f);

		nm.ease(ref lastLookAtPos, newLookPos, .3f);
		lookPos = lastLookAtPos;
		nm.ease(ref lastLookFromPos, new v3(lookPos.x * .1f, lookPos.y * .1f, -9.5f), .2f);
		//nm.ease(ref lastLookFromPos, new v3(lookPos.x * .1f, lookPos.y * .1f, -11), .2f);
		transform.LookAt(new v3(transform.position.x * .9f + .1f * lookPos.x, transform.position.y * .9f + .1f * lookPos.y, lookPos.z));
		transform.position = lastLookFromPos;}
	
	public void MakeRoundEnd(int roundNumber, int ticksPerSecond, AudiencePlayerEventsHandler[,] grid, List<PlayerEndOfRoundInfo> info, Action<int> setPauseTimer) {
		var roundColors = new Color[] { new Color(.4f, .533f, .266f, 1f), new Color(.266f, .4f, .533f, 1f), new Color(.533f, .266f, .4f, 1f) };

		int usedSpots = 0;
		var spotList = new List<int>();
		var rowList = new List<int>();
		for (var j = 5; j > -1; j--) {
			for (var k = 2; k > -1; k--) {
				if (grid[j, k] != null || grid[6+ j, k] != null) { usedSpots++; spotList.Add(j); rowList.Add(k); } }}
		var turnTime = usedSpots;

		var tick = 0;
		var doingAction = false;
		var atRemove = false;
		new ent(gameSys) { ignorePause = true,
			update = e => {
				tick++;
				if (tick == ticksPerSecond * 1) {
					new ent(gameSys, assets.textName) {
						ignorePause = true, text = "Round " + (roundNumber - 1) + " is over!", parentMono = assets, scale = .1f, pos = new v3(0, 3, 10), health = ticksPerSecond * 2, textColor = roundColors[(roundNumber - 1) % roundColors.Length],
						update = e2 => {
							if (e2.health > 0) { var v = e2.pos; nm.ease(ref v, new v3(0, 3, 10), .1f); e2.pos = v; }
							else { var v = e2.pos; nm.ease(ref v, new v3(0, -10, 10), .1f); e2.pos = v; }
							e2.health--;
							if (e2.pos.y < -9f) e2.remove();}};}
				if (tick == ticksPerSecond * 3) {
					doingAction = true;
					var label = new ent(gameSys, assets.textName) {
						ignorePause = true, text = "Audience Actions for Round " + (roundNumber), parentMono = assets, scale = .1f, pos = new v3(0, 4, 10), textColor = roundColors[(roundNumber) % roundColors.Length],
						update = e2 => {
							if (!atRemove) { var v = e2.pos; nm.ease(ref v, new v3(0, 4, 10), .1f); e2.pos = v; }
							else { var v = e2.pos; nm.ease(ref v, new v3(0, -10, 10), .1f); e2.pos = v; }
							if (e2.pos.y < -9f) e2.remove(); }};
					var curDelay = 0f; var curGrid=-1; var showGlow1 = false; var showGlow2 = false;
					v3 audiencePos2 = new v3(0,0,0);
					new ent(gameSys) {
						ignorePause = true, scale = 1f, pos = new v3(0, 3, 10), sprite = assets.playerHighlight, color = new Color(1, 1, 1, .5f), 
						update = e2 => {
							e2.color = (showGlow2) ? new Color(1, 1, 1, .4f+.3f*Mathf.Cos(tick*.1f)) : new Color(1, 1, 1, 0);
							if (atRemove) e2.remove();
							else { var v = e2.pos; nm.ease(ref v, audiencePos2, .3f); e2.pos = v;}} };

					// highlight names.
					// show action name or icons
					// show faces
					// show health

					new ent(gameSys) {
						ignorePause = true, scale = 1f, pos = new v3(0, 3, 10), sprite = assets.playerHighlight, color = new Color(1, 1, 1, .5f),
						update = e2 => {
							curDelay--;
							if( curDelay <= 0) {
								curGrid++;
								if (curGrid >= usedSpots) atRemove = true;
								else {
									var g1 = grid[spotList[curGrid], rowList[curGrid]];
									var g2 = grid[6+ spotList[curGrid], rowList[curGrid]];
									if (g1 != null) { g1.showActionStart(4); }
									if (g2 != null) { g2.showActionStart(4); }
									if (g1 == null && g2 == null) { label.text = "???"; curDelay = 0; }
									else if (g1 == null) { label.text = g2.getName(); curDelay = ticksPerSecond * 2f; }
									else if (g2 == null) { label.text = g1.getName(); curDelay = ticksPerSecond*2f; }
									else { label.text = g1.getName() + " vs " + g2.getName() + "!"; curDelay = ticksPerSecond*4; }}}
							else {
								var g1 = grid[spotList[curGrid], rowList[curGrid]];
								var g2 = grid[6+ spotList[curGrid], rowList[curGrid]];
								if (g2 != null) { cameraPos = audiencePos2 = g2.getPos() + new v3(0, .5f, -.1f); showGlow2 = true; } else showGlow2 = false;
								if (g1 != null) { cameraPos = audiencePos = g1.getPos() + new v3(0, .5f, -.1f); showGlow1 = true; } else showGlow1 = false;
								if( g1 != null && g2 != null ){ cameraPos = (audiencePos + audiencePos2) / 2; }}

							/*if (id != lastID) {

								if (g1 == null && g2 == null) { label.text = "???"; }
								else if (g1 == null) { label.text = g2.getName(); }
								else if (g2 == null) { label.text = g1.getName(); }
								else { label.text = g1.getName() + " vs " + g2.getName() + "!"; }

								new ent(gameSys, assets.textName) {
									ignorePause = true, scale = .05f, pos = info[id].pos + new v3(0, .5f, -.1f), health = ticksPerSecond * 1, text = info[id].actionName, textColor = info[id].actionColor,
									update = e3 => {
										e3.health--;
										if (e3.health < 10) e3.textAlpha = e3.health / 10f;
										e3.pos = e3.pos + new v3(0, .01f, 0);
										if (e3.health <= 0f) e3.remove();}};
								new ent(gameSys, assets.textName) {
									ignorePause = true, scale = .05f, pos = info[id].pos + new v3(0, .1f, -.1f), health = ticksPerSecond * 1, text = info[id].stanceName, textColor = info[id].stanceColor,
									update = e3 => {
										e3.health--;
										if (e3.health < 10) e3.textAlpha = e3.health / 10f;
										e3.pos = e3.pos + new v3(0, .01f, 0);
										if (e3.health <= 0f) e3.remove();}};}*/

							e2.color = (showGlow1) ? new Color(1, 1, 1, .4f + .3f * Mathf.Cos(tick * .1f)) : new Color(1, 1, 1, 0);
							if (atRemove) e2.remove();
							else { var v = e2.pos; nm.ease(ref v, audiencePos, .3f); e2.pos = v;}}};}
				if (doingAction==false) { midpointTimer = 1; }
				else if (!atRemove) { midpointTimer = .5f;}
				else {for( var k = 0; k < 12;k++ )for(var j = 0; j < 3; j++) {if(grid[k, j] != null )grid[k, j].doMove();}
					midpointTimer = 0;
					setPauseTimer(0);
					e.remove();}}};}

	public void Init(MonoBehaviour src) {
		aspect = Camera.main.aspect;
		gameSys = new GameSys(assets.basicSpriteObject, src.transform);
		reactSys.Init(gameSys, assets.reacts);
		assets.basicGameLogic.SetGameSys(gameSys);
		MakeIntroPlaque();
		assets.basicGameLogic.SetAudiencePlayers(audiencePlayerSys);
		treatSys = new TreatSys(assets.treats, gameSys, reactSys);
		foeSys = new FoeSys(assets.foes, gameSys, playerSys, audiencePlayerSys, treatSys);
		propSys = new PropSys(assets.props, gameSys);
		playerSys.Setup(gameSys, assets.players, foeSys, reactSys);
		audiencePlayerSys.Setup(gameSys, assets.players, foeSys, assets.basicGameLogic.GetPlayers(), playerSys, assets.gameLogicChat.GetAudienceSys());
		buildingPos = assets.backgrounds.Setup(gameSys);
		InitSpawns();
		//InitSpawnsTest();
		waveHUD = new WaveHUD(gameSys, assets.incomingWaveHUD, src, spawnSys, audiencePlayerSys, assets.gameLogicChat.GetAudienceSys().MobileJoinQRCode() );
		audio = assets.GetComponent<AudioSource>();
		audio.clip = assets.musicSet.titleSong;
		audio.loop = true;
		audio.Play();
		assets.sky.GetComponent<SpriteRenderer>().sprite = assets.backgrounds.skies[3];
		assets.sky2.GetComponent<SpriteRenderer>().sprite = assets.backgrounds.skies[1];}
	void FadeSongTo(AudioClip theNextSong) {
		nextSong = theNextSong;
		doingSongFade = true;}
	void UpdateMusic() {
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
		else {if (musicVol < .99f) { musicVol = musicVol * .9f + .1f * 1; audio.volume = musicVol;}}}
	public void RunUpdate(Transform transform) {
		tick++;
		if (!assets.basicGameLogic.waitingForGameToStart) tick2++;
		foeSys.tick = tick2;
		if (gameSys.gameOver) { if (DoEndOfGameFadeOut) { DoEndOfGameFadeOut = false; FadeSongTo(assets.musicSet.titleSong);}}
		UpdateMusic();
		float pauseRatio = midpointTimer;
		//float pauseRatio = assets.basicGameLogic.BetweenRoundPauseRatio();
		v3 lookPos;
		if (playerSys.player2Ent == null) {lookPos = playerSys.playerEnt.pos;}
		else {lookPos = (playerSys.playerEnt.pos + playerSys.player2Ent.pos) / 2;}
		lookPos.y -= 10f;
		if (pauseRatio > 0 && pauseRatio < 1) {EndOfRoundCamera(pauseRatio, ref lookPos, transform);}
		else {
			lastLookAtPos = lookPos;
			nm.ease(ref lastLookFromPos, new v3(lookPos.x * .03f, lookPos.y * .03f, -10), .3f);
			transform.LookAt(new v3(transform.position.x * .97f + .03f * lookPos.x, transform.position.y * .97f + .03f * lookPos.y, lookPos.z));
			transform.position = lastLookFromPos;}
		if (Input.GetKey(KeyCode.Escape)) {if (!pauseLatch) {isPaused = !isPaused;pauseLatch = true;}}
		else pauseLatch = false;
		if (assets.basicGameLogic.waitingForGameToStart) {
			if (Input.GetKey(KeyCode.Escape) || Input.GetKey(KeyCode.Space) || Input.GetButton("Fire1") || Input.GetButton("Fire2")) {
				assets.basicGameLogic.OnGameStart();
				assets.basicGameLogic.waitingForGameToStart = false;
				FadeSongTo(assets.musicSet.mainSongs[2]);}}
		if (aspect == 1.6f) {transform.position += new Vector3(0, .7f, -1.1f);}
		if (aspect == 1.5f) {transform.position += new Vector3(0, 1.3f, -1.9f);}
		if (Mathf.Abs(aspect - 4f / 3f) < .001f) {transform.position += new Vector3(0, 1.9f, -3.3f);}
		gameSys.Update(isPaused || pauseRatio > 0 || assets.basicGameLogic.waitingForGameToStart);
		if (!isPaused && pauseRatio == 0 && gameSys.gameOver == false && assets.basicGameLogic.waitingForGameToStart == false) {spawnSys.Update((int)tick2);}

		assets.ground.transform.position = new Vector3(transform.position.x, transform.position.y - 6, assets.ground.transform.position.z);
		assets.sky.transform.position = new Vector3(transform.position.x, transform.position.y, assets.sky.transform.position.z);

		assets.overlay1.transform.position = new Vector3(transform.position.x, transform.position.y, transform.position.z + 3);
		assets.overlay2.transform.position = new Vector3(transform.position.x, transform.position.y, 2);
		assets.overlay3.transform.position = new Vector3(transform.position.x, transform.position.y, 6);

		assets.overlay1.GetComponent<SpriteRenderer>().color = new Color(1f, 1f, .9f, .15f + .11f * Mathf.Cos(tick * .01f + 73.0f) + .13f * Mathf.Cos(tick * .0073f + 13.0f));
		assets.overlay2.GetComponent<SpriteRenderer>().color = new Color(1f, 1f, .9f, .22f + .09f * Mathf.Cos(tick * .0083f + 173.0f) + .17f * Mathf.Cos(tick * .0063f + 23.0f));
		assets.overlay3.GetComponent<SpriteRenderer>().color = new Color(1f, 1f, .9f, .22f + .07f * Mathf.Cos(tick * .0113f + 273.0f) + .23f * Mathf.Cos(tick * .0093f + 33.0f));

		assets.sky2.GetComponent<SpriteRenderer>().color = new Color(1f, 1f, 1f, tick*.001f);

		assets.overlay1.transform.localEulerAngles = new Vector3(0, 0, .2f + 21f * Mathf.Cos(tick * .01f + 73.0f) + 16f * Mathf.Cos(tick * .0053f + 13.0f));
		assets.overlay2.transform.localEulerAngles = new Vector3(0, 0, .2f + 11f * Mathf.Cos(tick * .0111f + 173.0f) + 23f * Mathf.Cos(tick * .0073f + 213.0f));
		assets.overlay3.transform.localEulerAngles = new Vector3(0, 0, .2f + 17f * Mathf.Cos(tick * .0131f + 273.0f) + 13f * Mathf.Cos(tick * .093f + 313.0f));}
	public FullGame(GameBuilder builder) { assets = builder;}}