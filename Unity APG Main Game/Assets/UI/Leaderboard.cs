using UnityEngine;
using System.Collections.Generic;
using V3 = UnityEngine.Vector3;

public class Leaderboard : MonoBehaviour {
	public Sprite uiBackground, player;

	private int tick = 0;

	public void makeUI( GameSys gameSys, MonoBehaviour src ) {
		var uiBkg = new Ent(gameSys) {
			sprite = uiBackground,
			pos = new V3(7, 5.5f, 1),
			scale = .75f,
			layer = Layers.UI,
			parent = src.transform,
		};
		foreach (var k in 5.Loop()) {
			var offset = k;
			new Ent(gameSys) {
				sprite = player,
				parent = uiBkg.gameObj.transform,
				pos = new V3(0, 0, -.1f),
				scale = 1,
				layer = Layers.UI,
				update = e => {
					var s=((tick+offset*2000) % 10000)/10000f;
					e.pos = new V3(-(s*8 - 4), 0, -.1f);
					e.color = new Color( 1, 1, 1, Num.FadeInOut( s, 8 ) );
				}
			};
		}
	}
	void Update() {
		tick++;
	}
}