using UnityEngine;
using V3 = UnityEngine.Vector3;

public class Backgrounds:MonoBehaviour {
	public Sprite[] trees, bushes, clouds, buildings;

	GameSys gameSys;
	public void Setup(GameSys theGameSys) {
		gameSys = theGameSys;
		Clouds();
		Trees();
		Bushes();
		Buildings();
	}
	void Clouds() {
		foreach(var k in 250.Loop()) {
			var zDist = Rd.Fl(0, 50); var sideScale = zDist / 50; var goal = new V3(Rd.Fl(28) * (1 + sideScale * 2), Rd.Fl(0, 18) * (1 + sideScale * 2), 10 + zDist);
			var offset = Rd.Ang(); var rotateRange = Rd.Fl(.1f, .2f) * 80; var rotateSpeed = Rd.Fl(.02f, .04f);
			var tick = 0f;
			new Ent(gameSys) {
				sprite = Rd.Sprite(clouds), pos = goal, scale = Rd.Fl(.3f, .4f) * 1.7f,
				useGrid=true,
				name="cloud", 
				update = e => {
					tick++;
					if(Rd.Test(.0003f)) { goal = e.pos + Rd.Vec(-3, 3); }
					e.ang = Mathf.Cos(tick * rotateSpeed + offset) * rotateRange;
					var immediateGoal = e.pos * .99f + .01f * goal;
					if(immediateGoal.magnitude > .1f) e.MoveBy(immediateGoal - e.pos);
				}
			};
		}
	}
	void Trees() {
		foreach(var k in 300.Loop()) {
			var zDist = Rd.Fl(7f, 60.0f); var sideScale = zDist / 60.0f;
			new Ent(gameSys) {
				sprite = Rd.Sprite(trees), pos = new V3(Rd.Fl(23) * (1 + sideScale * 2), -6f+Rd.Fl(0, .2f), zDist), scale = Rd.Fl(.3f, .4f) * 2, useGrid=true, name="tree",
				update = e => { }
			};
		}
	}
	void Bushes() {
		foreach(var k in 100.Loop()) {
			var zDist = Rd.Fl(3f, 27.0f); var sideScale = zDist / 60.0f;
			new Ent(gameSys) { sprite = Rd.Sprite(bushes), pos = new V3(Rd.Fl(23) * (1 + sideScale * 2), -6f+Rd.Fl(0, .2f), zDist), scale = Rd.Fl(.3f, .4f), name="bush", useGrid=true };
		}
	}
	void Buildings() {
		foreach(var k in 6.Loop()) {
			var zDist = 2.5f; var posx = -12 + 10 * (k/6f);
			new Ent(gameSys) { sprite = buildings[k], pos = new V3(posx, -6f+Rd.Fl(0, .2f), zDist), scale = Rd.Fl(.3f, .4f) * 1.7f, name="building", useGrid=true };
			new Ent(gameSys) { sprite = buildings[k], pos = new V3(-posx, -6f+Rd.Fl(0, .2f), zDist), scale = Rd.Fl(.3f, .4f) * 1.7f, name="building", useGrid=true };
		}
	}
}