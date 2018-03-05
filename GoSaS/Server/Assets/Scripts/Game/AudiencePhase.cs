using UnityEngine;
using System;
using System.Collections.Generic;
using v3 = UnityEngine.Vector3;

public class AudiencePhase {

	class ActionInfo {
		public APlayerInfo g;
		public bool use, harvest = false;
        public int dmg = 0;
        public ItemId item = ItemId.Unset;
        public BuildingActionID building=BuildingActionID.Unset;
		public ActionInfo(APlayerInfo src) { g = src; use = (g != null && g.pl.health > 0);}

		public void DoAction( PlayerHUD hud, Backgrounds backgrounds ) {
			if (harvest) {
				if (hud.curBuildingUsed) { hud.actionFail = 1; } else { g.funcs.doHarvest(); }
				hud.curBuildingUsed = true;
				hud.buildingpic.color = new Color(.3f, .3f, .3f, 1);}
			if (item != ItemId.Unset) { g.funcs.useUpSelectedItem(); backgrounds.DoItem(item, 1, g.pl.pos);}
			if (building != BuildingActionID.Unset) {
				if (hud.curBuildingUsed) { hud.actionFail = 1; }
				else { g.funcs.useSelectedBuildingAction(); backgrounds.DoBuilding(building, 1, g.pl.pos); }
				hud.curBuildingUsed = true;
				hud.buildingpic.color = new Color(.3f, .3f, .3f, 1);}}}

	class HudShared {
		public float fadeIn = 0, push = 0;
		public AudiencePhaseInfo info;
            
		public float curDelay = 0f;
		public int curGrid = -1;
		public float actionDelay = 0f;
		public v3 audiencePos2 = new v3(0, 0, 0);

        public Transform transform;

        public HudShared( AudiencePhaseInfo infoSrc, Transform theTransform) {
            transform = theTransform;
            info = infoSrc;
			info.doingAction = true;}}

	class PlayerHUD {
		public HudShared src;
		ent label, labelbk, face, health;
		public ent action, buildingpic;
		public float healthRat = 0f, shake = 0; public int actionFail = 0, curBuilding = 0; public bool curBuildingUsed = false;

        Sprite[] buildings = new Sprite[] { Art.Buildings.barn.spr, Art.Buildings.pond.spr, Art.Buildings.greenhouse.spr, Art.Buildings.airport.spr, Art.Buildings.policestation.spr, Art.Buildings.hospital.spr };
        Sprite[] items = new Sprite[] { Art.Players.items.ball.spr, Art.Players.items.bomb.spr, Art.Players.items.hammer.spr, Art.Players.items.mask.spr, Art.Players.items.rocket.spr, Art.Players.items.shield.spr };
        Sprite[] buildingActions = new Sprite[] { Art.Players.buildingabilities.cow.spr, Art.Players.buildingabilities.broccoli.spr, Art.Players.buildingabilities.fish.spr, Art.Players.buildingabilities.turtles.spr, Art.Players.buildingabilities.flowers.spr, Art.Players.buildingabilities.sun.spr,
            Art.Players.buildingabilities.biplane.spr, Art.Players.buildingabilities.blimp.spr, Art.Players.buildingabilities.policecopter.spr, Art.Players.buildingabilities.policecar.spr, Art.Players.buildingabilities.meds.spr, Art.Players.buildingabilities.fairyability.spr};
        Sprite[] actions = new Sprite[] { Art.Players.actions.slash.spr, Art.Players.actions.recklessability.spr, Art.Players.actions.strikeback.spr, Art.Players.actions.harvest.spr, Art.Players.actions.harvest.spr,
            Art.Players.actions.activate.spr, Art.Players.actions.bag1.spr, Art.Players.actions.bag1.spr, Art.Players.actions.bag1.spr };

		public PlayerHUD( HudShared theSrc, float scs, int sideSet) {
			src = theSrc;

			var yadd = -7;

			label = makeTx(scs * 4, .5f, "Player", sideSet, false);
			labelbk = makeTx(scs * 4, .5f, "Player", sideSet, true); labelbk.color = new Color(0, 0, 0, 1);
			face = make(scs * 5, yadd + 3, AudiencePlayerSys.heads[0], 1.5f, sideSet);
			action = makeAction(scs * 3f, yadd + 3.5f, actions[0], 2f, sideSet);
			health = makeHealth(scs * 5.5f, yadd + 2.5f, .3f, sideSet); health.color = new Color(1, 0, 0, 1);
			buildingpic = makeBuilding(scs * 6.5f, yadd + 2, buildings[0], .65f, sideSet);}

		public ent make(float x, float y, Sprite spr, float sc, int set) {
			return new ent() {
				ignorePause = true, parentTrans = src.transform, scale = sc, pos = new v3(x, y, 10), sprite = spr, health = 0, layer = Layers.UI,
				update = e2 => {
					var mul = (set == 1) ? 1 : -1;
					if (set == 1 && !src.info.showSet1) e2.scale = 0;
					else if (set == 2 && !src.info.showSet2) e2.scale = 0;
					else if (e2.health > 0) { e2.health--; e2.scale = 0; }
					else { e2.scale = sc * (1f - src.fadeIn); }
					if (!src.info.atRemove) { var v = e2.pos; nm.ease(ref v, new v3(src.push * mul + x + rd.f(-shake, shake), y + rd.f(-shake, shake), 10), .1f); e2.pos = v; }
					else { var v = e2.pos; nm.ease(ref v, new v3(0, -10, 10), .1f); e2.pos = v; }
					if (e2.pos.y < -9f) e2.remove();}};}
		public ent makeTx(float x, float y, string tx, int set, bool isBack) {
			return new ent(Art.Text.TextName.obj) {
				ignorePause = true, text = tx, parentTrans = src.transform, scale = .1f, pos = new v3(x, y, 10), layer = Layers.UI,
				update = e2 => {
					var mul = (set == 1) ? 1 : -1;
					if (set == 1 && !src.info.showSet1) e2.scale = 0;
					else if (set == 2 && !src.info.showSet2) e2.scale = 0;
					else e2.scale = .1f;
					e2.textAlpha = 1f - src.fadeIn;
					if (!src.info.atRemove) { var v = e2.pos; nm.ease(ref v, new v3(src.push * mul + x + rd.f(-shake, shake) + (isBack ? .02f : 0), y + rd.f(-shake, shake) - (isBack ? .02f : 0), 10 + (isBack ? .01f : 0)), .1f); e2.pos = v; }
					else { var v = e2.pos; nm.ease(ref v, new v3(0, -10, 10), .1f); e2.pos = v; }
					if (e2.pos.y < -9f) e2.remove();}};}
		public ent makeAction(float x, float y, Sprite spr, float sc, int set) {
			return new ent() {
				ignorePause = true, parentTrans = src.transform, scale = sc, pos = new v3(x, y, 10), sprite = spr, health = 0, layer = Layers.UI,
				update = e2 => {
					var fall = 0; var mul = (set == 1) ? 1 : -1;
					if (set == 1) { if (actionFail > 0) { actionFail++; e2.ang = actionFail * 5; fall = actionFail * 3; if (fall > 6) fall = 6; e2.color = new Color(1, 1, 1, 1f - actionFail * .01f); } }
					if (set == 1 && !src.info.showSet1) e2.scale = 0;
					else if (set == 2 && !src.info.showSet2) e2.scale = 0;
					else if (e2.health > 0) { e2.health--; e2.scale = 0; }
					else { e2.scale = sc * (1f - src.fadeIn); }
					if (!src.info.atRemove) { var v = e2.pos; nm.ease(ref v, new v3(src.push * mul + x + rd.f(-shake, shake), y + rd.f(-shake, shake) - fall, 10), .1f); e2.pos = v; }
					else { var v = e2.pos; nm.ease(ref v, new v3(0, -20, 10), .1f); e2.pos = v; }
					if (e2.pos.y < -19f) e2.remove();}};}
		public ent makeHealth(float x, float y, float sc, int set) {
			return new ent() {
				ignorePause = true, parentTrans = src.transform, scale = sc, pos = new v3(x, y, 10), sprite = Art.UI.minihealthbar.spr, health = 0, layer = Layers.UI, color = new Color(1, 0, 0, 1),
				update = e2 => {
					var mul = (set == 1) ? 1 : -1;
					if (set == 1 && !src.info.showSet1) e2.scale = 0;
					else if (set == 2 && !src.info.showSet2) e2.scale = 0;
					else if (e2.health > 0) { e2.health--; e2.scale = 0; }
					else { e2.scale3 = new v3(sc * (1f - src.fadeIn) * healthRat, sc * (1f - src.fadeIn), 1); }
					e2.color = new Color(.3f + .7f * healthRat, 0, 0, 1);
					if (!src.info.atRemove) { var v = e2.pos; nm.ease(ref v, new v3(src.push * mul + x + rd.f(-shake, shake), y + rd.f(-shake, shake), 10), .1f); e2.pos = v; }
					else { var v = e2.pos; nm.ease(ref v, new v3(0, -10, 10), .1f); e2.pos = v; }
					if (e2.pos.y < -9f) e2.remove();}};}
		public ent makeBuilding(float x, float y, Sprite spr, float sc, int set) {
			return new ent() {
				ignorePause = true, parentTrans = src.transform, scale = sc, pos = new v3(x, y, 11), sprite = spr, health = 0, layer = Layers.UIMid,
				update = e2 => {
					var mul = (set == 1) ? 1 : -1;
					if (set == 1 && !src.info.showSet1) e2.scale = 0;
					else if (set == 2 && !src.info.showSet2) e2.scale = 0;
					else if (e2.health > 0) { e2.health--; e2.scale = 0; }
					else { e2.scale = sc * (1f - src.fadeIn); }
					if (!src.info.atRemove) { var v = e2.pos; nm.ease(ref v, new v3(src.push * mul * .5f + x, y, 10), .1f); e2.pos = v; }
					else { var v = e2.pos; nm.ease(ref v, new v3(0, -10, 10), .1f); e2.pos = v; }
					if (e2.pos.y < -9f) e2.remove();}};}

		public void ChangeFocus( APlayerInfo g2) {
			actionFail = 0;
			if (g2 != null && g2.pl.health > 0) {
				if (g2.curBuilding%6 != curBuilding) {
					curBuilding = g2.curBuilding%6;
					curBuildingUsed = false;
					buildingpic.color = new Color(1, 1, 1, 1);}
				buildingpic.sprite = buildings[g2.curBuilding%6];
				action.color = new Color(1, 1, 1, 1); action.ang = 0;
				labelbk.text = label.text = g2.label.text;
				label.textColor = AudiencePlayerSys.nameColors[g2.colorID];
				face.sprite = AudiencePlayerSys.heads[g2.headID];
				if (g2.itemId != ItemId.Unset) action.sprite = items[(int)g2.itemId];
				else if (g2.buildingActionId != BuildingActionID.Unset) action.sprite = buildingActions[(int)g2.buildingActionId];
				else action.sprite = actions[(int)g2.actionId]; }
			action.health = 240;}}

	class AudiencePhaseInfo {
		public int usedSpots = 0;
		public List<int> spotList = new List<int>();
		public List<int> rowList = new List<int>();
		public bool showSet1 = false;
		public bool showSet2 = false;
		public bool doingAction = false;
		public bool atRemove = false;
		public int tick = 0;}

	public static void EndOfRoundCamera( v3 cameraPos, ref v3 lastLookAtPos, ref v3 lastLookFromPos, float pauseRatio, ref v3 lookPos, Transform transform) {
		var newLookPos = cameraPos; newLookPos.y -= 10f;
		nm.ease(ref lastLookAtPos, newLookPos, .3f);
		lookPos = lastLookAtPos;
		nm.ease(ref lastLookFromPos, new v3(lookPos.x * .1f, lookPos.y * .1f, -9.5f), .2f);
		transform.LookAt(new v3(transform.position.x * .9f + .1f * lookPos.x, transform.position.y * .9f + .1f * lookPos.y, lookPos.z));
		transform.position = lastLookFromPos;}

	static Color[] roundColors = new Color[] { new Color(.4f, .533f, .266f, 1f), new Color(.266f, .4f, .533f, 1f), new Color(.533f, .266f, .4f, 1f) };

    static bool textFade( ent e2, float spd ) {
        if (e2.health > 0) { e2.textAlpha = e2.textAlpha * (1- spd) + spd * 1.01f; } else { e2.textAlpha = e2.textAlpha * (1-spd) + spd * -.01f; } e2.health--;
        return (e2.textAlpha < .01f && e2.health < 1);}
    static void MakeMessage( Transform transform, int roundNumber, string message, Action onUpdate, Action onEnd ) {
		new ent(Art.Text.TextName.obj) {
			ignorePause = true, text = message , parentTrans = transform, scale = .15f, pos = new v3(0, 3, 10), health = FullGame.ticksPerSecond * 2, textColor = roundColors[(roundNumber) % roundColors.Length], textAlpha = 0,
			update = e2 => { onUpdate(); if (textFade(e2, .1f)) { onEnd(); e2.remove();}}};}

    static float roundEndMessageTime = 1;
    static float leaderboardTime = roundEndMessageTime+1;
    //static float roundStartMessageTime = leaderboardTime + 4;////1.5f;//2.5f;
    static float roundStartMessageTime = roundEndMessageTime+2.5f;
    static float oldRoundFadeOutTime = roundStartMessageTime+.5f;
    static float audienceTurnMessageTime = oldRoundFadeOutTime+1.5f;
    static float audienceActionsTime = audienceTurnMessageTime+2.5f;

    static void RoundEndMessage(Transform transform, int roundNumber) {
		var tick = 0;
		new ent(Art.Text.TextName.obj) {
			ignorePause = true, text = "Round " + (roundNumber - 1) + " is over!", parentTrans = transform, scale = .1f, pos = new v3(0, 3, 10), health = FullGame.ticksPerSecond * 2, textColor = roundColors[(roundNumber - 1) % roundColors.Length], textAlpha = 0,
			update = e2 => {
				tick++;
				if (tick < FullGame.ticksPerSecond * roundEndMessageTime) return;
				if (textFade(e2, .1f)) e2.remove();}};

		new ent() {
			ignorePause = true, parentTrans = transform, scale = 60f, pos = new v3(0, 0, 10), health = FullGame.ticksPerSecond * 2, sprite = Art.UI.cutsceneBorder.spr, color = new Color(1,1,1,0), name="fader", layer=Layers.Fade,
			update = e2 => {
				tick++;
				if (tick < FullGame.ticksPerSecond * oldRoundFadeOutTime) return;
				var rat = (tick - FullGame.ticksPerSecond * oldRoundFadeOutTime) /210f;
				var alpha = (float)Math.Sin(rat * Math.PI) * 2f;
				if (alpha > 1) alpha = 1;
				e2.color = new Color(1, 1, 1, alpha);
				if (tick > FullGame.ticksPerSecond *4 + 210) e2.remove();}};}

    static void Leaderboard(Transform transform, int roundNumber) {
		var tick = 0;
		new ent() {
			ignorePause = true, parentTrans = transform, scale = 1f, pos = new v3(0, 0, 10), health = FullGame.ticksPerSecond * 2, sprite = Art.UI.Title.howtoplay.spr, color = new Color(1,1,1,0), name="fader", layer=Layers.Fade,
			update = e2 => {
				tick++;
				if (tick < FullGame.ticksPerSecond * leaderboardTime) return;
				var rat = (tick - FullGame.ticksPerSecond * leaderboardTime) /210f;
				var alpha = (float)Math.Sin(rat * Math.PI) * 2f;
				if (alpha > 1) alpha = 1;
				e2.color = new Color(1, 1, 1, alpha);
				if (tick > FullGame.ticksPerSecond *4 + 210) e2.remove();}};
		new ent(Art.Text.TextName.obj) {
			ignorePause = true, text = "Leaderboard", parentTrans = transform, scale = .1f, pos = new v3(0, 3, 10), health = FullGame.ticksPerSecond * 2, textColor = roundColors[(roundNumber - 1) % roundColors.Length], textAlpha = 0,
			update = e2 => {
				tick++;
				if (tick < FullGame.ticksPerSecond * leaderboardTime) return;
				if (textFade(e2, .1f)) e2.remove();}};}

    static void RoundStartMessage(Transform transform, int roundNumber) {
		var tick = 0;
		new ent(Art.Text.TextName.obj) {
			ignorePause = true, text = "Round " + (roundNumber), parentTrans = transform, scale = .15f, pos = new v3(0, 3, 10), health = FullGame.ticksPerSecond * 2, textColor = roundColors[(roundNumber ) % roundColors.Length], textAlpha = 0,
			update = e2 => {
				tick++;
				if (tick < FullGame.ticksPerSecond * roundStartMessageTime) return;
				if (textFade(e2, .1f)) e2.remove();}};}

	static void AudienceTurnMessage(Transform transform, int roundNumber) {
		var tick = 0;
		new ent(Art.Text.TextName.obj) {
			ignorePause = true, text = "Audience Turn", parentTrans = transform, scale = .15f, pos = new v3(0, 3, 10), health = FullGame.ticksPerSecond * 2, textColor = roundColors[(roundNumber ) % roundColors.Length], textAlpha=0,
			update = e2 => {
				tick++;
				if (tick < FullGame.ticksPerSecond * audienceTurnMessageTime) return;
				if (textFade(e2, .1f)) e2.remove();}};}

	static void DoWindDown(AudiencePhaseStatus aStatus, Transform transform, int roundNumber, APlayerInfo[,] grid, Action audienceActionsEnded) {
		for (var k = 0; k < 12; k++) for (var j = 0; j < 3; j++) { if (grid[k, j] != null) grid[k, j].funcs.doMove(); }
		for (var j = 5; j > -1; j--) {
			for (var k = 2; k > -1; k--) {
				if ((grid[j, k] != null && grid[j, k].pl.health > 0)) { var ex = grid[j, k].pl; grid[j, k].bodyEnt.color=ex.color = new Color(ex.color.r, ex.color.g, ex.color.b, 1); grid[j, k].headEnt.color = new Color(1,1,1,1); }
				if (grid[6 + j, k] != null && grid[6 + j, k].pl.health > 0) { var ex = grid[6+j, k].pl; grid[6 + j, k].bodyEnt.color=ex.color = new Color(ex.color.r, ex.color.g, ex.color.b, 1); grid[6+j, k].headEnt.color = new Color(1,1,1,1); }}}

		// make a little running panting noise!
		new ent(Art.Text.TextName.obj) {
			ignorePause = true, text = "Movement Turn", parentTrans = transform, scale = .15f, pos = new v3(0, 3, 10), health = FullGame.ticksPerSecond * 2, textColor = roundColors[(roundNumber) % roundColors.Length], textAlpha = 0,
			update = e2 => {
                for (var k = 0; k < 12; k++) for (var j = 0; j < 3; j++) { if (grid[k, j] != null) grid[k, j].funcs.updateMove(grid[k, j].pl); }
				if (textFade(e2, .1f)) { DoStreamerMessage( aStatus, transform, roundNumber, audienceActionsEnded); e2.remove();}}};

    }

	static void DoStreamerMessage( AudiencePhaseStatus aStatus, Transform transform, int roundNumber, Action audienceActionsEnded) {
        MakeMessage(transform, roundNumber, "Streamer Turn", () => { }, () => { aStatus.doingEnd = false; aStatus.midpointTimer = 0; audienceActionsEnded(); });}
	
    static void RunAnim( ActionInfo v, bool successfulAttack, bool successfulRetaliate, bool hurt ){
            switch( v.g.actionId){
                case AudienceAction.SmallAttack: v.g.funcs.startAnim(AnimStyle.SmallAttack, successfulAttack, hurt); break;
                case AudienceAction.BigAttack: v.g.funcs.startAnim(AnimStyle.BigAttack, successfulAttack, hurt); break;
                case AudienceAction.Retaliate: v.g.funcs.startAnim(AnimStyle.Retaliate, successfulRetaliate, hurt); break;
                case AudienceAction.Harvest: v.g.funcs.startAnim(AnimStyle.Harvest, true, hurt); break;
                case AudienceAction.UseBuilding1:
                case AudienceAction.UseBuilding2: v.g.funcs.startAnim(AnimStyle.UseBuilding, true, hurt); break;
                case AudienceAction.UseItem1:
                case AudienceAction.UseItem2:
                case AudienceAction.UseItem3: v.g.funcs.startAnim(AnimStyle.UseItem, true, hurt); break;}}

	static void RunActions(HudShared src, PlayerHUD hud1, PlayerHUD hud2, APlayerInfo[,] grid, int curGrid, Backgrounds backgrounds) {
		// Attack.  Stops building actions.
		// Reckless attack.  Stops building actions.  Stops extract.  Stops items.
		var v1 = new ActionInfo(grid[src.info.spotList[curGrid], src.info.rowList[curGrid]]);
		var v2 = new ActionInfo(grid[6 + src.info.spotList[curGrid], src.info.rowList[curGrid]]);

        var pos1 = 0f;
        var pos2 = 1f;

		if (v1.use && v2.use) {
			var p1 = v1.g.pl; var p2 = v2.g.pl;
			var actionID1 = v1.g.actionId;
			var actionID2 = v2.g.actionId;
			v1.item = v1.g.itemId; v2.item = v2.g.itemId;
			v1.building = v1.g.buildingActionId; v2.building = v2.g.buildingActionId;
			if (actionID1 == AudienceAction.Harvest) v1.harvest = true;
			if (actionID2 == AudienceAction.Harvest) v2.harvest = true;
			if (actionID1 > AudienceAction.Retaliate && actionID2 > AudienceAction.Retaliate) {
                // both players have chosen actions that can't interfere with each other.
                RunAnim(v1, false, false,false);
                RunAnim(v2, false, false, false);}
			else {
				if (actionID1 == AudienceAction.SmallAttack) {
					if (v2.building != BuildingActionID.Unset) hud2.actionFail = 1;
					v2.building = BuildingActionID.Unset; 
					if (actionID2 == AudienceAction.SmallAttack) { v1.dmg = v2.dmg = 1; RunAnim(v1, true, false, false); RunAnim(v2, true, false, false); pos1 = pos2 = .5f; }
					else if (actionID2 == AudienceAction.BigAttack) { v1.dmg = v2.dmg = 1; RunAnim(v1, true, false, false); RunAnim(v2, true, false, false); pos1 = pos2 = .5f; }
					else if (actionID2 == AudienceAction.Retaliate) { v1.dmg = 2; RunAnim(v1, false, false, true); RunAnim(v2, false, true, false); pos1 = pos2 = 1; }
					else { v2.dmg = 1; RunAnim(v1, true, false, false); RunAnim(v2, false, false, true);pos1 = pos2 = 1;}}
				else if (actionID1 == AudienceAction.BigAttack) {
					if (v2.building != BuildingActionID.Unset || v2.item != ItemId.Unset || v2.harvest ) hud2.actionFail = 1;
					v2.building = BuildingActionID.Unset; v2.item = ItemId.Unset; v2.harvest = false;
					if (actionID2 == AudienceAction.SmallAttack) { v1.dmg = v2.dmg = 1; RunAnim(v1, true, false, false); RunAnim(v2, true, false, false); pos1 = pos2 = .5f; }
					else if (actionID2 == AudienceAction.BigAttack) { v1.dmg = v2.dmg = 2; RunAnim(v1, true, false, false); RunAnim(v2, true, false, false); pos1 = pos2 = .5f; }
					else if (actionID2 == AudienceAction.Retaliate) { v1.dmg = 5; RunAnim(v1, false, false, true); RunAnim(v2, false, true, false); pos1 = pos2 = 1; }
					else { v2.dmg = 2; RunAnim(v1, true, false, false); RunAnim(v2, false, false, true);pos1 = pos2 = 1;}}
				else if (actionID1 == AudienceAction.Retaliate) {
					if (actionID2 == AudienceAction.SmallAttack) { v2.dmg = 2; RunAnim(v1, false, true, false); RunAnim(v2, false, false, true); pos1 = pos2 = 0; }
					else if (actionID2 == AudienceAction.BigAttack) { v2.dmg = 5; RunAnim(v1, false, true, false); RunAnim(v2, false, false, true); pos1 = pos2 = 0; }
					else if (actionID2 == AudienceAction.Retaliate) { RunAnim(v1, false, false, false); RunAnim(v2, false, false, false); }
					else { RunAnim(v1, false, false, false); RunAnim(v2, false, false, false);}}
				else {
					if (actionID2 == AudienceAction.SmallAttack) { if (v1.building != BuildingActionID.Unset ) hud1.actionFail = 1; v1.building = BuildingActionID.Unset; v1.dmg = 1; RunAnim(v1, false, false, true); RunAnim(v2, true, false, false); pos1 = pos2 = 0; }
					else if (actionID2 == AudienceAction.BigAttack) { v1.dmg = 2; if (v1.building != BuildingActionID.Unset || v1.item != ItemId.Unset || v1.harvest ) hud1.actionFail = 1; v1.building = BuildingActionID.Unset; v1.item = ItemId.Unset; v1.harvest = false; RunAnim(v1, false, false, true); RunAnim(v2, true, false, false); pos1 = pos2 = 0; }
					else if (actionID2 == AudienceAction.Retaliate) {RunAnim(v1, false, false, false); RunAnim(v2, false, false, false); }}}
			if (v1.dmg != 0) { p1.onHurt(p1, p2, new TouchInfo { flags = 0, damage = v1.dmg, showDamage=false }); hud1.shake = v1.dmg; }
			if(v2.dmg != 0 ){p2.onHurt(p2, p1, new TouchInfo { flags = 0, damage = v2.dmg, showDamage = false }); hud2.shake = v2.dmg; }}
		else {
			if(v1.use) { if (v1.g.actionId == AudienceAction.Harvest) v1.harvest = true; v1.item = v1.g.itemId; v1.building = v1.g.buildingActionId; RunAnim(v1, false, false, false);}
			if(v2.use) { if (v2.g.actionId == AudienceAction.Harvest) v2.harvest = true; v2.item = v2.g.itemId; v2.building = v2.g.buildingActionId; RunAnim(v2, false, false, false);} }

		v1.DoAction(hud1, backgrounds);
		v2.DoAction(hud2, backgrounds);}

	static void ChangeAudienceFocus(HudShared src, PlayerHUD hud1, PlayerHUD hud2, APlayerInfo[,] grid) {
		// This is the logic for transitioning from one set of players to the next
		src.curGrid++;
		src.fadeIn = 1;
		if (src.curGrid >= src.info.usedSpots) src.info.atRemove = true;
		else {
			var g1 = grid[src.info.spotList[src.curGrid], src.info.rowList[src.curGrid]];
			var use1 = g1 != null && g1.pl.health > 0;
			hud1.ChangeFocus(g1);
			var g2 = grid[6 + src.info.spotList[src.curGrid], src.info.rowList[src.curGrid]];
			var use2 = g2 != null && g2.pl.health > 0;
			hud2.ChangeFocus(g2);

			if (!use1 && !use2) { src.curDelay = 0;  }
			else if (!use1) { src.curDelay = FullGame.ticksPerSecond * 2f; hud2.action.health = 30; src.actionDelay = FullGame.ticksPerSecond * 1; }
			else if (!use2) { src.curDelay = FullGame.ticksPerSecond *2f; hud1.action.health = 30; src.actionDelay = FullGame.ticksPerSecond * 1; }
			else { src.curDelay = FullGame.ticksPerSecond *4; hud1.action.health = 30; hud2.action.health = 60; src.actionDelay = FullGame.ticksPerSecond * 1.5f; }}}

	static void RunNormalFrame(HudShared src, PlayerHUD hud1, PlayerHUD hud2, APlayerInfo[,] grid, AudiencePhaseStatus aStatus) {
		// this is the logic for updating when the camera is steady on a set of players
		for (var j = 5; j > -1; j--) {
			for (var k = 2; k > -1; k--) {
				if ((grid[j, k] != null && grid[j, k].pl.health > 0)) { var ex = grid[j, k].pl; grid[j, k].bodyEnt.color = ex.color = new Color(ex.color.r, ex.color.g, ex.color.b, .2f); grid[j, k].headEnt.color = new Color(1, 1, 1, .2f); }
				if (grid[6 + j, k] != null && grid[6 + j, k].pl.health > 0) { var ex = grid[6+j, k].pl; grid[6+j, k].bodyEnt.color = ex.color = new Color(ex.color.r, ex.color.g, ex.color.b, .2f); grid[6 + j, k].headEnt.color=new Color(1,1,1, .2f); }}}

		var g1 = grid[src.info.spotList[src.curGrid], src.info.rowList[src.curGrid]];
		var g2 = grid[6+ src.info.spotList[src.curGrid], src.info.rowList[src.curGrid]];
		var use1 = g1 != null && g1.pl.health > 0;
		var use2 = g2 != null && g2.pl.health > 0;
		if (use2) { var ex = g2.pl; g2.bodyEnt.color = ex.color = new Color(ex.color.r, ex.color.g, ex.color.b, 1); g2.headEnt.color = new Color(1, 1, 1, 1); hud2.shake = hud2.shake * .9f; hud2.healthRat = hud2.healthRat * .9f + .1f * g2.pl.health / 10f; aStatus.cameraPos = src.audiencePos2 = g2.pl.pos + new v3(0, .5f, -.1f); src.info.showSet2 = true; } else src.info.showSet2 = false;
		if (use1) { var ex = g1.pl; g1.bodyEnt.color = ex.color = new Color(ex.color.r, ex.color.g, ex.color.b, 1); g1.headEnt.color = new Color(1, 1, 1, 1); hud1.shake = hud1.shake * .9f;  hud1.healthRat = hud1.healthRat * .9f + .1f * g1.pl.health / 10f; aStatus.cameraPos = aStatus.audiencePos = g1.pl.pos + new v3(0, .5f, -.1f); src.info.showSet1 = true; } else src.info.showSet1 = false;
		if( use1 && use2 ){ aStatus.cameraPos = (aStatus.audiencePos + src.audiencePos2) / 2; }}

	static void RunAudiencePhase( AudiencePhaseInfo infoSrc, AudiencePhaseStatus aStatus, APlayerInfo[,] grid, Backgrounds backgrounds, Transform theTransform) {
		var src = new HudShared( infoSrc, theTransform);

		var yadd = -7;

		new ent() { ignorePause = true, parentTrans = src.transform, scale = 10, pos = new v3(0, yadd + 2 + 1, 9), sprite = Art.UI.cutsceneBorder.spr, health=0, layer = Layers.UIBkg, color = new Color(1, 0, 0, .8f), ang=177+180,
			update = e2 => {
				if (!src.info.atRemove) { var v = e2.pos; nm.ease(ref v, new v3(0, yadd + 2 + 1, 10), .1f); e2.pos = v; }
				else { var v = e2.pos; nm.ease(ref v, new v3(0, -10, 10), .1f); e2.pos = v; }
				if (e2.pos.y < -9f) e2.remove(); }};
		new ent() { ignorePause = true, parentTrans = src.transform, scale = 10, pos = new v3(0, 6.5f, 9), sprite = Art.UI.cutsceneBorder.spr, health=0, layer = Layers.UIBkg, color = new Color(1, 0, 0, .8f), ang=177,
			update = e2 => {
				if (!src.info.atRemove) { var v = e2.pos; nm.ease(ref v, new v3(0, 6.5f, 10), .1f); e2.pos = v; }
				else { var v = e2.pos; nm.ease(ref v, new v3(0, 10, 10), .1f); e2.pos = v; }
				if (e2.pos.y > 9f) e2.remove(); }};

		var hud1 = new PlayerHUD( src, -1, 1);
		var hud2 = new PlayerHUD( src, 1, 2);
	
		new ent() {
			ignorePause = true, scale = 2f, pos = new v3(0, 3, 10), sprite = Art.UI.blueorb.spr, material= Art.Core.Glow_Material.mat, color = new Color(1, 1, 1, .5f), 
			update = e2 => {
				if (src.info.showSet2) src.push = 4-Math.Abs( e2.pos.x )*.75f;
				e2.color = (src.info.showSet2) ? new Color(1, 1, 1, .5f+.2f*Mathf.Cos(src.info.tick *.04f)) : new Color(1, 1, 1, 0);
				if (src.info.atRemove) e2.remove(); else { var v = e2.pos; nm.ease(ref v, src.audiencePos2, .3f); e2.pos = v;}} };
		
		new ent() {
			ignorePause = true, scale = 2f, pos = new v3(0, 3, 10), sprite = Art.UI.blueorb.spr, material = Art.Core.Glow_Material.mat, color = new Color(1, 1, 1, .5f),
			update = e2 => {
				if (src.info.showSet1) src.push = 4-Math.Abs(e2.pos.x) * .75f;
				src.curDelay--;
				src.fadeIn = src.fadeIn * .9f;
				src.actionDelay--;
				if (src.actionDelay == 0) RunActions( src, hud1, hud2, grid, src.curGrid, backgrounds );
				if (src.curDelay <= 0) ChangeAudienceFocus(src, hud1, hud2, grid);
				else RunNormalFrame(src, hud1, hud2, grid, aStatus);
				e2.color = (src.info.showSet1) ? new Color(1, 1, 1, .5f + .2f * Mathf.Cos(src.info.tick * .04f)) : new Color(1, 1, 1, 0);
				if (src.info.atRemove) e2.remove();
				else { var v = e2.pos; nm.ease(ref v, aStatus.audiencePos, .3f); e2.pos = v;}}};}

	public static void MakeRoundEnd(AudiencePhaseStatus aStatus, int roundNumber, APlayerInfo[,] grid, Action audienceActionsEnded, Transform theTransform, Backgrounds backgrounds ) {
		aStatus.doingEnd = true;
		RoundEndMessage( theTransform, roundNumber);
        //Leaderboard(theTransform, roundNumber);
        RoundStartMessage(theTransform, roundNumber);
		AudienceTurnMessage(theTransform, roundNumber);

		var info = new AudiencePhaseInfo();

		for (var j = 5; j > -1; j--) {
			for (var k = 2; k > -1; k--) {
				if ((grid[j, k] != null && grid[j, k].pl.health > 0 ) || ( grid[6+ j, k] != null && grid[6 + j, k].pl.health > 0 )) { info.usedSpots++; info.spotList.Add(j); info.rowList.Add(k); } }}

		new ent() { ignorePause = true,
			update = e => {
				info.tick++;
				if (info.tick == FullGame.ticksPerSecond * audienceActionsTime) RunAudiencePhase(info, aStatus, grid, backgrounds, theTransform);
				if (info.doingAction ==false) { aStatus.midpointTimer = 1; }
				else if (!info.atRemove) { aStatus.midpointTimer = .5f;}
				else {DoWindDown( aStatus, theTransform, roundNumber, grid, audienceActionsEnded );e.remove();}}};}}