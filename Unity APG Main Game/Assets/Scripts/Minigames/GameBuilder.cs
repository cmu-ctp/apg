using UnityEngine;
using v3 = UnityEngine.Vector3;
using APG;

public class GameBuilder:MonoBehaviour {
	public GameObject basicSpriteObject;

	public GameObject sky, ground, overlay1, overlay2;

	public IncomingWaveHUD incomingWaveHUD;
	public Backgrounds backgrounds;
	public Foes foes;
	public Players players;
	public Treats treats;
	public Props props;
	public Reacts reacts;

	public TwitchGameLogicChat gameLogicChat;
	public APGBasicGameLogic basicGameLogic;

	FullGame fullGame;

	void Start() {
		Application.runInBackground = true;
		fullGame = new FullGame( this );
		fullGame.Init( this );
	}

	void Update() {
		fullGame.RunUpdate( transform );
	}
}

class FullGame {

	float tick = 0;

	GameSys gameSys;
	FoeSys foeSys;
	PlayerSys playerSys = new PlayerSys();
	AudiencePlayerSys audiencePlayerSys = new AudiencePlayerSys();
	TreatSys treatSys;
	PropSys propSys;
	ReactSys reactSys = new ReactSys();
	SpawnSys spawnSys = new SpawnSys();
	WaveHUD  waveHUD;

	bool pauseLatch = false;
	bool isPaused = false;

	void InitSpawns() {

		//spawnSys.Add(5, treatSys.balloonGridAll );
		//spawnSys.Add(1, treatSys.balloonClusterBottom);
		//spawnSys.Add(0, foeSys.beardGuy);
		/*spawnSys.Add(3, treatSys.balloonGridRight);
		spawnSys.Add(12, treatSys.balloonGridLeft );
		spawnSys.Add(20, treatSys.balloonGridCenter );
		spawnSys.Add(30, treatSys.balloonGridAll );*/

		spawnSys.Add(6, treatSys.balloonClusterLeft);
		spawnSys.Add(12, treatSys.balloonClusterRight);
		spawnSys.Add(18, treatSys.balloonClusterBottomLeft);

		spawnSys.Add(20, foeSys.beardGuy);

		spawnSys.Add(24, treatSys.balloonClusterBottom);
		spawnSys.Add(30, treatSys.balloonClusterBottomRight);

		spawnSys.Add(46, treatSys.balloonClusterLeft);
		spawnSys.Add(52, treatSys.balloonClusterRight);

		spawnSys.Add(60, foeSys.plantGuy);

		spawnSys.Add(68, treatSys.balloonClusterBottomLeft);


		//spawnSys.Add(60, () => { }, boulder);
		spawnSys.Add(80, foeSys.trashGuy);

		spawnSys.Add(100, treatSys.balloonGridAll );

		spawnSys.Add(120, foeSys.beardGuy);
		//spawnSys.Add(120, () => { }, boulder);
		spawnSys.Add(160, foeSys.mustacheGuy);

		//spawnSys.Add(180, () => { }, boulder);
		//spawnSys.Add(200, foeSys.microwaveGuy);
		//spawnSys.Add(240, () => { }, boulder);
		//spawnSys.Add(300, () => { }, boulder);

		spawnSys.Sort();
	}

	public void Init( MonoBehaviour src ) {
		gameSys = new GameSys(assets.basicSpriteObject, src.transform);
		reactSys.Init( gameSys, assets.reacts );
		foeSys = new FoeSys(assets.foes, gameSys, playerSys, audiencePlayerSys);
		treatSys = new TreatSys	( assets.treats, gameSys, reactSys );
		propSys = new PropSys( assets.props, gameSys );
		
		
		playerSys.Setup(gameSys, assets.players, foeSys, reactSys);
		audiencePlayerSys.Setup(gameSys, assets.players, foeSys, assets.basicGameLogic.GetPlayers(), playerSys, assets.gameLogicChat.GetAudienceSys() );
		assets.backgrounds.Setup(gameSys);
		InitSpawns();

		waveHUD = new WaveHUD( gameSys, assets.incomingWaveHUD, src, spawnSys );
	}

	public void RunUpdate( Transform transform ) {
		tick++;
		foeSys.tick = tick;

		spawnSys.Update((int)tick);

		v3 lookPos;
		if(playerSys.player2Ent == null) {
			lookPos = playerSys.playerEnt.pos;
		}
		else {
			lookPos = (playerSys.playerEnt.pos + playerSys.player2Ent.pos)/2;
		}
		lookPos.y -= 10f;

		transform.LookAt(new v3(transform.position.x * .97f + .03f * lookPos.x, transform.position.y * .97f + .03f * lookPos.y, lookPos.z));
		transform.position = new v3(lookPos.x * .03f, lookPos.y * .03f, transform.position.z);

		if( Input.GetKey(KeyCode.Escape) ) {
			if( !pauseLatch ) {
				isPaused = !isPaused;
				pauseLatch = true;
			}
		}
		else pauseLatch = false;

		gameSys.Update( isPaused );

		assets.ground.transform.position = new Vector3(transform.position.x, transform.position.y - 6, assets.ground.transform.position.z);
		assets.sky.transform.position = new Vector3(transform.position.x, transform.position.y, assets.sky.transform.position.z);

		assets.overlay1.transform.position = new Vector3(transform.position.x, transform.position.y, assets.overlay1.transform.position.z);
		assets.overlay2.transform.position = new Vector3(transform.position.x, transform.position.y, assets.overlay2.transform.position.z);

		assets.overlay1.GetComponent<SpriteRenderer>().color = new Color(1f, 1f, .9f, .15f + .11f * Mathf.Cos(tick * .01f + 73.0f) + .13f * Mathf.Cos(tick * .0073f + 13.0f));
		assets.overlay2.GetComponent<SpriteRenderer>().color = new Color(1f, 1f, .9f, .12f + .09f * Mathf.Cos(tick * .0083f + 173.0f) + .11f * Mathf.Cos(tick * .0063f + 23.0f));

		assets.overlay1.transform.localEulerAngles = new Vector3(0, 0, .2f + 21f * Mathf.Cos(tick * .01f + 73.0f) + 16f * Mathf.Cos(tick * .0053f + 13.0f));
		assets.overlay2.transform.localEulerAngles = new Vector3(0, 0, .2f + 11f * Mathf.Cos(tick * .0311f + 173.0f) + 23f * Mathf.Cos(tick * .0073f + 213.0f));
	}

	GameBuilder assets;

	public FullGame( GameBuilder builder ) {
		assets = builder;
	}
}