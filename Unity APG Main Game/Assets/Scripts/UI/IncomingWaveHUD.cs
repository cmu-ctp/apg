using UnityEngine;
using v3 = UnityEngine.Vector3;

public class IncomingWaveHUD : MonoBehaviour {
	public Sprite uiBackground, player;
	public GameObject textName;
}

public class WaveHUD {

	private int tick = 0;

	void spawningMessage(GameSys gameSys, SpawnSys spawners, ent uiBkg, GameObject textName ) {
		bool labelActive = false;
		var labelAlpha = 0f;
		int messageTime= 0;

		new ent(gameSys, textName) { pos = nm.v3y( 4.3f ), scale=.09f, text="", textColor=nm.col( .1f, 0 ), active=false, parent = uiBkg,
			update = e => {
				if( spawners.incomingMessageTime > messageTime) {
					messageTime = spawners.incomingMessageTime;
					e.text = spawners.incomingMessage;
				}
				if( spawners.incomingMessage != "" ) {
					nm.ease( ref labelAlpha, 1, .1f );
					e.scale = e.scale * .8f + .2f * .09f;
					e.textColor = nm.col( .1f, labelAlpha );
					if( labelActive == false ) {
						labelActive = true;
						e.active = true;
					}
				}
				else if( spawners.incomingMessage == "" ) {
					if( labelActive == true ) {
						nm.ease( ref labelAlpha, 0, .1f );
						e.scale = e.scale * .8f + .2f * .09f;
						e.textColor = nm.col( .1f, labelAlpha );
						if( labelAlpha < .01f ) {
							labelActive = false;
							e.active = false;
						}
					}
				}
			}
		};
	}

	void makeSpawnTimelineEntries( GameSys gameSys, SpawnSys spawners, ent uiBkg, Sprite player ) {
		for( var k = 0; k < 20; k++ ) {
			var offset = k;
			new ent(gameSys) {
				sprite = offset < spawners.spawnSet.Count ? spawners.spawnSet[offset].icon : player, parent = uiBkg, pos = nm.v3z( -.1f ), scale = .3f, layer = Layers.UI,
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
					e.color = nm.col( 1, nm.FadeInOut( s, 8 ) );
				}
			};
		}
	}

	public WaveHUD( GameSys gameSys, IncomingWaveHUD assets, MonoBehaviour src, SpawnSys spawners  ) {
		var uiBkg = new ent(gameSys) { sprite = assets.uiBackground, pos = new v3(0, 5.7f, 1), scale = .6f, layer = Layers.UI, parentMono = src, update = e => tick++ };
		spawningMessage( gameSys, spawners, uiBkg, assets.textName );
		makeSpawnTimelineEntries( gameSys, spawners, uiBkg, assets.player );

		var timer = 99*120;
		new ent(gameSys, assets.textName) { pos = new v3(-3.8f, 5.3f, 0 ), scale=.1f, text="99", textColor=nm.col( 0f, 1 ), active=true, parent = uiBkg,
			update = e => {
				timer--;
				if( timer % 120 == 0 )e.text = ""+(int)( timer / 120 );
			}
		};
	}
}