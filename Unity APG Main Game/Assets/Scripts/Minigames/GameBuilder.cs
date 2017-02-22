using UnityEngine;
using System.Collections.Generic;
using System;
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
	public TwitchGameLogicChat gameLogicChat;

	float tick = 0;

	GameSys gameSys;
	FoeSys foeSys;
	PlayerSys playerSys = new PlayerSys();
	TreatSys treatSys;
	PropSys propSys;
	SpawnSys spawnSys = new SpawnSys();

	void InitSpawns() {

		//spawnSys.Add(0, treatSys.balloons);

		//spawnSys.Add(0, foeSys.beardGuy);

		spawnSys.Add(0, foeSys.beardGuy);
		spawnSys.Add(40, foeSys.plantGuy);

		spawnSys.Add(60, () => { }, boulder);
		spawnSys.Add(80, foeSys.trashGuy);

		spawnSys.Add(120, foeSys.beardGuy);
		spawnSys.Add(120, () => { }, boulder);
		spawnSys.Add(160, foeSys.mustacheGuy);

		spawnSys.Add(180, () => { }, boulder);
		spawnSys.Add(200, foeSys.microwaveGuy);

		spawnSys.Add(240, () => { }, boulder);

		spawnSys.Add(300, () => { }, boulder);


		spawnSys.Sort();
	}
	void Start() {
		Application.runInBackground = true;
		gameSys = new GameSys(cloud1, transform);
		foeSys = new FoeSys(foes, gameSys, playerSys);
		treatSys = new TreatSys	( treats, gameSys );
		propSys = new PropSys( props, gameSys );
		playerSys.Setup(gameSys, players, foeSys, gameLogicChat.GetAudienceSys());
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
			lookPos = playerSys.playerEnt.src.transform.position;
		}
		else {
			lookPos = (playerSys.playerEnt.src.transform.position + playerSys.player2Ent.src.transform.position)/2;
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