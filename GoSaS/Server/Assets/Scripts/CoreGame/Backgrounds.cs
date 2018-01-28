using UnityEngine;
using v3 = UnityEngine.Vector3;

public class Backgrounds:MonoBehaviour {
	public Sprite[] trees, bushes, clouds, buildings, skies;
	public Sprite flag1, flag2, overlay, land;
	Buildings buildingSet;

    Items items;
    BuildingActions buildingActions;

	public void Title(GameSys theGameSys, Buildings theBuildingSet, PlayerSys thePlayerSys, TreatSys theTreatSys ) {
		buildingSet = theBuildingSet;

        if (buildingSet != null){
            items = new Items(buildingSet, thePlayerSys);
            buildingActions = new BuildingActions(theGameSys, buildingSet, thePlayerSys, theTreatSys);}

		Clouds();
		Trees();
		Bushes();

		//var lookPositions = Buildings();

		//Flags();
    }

	public v3[] Setup(GameSys theGameSys, Buildings theBuildingSet, PlayerSys thePlayerSys, TreatSys theTreatSys ) {
		buildingSet = theBuildingSet;

        if (buildingSet != null){
            items = new Items(buildingSet, thePlayerSys);
            buildingActions = new BuildingActions(theGameSys, buildingSet, thePlayerSys, theTreatSys);}

		Clouds();
		Trees();
		Bushes();

		var lookPositions = Buildings();

		Flags();

		return lookPositions;}
	void Clouds() {
		var src = new ent() { name="cloudSet" };
		for( var k = 0; k < 250; k++ ) {
			var zDist = rd.f(0, 50); var sideScale = zDist / 50; var goal = new v3(rd.f(28) * (1 + sideScale * 2), rd.f(0, 18) * (1 + sideScale * 2), 10 + zDist);
			var offset = rd.Ang(); var rotateRange = rd.f(.1f, .2f) * 80; var rotateSpeed = rd.f(.02f, .04f);
			var tick = 0f;
			new ent() { sprite = rd.Sprite(clouds), pos = goal, scale = rd.f(.3f, .4f) * 1.7f, parent = src, name="cloud", 
				update = e => {
					tick++;
					if(rd.Test(.0003f)) { goal = e.pos + rd.Vec(-3, 3); }
					e.ang = Mathf.Cos(tick * rotateSpeed + offset) * rotateRange;
					var immediateGoal = e.pos * .99f + .01f * goal;
					if(immediateGoal.magnitude > .1f) e.MoveBy(immediateGoal - e.pos);}};}}
	void Trees() {
		var src = new ent() { name="treeSet" };
		for( var k = 0; k < 300; k++ ) {
			var zDist = rd.f(7f, 60.0f); var sideScale = zDist / 60.0f;
			new ent() {sprite = rd.Sprite(trees), pos = new v3(rd.f(23) * (1 + sideScale * 2), -5f+rd.f(0, .2f), zDist), scale = rd.f(.3f, .4f) * 2, name="tree", parent = src,};}}
	void Bushes() {
		var src = new ent() { name="bushSet" };
		for( var k = 0; k < 100; k++ ) {
			var zDist = rd.f(3f, 27.0f); var sideScale = zDist / 60.0f;
			new ent() { sprite = rd.Sprite(bushes), pos = new v3(rd.f(23) * (1 + sideScale * 2), -5f+rd.f(0, .2f), zDist), scale = rd.f(.3f, .4f), name="bush", parent = src };}}

    public void DoBuilding(BuildingActionID id, int team, v3 pos) { buildingActions.DoBuilding(id, team, pos); }
    public void DoItem(ItemId id, int team, v3 pos) {items.DoItem(id,team,pos ); }

	v3[] Buildings() {

		v3[] lookPos = new v3[12];

		var bList = new Sprite[] { buildingSet.barn, buildingSet.pond, buildingSet.greenhouse, buildingSet.airport, buildingSet.policeStation, buildingSet.hospital };
		var scList = new float[] { .7f, 1, .6f, 1, 1, 1 };

		var src = new ent() { name = "buildingSet" };
		for (var k = 0; k < 6; k++) {
			var zDist = 1f; var posx = -9.5f + 8.5f * (k / 6f);
			lookPos[k] = new v3(posx, -5f + rd.f(0, .2f), zDist);
			lookPos[12 - 1 - k] = new v3(-posx, -5f + rd.f(0, .2f), zDist);
			new ent() { sprite = bList[k], pos = lookPos[k], scale = .4f * scList[k], name = "building", parent = src };
			new ent() { sprite = bList[k], pos = lookPos[12 - 1 - k], scale = .4f * scList[k], name = "building", parent = src };}

		return lookPos;}
	public void GameUpdate( double roundTime ) {}
	void Flags() {
		var f1 = 7.8f;
		var f2 = 4.8f;

		var src = new ent() { name="flagSet" };
		new ent() { sprite = flag1, pos=new Vector3( -1.5f, -5f, -3f ), scale = .3f, name="flags", parent = src };
		new ent() { sprite = flag1, pos=new Vector3( -1.5f, -5f, 3f ), scale = .3f, name="flags", parent = src };

		new ent() { sprite = flag1, pos = new Vector3(-f1, -5f, -.4f), scale = .15f, name = "flags", parent = src };
		new ent() { sprite = flag1, pos = new Vector3(-f1, -5f, 0f), scale = .15f, name = "flags", parent = src };
		new ent() { sprite = flag1, pos = new Vector3(-f1, -5f, .4f), scale = .15f, name = "flags", parent = src };

		new ent() { sprite = flag1, pos = new Vector3(-f2, -5f, -.4f), scale = .15f, name = "flags", parent = src };
		new ent() { sprite = flag1, pos = new Vector3(-f2, -5f, 0f), scale = .15f, name = "flags", parent = src };
		new ent() { sprite = flag1, pos = new Vector3(-f2, -5f, .4f), scale = .15f, name = "flags", parent = src };

		new ent() { sprite = flag2, pos=new Vector3( 1.5f, -5f, -3f ), scale = .3f, name="flags", parent = src };
		new ent() { sprite = flag2, pos=new Vector3( 1.5f, -5f, 3f ), scale = .3f, name="flags", parent = src };

		new ent() { sprite = flag2, pos = new Vector3(f1, -5f, -.4f), scale = .15f, name = "flags", parent = src };
		new ent() { sprite = flag2, pos = new Vector3(f1, -5f, 0f), scale = .15f, name = "flags", parent = src };
		new ent() { sprite = flag2, pos = new Vector3(f1, -5f, .4f), scale = .15f, name = "flags", parent = src };

		new ent() { sprite = flag2, pos = new Vector3(f2, -5f, -.4f), scale = .15f, name = "flags", parent = src };
		new ent() { sprite = flag2, pos = new Vector3(f2, -5f, 0f), scale = .15f, name = "flags", parent = src };
		new ent() { sprite = flag2, pos = new Vector3(f2, -5f, .4f), scale = .15f, name = "flags", parent = src };}}