using System.Collections.Generic; using UnityEngine; using v3 = UnityEngine.Vector3;

public class IncomingWaveHUD : MonoBehaviour {
	public Sprite uiBackground, player, phaseDivider, cutsceneEdges, whiteSquare, whiteSquareBottomCenter, timelineBackground, timeUI, chargeBar1, chargeBar2, healthBar1, healthBar2, titlePic;
	public Sprite[] roundNums;
	public GameObject textName;
	public AudioClip timerCountDown;
	public APG.APGBasicGameLogic basicGameLogic;}

public class WaveHUD {
	private int tick = 0; float hudSlideIn = 0f; AudiencePlayerSys buddies; PlayerSys playerSys;
	public float pauseRatio = 0f;
	void spawningMessage(SpawnSys spawners, GameObject textName, Transform transform ) {
		bool labelActive = false;
		var labelAlpha = 0f;
		int messageTime= 0;
		var location = new v3(0, 0, 0);
		var me = new ent(textName) { pos = nm.v3y( 4.6f ), scale=.07f, text="", textColor=nm.col( .1f, 0 ), active=false, name="spawningMessage", parentTrans=transform,  ignorePause=true,
			update = e => {
				e.pos = location + new v3(0, 7 * pauseRatio, 0);
				if( spawners.incomingMessageTime > messageTime) {messageTime = spawners.incomingMessageTime;e.text = spawners.incomingMessage;}
				if( spawners.incomingMessage != "" ) {
					nm.ease( ref labelAlpha, 1, .1f );
					e.scale = e.scale * .8f + .2f * .045f;
					e.textColor = nm.col( .1f, labelAlpha );
					if( labelActive == false ) {labelActive = true;e.active = true;}}
				else if( spawners.incomingMessage == "" ) {
					if( labelActive == true ) {
						nm.ease( ref labelAlpha, 0, .1f );
						e.scale = e.scale * .8f + .2f * .045f;
						e.textColor = nm.col( .1f, labelAlpha );
						if( labelAlpha < .01f ) {labelActive = false;e.active = false;}}}}};
		location = me.pos;}
	void makeSpawnTimelineEntries( GameSys gameSys, SpawnSys spawners, ent uiBkg, Sprite player, IncomingWaveHUD assets ) {
		for( var k = 0; k < (spawners.spawnSet.Count < 20 ? spawners.spawnSet.Count:20 ); k++ ) {
			var offset = k;
			var thePic = new ent() {
				sprite = offset < spawners.spawnSet.Count ? spawners.spawnSet[offset].icon : player, parent = uiBkg, pos = nm.v3z( -.1f ), scale = .2f * spawners.spawnSet[offset].scale, layer = Layers.UI, name="uiTimelinePic", 
				update = e => {
					if( gameSys.gameOver) { return; }
					if( offset >= spawners.spawnSet.Count ) { e.color = new Color( 0,0,0,0 ); return;}
					if( tick > spawners.spawnSet[offset].time ) {
						offset += 20;
						if( offset >= spawners.spawnSet.Count )return;
						e.scale = .2f * spawners.spawnSet[offset].scale;
						e.sprite = spawners.spawnSet[offset].icon;}
					var s=1-(spawners.spawnSet[offset].time - tick)/(60f*120f);
					if( s > 1 ) { e.color = new Color( 0,0,0,0); return;}
					e.pos = new v3(-(s*8 - 4)-.1f, spawners.spawnSet[offset].iconYOffset*.5f, -.1f);
					if( s > .5f && s < 1f ) { var al = nm.FadeInOut( s, 40 ); e.color = nm.col( 1, al ); }
					else { e.color = nm.col( 1, nm.FadeInOut( s, 8 ) ); } } };}
		var ratio = 1f;
		var bar = new ent() { parent = uiBkg, sprite = assets.whiteSquare, name="roundHighlight", pos = new v3(-4.2f,.48f,-.2f), scale = 1f, layer = Layers.UI, color = new Color( .5f, .5f, .5f, .3f ),
			update = e => {
				var goalRatio = assets.basicGameLogic.GetRoundTime()/60f / 45f;
				if( Mathf.Abs( ratio - goalRatio) > .01f ) { nm.ease( ref ratio, goalRatio, .1f ); e.scale3 = new v3(ratio*4.8f,1.8f,1f);}
				else if( goalRatio == 0 && e.scale != 0 ) { e.scale = 0; } } };}
	void MakeQRCode(IncomingWaveHUD assets, MonoBehaviour src, Texture2D qrCode ) {
		Sprite spr = Sprite.Create(qrCode, new Rect(0,0,256, 256), new Vector2(.5f, .5f));
		new ent() { sprite = spr, pos = new v3(0, 0f, 0), scale = 1, active = true, name = "QRCode", parentTrans = src.transform };}
	void MakeTimer( GameSys gameSys, IncomingWaveHUD assets, Transform transform ) {
		var lastTimer = 0;
		var sc = .06f;
		var timePos = new v3(0,0,0);
		var timeui = new ent( ) { sprite=assets.timeUI, pos = new v3(-3.5f, 5.2f, 0 ), scale=1f, active=true, name="timeui", parentTrans = transform, ignorePause=true, update = e => { e.pos = timePos + new v3(0, 5 * pauseRatio, 0); } }; timePos = timeui.pos;
		var timeNum = new ent(assets.textName) { text="45", textColor=nm.col( 0f, 1 ), active=true, name="time", parent = timeui,
			update = e => {
				int timer = assets.basicGameLogic.GetRoundTime();
				sc = sc * .9f + .1f *  .06f;
				e.scale = sc;
				if( (int)( timer / 60 ) != lastTimer ) {
					lastTimer = (int)( timer / 60 );
					e.text = ""+lastTimer;
					if( lastTimer < 6 ) {
						if( lastTimer == 0 ) {}
						else {gameSys.Sound( assets.timerCountDown, (6-lastTimer)*.2f );}
						sc = .06f + .03f * (6-lastTimer);
						e.textColor = new Color( (6-lastTimer)*.2f , 0, 0, 1 );}
					else {e.textColor = new Color( 0, 0, 0, 1 );}}}};
		var roundNum = 1;
		var roundColors= new Color[] { new Color(.4f, .533f, .266f, 1f), new Color(.266f, .4f, .533f, 1f), new Color(.533f, .266f, .4f, 1f) };
		var theRound = new ent(assets.textName) { text="1", textColor=roundColors[0], active=true, name="round",  parent = timeui,
			update = e => {
				int round = assets.basicGameLogic.GetRoundNumber();
				if( round != roundNum ) { roundNum = round; e.text = "" + roundNum; e.textColor = roundColors[roundNum % 3];}}};
		timeNum.pos = new v3(-.28f,.1f,-.01f);
		timeNum.scale = .06f;
		theRound.pos = new v3(.1f,.2f,-.01f);}
	void MakeHealthBar1(Transform transform, Sprite whiteSquare, Sprite healthBar1 ) {
		var ratio = 1f;
		var bar = new ent() {sprite = whiteSquare, name="healthbar1", pos = new v3(-9, 6, 1), scale = .4f, layer = Layers.UI, parentTrans=transform, color = new Color( .3f, .7f, .3f, .5f ), 
			update = e => {
				var goalRatio = playerSys.team1Health / playerSys.team1MaxHealth;
				e.val1 = goalRatio;
				e.val2 = ratio;
				if( Mathf.Abs( ratio - goalRatio) > .01f ) {
					nm.ease( ref ratio, goalRatio, .1f );
					e.color = new Color(.6f * ratio+.3f, .1f, .1f, .5f);
					e.scale3 = new v3(14.2f*ratio,.8f,1);}
				else if( goalRatio == 0 && e.scale != 0 ) {e.scale = 0;}}};
		var corePos = new v3(0, 0, 0);
		var core = new ent() { ignorePause=true, sprite = healthBar1, name="healthbar1", pos = new v3(-9+hudSlideIn, 6, 1), scale = .4f, layer = Layers.UI, parentTrans=transform, children = new List<ent> { bar }, update = e => { e.pos = corePos + new v3(-35f * pauseRatio, 0, 0); } }; corePos = core.pos;
		bar.pos = new v3( -4.45f, .25f, -.01f );
		bar.scale3 = new v3(14.2f,.8f,1);}
	void MakeHealthBar2(Transform transform, Sprite whiteSquare, Sprite healthBar2) {
		var ratio = 1f;
		var bar = new ent() {sprite = whiteSquare, name="healthbar1", pos = new v3(-9, 6, 1), scale = .4f, layer = Layers.UI, parentTrans=transform, color = new Color( .3f, .7f, .3f, .5f ), flipped=true,
			update = e => {
				var goalRatio = playerSys.team2Health / playerSys.team2MaxHealth;
				if( Mathf.Abs( ratio - goalRatio) > .01f ) {
					nm.ease( ref ratio, goalRatio, .1f );
					e.color = new Color(.6f * ratio+.3f, .1f, .1f, .5f);
					e.scale3 = new v3(14.2f*ratio,.8f,1);}
				else if( goalRatio == 0 && e.scale != 0 ) {e.scale = 0;}}};
		var corePos = new v3(0, 0, 0);
		var core = new ent() { ignorePause = true, sprite = healthBar2, name="chargebar1anim", pos = new v3(9-hudSlideIn, 6, 1), scale = .4f, layer = Layers.UI, parentTrans=transform, children = new List<ent> { bar }, update = e => { e.pos = corePos + new v3(24f * pauseRatio, 0, 0); } }; corePos = core.pos;
		bar.pos = new v3( 4.45f, .25f, -.01f );
		bar.scale3 = new v3(14.2f,.8f,1);}
	void MakeChargeBar1(IncomingWaveHUD assets, Transform transform) {
		var ratio = 1f;
		var coverPos = new v3(0, 0, 0);
		var cover = new ent() { ignorePause = true, sprite = assets.chargeBar1, name="chargebar1", pos = new v3(-10.7f + hudSlideIn, 5.7f, 1), scale = 1f, layer = Layers.UI, parentTrans = transform, update = e => { e.pos = coverPos + new v3(-4 * pauseRatio, 0, 0); } }; coverPos = cover.pos;
		var bar = new ent() { parent = cover, sprite = assets.whiteSquareBottomCenter, name="chargeBarAnim", pos = new v3(-.05f, -2.1f, -.1f), scale = .5f, layer = Layers.UI, color = new Color( .5f, .5f, 1f, .5f ), 
			update = e => {
				var goalRatio = assets.basicGameLogic.player1ChargeRatio;
				if( goalRatio > .999f ) {
					if( tick % 60 == 0 )e.color = new Color(1, 1, 1, 1f);
					else if( tick % 60 == 4 )e.color = new Color(247f/255f*(.5f+ratio*.5f), (.5f+ratio*.5f), 176f/255f *(.5f+ratio*.5f), .5f);}
				if( Mathf.Abs( ratio - goalRatio) > .01f ) {
					nm.ease( ref ratio, goalRatio, .1f );
					e.color = new Color(247f/255f*(.5f+ratio*.5f), (.5f+ratio*.5f), 176f/255f *(.5f+ratio*.5f), .5f);
					e.scale3 = new v3(.5f, 2.6f*ratio,1);}
				else if( goalRatio == 0 && e.scale != 0 ) {e.scale = 0;}}};}
	void MakeChargeBar2(IncomingWaveHUD assets, Transform transform) {
		var ratio = 1f;
		var coverPos = new v3(0, 0, 0);
		var cover = new ent() { ignorePause = true, sprite = assets.chargeBar2, name = "chargebar2", pos = new v3(10.7f - hudSlideIn, 5.7f, 1), scale = 1f, layer = Layers.UI, parentTrans = transform, update = e =>{ e.pos = coverPos + new v3(3f * pauseRatio, 0, 0); } }; coverPos = cover.pos;
		var bar = new ent() { parent = cover, sprite = assets.whiteSquareBottomCenter, name="chargeBarAnim", pos = new v3(-.25f, -2.1f, -.1f), scale = .5f, layer = Layers.UI, color = new Color( .5f, .5f, 1f, .5f ), 
			update = e => {
				var goalRatio = assets.basicGameLogic.player2ChargeRatio;
				if( goalRatio > .999f ) {
					if( tick % 60 == 0 )e.color = new Color(1, 1, 1, 1f);
					else if( tick % 60 == 4 )e.color = new Color(151f/255f*(.5f+ratio*.5f), 65f/255f*(.5f+ratio*.5f), 212f/255f *(.5f+ratio*.5f), .5f);}
				if( Mathf.Abs( ratio - goalRatio) > .01f ) {
					nm.ease( ref ratio, goalRatio, .1f );
					e.color = new Color(151f/255f*(.5f+ratio*.5f), 65f/255f*(.5f+ratio*.5f), 212f/255f *(.5f+ratio*.5f), .5f);
					e.scale3 = new v3(.5f, 2.6f*ratio,1);}
				else if( goalRatio == 0 && e.scale != 0 ) {e.scale = 0;}}};}
	public WaveHUD( GameSys gameSys, IncomingWaveHUD assets, Transform transform, SpawnSys spawners, AudiencePlayerSys audiencePlayerSys, Texture2D mobileQRCode, PlayerSys thePlayerSys ) {
		if( Camera.main.aspect == 1.6f) { hudSlideIn = 1f; }
		if( Camera.main.aspect == 1.5f) { hudSlideIn = 2f; }
		if( Mathf.Abs( Camera.main.aspect - 4f/3f ) < .001f ) { hudSlideIn = 2.6f; }
		buddies = audiencePlayerSys;
		playerSys = thePlayerSys;
		v3 uiSrcPos = new v3(0,0,0);
		var uiBkg = new ent() { sprite = assets.timelineBackground, name="uibkg", ignorePause=true, pos = new v3(.6f, 5.8f, 1), scale = .75f, layer = Layers.UI, parentTrans = transform, update = e => { tick++; e.pos = uiSrcPos + new v3(0, 8*pauseRatio, 0); } };
		uiSrcPos = uiBkg.pos;
		spawningMessage( spawners, assets.textName, transform );
		makeSpawnTimelineEntries( gameSys, spawners, uiBkg, assets.player, assets );
		MakeTimer( gameSys, assets, transform );
		MakeHealthBar1( transform, assets.whiteSquare, assets.healthBar1);
		MakeHealthBar2( transform, assets.whiteSquare, assets.healthBar2);
		MakeChargeBar1( assets, transform );
		MakeChargeBar2( assets, transform );
		//MakeQRCode(gameSys, assets, src, mobileQRCode);
		//MakeCutsceneBorders( gameSys, assets, uiBkg );
	}}