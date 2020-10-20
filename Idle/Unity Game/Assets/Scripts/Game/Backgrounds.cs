using UnityEngine;
using v3 = UnityEngine.Vector3;

public static class Backgrounds {
	public static void Setup() {
		//Clouds();
		Trees();
		Bushes();}
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
			new ent() { sprite = Art.Props.Bushes.rand(), pos = new v3(rd.f(23) * (1 + sideScale * 2), -5f+rd.f(0, .2f), zDist), scale = rd.f(.3f, .4f), name="bush", parent = src };}}}