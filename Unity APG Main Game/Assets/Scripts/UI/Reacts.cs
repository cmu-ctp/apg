using UnityEngine;
using System.Collections.Generic;
using V3 = UnityEngine.Vector3;

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

		foreach( var k in 10.Loop()) {
			var label = new Ent(gameSys, reacts.textName) { pos = new V3(0, 0, 0), text="" };
			new ReuseEnt( newReacts ) { sprite = reacts.shockBkg, name="react", scale = 1, update = null, textLabel = label, children = new List<Ent> { label }, active=false };
		}
	}

	public void React(V3 pos, string msg, Color color) {
		ReactCore( reacts.shockBkg, pos, msg, color );
	}

	public void Chat(V3 pos, string msg, Color color) {
		ReactCore( reacts.talkBkg, pos, msg, color );
	}

	void ReactCore( Sprite spr, V3 pos, string msg, Color color) {
		var r = new ReuseEnt( newReacts ) { active= true, sprite = reacts.shockBkg, pos = pos, health = 30,
		update = e => {
			e.health--;
			if(e.health <= 0)e.active = false;
		} };
		r.e.textLabel.text=msg;
	}
}
