using UnityEngine;
using V3 = UnityEngine.Vector3;

public class IncomingWaveHUD : MonoBehaviour {
	public Sprite uiBackground, player;
	public GameObject textName;

	private int tick = 0;

	public void makeUI( GameSys gameSys, MonoBehaviour src, SpawnSys spawners ) {

		var label = new Ent(gameSys, textName) { pos = new V3(0, 4.3f, 0), scale=.09f };
		var t = label.src.GetComponent<TextMesh>();
		t.text = "";
		t.color = new Color( .1f, .1f, .1f, 0 );
		label.src.SetActive( false );
		bool labelActive = false;
		var labelAlpha = 0f;
		int messageTime= 0;

		var uiBkg = new Ent(gameSys) {
			sprite = uiBackground,
			pos = new V3(0, 5.7f, 1),
			scale = .6f,
			layer = Layers.UI,
			parent = src.transform,
			update = e => {
				if( spawners.incomingMessageTime > messageTime) {
					messageTime = spawners.incomingMessageTime;
					t.text = spawners.incomingMessage;
				}
				if( spawners.incomingMessage != "" ) {
					labelAlpha = labelAlpha * .9f + .1f * 1;
					label.scale = label.scale * .8f + .2f * .09f;
					t.color = new Color( .1f, .1f, .1f, labelAlpha );
					if( labelActive == false ) {
						labelActive = true;
						label.src.SetActive( true );
					}
				}
				else if( spawners.incomingMessage == "" ) {
					if( labelActive == true ) {
						labelAlpha = labelAlpha * .9f + .1f * 0;
						label.scale = label.scale * .8f + .2f * .09f;
						t.color = new Color( .1f, .1f, .1f, labelAlpha );
						if( labelAlpha < .01f ) {
							labelActive = false;
							label.src.SetActive( false );
						}
					}
				}
			}
		};

		label.parent = uiBkg.gameObj.transform;

		foreach (var k in 20.Loop()) {
			var offset = k;
			new Ent(gameSys) {
				sprite = offset < spawners.spawnSet.Count ? spawners.spawnSet[offset].icon : player,
				parent = uiBkg.gameObj.transform,
				pos = new V3(0, 0, -.1f),
				scale = .3f,
				layer = Layers.UI,
				update = e => {
					if( offset >= spawners.spawnSet.Count ) {
						e.color = new Color( 0,0,0,0 );
						return;}
					if( tick > spawners.spawnSet[offset].time ) {
						offset += 20;
						if( offset >= spawners.spawnSet.Count )return;
						e.sprite = spawners.spawnSet[offset].icon;}
					var s=1-(spawners.spawnSet[offset].time - tick)/(60f*120f);
					if( s > 1 ) {
						e.color = new Color( 0,0,0,0);
						return;}
					e.pos = new V3(-(s*8 - 4), spawners.spawnSet[offset].iconYOffset*.5f, -.1f);
					e.color = new Color( 1, 1, 1, Num.FadeInOut( s, 8 ) );}};}}
	void Update() {
		tick++;}}