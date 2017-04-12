using System.Collections.Generic;
using UnityEngine;
using v3 = UnityEngine.Vector3;

public class IncomingWaveHUD : MonoBehaviour {
	public Sprite uiBackground, player, phaseDivider, cutsceneEdges, whiteSquare, timelineBackground, timeUI;
	public Sprite[] roundNums;
	public GameObject textName;

	public AudioClip timerCountDown;

	public APG.APGBasicGameLogic basicGameLogic;
}

public class WaveHUD {

	private int tick = 0;
	public SpawnEntry turnEnd;

	void spawningMessage(GameSys gameSys, SpawnSys spawners, GameObject textName, MonoBehaviour src ) {
		bool labelActive = false;
		var labelAlpha = 0f;
		int messageTime= 0;

		new ent(gameSys, textName) { pos = nm.v3y( 4.6f ), scale=.07f, text="", textColor=nm.col( .1f, 0 ), active=false, name="spawningMessage", parentMono=src, 
			update = e => {
				if( spawners.incomingMessageTime > messageTime) {
					messageTime = spawners.incomingMessageTime;
					e.text = spawners.incomingMessage;
				}
				if( spawners.incomingMessage != "" ) {
					nm.ease( ref labelAlpha, 1, .1f );
					e.scale = e.scale * .8f + .2f * .045f;
					e.textColor = nm.col( .1f, labelAlpha );
					if( labelActive == false ) {
						labelActive = true;
						e.active = true;
					}
				}
				else if( spawners.incomingMessage == "" ) {
					if( labelActive == true ) {
						nm.ease( ref labelAlpha, 0, .1f );
						e.scale = e.scale * .8f + .2f * .045f;
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

	void makeSpawnTimelineEntries( GameSys gameSys, SpawnSys spawners, ent uiBkg, Sprite player, IncomingWaveHUD assets, MonoBehaviour src ) {
		for( var k = 0; k < (spawners.spawnSet.Count < 20 ? spawners.spawnSet.Count:20 ); k++ ) {
			var offset = k;
			var thePic = new ent(gameSys) {
				sprite = offset < spawners.spawnSet.Count ? spawners.spawnSet[offset].icon : player, parent = uiBkg, pos = nm.v3z( -.1f ), scale = .2f * spawners.spawnSet[offset].scale, layer = Layers.UI, name="uiTimelinePic", 
				update = e => {
					if( gameSys.gameOver) {
						return;
					}
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
					e.pos = new v3(-(s*8 - 4)-.1f, spawners.spawnSet[offset].iconYOffset*.5f, -.1f);
					if( s > .5f && s < 1f ) {
						var al = nm.FadeInOut( s, 40 );
						e.color = nm.col( 1, al );
					}
					else {
						e.color = nm.col( 1, nm.FadeInOut( s, 8 ) );
					}
				}
			};
		}

		var ratio = 1f;
		var bar = new ent(gameSys) { parent = uiBkg, sprite = assets.whiteSquare, name="roundHighlight", pos = new v3(-4.2f,.48f,-.2f), scale = 1f, layer = Layers.UI, color = new Color( .5f, .5f, .5f, .3f ),
			update = e => {
				var goalRatio = assets.basicGameLogic.GetRoundTime()/60f / 45f;
				if( Mathf.Abs( ratio - goalRatio) > .01f ) {
					nm.ease( ref ratio, goalRatio, .1f );
					e.scale3 = new v3(ratio*4.8f,1.8f,1f);
				}
				else if( goalRatio == 0 && e.scale != 0 ) {
					e.scale = 0;
				}
			}
		};
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

	void MakeTimer( GameSys gameSys, IncomingWaveHUD assets, MonoBehaviour src ) {
		var lastTimer = 0;
		var sc = .06f;
		var timeui = new ent(gameSys ) { sprite=assets.timeUI, pos = new v3(-3.5f, 5.2f, 0 ), scale=1f, active=true, name="timeui", parentMono = src };
		var timeNum = new ent(gameSys, assets.textName) { text="45", textColor=nm.col( 0f, 1 ), active=true, name="time", parent = timeui,
			update = e => {
				int timer = assets.basicGameLogic.GetRoundTime();
				sc = sc * .9f + .1f *  .06f;
				e.scale = sc;
				if( (int)( timer / 60 ) != lastTimer ) {
					lastTimer = (int)( timer / 60 );
					e.text = ""+lastTimer;
					
					if( lastTimer < 6 ) {
						if( lastTimer == 0 ) {
						}
						else {
							gameSys.Sound( assets.timerCountDown, (6-lastTimer)*.2f );
						}
						sc = .06f + .03f * (6-lastTimer);
						e.textColor = new Color( (6-lastTimer)*.2f , 0, 0, 1 );
					}
					else {
						e.textColor = new Color( 0, 0, 0, 1 );
					}
				}
			}
		};
		var roundNum = 1;
		var theRound = new ent(gameSys, assets.textName) { text="1", textColor=nm.col( 0f, 1 ), active=true, name="round",  parent = timeui,
			update = e => {
				int round = assets.basicGameLogic.GetRoundNumber();
				if( round != roundNum ) {
					roundNum = round;
					e.text = "" + roundNum;
				}
			}
		};
		timeNum.pos = new v3(-.25f,.1f,-.01f);
		timeNum.scale = .06f;
		theRound.pos = new v3(.3f,-.28f,-.01f);
	}

	AudiencePlayerSys buddies;

	void MakeHealthBar1(GameSys gameSys, IncomingWaveHUD assets, MonoBehaviour src) {
		var ratio = 1f;
		var bar = new ent(gameSys) { sprite = assets.whiteSquare, name="healthbar1", pos = new v3(-9, 6, 1), scale = .4f, layer = Layers.UI, parentMono = src, color = new Color( .3f, .7f, .3f, 1 ), 
			update = e => {
				var goalRatio = buddies.team1Health / buddies.team1MaxHealth;
				e.val1 = goalRatio;
				e.val2 = ratio;
				if( Mathf.Abs( ratio - goalRatio) > .01f ) {
					nm.ease( ref ratio, goalRatio, .1f );
					e.color = new Color(.6f * ratio+.3f, .1f, .1f, 1);
					e.scale3 = new v3(14.2f*ratio,1.45f,1);
				}
				else if( goalRatio == 0 && e.scale != 0 ) {
					e.scale = 0;
				}
			}
		};
		new ent(gameSys) { sprite = assets.uiBackground, name="healthbar1", pos = new v3(-9, 6, 1), scale = .4f, layer = Layers.UI, parentMono = src, children = new List<ent> { bar } };

		bar.pos = new v3( -4.4f, .5f, -.01f );
		bar.scale3 = new v3(14.2f,1.45f,1);
	}

	void MakeHealthBar2(GameSys gameSys, IncomingWaveHUD assets, MonoBehaviour src) {
		var ratio = 1f;
		var bar = new ent(gameSys) { sprite = assets.whiteSquare, name="healthbar1", pos = new v3(-9, 6, 1), scale = .4f, layer = Layers.UI, parentMono = src, color = new Color( .3f, .7f, .3f, 1 ), flipped=true,
			update = e => {
				var goalRatio = buddies.team2Health / buddies.team2MaxHealth;
				if( Mathf.Abs( ratio - goalRatio) > .01f ) {
					nm.ease( ref ratio, goalRatio, .1f );
					e.color = new Color(.6f * ratio+.3f, .1f, .1f, 1);
					e.scale3 = new v3(14.2f*ratio,1.45f,1);
				}
				else if( goalRatio == 0 && e.scale != 0 ) {
					e.scale = 0;
				}
			}
		};
		new ent(gameSys) { sprite = assets.uiBackground, name="healthbar2", pos = new v3(9, 6, 1), scale = .4f, layer = Layers.UI, parentMono = src, children = new List<ent> { bar } };

		bar.pos = new v3( 4.4f, .5f, -.01f );
		bar.scale3 = new v3(14.2f,1.45f,1);
	}

	public WaveHUD( GameSys gameSys, IncomingWaveHUD assets, MonoBehaviour src, SpawnSys spawners, AudiencePlayerSys audiencePlayerSys ) {
		buddies = audiencePlayerSys;

		var uiBkg = new ent(gameSys) { sprite = assets.timelineBackground, name="uibkg", pos = new v3(.9f, 5.8f, 1), scale = .75f, layer = Layers.UI, parentMono = src, update = e => tick++ };
		spawningMessage( gameSys, spawners, assets.textName, src );
		makeSpawnTimelineEntries( gameSys, spawners, uiBkg, assets.player, assets, src );

		MakeTimer( gameSys, assets, src );

		MakeHealthBar1( gameSys, assets, src );
		MakeHealthBar2( gameSys, assets, src );

		//MakeCutsceneBorders( gameSys, assets, uiBkg );
	}
}