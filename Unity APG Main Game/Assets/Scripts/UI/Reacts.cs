using UnityEngine;
using System.Collections.Generic;
using v3 = UnityEngine.Vector3;

public class Reacts : MonoBehaviour {
	public GameObject textName;
	public Sprite shockBkg, talkBkg;
}

public class ReactSys {
	GameSys gameSys;

	Reacts reacts;

	const int numReacts = 10;
	FixedEntPool entPool;

	public void Init( GameSys theGameSys, Reacts theReacts ) {
		gameSys = theGameSys;
		reacts = theReacts;

		var src = new ent(gameSys) { name="reactSet" };

		entPool = new FixedEntPool( gameSys, numReacts, "reacts" );
		for( var k = 0; k < numReacts; k++ ) {
			var label = new ent(gameSys, reacts.textName) { pos = new v3(0, 0, 0), text="" };
			var labelSrc = new ent(gameSys) { pos = new v3(0, 0, 0), children = new List<ent> { label }, layer = Layers.UI };
			new PoolEnt( entPool ) { sprite = reacts.shockBkg, name="react", scale = 1, update = null, textLabel = label, children = new List<ent> { labelSrc }, active=false, parent = src };
			label.pos = new v3(-.2f, 0, -.01f );
		}
	}

	public void React(v3 pos, string msg, Color color) {
		ReactCore( reacts.shockBkg, pos, msg, color );
	}

	public void Chat(v3 pos, string msg, Color color) {
		ReactCore( reacts.talkBkg, pos, msg, color );
	}

	void ReactCore( Sprite spr, v3 pos, string msg, Color color) {
		var r = new PoolEnt( entPool ) { active= true, sprite = reacts.shockBkg, pos = pos, health = 30,
		update = e => {
			e.health--;
			if(e.health <= 0) {
				e.active = false;
				e.remove();
			}
		} };
		r.e.textLabel.text=msg;
	}
}
