using UnityEngine;
using v3 = UnityEngine.Vector3;

public class IncomingWaveHUD : MonoBehaviour {
	public Sprite uiBackground, player, phaseDivider, cutsceneEdges;
	public GameObject textName;

	public APG.APGBasicGameLogic basicGameLogic;
}

/*

	Get in rest of audiece player actions.

	Get in high level structure.  Game start, hints, game end.

	Get in between round stuff.  Need to pause game, show audience player actions.

	Cues for round about to be over.  Sounds.

	Get phone resolution correct.

	Black outlines on player names.

 */

public class WaveHUD {

	private int tick = 0;
	public SpawnEntry turnEnd;

	void spawningMessage(GameSys gameSys, SpawnSys spawners, ent uiBkg, GameObject textName ) {
		bool labelActive = false;
		var labelAlpha = 0f;
		int messageTime= 0;

		new ent(gameSys, textName) { pos = nm.v3y( 4.1f ), scale=.07f, text="", textColor=nm.col( .1f, 0 ), active=false, parent = uiBkg, name="spawningMessage", 
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
		for( var k = 0; k < (spawners.spawnSet.Count < 20 ? spawners.spawnSet.Count:20 ); k++ ) {
			var offset = k;
			new ent(gameSys) {
				sprite = offset < spawners.spawnSet.Count ? spawners.spawnSet[offset].icon : player, parent = uiBkg, pos = nm.v3z( -.1f ), scale = .2f * spawners.spawnSet[offset].scale, layer = Layers.UI, name="uiTimelinePic", 
				update = e => {
					if( offset >= spawners.spawnSet.Count ) {
						e.color = new Color( 0,0,0,0 );
						return;}
					if( tick > spawners.spawnSet[offset].time ) {
						offset += 20;
						if( offset >= spawners.spawnSet.Count )return;
						e.scale = .2f * spawners.spawnSet[offset].scale;
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

/*	void MakeCutsceneBorders( GameSys gameSys, IncomingWaveHUD assets, ent uiBkg ) {
		var offset = 0f;
		var tc=0;
		var bottom = new ent(gameSys) { sprite=assets.cutsceneEdges, active=true, parent = uiBkg,  pos = new v3(0, -4.9f-13.3f, 0 ), scale=4.1f };

		new ent(gameSys) { sprite=assets.cutsceneEdges, ang=180, active=true, name="cutsceneEdge", parent = uiBkg,  pos = new v3(0, 4.9f-4.3f, 0 ), scale=4.1f, ignorePause=true,
			update = e => {
				int timer = assets.basicGameLogic.GetRoundTime();
				if( timer == 0 ) {
					nm.ease( ref offset, 0, .1f );
				}
				else {
					nm.ease( ref offset, 1, .1f );
				}

				tc++;
				if( tc == 30 ) {
					tc = 0;
					Debug.Log( "" + offset  );
				}
				bottom.pos = new v3(0, -4.9f-13.3f - offset*2, 0 );
				e.pos = new v3(0, 4.9f-4.3f + offset*2, 0 );
			}
		};
	}*/

	void MakeTimer( GameSys gameSys, IncomingWaveHUD assets, ent uiBkg ) {
		var lastTimer = 0;
		var sc = .06f;
		new ent(gameSys, assets.textName) { pos = new v3(-3.2f, 4.7f, 0 ), scale=.06f, text="45", textColor=nm.col( 0f, 1 ), active=true, parent = uiBkg, name="time", 
			update = e => {
				int timer = assets.basicGameLogic.GetRoundTime();
				sc = sc * .9f + .1f *  .06f;
				e.scale = sc;
				if( (int)( timer / 60 ) != lastTimer ) {
					lastTimer = (int)( timer / 60 );
					e.text = ""+lastTimer;
					
					if( lastTimer < 6 ) {
						sc = .06f + .03f * (6-lastTimer);
						e.textColor = new Color( (6-lastTimer)*.2f , 0, 0, 1 );
					}
					else {
						e.textColor = new Color( 0, 0, 0, 1 );
					}
				}
			}
		};
	}

	public WaveHUD( GameSys gameSys, IncomingWaveHUD assets, MonoBehaviour src, SpawnSys spawners  ) {
		var uiBkg = new ent(gameSys) { sprite = assets.uiBackground, name="uibkg", pos = new v3(0, 5.3f, 1), scale = .6f, layer = Layers.UI, parentMono = src, update = e => tick++ };
		spawningMessage( gameSys, spawners, uiBkg, assets.textName );
		makeSpawnTimelineEntries( gameSys, spawners, uiBkg, assets.player );

		MakeTimer( gameSys, assets, uiBkg );

		//MakeCutsceneBorders( gameSys, assets, uiBkg );
	}
}