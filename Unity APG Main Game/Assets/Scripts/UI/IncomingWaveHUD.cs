using UnityEngine;
using v3 = UnityEngine.Vector3;

public class IncomingWaveHUD : MonoBehaviour {
	public Sprite uiBackground, player;
	public GameObject textName;

	private int tick = 0;

	void spawningMessage(GameSys gameSys, SpawnSys spawners, ent uiBkg ) {
		bool labelActive = false;
		var labelAlpha = 0f;
		int messageTime= 0;

		new ent(gameSys, textName) { pos = new v3(0, 4.3f, 0), scale=.09f, text="", textColor=new Color( .1f, .1f, .1f, 0 ), active=false, parent = uiBkg,
			update = e => {
				if( spawners.incomingMessageTime > messageTime) {
					messageTime = spawners.incomingMessageTime;
					e.text = spawners.incomingMessage;
				}
				if( spawners.incomingMessage != "" ) {
					labelAlpha = labelAlpha * .9f + .1f * 1;
					e.scale = e.scale * .8f + .2f * .09f;
					e.textColor = new Color( .1f, .1f, .1f, labelAlpha );
					if( labelActive == false ) {
						labelActive = true;
						e.active = true;
					}
				}
				else if( spawners.incomingMessage == "" ) {
					if( labelActive == true ) {
						labelAlpha = labelAlpha * .9f + .1f * 0;
						e.scale = e.scale * .8f + .2f * .09f;
						e.textColor = new Color( .1f, .1f, .1f, labelAlpha );
						if( labelAlpha < .01f ) {
							labelActive = false;
							e.active = false;
						}
					}
				}
		} };
	}

	void makeSpawnTimelineEntries( GameSys gameSys, SpawnSys spawners, ent uiBkg ) {
		foreach (var k in 20.Loop()) {
			var offset = k;
			new ent(gameSys) {
				sprite = offset < spawners.spawnSet.Count ? spawners.spawnSet[offset].icon : player, parent = uiBkg, pos = new v3(0, 0, -.1f), scale = .3f, layer = Layers.UI,
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
					e.pos = new v3(-(s*8 - 4), spawners.spawnSet[offset].iconYOffset*.5f, -.1f);
					e.color = new Color( 1, 1, 1, nm.FadeInOut( s, 8 ) );}};}
	}

	public void makeUI( GameSys gameSys, MonoBehaviour src, SpawnSys spawners ) {
		var uiBkg = new ent(gameSys) { sprite = uiBackground, pos = new v3(0, 5.7f, 1), scale = .6f, layer = Layers.UI, parentMono = src, update = e => tick++ };
		spawningMessage( gameSys, spawners, uiBkg );
		makeSpawnTimelineEntries( gameSys, spawners, uiBkg );
	}
}