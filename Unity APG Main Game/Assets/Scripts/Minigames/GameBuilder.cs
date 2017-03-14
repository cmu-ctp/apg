using UnityEngine;
using V3 = UnityEngine.Vector3;

public class GameBuilder:MonoBehaviour {
	public GameObject cloud1;
	public Sprite boulder;
	public GameObject sky, ground, overlay1, overlay2;

	public IncomingWaveHUD incomingWaveHUD;
	public Backgrounds backgrounds;
	public Foes foes;
	public Players players;
	public Treats treats;
	public Props props;
	public Reacts reacts;
	public TwitchGameLogicChat gameLogicChat;

	float tick = 0;

	GameSys gameSys;
	FoeSys foeSys;
	PlayerSys playerSys = new PlayerSys();
	AudiencePlayerSys audiencePlayerSys = new AudiencePlayerSys();
	TreatSys treatSys;
	PropSys propSys;
	ReactSys reactSys = new ReactSys();
	SpawnSys spawnSys = new SpawnSys();

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

		//spawnSys.Add(0, foeSys.beardGuy);

		spawnSys.Add(0, foeSys.beardGuy);
		spawnSys.Add(40, foeSys.plantGuy);

		spawnSys.Add(46, treatSys.balloonClusterLeft);
		spawnSys.Add(52, treatSys.balloonClusterRight);
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
	void Start() {
		Application.runInBackground = true;
		gameSys = new GameSys(cloud1, transform);
		reactSys.Init( gameSys, reacts );
		foeSys = new FoeSys(foes, gameSys, playerSys, audiencePlayerSys);
		treatSys = new TreatSys	( treats, gameSys, reactSys );
		propSys = new PropSys( props, gameSys );
		
		playerSys.Setup(gameSys, players, foeSys, gameLogicChat.GetAudienceSys());
		audiencePlayerSys.Setup(gameSys, players, foeSys, gameLogicChat.GetAudienceSys(), playerSys);
		backgrounds.Setup(gameSys);
		InitSpawns();
		incomingWaveHUD.makeUI(gameSys, this, spawnSys);
	}
	void Update() {
		tick++;
		foeSys.tick = tick;

		spawnSys.Update((int)tick);

		V3 lookPos;
		if(playerSys.player2Ent == null) {
			lookPos = playerSys.playerEnt.pos;
		}
		else {
			lookPos = (playerSys.playerEnt.pos + playerSys.player2Ent.pos)/2;
		}

		transform.LookAt(new V3(transform.position.x * .97f + .03f * lookPos.x, transform.position.y * .97f + .03f * lookPos.y, lookPos.z));
		transform.position = new V3(lookPos.x * .03f, lookPos.y * .03f, transform.position.z);
		gameSys.Update();

		ground.transform.position = new Vector3(transform.position.x, transform.position.y - 6, ground.transform.position.z);
		sky.transform.position = new Vector3(transform.position.x, transform.position.y, sky.transform.position.z);

		overlay1.transform.position = new Vector3(transform.position.x, transform.position.y, overlay1.transform.position.z);
		overlay2.transform.position = new Vector3(transform.position.x, transform.position.y, overlay2.transform.position.z);

		overlay1.GetComponent<SpriteRenderer>().color = new Color(1f, 1f, .9f, .15f + .11f * Mathf.Cos(tick * .01f + 73.0f) + .13f * Mathf.Cos(tick * .0073f + 13.0f));
		overlay2.GetComponent<SpriteRenderer>().color = new Color(1f, 1f, .9f, .12f + .09f * Mathf.Cos(tick * .0083f + 173.0f) + .11f * Mathf.Cos(tick * .0063f + 23.0f));

		overlay1.transform.localEulerAngles = new Vector3(0, 0, .2f + 21f * Mathf.Cos(tick * .01f + 73.0f) + 16f * Mathf.Cos(tick * .0053f + 13.0f));
		overlay2.transform.localEulerAngles = new Vector3(0, 0, .2f + 11f * Mathf.Cos(tick * .0311f + 173.0f) + 23f * Mathf.Cos(tick * .0073f + 213.0f));
	}
}