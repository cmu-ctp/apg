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
	public Material glowMaterial;
	public GameObject textName;

	public IncomingWaveHUD incomingWaveHUD;
	public Backgrounds backgrounds;
	public Foes foes;
	public Players players;
	public Treats treats;
	public Props props;
	public Reacts reacts;
	public Buildings buildings;

	public TwitchNetworking gameLogicChat;
	public APGBasicGameLogic basicGameLogic;

	public MusicSet musicSet;

	FullGame fullGame;

	public void MakeRoundEnd(int roundNumber, int ticksPerSecond, BuddyFuncs[,]  grid, Action audienceActionsEnded) { fullGame.MakeRoundEnd(roundNumber, ticksPerSecond, grid, audienceActionsEnded);}
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
	float aspect;

	float musicVol = 1f;
	AudioSource audio;
	v3 lastLookAtPos = new v3(0, 0, 0);
	v3 lastLookFromPos = new v3(0, 0, 0);
	bool doingSongFade = false;
	AudioClip nextSong = null;
	bool DoEndOfGameFadeOut = true;

	void InitSpawns() {

		var foeTime = 50;
		var foeOffset = 6;

		var turnEnd = new SpawnEntry { icon = assets.incomingWaveHUD.phaseDivider, spawn = () => { }, message = "", scale = 5 };
		var roundMarker = new SpawnEntry { icon = assets.incomingWaveHUD.phaseDivider, spawn = () => { }, message = "", scale = 2, iconYOffset = -.7f };
		for (var k = 1; k < 20; k++) spawnSys.Add(5+50 * k, turnEnd);
		for (var k = 0; k < 12; k++) spawnSys.Add(5 + 50 * k + 36, new SpawnEntry { icon = assets.incomingWaveHUD.roundNums[k], spawn = () => { }, message = "", scale = 8, iconYOffset = -.9f });

		var smallPositive = new SpawnEntry[] { treatSys.balloonClusterLeft, treatSys.balloonClusterBottomLeft, treatSys.balloonClusterRight, treatSys.balloonClusterBottomRight };
		var smallPositiveUnbiased = new SpawnEntry[] { treatSys.balloonClusterBottom };
		var bigPositive = new SpawnEntry[] { treatSys.balloonGridLeft, treatSys.balloonGridRight };
		var bigPositiveUnbiased = new SpawnEntry[] { treatSys.balloonGridAll, treatSys.balloonGridCenter };

		var normalFoes = new SpawnEntry[] { foeSys.beardGuy, foeSys.beardGuy, foeSys.plantGuy };

		Func<SpawnEntry[], SpawnEntry> rs = choices => choices[rd.i(0, choices.Length)];

		Action<SpawnEntry[], int, int> addTwo = (choices, time, timeAdd) => {
			var id = rd.i(0, choices.Length);
			var id2 = (id + choices.Length / 2) % choices.Length;
			spawnSys.Add(time, choices[id]);
			spawnSys.Add(time + timeAdd, choices[id2]);};

		addTwo(smallPositive, 6, 6);
		spawnSys.Add(18, rs(smallPositiveUnbiased));

		spawnSys.Add(foeOffset, rs(normalFoes));

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

		spawnSys.Sort();
	}

	void MakeIntroPlaque() {
		new ent(gameSys) { ignorePause = true, sprite = assets.introPlaque, parentMono = assets, scale = 1.3f, pos = new v3(0, 0, 10), health = 1,
			update = e2 => {
				if (Input.GetKey(KeyCode.Escape) || Input.GetKey(KeyCode.Space) || Input.GetButton("Fire1") || Input.GetButton("Fire2")) e2.health = 0;
				if (e2.health > 0) { var v = e2.pos; nm.ease(ref v, new v3(0, 0, 10), .1f); e2.pos = v; }
				else { var v = e2.pos; nm.ease(ref v, new v3(0, -10, 10), .1f); e2.pos = v; }
				if (e2.pos.y < -9f) e2.remove();}};}

	float midpointTimer = 0; v3 audiencePos; v3 cameraPos;

	public delegate TResult Func<T1, T2, T3, T4, T5, TResult>(T1 arg1, T2 arg2, T3 arg3, T4 arg4, T5 arg5);
	public delegate TResult Func<T1, T2, T3, T4, T5, T6, TResult>(T1 arg1, T2 arg2, T3 arg3, T4 arg4, T5 arg5, T6 arg6);
	public delegate TResult Func<T1, T2, T3, T4, T5, T6, T7, TResult>(T1 arg1, T2 arg2, T3 arg3, T4 arg4, T5 arg5, T6 arg6, T7 arg7);
	public delegate TResult Func<T1, T2, T3, T4, T5, T6, T7, T8, TResult>(T1 arg1, T2 arg2, T3 arg3, T4 arg4, T5 arg5, T6 arg6, T7 arg7, T8 arg8);

	void EndOfRoundCamera(float pauseRatio, ref v3 lookPos, Transform transform) {
		var newLookPos = cameraPos; newLookPos.y -= 10f;
		nm.ease(ref lastLookAtPos, newLookPos, .3f);
		lookPos = lastLookAtPos;
		nm.ease(ref lastLookFromPos, new v3(lookPos.x * .1f, lookPos.y * .1f, -9.5f), .2f);
		transform.LookAt(new v3(transform.position.x * .9f + .1f * lookPos.x, transform.position.y * .9f + .1f * lookPos.y, lookPos.z));
		transform.position = lastLookFromPos;}
	
	void RoundEndMessage(int roundNumber, int ticksPerSecond) {
		var roundColors = new Color[] { new Color(.4f, .533f, .266f, 1f), new Color(.266f, .4f, .533f, 1f), new Color(.533f, .266f, .4f, 1f) };
		var tick = 0;
		new ent(gameSys, assets.textName) {
			ignorePause = true, text = "Round " + (roundNumber - 1) + " is over!", parentMono = assets, scale = .1f, pos = new v3(0, 3, 10), health = ticksPerSecond * 2, textColor = roundColors[(roundNumber - 1) % roundColors.Length], textAlpha = 0,
			update = e2 => {
				tick++;
				if (tick < ticksPerSecond * 1) return;
				if (e2.health > 0) { e2.textAlpha = e2.textAlpha * .9f + .1f * 1.01f; } else { e2.textAlpha = e2.textAlpha * .9f + .1f * -.01f; }
				e2.health--;
				if (e2.textAlpha < .01f && e2.health < 1) e2.remove();}};

		new ent(gameSys) {
			ignorePause = true, parentMono = assets, scale = 60f, pos = new v3(0, 0, 10), health = ticksPerSecond * 2, sprite = assets.players.actionBkg, color = new Color(1,1,1,0), name="fader", layer=Layers.Fade,
			update = e2 => {
				tick++;
				if (tick < ticksPerSecond * 4) return;
				var rat = (tick - ticksPerSecond * 4f)/210f;
				var alpha = (float)Math.Sin(rat * Math.PI) * 2f;
				if (alpha > 1) alpha = 1;
				e2.color = new Color(1, 1, 1, alpha);
				if (tick > ticksPerSecond*4 + 210) e2.remove();}};}

	void RoundStartMessage(int roundNumber, int ticksPerSecond) {
		var roundColors = new Color[] { new Color(.4f, .533f, .266f, 1f), new Color(.266f, .4f, .533f, 1f), new Color(.533f, .266f, .4f, 1f) };
		var tick = 0;
		new ent(gameSys, assets.textName) {
			ignorePause = true, text = "Round " + (roundNumber), parentMono = assets, scale = .15f, pos = new v3(0, 3, 10), health = ticksPerSecond * 2, textColor = roundColors[(roundNumber ) % roundColors.Length], textAlpha = 0,
			update = e2 => {
				tick++;
				if (tick < ticksPerSecond * 7/2) return;
				if (e2.health > 0) { e2.textAlpha = e2.textAlpha * .9f + .1f * 1.01f; } else { e2.textAlpha = e2.textAlpha * .9f + .1f * -.01f; }
				e2.health--;
				if (e2.textAlpha < .01f && e2.health < 1) e2.remove();}};}
	void AudienceTurnMessage(int roundNumber, int ticksPerSecond) {
		var roundColors = new Color[] { new Color(.4f, .533f, .266f, 1f), new Color(.266f, .4f, .533f, 1f), new Color(.533f, .266f, .4f, 1f) };
		var tick = 0;
		new ent(gameSys, assets.textName) {
			ignorePause = true, text = "Audience Turn", parentMono = assets, scale = .15f, pos = new v3(0, 3, 10), health = ticksPerSecond * 2, textColor = roundColors[(roundNumber ) % roundColors.Length], textAlpha=0,
			update = e2 => {
				tick++;
				if (tick < ticksPerSecond * 11/2) return;
				if (e2.health > 0) { e2.textAlpha = e2.textAlpha * .9f + .1f * 1.01f; } else { e2.textAlpha = e2.textAlpha * .9f + .1f * -.01f; }
				e2.health--;
				if (e2.textAlpha < .01f && e2.health < 1) e2.remove();}};}

	bool doingEnd = false;

	void DoWindDown(int roundNumber, int ticksPerSecond, BuddyFuncs[,] grid, Action audienceActionsEnded) {
		var roundColors = new Color[] { new Color(.4f, .533f, .266f, 1f), new Color(.266f, .4f, .533f, 1f), new Color(.533f, .266f, .4f, 1f) };
		for (var k = 0; k < 12; k++) for (var j = 0; j < 3; j++) { if (grid[k, j] != null) grid[k, j].doMove(); }
		for (var j = 5; j > -1; j--) {
			for (var k = 2; k > -1; k--) {
				if ((grid[j, k] != null && grid[j, k].getHealth() > 0)) { var ex = grid[j, k].getEnt(); ex.color = new Color(ex.color.r, ex.color.g, ex.color.b, 1); grid[j, k].getHeadEnt().color = new Color(1,1,1,1); }
				if (grid[6 + j, k] != null && grid[6 + j, k].getHealth() > 0) { var ex = grid[6+j, k].getEnt(); ex.color = new Color(ex.color.r, ex.color.g, ex.color.b, 1); grid[6+j, k].getHeadEnt().color = new Color(1,1,1,1); }}}
		// make a little running panting noise!
		new ent(gameSys, assets.textName) {
			ignorePause = true, text = "Movement Turn", parentMono = assets, scale = .15f, pos = new v3(0, 3, 10), health = ticksPerSecond * 2, textColor = roundColors[(roundNumber) % roundColors.Length], textAlpha = 0,
			update = e2 => {
				if (e2.health > 0) { e2.textAlpha = e2.textAlpha * .9f + .1f * 1.01f; } else { e2.textAlpha = e2.textAlpha * .9f + .1f * -.01f; }
				e2.health--;
				for (var k = 0; k < 12; k++) for (var j = 0; j < 3; j++) { if (grid[k, j] != null) grid[k, j].updateMove( grid[k,j].getEnt() ); }
				if (e2.textAlpha < .01f && e2.health < 1) {
					DoStreamerMessage(roundNumber, ticksPerSecond, grid, audienceActionsEnded);
					e2.remove();}}};}
	void DoStreamerMessage(int roundNumber, int ticksPerSecond, BuddyFuncs[,] grid, Action audienceActionsEnded) {
		var roundColors = new Color[] { new Color(.4f, .533f, .266f, 1f), new Color(.266f, .4f, .533f, 1f), new Color(.533f, .266f, .4f, 1f) };
		new ent(gameSys, assets.textName) {
			ignorePause = true, text = "Streamer Turn", parentMono = assets, scale = .15f, pos = new v3(0, 3, 10), health = ticksPerSecond * 2, textColor = roundColors[(roundNumber) % roundColors.Length], textAlpha = 0,
			update = e2 => {
				if (e2.health > 0) { e2.textAlpha = e2.textAlpha * .9f + .1f * 1.01f; } else { e2.textAlpha = e2.textAlpha * .9f + .1f * -.01f; }
				e2.health--;
				if (e2.textAlpha < .01f && e2.health < 1) {
					doingEnd = false;
					midpointTimer = 0;
					audienceActionsEnded();
					e2.remove();}}};}
	public void MakeRoundEnd(int roundNumber, int ticksPerSecond, BuddyFuncs[,] grid, Action audienceActionsEnded) {
		doingEnd = true;
		RoundEndMessage(roundNumber, ticksPerSecond);
		RoundStartMessage(roundNumber, ticksPerSecond);
		AudienceTurnMessage(roundNumber, ticksPerSecond);

		int usedSpots = 0; var spotList = new List<int>(); var rowList = new List<int>();
		for (var j = 5; j > -1; j--) {
			for (var k = 2; k > -1; k--) {
				if ((grid[j, k] != null && grid[j, k].getHealth() > 0 ) || ( grid[6+ j, k] != null && grid[6 + j, k].getHealth() > 0 )) { usedSpots++; spotList.Add(j); rowList.Add(k); } }}
		var tick = 0; var doingAction = false; var atRemove = false; var showSet1 = false; var showSet2 = false;
		new ent(gameSys) { ignorePause = true,
			update = e => {
				tick++;
				if (tick == ticksPerSecond * 8) {
					doingAction = true;
					var fadeIn = 0f;
					var shake1 = 0f; var shake2 = 0f;
					var actionFail1 = 0; var actionFail2 = 0;
					var push = 0f;
					Func<float, float, string, int, bool, ent> makeTx = (x,y,tx, set, isBack) => new ent(gameSys, assets.textName) {
						ignorePause = true, text = tx, parentMono = assets, scale = .1f, pos = new v3(x, y , 10), layer = Layers.UI,
						update = e2 => {
							var shake = 0f; var mul = (set == 1) ? 1 : -1;
							if (set == 1) { shake = shake1; }
							if (set == 2) { shake = shake2; }
							if (set == 1 && !showSet1) e2.scale = 0;
							else if (set == 2 && !showSet2) e2.scale = 0;
							else e2.scale = .1f;
							e2.textAlpha = 1f - fadeIn;
							if (!atRemove) { var v = e2.pos; nm.ease(ref v, new v3(push * mul + x + rd.f(-shake, shake) + (isBack ? .02f : 0), y + rd.f(-shake, shake) - (isBack ? .02f : 0), 10 + (isBack ? .01f : 0)), .1f); e2.pos = v; }
							else { var v = e2.pos; nm.ease(ref v, new v3(0, -10, 10), .1f); e2.pos = v; }
							if (e2.pos.y < -9f) e2.remove(); }};
					Func<float, float, Sprite, float, int, ent> makeBkg = (x,y,spr,sc, set) => new ent(gameSys) {
						ignorePause = true, parentMono = assets, scale = sc, pos = new v3(x, y, 9), sprite = spr, health=0, layer = Layers.UIBkg, color = new Color(1, 0, 0, .8f), ang=177+180,
						update = e2 => {
							if (!atRemove) { var v = e2.pos; nm.ease(ref v, new v3(x, y, 10), .1f); e2.pos = v; }
							else { var v = e2.pos; nm.ease(ref v, new v3(0, -10, 10), .1f); e2.pos = v; }
							if (e2.pos.y < -9f) e2.remove(); }};
					Func<float, float, Sprite, float, int, ent> makeBkg2 = (x,y,spr,sc, set) => new ent(gameSys) {
						ignorePause = true, parentMono = assets, scale = sc, pos = new v3(x, y, 9), sprite = spr, health=0, layer = Layers.UIBkg, color = new Color(1, 0, 0, .8f), ang=177,
						update = e2 => {
							if (!atRemove) { var v = e2.pos; nm.ease(ref v, new v3(x, y, 10), .1f); e2.pos = v; }
							else { var v = e2.pos; nm.ease(ref v, new v3(0, 10, 10), .1f); e2.pos = v; }
							if (e2.pos.y > 9f) e2.remove(); }};
					Func<float, float, Sprite, float, int, ent> make = (x,y,spr,sc, set) => new ent(gameSys) {
						ignorePause = true, parentMono = assets, scale = sc, pos = new v3(x, y, 10), sprite = spr, health=0, layer = Layers.UI,
						update = e2 => {
							var shake = 0f; var mul = (set == 1) ? 1 : -1;
							if (set == 1) { shake = shake1; }
							if (set == 2) { shake = shake2; }
							if (set == 1 && !showSet1) e2.scale = 0;
							else if (set == 2 && !showSet2) e2.scale = 0;
							else if (e2.health > 0) { e2.health--; e2.scale = 0;}
							else {e2.scale = sc * (1f - fadeIn);}
							if (!atRemove) { var v = e2.pos; nm.ease(ref v, new v3(push * mul + x + rd.f(-shake, shake), y + rd.f(-shake, shake), 10), .1f); e2.pos = v; }
							else { var v = e2.pos; nm.ease(ref v, new v3(0, -10, 10), .1f); e2.pos = v; }
							if (e2.pos.y < -9f) e2.remove(); }};
					Func<float, float, Sprite, float, int, ent> makeAction = (x,y,spr,sc, set) => new ent(gameSys) {
						ignorePause = true, parentMono = assets, scale = sc, pos = new v3(x, y, 10), sprite = spr, health=0, layer = Layers.UI,
						update = e2 => {
							var shake = 0f; var fall = 0; var mul = (set == 1) ? 1 : -1;
							if (set == 1) { shake = shake1; if (actionFail1 > 0) { actionFail1++; e2.ang = actionFail1 * 5;  fall = actionFail1 * 3; if (fall > 6) fall = 6; e2.color = new Color(1, 1, 1, 1f - actionFail1 * .01f); } }
							if (set == 2) { shake = shake2; if (actionFail2 > 0) { actionFail2++; e2.ang = actionFail2 * 5; fall = actionFail2 * 3; if (fall > 6) fall = 6; e2.color = new Color(1, 1, 1, 1f - actionFail2 * .01f); } }
							if (set == 1 && !showSet1) e2.scale = 0;
							else if (set == 2 && !showSet2) e2.scale = 0;
							else if (e2.health > 0) { e2.health--; e2.scale = 0;}
							else {e2.scale = sc * (1f - fadeIn);}
							if (!atRemove) { var v = e2.pos; nm.ease(ref v, new v3(push * mul + x + rd.f(-shake, shake), y + rd.f(-shake, shake)-fall, 10), .1f); e2.pos = v; }
							else { var v = e2.pos; nm.ease(ref v, new v3(0, -20, 10), .1f); e2.pos = v; }
							if (e2.pos.y < -19f) e2.remove(); }};
					var healthRat1 = 0f; var healthRat2 = 0f; 
					Func<float, float, Sprite, float, int, ent> makeHealth = (x,y,spr,sc, set) => new ent(gameSys) {
						ignorePause = true, parentMono = assets, scale = sc, pos = new v3(x, y, 10), sprite = spr, health=0, layer = Layers.UI, color = new Color(1,0,0,1),
						update = e2 => {
							var rat = 1f; var shake = 0f; var mul = (set == 1) ? 1 : -1;
							if (set == 1) { rat = healthRat1; shake = shake1; }
							if (set == 2) { rat = healthRat2; shake = shake2; }
							if (set == 1 && !showSet1) e2.scale = 0;
							else if (set == 2 && !showSet2) e2.scale = 0;
							else if (e2.health > 0) { e2.health--; e2.scale = 0;}
							else { e2.scale3 = new v3( sc * (1f - fadeIn)*rat, sc * (1f - fadeIn), 1 ); }
							e2.color = new Color(.3f + .7f * rat, 0, 0, 1);
							if (!atRemove) { var v = e2.pos; nm.ease(ref v, new v3(push*mul + x+rd.f(-shake,shake), y + rd.f(-shake, shake), 10), .1f); e2.pos = v; }
							else { var v = e2.pos; nm.ease(ref v, new v3(0, -10, 10), .1f); e2.pos = v; }
							if (e2.pos.y < -9f) e2.remove(); }};
					Func<float, float, Sprite, float, int, ent> makeBuilding = (x,y,spr,sc, set) => new ent(gameSys) {
						ignorePause = true, parentMono = assets, scale = sc, pos = new v3(x, y, 11), sprite = spr, health=0, layer = Layers.UIMid,
						update = e2 => {
							var mul = (set == 1) ? 1 : -1;
							if (set == 1 && !showSet1) e2.scale = 0;
							else if (set == 2 && !showSet2) e2.scale = 0;
							else if (e2.health > 0) { e2.health--; e2.scale = 0;}
							else {e2.scale = sc * (1f - fadeIn);}
							if (!atRemove) { var v = e2.pos; nm.ease(ref v, new v3(push * mul*.5f + x, y, 10), .1f); e2.pos = v; }
							else { var v = e2.pos; nm.ease(ref v, new v3(0, -10, 10), .1f); e2.pos = v; }
							if (e2.pos.y < -9f) e2.remove(); }};


					var yadd = -7;
					makeBkg(0, yadd + 2 + 1, assets.players.actionBkg, 10, 0);
					makeBkg2(0, 6.5f, assets.players.actionBkg, 10, 0);
					var label1 = makeTx(-4, .5f, "Player1",1,false);
					var label2 = makeTx(4, .5f, "Player2",2, false);
					var label1bk = makeTx(-4, .5f, "Player1", 1, true); label1bk.color = new Color(0, 0, 0, 1);
					 var label2bk = makeTx(4, .5f, "Player2", 2, true); label2bk.color = new Color(0, 0, 0, 1);
					var face1 = make(-5, yadd + 3, assets.players.heads[0], 1.5f, 1);
					var face2 = make(5, yadd + 3, assets.players.heads[0], 1.5f, 2);
					var action1 = makeAction(-3f, yadd + 3.5f, assets.players.actions[0], 2f, 1);
					var action2 = makeAction(3f, yadd + 3.5f, assets.players.actions[0], 2f, 2);
					var health1 = makeHealth(-5.5f, yadd + 2.5f, assets.players.healthBar, .3f, 1); health1.color = new Color(1, 0, 0, 1); 
					var health2 = makeHealth(5.5f, yadd + 2.5f, assets.players.healthBar2, .3f, 2); health2.color = new Color(1, 0, 0, 1);
					var buildingpic1 = makeBuilding(-6.5f, yadd + 2, assets.players.buildings[0], .65f, 1);
					var buildingpic2 = makeBuilding(6.5f, yadd + 2, assets.players.buildings[0], .65f, 2);

					var curBuilding1 = 0; var curBuilding2 = 0; var curBuilding1Used = false; var curBuilding2Used = false;

					var curDelay = 0f; var curGrid=-1;
					var actionDelay = 0f;
					v3 audiencePos2 = new v3(0,0,0);
					
					new ent(gameSys) {
						ignorePause = true, scale = 2f, pos = new v3(0, 3, 10), sprite = assets.playerHighlight, material= assets.glowMaterial, color = new Color(1, 1, 1, .5f), 
						update = e2 => {
							if (showSet2) push = 4-Math.Abs( e2.pos.x )*.75f;
							e2.color = (showSet2) ? new Color(1, 1, 1, .5f+.2f*Mathf.Cos(tick*.04f)) : new Color(1, 1, 1, 0);
							if (atRemove) e2.remove(); else { var v = e2.pos; nm.ease(ref v, audiencePos2, .3f); e2.pos = v;}} };
					// highlight names.
					new ent(gameSys) {
						ignorePause = true, scale = 2f, pos = new v3(0, 3, 10), sprite = assets.playerHighlight, material = assets.glowMaterial, color = new Color(1, 1, 1, .5f),
						update = e2 => {
							if (showSet1) push = 4-Math.Abs(e2.pos.x) * .75f;
							curDelay--;
							fadeIn = fadeIn * .9f;

							actionDelay--;
							if( actionDelay == 0) {
								// Attack.  Stops building actions.
								// Reckless attack.  Stops building actions.  Stops extract.  Stops items.
								var g1 = grid[spotList[curGrid], rowList[curGrid]]; var g2 = grid[6 + spotList[curGrid], rowList[curGrid]];
								var use1 = (g1 != null && g1.getHealth() > 0); var use2 = (g2 != null && g2.getHealth() > 0);
								var dmg1 = 0; var dmg2 = 0;
								var item1 = -1; var item2 = -1;
								var extract1 = -1; var extract2 = -1;
								var building1 = -1; var building2 = -1;
								if (use1 && use2) {
									var p1 = g1.getEnt(); var p2 = g2.getEnt();
									var actionID1 = g1.getAction();
									var actionID2 = g2.getAction();
									item1 = g1.getItem(); item2 = g2.getItem();
									building1 = g1.getBuildingAction(); building2 = g2.getBuildingAction();
									if (actionID1 == 3) extract1 = 1;
									if (actionID2 == 3) extract2 = 1;
									if (actionID1 > 2 && actionID2 > 2) {
										// both players have chosen actions that can't interfere with each other.
									}
									else {
										if (actionID1 == 0) {
											if (building2 != -1 ) actionFail2 = 1;
											building2 = -1; 
											if (actionID2 == 0) { dmg1 = dmg2 = 1; }
											else if (actionID2 == 1) { dmg1 = dmg2 = 1; }
											else if (actionID2 == 2) { dmg1 = 2; }
											else { dmg2 = 1; }}
										else if (actionID1 == 1) {
											if (building2 != -1 || item2 != -1 || extract2 != -1) actionFail2 = 1;
											building2 = -1; item2 = -1; extract2 = -1;
											if (actionID2 == 0) { dmg1 = dmg2 = 1; }
											else if (actionID2 == 1) { dmg1 = dmg2 = 2; }
											else if (actionID2 == 2) { dmg1 = 5;  }
											else { dmg2 = 2; }}
										else if (actionID1 == 2) {
											if (actionID2 == 0) { dmg2 = 2; }
											else if (actionID2 == 1) { dmg2 = 5; }
											else if (actionID2 == 2) { }
											else { }}
										else {
											if (actionID2 == 0) { if (building1 != -1 ) actionFail1 = 1; building1 = -1; dmg1 = 1;}
											else if (actionID2 == 1) { dmg1 = 2; if (building1 != -1 || item1 != -1 || extract1 != -1) actionFail1 = 1; building1 = -1; item1 = -1; extract1 = -1; }
											else if (actionID2 == 2) { }}}
									if (dmg1 != 0) { p1.onHurt(p1, p2, new TouchInfo { flags = 0, damage = dmg1, showDamage=false }); shake1 = dmg1; }
									if( dmg2 != 0 ){p2.onHurt(p2, p1, new TouchInfo { flags = 0, damage = dmg2, showDamage = false }); shake2 = dmg2; }
								}
								else {
									if( use1 ) { if (g1.getAction() == 3) extract1 = 1; item1 = g1.getItem(); building1 = g1.getBuildingAction();}
									if( use2 ) { if (g2.getAction() == 3) extract2 = 1; item2 = g2.getItem(); building2 = g2.getBuildingAction();} }

								if (extract1 != -1) {
									if (curBuilding1Used) { actionFail1 = 1; } else { g1.doExtract(); }
									curBuilding1Used = true;
									buildingpic1.color = new Color(.3f, .3f, .3f, 1);}
								if (extract2 != -1) {
									if (curBuilding2Used) { actionFail2 = 1; } else {g2.doExtract();}
									curBuilding2Used = true;
									buildingpic2.color = new Color(.3f, .3f, .3f, 1);}
								if ( item1 != -1) { g1.useUpSelectedItem(); assets.backgrounds.DoItem(item1, 1, g1.getEnt().pos);}
								if (item2 != -1) { g2.useUpSelectedItem(); assets.backgrounds.DoItem(item2, 2, g2.getEnt().pos);}
								if (building1 != -1) {
									if (curBuilding1Used) { actionFail1 = 1; }
									else { g1.useSelectedBuildingAction(); assets.backgrounds.DoBuilding(building1, 1, g1.getEnt().pos); }
									curBuilding1Used = true;
									buildingpic1.color = new Color(.3f, .3f, .3f, 1);}
								if (building2 != -1) {
									if (curBuilding2Used) { actionFail2 = 1; }
									else { g2.useSelectedBuildingAction(); assets.backgrounds.DoBuilding(building2, 2, g2.getEnt().pos); }
									curBuilding2Used = true;
									buildingpic2.color = new Color(.3f, .3f, .3f, 1);}}

							if ( curDelay <= 0) {
								curGrid++;
								fadeIn = 1;
								if (curGrid >= usedSpots) atRemove = true;
								else {
									actionFail1 = actionFail2 = 0;
									var g1 = grid[spotList[curGrid], rowList[curGrid]];
									var g2 = grid[6+ spotList[curGrid], rowList[curGrid]];
									var use1 = g1 != null && g1.getHealth() > 0;
									var use2 = g2 != null && g2.getHealth() > 0;
									if ( use1 ) {
										if( g1.getBuilding() != curBuilding1) {
											curBuilding1 = g1.getBuilding();
											curBuilding1Used = false;
											buildingpic1.color = new Color(1, 1, 1, 1);}
										buildingpic1.sprite = assets.players.buildings[g1.getBuilding()];
										action1.color = new Color(1, 1, 1, 1); action1.ang = 0;
										label1bk.text = label1.text = g1.getName();
										label1.textColor = g1.getColor();
										face1.sprite = assets.players.heads[g1.getHead()];
										if (g1.getItem() != -1) action1.sprite = assets.players.items[g1.getItem()];
										else if (g1.getBuildingAction() != -1) action1.sprite = assets.players.buildingActions[g1.getBuildingAction()];
										else action1.sprite = assets.players.actions[g1.getAction()]; }
									if ( use2 ) {
										if (g2.getBuilding()%6 != curBuilding2) {
											curBuilding2 = g2.getBuilding()%6;
											curBuilding2Used = false;
											buildingpic2.color = new Color(1, 1, 1, 1);}
										buildingpic2.sprite = assets.players.buildings[g2.getBuilding()%6];
										action2.color = new Color(1, 1, 1, 1); action2.ang = 0;
										label2bk.text = label2.text = g2.getName();
										label2.textColor = g2.getColor();
										face2.sprite = assets.players.heads[g2.getHead()];
										if (g2.getItem() != -1) action2.sprite = assets.players.items[g2.getItem()];
										else if (g2.getBuildingAction() != -1) action2.sprite = assets.players.buildingActions[g2.getBuildingAction()];
										else action2.sprite = assets.players.actions[g2.getAction()]; }
									action1.health = 240; action2.health = 240;
									if (!use1 && !use2) { curDelay = 0;  }
									else if (!use1) { curDelay = ticksPerSecond * 2f; action2.health = 30; actionDelay = ticksPerSecond * 1; }
									else if (!use2) { curDelay = ticksPerSecond*2f; action1.health = 30; actionDelay = ticksPerSecond * 1; }
									else { curDelay = ticksPerSecond*4;  action1.health = 30; action2.health = 60; actionDelay = ticksPerSecond * 1.5f; }}}
							else {
								for (var j = 5; j > -1; j--) {
									for (var k = 2; k > -1; k--) {
										if ((grid[j, k] != null && grid[j, k].getHealth() > 0)) { var ex = grid[j, k].getEnt(); ex.color = new Color(ex.color.r, ex.color.g, ex.color.b, .2f); grid[j, k].getHeadEnt().color = new Color(1, 1, 1, .2f); }
										if (grid[6 + j, k] != null && grid[6 + j, k].getHealth() > 0) { var ex = grid[6+j, k].getEnt(); ex.color = new Color(ex.color.r, ex.color.g, ex.color.b, .2f); grid[6 + j, k].getHeadEnt().color=new Color(1,1,1, .2f); }}}

								var g1 = grid[spotList[curGrid], rowList[curGrid]];
								var g2 = grid[6+ spotList[curGrid], rowList[curGrid]];
								var use1 = g1 != null && g1.getHealth() > 0;
								var use2 = g2 != null && g2.getHealth() > 0;
								if (use2) { var ex = g2.getEnt(); ex.color = new Color(ex.color.r, ex.color.g, ex.color.b, 1); g2.getHeadEnt().color = new Color(1, 1, 1, 1); shake2 = shake2 * .9f; healthRat2 = healthRat2 * .9f + .1f * g2.getHealth()/10f; cameraPos = audiencePos2 = g2.getPos() + new v3(0, .5f, -.1f); showSet2 = true; } else showSet2 = false;
								if (use1) { var ex = g1.getEnt(); ex.color = new Color(ex.color.r, ex.color.g, ex.color.b, 1); g1.getHeadEnt().color = new Color(1, 1, 1, 1); shake1 = shake1 * .9f;  healthRat1 = healthRat1 * .9f + .1f * g1.getHealth()/10f; cameraPos = audiencePos = g1.getPos() + new v3(0, .5f, -.1f); showSet1 = true; } else showSet1 = false;
								if( use1 && use2 ){ cameraPos = (audiencePos + audiencePos2) / 2; }}
							e2.color = (showSet1) ? new Color(1, 1, 1, .5f + .2f * Mathf.Cos(tick * .04f)) : new Color(1, 1, 1, 0);
							if (atRemove) e2.remove();
							else { var v = e2.pos; nm.ease(ref v, audiencePos, .3f); e2.pos = v;}}};}

				if (doingAction==false) { midpointTimer = 1; }
				else if (!atRemove) { midpointTimer = .5f;}
				else {DoWindDown(roundNumber, ticksPerSecond, grid, audienceActionsEnded );e.remove();}} };}

	public void Init(MonoBehaviour src) {
		aspect = Camera.main.aspect;
		gameSys = new GameSys(assets.basicSpriteObject, src.transform);
		reactSys.Init(gameSys, assets.reacts);
		assets.basicGameLogic.SetGameSys(gameSys);
		MakeIntroPlaque();
		assets.basicGameLogic.SetPlayers(playerSys);
		assets.basicGameLogic.SetAudiencePlayers(audiencePlayerSys);
		treatSys = new TreatSys(assets.treats, gameSys, reactSys);
		foeSys = new FoeSys(assets.foes, gameSys, playerSys, audiencePlayerSys, treatSys);
		propSys = new PropSys(assets.props, gameSys);
		playerSys.Setup(gameSys, assets.players, foeSys, reactSys);
		audiencePlayerSys.Setup(gameSys, assets.players, foeSys, playerSys, assets.gameLogicChat.GetAudienceSys(), treatSys);
		buildingPos = assets.backgrounds.Setup(gameSys, assets.buildings, playerSys, treatSys);
		InitSpawns();
		waveHUD = new WaveHUD(gameSys, assets.incomingWaveHUD, src, spawnSys, audiencePlayerSys, assets.gameLogicChat.GetAudienceSys().MobileJoinQRCode(), playerSys );
		audio = assets.GetComponent<AudioSource>();
		audio.clip = assets.musicSet.titleSong;
		audio.loop = true;
		audio.Play();
		assets.sky.GetComponent<SpriteRenderer>().sprite = assets.backgrounds.skies[4];
		assets.sky2.GetComponent<SpriteRenderer>().sprite = assets.backgrounds.skies[0];}
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
		treatSys.soundTick = tick2;
		audiencePlayerSys.soundTick = tick2;
		foeSys.tick = tick2;
		if (gameSys.gameOver) { if (DoEndOfGameFadeOut) { DoEndOfGameFadeOut = false; FadeSongTo(assets.musicSet.titleSong);}}
		UpdateMusic();
		float pauseRatio = midpointTimer;
		v3 lookPos;
		if (playerSys.player2Ent == null) {lookPos = playerSys.playerEnt.pos;}
		else {lookPos = (playerSys.playerEnt.pos + playerSys.player2Ent.pos) / 2;}
		lookPos.y -= 14f;// 10f;
		if( doingEnd ) waveHUD.pauseRatio = waveHUD.pauseRatio * .99f + .01f * 1;
		else waveHUD.pauseRatio = waveHUD.pauseRatio * .9f + .1f * 0;
		if (pauseRatio > 0 && pauseRatio < 1) {
			EndOfRoundCamera(pauseRatio, ref lookPos, transform);}
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

		if (!isPaused && pauseRatio == 0 && gameSys.gameOver == false && assets.basicGameLogic.waitingForGameToStart == false) {
			spawnSys.Update(assets.basicGameLogic.GetGameTime());
			assets.backgrounds.GameUpdate(assets.basicGameLogic.GetRoundTime());
		}

		assets.ground.transform.position = new Vector3(transform.position.x, transform.position.y - 6, assets.ground.transform.position.z);
		assets.sky.transform.position = new Vector3(transform.position.x, transform.position.y, assets.sky.transform.position.z);

		assets.overlay1.transform.position = new Vector3(transform.position.x, transform.position.y, transform.position.z + 3);
		assets.overlay2.transform.position = new Vector3(transform.position.x, transform.position.y, 2);
		assets.overlay3.transform.position = new Vector3(transform.position.x, transform.position.y, 6);

		assets.overlay1.GetComponent<SpriteRenderer>().color = new Color(1f, 1f, .9f, .15f + .11f * Mathf.Cos(tick * .01f + 73.0f) + .13f * Mathf.Cos(tick * .0073f + 13.0f));
		assets.overlay2.GetComponent<SpriteRenderer>().color = new Color(1f, 1f, .9f, .22f + .09f * Mathf.Cos(tick * .0083f + 173.0f) + .17f * Mathf.Cos(tick * .0063f + 23.0f));
		assets.overlay3.GetComponent<SpriteRenderer>().color = new Color(1f, 1f, .9f, .22f + .07f * Mathf.Cos(tick * .0113f + 273.0f) + .23f * Mathf.Cos(tick * .0093f + 33.0f));

		assets.sky2.GetComponent<SpriteRenderer>().color = new Color(1f, 1f, 1f, tick*.001f);

		assets.overlay1.transform.localEulerAngles = new Vector3(0, 0, .2f + 21f * Mathf.Cos(tick * .01f + 73.0f) + 16f * Mathf.Cos(tick * .0153f + 13.0f));
		assets.overlay2.transform.localEulerAngles = new Vector3(0, 0, .2f + 11f * Mathf.Cos(tick * .0111f + 173.0f) + 23f * Mathf.Cos(tick * .0273f + 213.0f));
		assets.overlay3.transform.localEulerAngles = new Vector3(0, 0, .2f + 17f * Mathf.Cos(tick * .0131f + 273.0f) + 13f * Mathf.Cos(tick * .0193f + 313.0f));}
	public FullGame(GameBuilder builder) { assets = builder;}}