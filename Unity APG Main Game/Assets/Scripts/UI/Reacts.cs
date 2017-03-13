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

	const int numReacts = 10;

	Ent[] reactSet = new Ent[numReacts];
	int curReaction = 0;

	public void Init( GameSys theGameSys, Reacts theReacts ) {
		gameSys = theGameSys;
		reacts = theReacts;

		foreach( var k in 10.Loop()) {

			var label = new Ent(gameSys, reacts.textName) { pos = new V3(0, 0, 0) };
			var t = label.src.GetComponent<TextMesh>();
			t.text="";

			var r = new Ent(gameSys) { sprite = reacts.shockBkg, name="react", scale = 1, update = null, textLabel = label, children = new List<Ent> { label } };
			r.src.SetActive(false);
			reactSet[k] = r;
		}
	}

	public void React(V3 pos, string msg, Color color) {
		ReactCore( reacts.shockBkg, pos, msg, color );
	}

	public void Chat(V3 pos, string msg, Color color) {
		ReactCore( reacts.talkBkg, pos, msg, color );
	}

	void ReactCore( Sprite spr, V3 pos, string msg, Color color) {
		var r = reactSet[curReaction];
		r.src.SetActive( true );
		r.sprite = reacts.shockBkg;
		r.name="react";
		r.pos = pos;
		r.scale = 1;
		r.health = 30;
		var t = r.textLabel.src.GetComponent<TextMesh>();
		t.text=msg;
		r.update = e => {
			e.health--;
			if(e.health <= 0){
				e.src.SetActive(false);
			}
		};
		curReaction = (curReaction + 1 ) % numReacts;
	}
}
