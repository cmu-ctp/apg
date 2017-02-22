using UnityEngine;
using System.Collections.Generic;
using V3 = UnityEngine.Vector3;

public class IncomingWaveHUD : MonoBehaviour {
	public Sprite uiBackground, player;

	private int tick = 0;

	public void makeUI( GameSys gameSys, MonoBehaviour src, SpawnSys spawners ) {
		var uiBkg = new Ent(gameSys) {
			sprite = uiBackground,
			pos = new V3(0, 5.7f, 1),
			scale = .6f,
			layer = Layers.UI,
			parent = src.transform,};
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
					e.pos = new V3(-(s*8 - 4), 0, -.1f);
					e.color = new Color( 1, 1, 1, Num.FadeInOut( s, 8 ) );}};}}
	void Update() {
		tick++;}}