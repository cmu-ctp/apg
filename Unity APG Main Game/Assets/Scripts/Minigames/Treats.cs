using UnityEngine;
using System.Collections.Generic;
using V3 = UnityEngine.Vector3;

public class Treats:MonoBehaviour {
	public Sprite[] balloons;
}

public class TreatSys {
	public SpawnEntry balloons;
	GameSys gameSys;
	Treats theTreats;
	public List<Ent> treatList = new List<Ent>();
	public TreatSys(Treats treats, GameSys theGameSys) {
		gameSys = theGameSys;
		theTreats = treats;
		balloons= new SpawnEntry { icon = treats.balloons[0], spawn = () => BalloonSet() };
	}
	void BalloonSet() {
		foreach(var k in 5.Loop()) {
			float spd = Rd.Fl( .01f, .013f ), bob = Rd.Fl( .002f, .004f ), bobt = Rd.Fl( .8f, 1.2f ), tick = Rd.Ang();
			treatList.Add(new Ent(gameSys) {
				sprite = Rd.Sprite( theTreats.balloons ), pos = new V3(Rd.Fl(-8,-6), Rd.Fl(-.5f,.5f), Rd.Fl(-6, -3)), scale = .2f, flipped=Rd.Test(.5f),
				update = e => {
					tick+=.01f;
					e.pos += new V3( spd, bob*Mathf.Cos( bobt * tick ), 0 );
				},
				use = (e, user, useType, strength) => {
					e.pos += Rd.Vec(-.5f, .5f );
				}

			});
		}
	}
}