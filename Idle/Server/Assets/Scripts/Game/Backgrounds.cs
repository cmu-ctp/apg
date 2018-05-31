using UnityEngine;
using v3 = UnityEngine.Vector3;

public static class Backgrounds {
	public static void Setup() {
		Clouds();
		Trees();
		Bushes();
		//Buildings();
		//Flags();
    }
	static void Clouds() {
		var src = new ent() { name="cloudSet" };
		for( var k = 0; k < 250; k++ ) {
			var zDist = rd.f(0, 50); var sideScale = zDist / 50; var goal = new v3(rd.f(28) * (1 + sideScale * 2), rd.f(0, 18) * (1 + sideScale * 2), 10 + zDist);
			var offset = rd.Ang(); var rotateRange = rd.f(.1f, .2f) * 80; var rotateSpeed = rd.f(.02f, .04f);
			var tick = 0f;
			new ent() { sprite = Art.Props.Clouds.rand(), pos = goal, scale = rd.f(.3f, .4f) * 1.7f, parent = src, name="cloud", 
				update = e => {
					tick++;
					if(rd.Test(.0003f)) { goal = e.pos + rd.Vec(-3, 3); }
					e.ang = Mathf.Cos(tick * rotateSpeed + offset) * rotateRange;
					var immediateGoal = e.pos * .99f + .01f * goal;
					if(immediateGoal.magnitude > .1f) e.MoveBy(immediateGoal - e.pos);}};}}
	static void Trees() {
		var src = new ent() { name="treeSet" };
		for( var k = 0; k < 300; k++ ) {
			var zDist = rd.f(0f, 60.0f); var sideScale = zDist / 60.0f;
			new ent() {sprite = Art.Props.Trees.rand(), pos = new v3(rd.f(23) * (1 + sideScale * 2), -5f+rd.f(0, .2f), zDist), scale = rd.f(.3f, .4f) * 2, name="tree", parent = src,};}}
	static void Bushes() {
		var src = new ent() { name="bushSet" };
		for( var k = 0; k < 100; k++ ) {
			var zDist = rd.f(0f, 27.0f); var sideScale = zDist / 60.0f;
			new ent() { sprite = Art.Props.Bushes.rand(), pos = new v3(rd.f(23) * (1 + sideScale * 2), -5f+rd.f(0, .2f), zDist), scale = rd.f(.3f, .4f), name="bush", parent = src };}}
	static void Buildings() {
		v3[] lookPos = new v3[12];
        var bList = new ImageEntry[] { Art.Buildings.barn, Art.Buildings.pond, Art.Buildings.greenhouse, Art.Buildings.airport, Art.Buildings.policestation, Art.Buildings.hospital };
        var scList = new float[] { .7f, 1, .6f, 1, 1, 1 };
		var src = new ent() { name = "buildingSet" };
		for (var k = 0; k < 6; k++) {
			var zDist = 1f; var posx = -9.5f + 8.5f * (k / 6f);
			lookPos[k] = new v3(posx, -5f + rd.f(0, .2f), zDist);
			lookPos[12 - 1 - k] = new v3(-posx, -5f + rd.f(0, .2f), zDist);
			new ent() { sprite = bList[k].spr, pos = lookPos[k], scale = .4f * scList[k], name = "building", parent = src };
			new ent() { sprite = bList[k].spr, pos = lookPos[12 - 1 - k], scale = .4f * scList[k], name = "building", parent = src };}}
	static void Flags() {
		var f1 = 7.8f;
		var f2 = 4.8f;

		var src = new ent() { name="flagSet" };
		new ent() { sprite = Art.Players.flag1.spr, pos=new Vector3( -1.5f, -5f, -3f ), scale = .3f, name="flags", parent = src };
		new ent() { sprite = Art.Players.flag1.spr, pos=new Vector3( -1.5f, -5f, 3f ), scale = .3f, name="flags", parent = src };

		new ent() { sprite = Art.Players.flag1.spr, pos = new Vector3(-f1, -5f, -.4f), scale = .15f, name = "flags", parent = src };
		new ent() { sprite = Art.Players.flag1.spr, pos = new Vector3(-f1, -5f, 0f), scale = .15f, name = "flags", parent = src };
		new ent() { sprite = Art.Players.flag1.spr, pos = new Vector3(-f1, -5f, .4f), scale = .15f, name = "flags", parent = src };

		new ent() { sprite = Art.Players.flag1.spr, pos = new Vector3(-f2, -5f, -.4f), scale = .15f, name = "flags", parent = src };
		new ent() { sprite = Art.Players.flag1.spr, pos = new Vector3(-f2, -5f, 0f), scale = .15f, name = "flags", parent = src };
		new ent() { sprite = Art.Players.flag1.spr, pos = new Vector3(-f2, -5f, .4f), scale = .15f, name = "flags", parent = src };

		new ent() { sprite = Art.Players.flag2.spr, pos=new Vector3( 1.5f, -5f, -3f ), scale = .3f, name="flags", parent = src };
		new ent() { sprite = Art.Players.flag2.spr, pos=new Vector3( 1.5f, -5f, 3f ), scale = .3f, name="flags", parent = src };

		new ent() { sprite = Art.Players.flag2.spr, pos = new Vector3(f1, -5f, -.4f), scale = .15f, name = "flags", parent = src };
		new ent() { sprite = Art.Players.flag2.spr, pos = new Vector3(f1, -5f, 0f), scale = .15f, name = "flags", parent = src };
		new ent() { sprite = Art.Players.flag2.spr, pos = new Vector3(f1, -5f, .4f), scale = .15f, name = "flags", parent = src };

		new ent() { sprite = Art.Players.flag2.spr, pos = new Vector3(f2, -5f, -.4f), scale = .15f, name = "flags", parent = src };
		new ent() { sprite = Art.Players.flag2.spr, pos = new Vector3(f2, -5f, 0f), scale = .15f, name = "flags", parent = src };
		new ent() { sprite = Art.Players.flag2.spr, pos = new Vector3(f2, -5f, .4f), scale = .15f, name = "flags", parent = src };}}