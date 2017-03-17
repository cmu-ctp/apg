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

	FixedEntPool newReacts;

	public void Init( GameSys theGameSys, Reacts theReacts ) {
		gameSys = theGameSys;
		reacts = theReacts;

		newReacts = new FixedEntPool( gameSys, 10 );

		var src = new ent(gameSys) { name="reactSet" };

		for( var k = 0; k < 10; k++ ) {
			var label = new ent(gameSys, reacts.textName) { pos = new v3(0, 0, 0), text="" };
			new ReuseEnt( newReacts ) { sprite = reacts.shockBkg, name="react", scale = 1, update = null, textLabel = label, children = new List<ent> { label }, active=false, parent = src };
		}
	}

	public void React(v3 pos, string msg, Color color) {
		ReactCore( reacts.shockBkg, pos, msg, color );
	}

	public void Chat(v3 pos, string msg, Color color) {
		ReactCore( reacts.talkBkg, pos, msg, color );
	}

	void ReactCore( Sprite spr, v3 pos, string msg, Color color) {
		var r = new ReuseEnt( newReacts ) { active= true, sprite = reacts.shockBkg, pos = pos, health = 30,
		update = e => {
			e.health--;
			if(e.health <= 0)e.active = false;
		} };
		r.e.textLabel.text=msg;
	}
}
