using UnityEngine;
using v3 = UnityEngine.Vector3;

public class Backgrounds:MonoBehaviour {
	public Sprite[] trees, bushes, clouds, buildings, skies;
	public Sprite flag1, flag2, overlay, land;

	GameSys gameSys;
	public v3[] Setup(GameSys theGameSys) {
		gameSys = theGameSys;

		Clouds();
		Trees();
		Bushes();

		var lookPositions = Buildings();

		Flags();

		return lookPositions;
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
				sprite = rd.Sprite(trees), pos = new v3(rd.f(23) * (1 + sideScale * 2), -5f+rd.f(0, .2f), zDist), scale = rd.f(.3f, .4f) * 2, name="tree", parent = src,
			};
		}
	}
	void Bushes() {
		var src = new ent(gameSys) { name="bushSet" };
		for( var k = 0; k < 100; k++ ) {
			var zDist = rd.f(3f, 27.0f); var sideScale = zDist / 60.0f;
			new ent(gameSys) { sprite = rd.Sprite(bushes), pos = new v3(rd.f(23) * (1 + sideScale * 2), -5f+rd.f(0, .2f), zDist), scale = rd.f(.3f, .4f), name="bush", parent = src };
		}
	}
	v3[] Buildings() {

		v3[] lookPos = new v3[12];

		var src = new ent(gameSys) { name="buildingSet" };
		for( var k = 0; k < 6; k++ ) {
			var zDist = 1f; var posx = -9.5f + 8.5f * (k/6f);
			lookPos[k] = new v3(posx, -5f+rd.f(0, .2f), zDist);
			lookPos[12-1-k] = new v3(-posx, -5f+rd.f(0, .2f), zDist);
			new ent(gameSys) { sprite = buildings[k], pos = lookPos[k], scale = rd.f(.3f, .4f) * 1.4f, name="building", parent = src };
			new ent(gameSys) { sprite = buildings[k], pos = lookPos[12-1-k], scale = rd.f(.3f, .4f) * 1.4f, name="building", parent = src };
		}

		return lookPos;
	}
	void Flags() {
		var f1 = 7.8f;
		var f2 = 4.8f;

		var src = new ent(gameSys) { name="flagSet" };
		new ent(gameSys) { sprite = flag1, pos=new Vector3( -1.5f, -5f, -3f ), scale = .3f, name="flags", parent = src };
		new ent(gameSys) { sprite = flag1, pos=new Vector3( -1.5f, -5f, 3f ), scale = .3f, name="flags", parent = src };

		new ent(gameSys) { sprite = flag1, pos = new Vector3(-f1, -5f, -.4f), scale = .15f, name = "flags", parent = src };
		new ent(gameSys) { sprite = flag1, pos = new Vector3(-f1, -5f, 0f), scale = .15f, name = "flags", parent = src };
		new ent(gameSys) { sprite = flag1, pos = new Vector3(-f1, -5f, .4f), scale = .15f, name = "flags", parent = src };

		new ent(gameSys) { sprite = flag1, pos = new Vector3(-f2, -5f, -.4f), scale = .15f, name = "flags", parent = src };
		new ent(gameSys) { sprite = flag1, pos = new Vector3(-f2, -5f, 0f), scale = .15f, name = "flags", parent = src };
		new ent(gameSys) { sprite = flag1, pos = new Vector3(-f2, -5f, .4f), scale = .15f, name = "flags", parent = src };

		new ent(gameSys) { sprite = flag2, pos=new Vector3( 1.5f, -5f, -3f ), scale = .3f, name="flags", parent = src };
		new ent(gameSys) { sprite = flag2, pos=new Vector3( 1.5f, -5f, 3f ), scale = .3f, name="flags", parent = src };

		new ent(gameSys) { sprite = flag2, pos = new Vector3(f1, -5f, -.4f), scale = .15f, name = "flags", parent = src };
		new ent(gameSys) { sprite = flag2, pos = new Vector3(f1, -5f, 0f), scale = .15f, name = "flags", parent = src };
		new ent(gameSys) { sprite = flag2, pos = new Vector3(f1, -5f, .4f), scale = .15f, name = "flags", parent = src };

		new ent(gameSys) { sprite = flag2, pos = new Vector3(f2, -5f, -.4f), scale = .15f, name = "flags", parent = src };
		new ent(gameSys) { sprite = flag2, pos = new Vector3(f2, -5f, 0f), scale = .15f, name = "flags", parent = src };
		new ent(gameSys) { sprite = flag2, pos = new Vector3(f2, -5f, .4f), scale = .15f, name = "flags", parent = src };

	}
}