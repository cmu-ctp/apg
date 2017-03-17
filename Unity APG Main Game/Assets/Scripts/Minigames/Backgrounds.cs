using UnityEngine;
using v3 = UnityEngine.Vector3;

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
		var src = new ent(gameSys) { name="cloudSet" };
		for( var k = 0; k < 250; k++ ) {
			var zDist = rd.f(0, 50); var sideScale = zDist / 50; var goal = new v3(rd.f(28) * (1 + sideScale * 2), rd.f(0, 18) * (1 + sideScale * 2), 10 + zDist);
			var offset = rd.Ang(); var rotateRange = rd.f(.1f, .2f) * 80; var rotateSpeed = rd.f(.02f, .04f);
			var tick = 0f;
			new ent(gameSys) {
				sprite = rd.Sprite(clouds), pos = goal, scale = rd.f(.3f, .4f) * 1.7f, parent = src,
				name="cloud", 
				update = e => {
					tick++;
					if(rd.Test(.0003f)) { goal = e.pos + rd.Vec(-3, 3); }
					e.ang = Mathf.Cos(tick * rotateSpeed + offset) * rotateRange;
					var immediateGoal = e.pos * .99f + .01f * goal;
					if(immediateGoal.magnitude > .1f) e.MoveBy(immediateGoal - e.pos);
				}
			};
		}
	}
	void Trees() {
		var src = new ent(gameSys) { name="treeSet" };
		for( var k = 0; k < 300; k++ ) {
			var zDist = rd.f(7f, 60.0f); var sideScale = zDist / 60.0f;
			new ent(gameSys) {
				sprite = rd.Sprite(trees), pos = new v3(rd.f(23) * (1 + sideScale * 2), -6f+rd.f(0, .2f), zDist), scale = rd.f(.3f, .4f) * 2, name="tree", parent = src,
			};
		}
	}
	void Bushes() {
		var src = new ent(gameSys) { name="bushSet" };
		for( var k = 0; k < 100; k++ ) {
			var zDist = rd.f(3f, 27.0f); var sideScale = zDist / 60.0f;
			new ent(gameSys) { sprite = rd.Sprite(bushes), pos = new v3(rd.f(23) * (1 + sideScale * 2), -6f+rd.f(0, .2f), zDist), scale = rd.f(.3f, .4f), name="bush", parent = src };
		}
	}
	void Buildings() {
		var src = new ent(gameSys) { name="buildingSet" };
		for( var k = 0; k < 6; k++ ) {
			var zDist = 2.5f; var posx = -12 + 10 * (k/6f);
			new ent(gameSys) { sprite = buildings[k], pos = new v3(posx, -6f+rd.f(0, .2f), zDist), scale = rd.f(.3f, .4f) * 1.7f, name="building", parent = src };
			new ent(gameSys) { sprite = buildings[k], pos = new v3(-posx, -6f+rd.f(0, .2f), zDist), scale = rd.f(.3f, .4f) * 1.7f, name="building", parent = src };
		}
	}
}