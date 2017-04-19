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
	FixedEntPool textEntPool;

	public void Init( GameSys theGameSys, Reacts theReacts ) {
		gameSys = theGameSys;
		reacts = theReacts;

		var src = new ent(gameSys) { name="reactSet" };

		entPool = new FixedEntPool( gameSys, numReacts, "reacts" );
		for( var k = 0; k < numReacts; k++ ) {
			new PoolEnt( entPool ) { sprite = reacts.shockBkg, name="react", scale = 1, update = null, active=false, parent = src };
		}

		var tsrc = new ent(gameSys) { name="reactTextSet" };

		textEntPool = new FixedEntPool( gameSys, numReacts, "reactsText", false, reacts.textName );
		for( var k = 0; k < numReacts; k++ ) {
			new PoolEnt( textEntPool ) { name="reactText", scale = .06f, update = null, active=false, parent = tsrc, text="" };
		}
	}

	public void React(v3 pos, string msg, Color color) {
		ReactCore( reacts.shockBkg, pos, msg, color );
	}

	public void Chat(v3 pos, string msg, Color color) {
		ReactCore( reacts.talkBkg, pos, msg, color );
	}

	void ReactCore( Sprite spr, v3 pos, string msg, Color color) {
		new PoolEnt( entPool ) { active= true, sprite = reacts.shockBkg, pos = pos, health = 30,
			update = e => {
				e.health--;
				if(e.health <= 0) {
					e.active = false;
					e.remove();
				}
			}
		};
		new PoolEnt( textEntPool ) { active= true, text = msg, pos = pos+new v3(-.1f,.1f,-.1f), health = 30, scale = .03f, 
			update = e => {
				e.health--;
				if(e.health <= 0) {
					e.active = false;
					e.remove();
				}
			}
		};
	}
}
