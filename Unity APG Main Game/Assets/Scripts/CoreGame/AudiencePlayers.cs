using System; using UnityEngine; using System.Collections.Generic; using v3 = UnityEngine.Vector3; using APG;

public enum AnimStyle { Run = 0, Jump, Hurt, Die, GetSmall, GetBig, Victory, SmallAttack, BigAttack, Retaliate, Harvest, UseBuilding, UseItem, Idle }
public enum AudienceAction { SmallAttack = 0, BigAttack, Retaliate, Harvest, UseBuilding1, UseBuilding2, UseItem1, UseItem2, UseItem3 }
public enum BuildingID { BuildingUnset=-1, Building1, Building2, Building3, Building4, Building5, Building6 }
public enum LayerID { Unset = -1, Front, Middle, Back }
public enum BuildingActionID {Unset = -1, Building1, Building1Big, Building2, Building2Big, Building3, Building3Big, Building4, Building4Big, Building5, Building5Big, Building6, Building6Big }
public enum ItemId { Unset=-1, TennisBall, Bomb, Hammer, ScaryMask, Rocket, Shield }

public class BuddyFuncs {

	public Action<string> onJoin = playerName => { };
	public Func<Boolean> inUse = () => false;
	public Action onLeave = () => { };

	public Action<int[]> onInput = inputList => { };
	public Action onRoundEnd = () => { };

	public Func<int> getGoalBuilding = () => 0;
	public Action<int> setBuilding = x => { };
	public Action<LayerID> setGoalLayer = layer => { };

	public Action useUpSelectedItem = () => { };
	public Action useSelectedBuildingAction = () => { };
	public Action doHarvest = () => { };

	public Action doMove = () => { };
	public Action<ent> updateMove = e => { };
    public Action<AnimStyle,bool,bool> startAnim = (animStyle, successful, hurt) => { };

    public Action<APGSys> updateToClient = apg => { };}

public class APlayerInfo {
	public BuddyFuncs funcs;
	public ent headEnt;
    public ent bodyEnt;
    public ent label;
	public AudienceAction actionId;
	public BuildingActionID buildingActionId;
	public ItemId itemId;
	public LayerID goalLayer;
	public int curBuilding;
	public ent pl;
	public int headID;
	public int colorID;
	public int team;
	public int buildingGoal;}

class AudiencePlayerAnim{
    public static int Update(float team1Health, float team2Health, ref AnimStyle animStyle, bool animSuccessful, bool animHurt, float offset, float tick, int k, ref float animTime ){

        if ((team1Health < 1 && k < 10) || (team2Health < 1 && k >= 10)) { if (animStyle != AnimStyle.Die) { animStyle = AnimStyle.Die; animTime = tick; }  }
        if ((team1Health < 1 && k >= 10) || (team2Health < 1 && k < 10)) { if ( tick-animTime > 45 && rd.f(0,1)<.02f ) { animTime = tick;  } if (animStyle != AnimStyle.Victory) { animStyle = AnimStyle.Victory; animTime = tick; } }

        //e.sprite = players.anims[animBase + (((tick % 60) > 30 ) ? 0:1)];
        var animBase = 14;
        var animFr = animBase + ((((tick + (int)offset) % 60) > 30) ? 0 : 1);
        var animAdjustTime = tick - animTime;

        if (animStyle == AnimStyle.Run)animFr = 14 + ((((tick + (int)offset) % 16) > 8) ? 0 : 1);
        if (animStyle == AnimStyle.Idle)animFr = 6 + ((((tick + (int)offset) % 120) > 60) ? 0 : 1);
        if( animStyle == AnimStyle.Die){
            animFr = 12 + ((((tick + (int)offset) % 60) < 30) ? 0 : 1);}
        if( animStyle == AnimStyle.Hurt){
            if (animAdjustTime < 30) animFr = 10;
            else animFr = 11;
            if(animAdjustTime > 30){ animStyle = AnimStyle.Idle;}}
        if( animStyle == AnimStyle.Victory){
            if (animAdjustTime < 10) animFr = 8;
            else animFr = 9;}
        if( animStyle == AnimStyle.GetSmall){
            if (animAdjustTime < 10) animFr = 8;
            else animFr = 9;
            if(animAdjustTime > 30){ animStyle = AnimStyle.Idle;}}
        if( animStyle == AnimStyle.GetBig){
            if (animAdjustTime < 10) animFr = 8;
            else animFr = 9;
            if(animAdjustTime > 30){ animStyle = AnimStyle.Idle;}}
        if( animStyle == AnimStyle.SmallAttack){
            if (animAdjustTime < 45) animFr = 18;
            else if (animSuccessful) animFr = 17;
            else if (animHurt) animFr = 10;
            else animFr = 16;
            if(animAdjustTime > 60){ animStyle = AnimStyle.Idle;}}
        if( animStyle == AnimStyle.BigAttack){
            if (animAdjustTime < 45) animFr = 16;
            else if (animSuccessful) animFr = 17;
            else if (animHurt) animFr = 10;
            else animFr = 16;
            if(animAdjustTime > 60){ animStyle = AnimStyle.Idle;}}
        if( animStyle == AnimStyle.Retaliate){
            if (animAdjustTime < 45) animFr = 22;
            else if (animSuccessful) animFr = 23;
            else if (animHurt) animFr = 10;
            else animFr = 22;
            if(animAdjustTime > 60){ animStyle = AnimStyle.Idle;}}
        if( animStyle == AnimStyle.Harvest){
            if (animAdjustTime < 30) animFr = 4;
            else if (animSuccessful) animFr = 5;
            else if (animHurt) animFr = 10;
            else animFr = 4;
            if(animAdjustTime > 60){ animStyle = AnimStyle.Idle;}}
        if( animStyle == AnimStyle.UseItem){
            if (animAdjustTime < 30) animFr = 20;
            else if (animSuccessful) animFr = 21;
            else if (animHurt) animFr = 10;
            else animFr = 20;
            if(animAdjustTime > 60){ animStyle = AnimStyle.Idle;}}
        if( animStyle == AnimStyle.UseBuilding){
            if (animAdjustTime < 30) animFr = 6;
            else if (animSuccessful) animFr = 7;
            else if (animHurt) animFr = 10;
            else animFr = 6;
            if(animAdjustTime > 60){ animStyle = AnimStyle.Idle;}}

        //animFr = 0 + ((((tick + (int)offset) % 60) < 40) ? 0 : 1); // hammer
        //animFr = 2 + ((((tick + (int)offset) % 60) < 30) ? 0 : 1); // defend
        //animFr = 4 + ((((tick + (int)offset) % 60) < 50) ? 0 : 1); // dig
        //animFr = 6 + ((((tick + (int)offset) % 60) < 30) ? 0 : 1); // hold hands
        //animFr = 8 + ((((tick + (int)offset) % 60) < 10) ? 0 : 1); // jump
        //animFr = 10 + ((((tick + (int)offset) % 60) < 30) ? 0 : 1); // hurt
        //animFr = 12 + ((((tick + (int)offset) % 60) < 30) ? 0 : 1); // dead
        //animFr = 14 + ((((tick + (int)offset) % 16) > 8) ? 0 : 1); // run
        //animFr = 16 + ((((tick + (int)offset) % 60) < 45) ? 0 : 1); // bigslash
        //animFr = 18 + ((((tick + (int)offset) % 60) < 45) ? 0 : 1); // smallslash
        //animFr = 20 + ((((tick + (int)offset) % 60) < 30) ? 0 : 1); // use item
        //animFr = 22 + ((((tick + (int)offset) % 60) < 40) ? 0 : 1); // retaliate

        return animFr;}}

class AudienceActions{
	public static void DoHarvest( int curBuilding, int[] resources, ItemId[] items, ent pl, Sprite[] resourcePics, Sprite[] treatPics ) {
		var harvestResources = new Resource[,] { { Resource.TBone, Resource.Corn }, { Resource.Acid, Resource.Goo }, { Resource.Corn, Resource.Beans }, { Resource.FrothyDrink, Resource.Burger }, { Resource.FrothyDrink, Resource.Bribe }, { Resource.Fries, Resource.Taco } };
		var harvestItems = new ItemId[] { ItemId.Hammer, ItemId.ScaryMask, ItemId.Bomb, ItemId.TennisBall, ItemId.Rocket, ItemId.Shield };

		var rat = rd.f(0, 1);
		if (rat < .45f) {
			resources[(int)harvestResources[curBuilding % 6, 0]]++;
			new ent() {
				sprite = resourcePics[(int)harvestResources[curBuilding % 6, 0]], pos = new v3( pl.pos.x, -3f+pl.pos.y, rd.f(.5f)), scale = .4f, name="harvestResource", health=60, ignorePause=true, layer=Layers.UI,
				update = e => {
					e.health--;
					e.scale *= 1.01f;
					e.pos = e.pos + new v3(0, .002f, 0);
					e.color = new Color(1, 1, 1, e.health / 120f);
					if (e.health < 0) { e.remove(); return;} } };}
		else if (rat < .9f) {
			resources[(int)harvestResources[curBuilding % 6, 1]]++;
			new ent() {
				sprite = resourcePics[(int)harvestResources[curBuilding % 6, 1]], pos = new v3( pl.pos.x, -3f+pl.pos.y, rd.f(.5f)), scale = .4f, name= "harvestResource", health=60, ignorePause=true, layer=Layers.UI,
				update = e => {
					e.health--;
					e.scale *= 1.01f;
					e.pos = e.pos + new v3(0, .002f, 0);
					e.color = new Color(1, 1, 1, e.health / 120f);
					if (e.health < 0) { e.remove(); return;} } };}
		else {
			var show = true;
			if (items[0] == ItemId.Unset) { items[0] = harvestItems[curBuilding % 6]; }
			else if (items[1] == ItemId.Unset) { items[1] = harvestItems[curBuilding % 6]; }
			else if (items[2] == ItemId.Unset) { items[2] = harvestItems[curBuilding % 6]; }
			else { show = false;  }
			if( show) {
				new ent() {
					sprite = treatPics[(int)harvestItems[curBuilding % 6]], pos = new v3( pl.pos.x, -3f+pl.pos.y, rd.f(.5f)), scale = .4f, name= "harvestItem", health=60, ignorePause=true, layer=Layers.UI,
					update = e => {
						e.health--;
						e.scale *= 1.01f;
						e.pos = e.pos + new v3(0, .002f, 0);
						e.color = new Color(1, 1, 1, e.health / 120f);
						if (e.health < 0) { e.remove(); return;} } };}}}}

class AudienceExtra{
	public static void Ghost( Sprite angel1, Sprite angel2, v3 pos, ent leader, int team ) {
		float stopDist = rd.f(-4, -2), fadeOffset = rd.Ang(), tick = 0;
		var goalOffset = rd.Vec(-2, 2); 
		new ent() {
			sprite = ( team == 2 ? angel2 : angel1 ), pos = pos, scale = .35f, leader=leader,
			update = e => {
				tick++;
				e.color = nm.col(1, .5f + .5f * Mathf.Cos(tick * .02f + fadeOffset));
				var goal = e.leader.pos - e.pos + goalOffset;
				var spd = Mathf.Max( (goal.magnitude - stopDist)*.003f, 0 );
				if(spd > 0) e.MoveBy(goal.normalized * spd);}};}}

public class PlayGrid{
    APlayerInfo[,] playerGrid = null;
    public APlayerInfo[,] oldPlayerGrid = new APlayerInfo[12, 3];
    public List<APlayerInfo> buddies = new List<APlayerInfo>();

    public void InitGrid() {
		playerGrid = new APlayerInfo[12, 3];
		for (var k = 0; k < buddies.Count; k++) {
			int building = buddies[k].funcs.getGoalBuilding();
			LayerID layer = buddies[k].goalLayer;
			playerGrid[building, (int)layer] = buddies[k];}
		oldPlayerGrid = playerGrid;}

	public void SetGoalPositions() {
		oldPlayerGrid = playerGrid;
		playerGrid = new APlayerInfo[12, 3];
		for (var k = 0; k < 12; k++) {for (var j = 0; j < 3; j++) {playerGrid[k, j] = null;}}
		var offset = rd.i(0, 1000);
		var blocked = new List<APlayerInfo>();
		for (var k2 = 0; k2 < buddies.Count; k2++) {
			var k = (k2 + offset) % buddies.Count;
			if (buddies[k].pl.health <= 0) continue;
			int building = buddies[k].funcs.getGoalBuilding();
			LayerID layer = buddies[k].goalLayer;
			if (playerGrid[building, (int)layer] == null) playerGrid[building, (int)layer] = buddies[k];
			else {blocked.Add(buddies[k]);}}
		var reallyBlocked = new List<APlayerInfo>();
		for( var k = 0; k < blocked.Count; k++) {
			int building = blocked[k].funcs.getGoalBuilding();
			LayerID layer = blocked[k].goalLayer;
			var building2 = (building) % 6;
            var layerNum = (int)layer;
			if (layer > 0 && playerGrid[building, layerNum - 1] == null) playerGrid[building, layerNum - 1] = blocked[k];
			else if (layer < LayerID.Back && playerGrid[building, layerNum + 1] == null) playerGrid[building, layerNum + 1] = blocked[k];
			else if (building2 > 0 && playerGrid[building - 1, layerNum] == null) playerGrid[building - 1, layerNum] = blocked[k];
			else if (building2 < 5 && playerGrid[building + 1, layerNum] == null) playerGrid[building + 1, layerNum] = blocked[k];
			else if (building2 > 0 && layer > LayerID.Front && playerGrid[building - 1, layerNum - 1] == null) playerGrid[building - 1, layerNum - 1] = blocked[k];
			else if (building2 < 5 && layer > LayerID.Front && playerGrid[building + 1, layerNum - 1] == null) playerGrid[building + 1, layerNum - 1] = blocked[k];
			else if (building2 > 0 && layer < LayerID.Back && playerGrid[building - 1, layerNum + 1] == null) playerGrid[building - 1, layerNum + 1] = blocked[k];
			else if (building2 < 5 && layer < LayerID.Back && playerGrid[building + 1, layerNum + 1] == null) playerGrid[building + 1, layerNum + 1] = blocked[k];
			else {reallyBlocked.Add(blocked[k]);}}
		if (reallyBlocked.Count > 0) {
			for( var k = 0; k < reallyBlocked.Count; k++) {
				int baseVal = blocked[k].funcs.getGoalBuilding() < 6 ? 0:6;
				bool found = false;
				for( var l = 0; l < 3 && !found; l++ )for( var j = 0; j < 6 && !found; j++ )if(playerGrid[j + baseVal, l] == null) {found = true;playerGrid[j + baseVal, l] = reallyBlocked[k];}}}
		for( var k = 0; k < 12; k++ )for( var l = 0; l < 3; l++)if( playerGrid[k,l] != null) {playerGrid[k, l].funcs.setBuilding(k);playerGrid[k, l].funcs.setGoalLayer((LayerID)l);}}}



















public class AudiencePlayerSys {
    [Serializable]
    struct PlayerUpdate { public string nm; public int[] st; public int[] rs; }

    public static Color[] nameColors = new Color[] { new Color(.2f, .4f, .6f, 1f), new Color(.4f, .6f, .2f, 1f), new Color(.6f, .2f, .4f, 1f), new Color(.6f, .4f, .2f, 1f), new Color(.4f, .2f, .6f, 1f), new Color(.2f, .6f, .4f, 1f), new Color(.533f, .533f, .533f, 1f), new Color(.6f, .2f, .2f, 1f), new Color(.2f, .6f, .2f, 1f), new Color(.2f, .2f, .6f, 1f) };

    GameSys gameSys;
	Players players;
	public float soundTick = 0; public float lastSoundTime = 0;

	// How is this currently handled?
	// And how do I want to ultimatley handle it?
	// Players should be able to comandeer NPCs.
	// Real players should get priority over NPCs for movement
	// first connection is busted...
	// need a way for players to choose which team to join, and which character to be.

    public PlayGrid playGrid = new PlayGrid();

	void RegisterHandler(APlayerInfo buddy) { playGrid.buddies.Add(buddy); }
	public void RoundUpdate() { for( var k = 0; k < playGrid.buddies.Count; k++ ) { playGrid.buddies[k].funcs.onRoundEnd(); }}
	public void UpdatePlayersToClients( APGSys apg ) {for( var k = 0; k < playGrid.buddies.Count; k++ ) { playGrid.buddies[k].funcs.updateToClient( apg );}}
	public APlayerInfo[,] GetPlayerGrid() { return playGrid.oldPlayerGrid; }

	public void Setup(GameSys theGameSys, Players thePlayers, FoeSys foeSys, PlayerSys playerSys, APGSys apg, TreatSys treats) {
		gameSys = theGameSys;
		players = thePlayers;
		Buddies(playerSys, treats );
		playGrid.InitGrid();}

	void React(v3 pos, Sprite msg) {var delay = 30;new ent() { sprite = msg, name="react", pos = pos, scale = 1, update = e => { delay--; if(delay <= 0) e.remove(); } };}

	void Buddies(PlayerSys playerSys, TreatSys treats) {
		var bsrc = new ent() { name="buddySet" };
		var firstAbilityCosts = new Resource[,] { { Resource.Goo, Resource.Beans }, { Resource.Goo, Resource.Corn }, { Resource.Goo, Resource.Fries }, { Resource.FrothyDrink, Resource.Beans }, { Resource.Bribe, Resource.Burger }, { Resource.FrothyDrink, Resource.TBone } };
		var secondAbilityCosts = new Resource[,] { { Resource.Bribe, Resource.Burger, Resource.Fries }, { Resource.Acid, Resource.Beans, Resource.TBone}, { Resource.Acid, Resource.Burger, Resource.Taco }, { Resource.Bribe, Resource.Corn, Resource.TBone }, 
			{ Resource.FrothyDrink, Resource.Fries, Resource.Taco }, { Resource.Acid, Resource.Corn, Resource.Taco } };
		var maxHealth = 10;
		for ( var k2 = 0; k2 < 20; k2++ ) {
			var info = new APlayerInfo();
			var k = Mathf.Floor( k2 / 2 ) + (k2%2 == 1 ? 10:0);
			bool inUse = false;
			var nameColor = nameColors[(int)k % 10];
			info.label = new ent(players.textName) { pos = new v3(0, 0, 0), text="", textColor=nameColor };
			var healthBar = new ent() { sprite = players.healthBarCenter, pos = new v3(0, 0, 0), scale=.1f, color=new Color(.33f,0,0, .5f) };
			var labelBack = new ent( players.textName) { pos = new v3(0, 0, 0), text="", textColor=new Color(0,0,0,1), children = new List<ent> { info.label, healthBar }};
			info.headEnt = new ent() { pos = new v3(0, 0, 0), sprite = players.heads[(int)k], color = new Color(1, 1, 1, 1) };
            info.bodyEnt = new ent() { pos = new v3(0, 0, 0), scale = .505f, sprite = players.anims[14], color = nameColors[(int)k % 10] };
            var parms = new int[] { 0, 0, 0, 0, 0, 0, 0 };
			var bufferedParms = new int[] { 0, 0, 0, 0, 0, 0, 0 };
			var goalx = (k < 10) ? -9.5f + 8.5f * ((k % 6) / 6f) : 9.5f - 8.5f * (((k - 10) % 6) / 6f);
			var goalz = (k<6 || (k>9&&k<16))?-.4f:.4f;
			info.team = (k < 10 ) ? 1:2;
			info.pl = null;
			info.buildingGoal = (int)((k < 10) ? (k % 6) : (k - 10) % 6);
			var delayGoalX = 0f; var delayGoalZ = 0f;
			info.goalLayer = (k < 6 || (k > 9 && k < 16)) ? LayerID.Front : LayerID.Back;
			info.actionId = AudienceAction.SmallAttack;
            //var resources = new int[] { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 }; 
            //var items = new ItemId[] { ItemId.Unset, ItemId.Unset, ItemId.Unset };
            var resources = new int[] { 10, 10, 10, 10, 10, 10, 10, 10, 10, 10 };
            var items = new ItemId[] { (ItemId)rd.i(0,6), (ItemId)rd.i(0, 6), (ItemId)rd.i(0, 6) };
			var nameFlash = 0f; var nameFlashColor = new Color(0, 0, 0, 0);
			var buddyID = k; var tick = 0; var spd = 0f; var healthRatio = 1f; var goalHealthRatio = 1f; var offset = rd.f(0,10000f);
			info.itemId = ItemId.Unset;
			info.buildingActionId = BuildingActionID.Unset;
			info.curBuilding = info.buildingGoal;
			info.headID = (int)k;
			info.colorID = (int)k % 10;
			LayerID curLayer = info.goalLayer;
            //var names = new List<string> { "Tanya", "Eric", "FireLord", "Captain Silly", "xxxWinningxxx", "Mr. Eddy", "Sally", "Diamond", "Salty", "Trickster", "Keen Eye", "Dwayne", "Liu", "Felipe", "Spencer", "Tally", "Robo1337", "Minnie","Aoda", "Champion" };
            //var playerName = names[(int)k];
            var playerName = "npc" + k;
			var inactiveName = playerName;
			var dodging = false;

            var headOffset = new v3(0, 0, 0);
            var bodyOffset = new v3(0, 0, 0);
            var headAng = 0f;

            var animStyle = AnimStyle.Idle;
            var animTime = 0f;
            var animSuccessful = true;
            var animHurt = false;

			info.funcs = new BuddyFuncs {
				onJoin = name => {
					playerName = name;
					info.label.text = name;
					labelBack.text = name;
					healthBar.pos = new v3(-.5f, -3.5f, -.1f);
					inUse = true; },
				inUse = () => inUse,
				onLeave = () => {
					inUse = false;
					playerName = inactiveName;
					info.label.text = inactiveName;
					labelBack.text = inactiveName; },

				getGoalBuilding = () => info.buildingGoal + (info.team == 2 ? 6 : 0),

				useUpSelectedItem = () => {
					if (info.actionId == AudienceAction.UseItem3) { items[2] = ItemId.Unset; }
					if (info.actionId == AudienceAction.UseItem2) { items[1] = items[2]; items[2] = ItemId.Unset; }
					if (info.actionId == AudienceAction.UseItem1) { items[0] = items[1]; items[1] = items[2]; items[2] = ItemId.Unset; }},
				useSelectedBuildingAction = () => {
					var id = info.curBuilding % 6;
					if (info.actionId == AudienceAction.UseBuilding1) {
						resources[(int)firstAbilityCosts[id, 0]]--;
						resources[(int)firstAbilityCosts[id, 1]]--;}
					if (info.actionId == AudienceAction.UseBuilding2) {
						resources[(int)secondAbilityCosts[id, 0]]--;
						resources[(int)secondAbilityCosts[id, 1]]--;
						resources[(int)secondAbilityCosts[id, 2]]--;}},
				doHarvest = () => AudienceActions.DoHarvest(info.curBuilding, resources, items, info.pl, treats.theTreats.resources, treats.theTreats.items),
				onInput = inputs => { bufferedParms = inputs; },
				setBuilding = building => { info.buildingGoal = building; delayGoalX = (-9.5f + 8.5f * ((building % 6) / 6f)) * ((building < 6) ? 1 : -1); },
				setGoalLayer = layer => { info.goalLayer = layer;  delayGoalZ = -.4f + .4f * (int)layer; },
				doMove = () => { goalx = delayGoalX; goalz = delayGoalZ; info.curBuilding = info.buildingGoal; curLayer = info.goalLayer; },
				updateMove = e => {
                    var moving = true;
					var dir = new v3(goalx, -5f, goalz) - e.pos;
					if (dir.magnitude > .2f) { info.bodyEnt.flipped=e.flipped = (dir.x < 0) ? true : false; }
					if (dir.magnitude > .4f) {
                        if(animStyle != AnimStyle.Run){ animTime = tick; animStyle = AnimStyle.Run; }
                        nm.ease(ref spd, .017f * 3, .07f); }
					else if (dir.magnitude < .3f) {
                        if (animStyle != AnimStyle.Idle) { animTime = tick; animStyle = AnimStyle.Idle; }
                        nm.ease(ref spd, 0, .05f); info.bodyEnt.flipped = e.flipped = info.team == 1 ? false : true;
                        moving = false;}
					e.MoveBy(dir.normalized * spd);
					labelBack.pos = new v3(labelBack.pos.x, -1f + (-.4f + e.pos.z) * 1f, labelBack.pos.z);
					if (dir.magnitude > .1f) { e.ang = spd * Mathf.Cos(tick * .1f); }},
                startAnim = (style, successful,hurt) => { animStyle = style; animTime = tick; animSuccessful = successful; animHurt = hurt;},
				onRoundEnd = () => {
					var id = info.curBuilding % 6;
					//if( !inUse) { bufferedParms = new int[] { rd.i(0, 6), rd.i(0, 3), rd.f(0, 1) < .7f ? rd.i(0, 4) : rd.i(0, 9), rd.i(0, 7), rd.i(0, 6), 1 }; }
					if (!inUse) { bufferedParms = new int[] { rd.i(0, 6), rd.i(0, 3), rd.f(0, 1) < .4f ? rd.i(0, 4) : rd.i(0, 9), rd.i(0, 7), rd.i(0, 6), 1 }; }
					parms = bufferedParms;
					parms[0] = nm.Between(0, parms[0], 5);
					parms[1] = nm.Between(0, parms[1], 2);
					parms[2] = nm.Between(0, parms[2], 8);
					info.buildingGoal =  parms[0];
					info.goalLayer = (LayerID)parms[1];
					info.actionId = (AudienceAction)parms[2];
                    info.itemId = ItemId.Unset;
                    info.buildingActionId = BuildingActionID.Unset;
					if (info.actionId == AudienceAction.Harvest) dodging = true; else dodging = false;
					if (info.actionId == AudienceAction.UseBuilding1) { if (resources[(int)firstAbilityCosts[id, 0]] < 1 || resources[(int)firstAbilityCosts[id, 1]] < 1) { info.actionId = 0; } else info.buildingActionId = (BuildingActionID)(id*2);  }
					if (info.actionId == AudienceAction.UseBuilding2) { if (resources[(int)secondAbilityCosts[id, 0]] < 1 || resources[(int)secondAbilityCosts[id, 1]] < 1 || resources[(int)secondAbilityCosts[id, 2]] < 1) { info.actionId = 0; } else info.buildingActionId = (BuildingActionID)(id * 2 + 1); }
					if (info.actionId == AudienceAction.UseItem1) { if (items[0] == ItemId.Unset) info.actionId = AudienceAction.SmallAttack; else info.itemId = items[0]; }
					if (info.actionId == AudienceAction.UseItem2) { if (items[1] == ItemId.Unset) info.actionId = AudienceAction.SmallAttack; else info.itemId = items[1]; }
					if (info.actionId == AudienceAction.UseItem3) { if (items[2] == ItemId.Unset) info.actionId = AudienceAction.SmallAttack; else info.itemId = items[2]; }},
				updateToClient = apg => { apg.WriteToClients("pl", new PlayerUpdate { nm = playerName, st=new int[] { info.pl.health, (int)(k%10), info.buildingGoal, (int)info.goalLayer, (int)items[0], (int)items[1], (int)items[2] }, rs= resources });}};

			RegisterHandler(info);

            var animBase = rd.i(0, 12) * 2;
            var animx = new float[] {   0, .2f, 0.05f, -.1f,           0, .2f, .05f, .2f,                   .1f, .1f, -.2f, -.2f,                 .1f, .1f, .1f, .1f,            -.2f, .3f, 0, .2f,                       .05f, .2f, 0.05f, .3f};
            var animy = new float[] {   1.1f, 1.1f, 1.2f, 1.2f,       1.2f, 1f, 1.15f, 1.1f,            1.6f, 1.6f, 1.15f, 1.15f,         .8f, .8f, 1.2f, 1.4f,         1.2f, 1.25f, 1.15f, 1.1f,             1.15f, 1.1f, 1.15f, 1.25f };
            var bodyx = new float[] {   0, 0, 0, 0,                       0, 0, 0, 0,                         0, 0, -.8f, 0,                           0, 0, 0, 0,                   -.5f, 1, -.5f, .5f,                      0, 0, 0, 1 };
            var bodyy = new float[] {   0, .2f, 0, 0,                      0, 0, 0, 0,                         2, 0, 0, 0,                           0, 0, 0, 1,                     1, 0, .5f, 0,                             0, 0, 0, 0 };
            var interp = new float[] {   .1f, .3f, .1f, .1f,               .05f, .4f, .1f, .1f,                .4f, .1f, .5f, .1f,                   .1f, .1f, .1f, .3f,             .05f, .4f, .05f, .3f,                   .05f, .05f, .05f, .4f };
            var ang = new float[] {      0, -10, -5, 7,                  5, -15, 5, -5,                      15, -15, -40, 10,                  -20, -20, 0, -5,             20, -25, 10, -10,                       5, -5, -10, -10 };

			info.pl = new ent() {
				pos = new v3(goalx, -5, goalz), scale = .505f, health = maxHealth, children = new List<ent> { labelBack, info.bodyEnt, info.headEnt }, flipped=(k<10) ? false : true, leader= (k < 10) ? playerSys.playerEnt : ( playerSys.player2Ent != null ) ? playerSys.player2Ent:playerSys.playerEnt, team=(k<10)?Team.Player1:Team.Player2,
					name = "buddy"+k, inGrid=true, parent = bsrc, shadow=gameSys.Shadow(players.shadow, null, 1, .4f, 0 ), color= nameColors[(int)k % 10], ignorePause=true,
				onHurt = (e, src, dmg) => {
					if ((dmg.flags & ((int)TouchFlag.IsAirbourne)) != 0 && dodging && rd.Test(.5f)) return;
					e.health-=dmg.damage;
					goalHealthRatio = (e.health / (float)maxHealth);
					if (e.health > 0) {
						if (dmg.showDamage) {
                            info.funcs.startAnim(AnimStyle.Hurt, true, false);
							if (soundTick - lastSoundTime > 10) { gameSys.Sound(players.hurtSound, 1); lastSoundTime = soundTick; }
							React(e.pos + new v3(0, 0, -.2f), players.owMsg);
							nameFlash = 1f;
							nameFlashColor = new Color(1, 0, 0, 1);}}
					else {
                        info.funcs.startAnim(AnimStyle.Die, true, false);
                        gameSys.Sound(players.dieSound, 1);
						info.label.text = "";
						labelBack.text = "";
						healthBar.active = false;
                        AudienceExtra.Ghost(players.angel1, players.angel2, e.pos, e.leader, info.team);
						React(e.pos + new v3(0, 0, -.2f), players.ughMsg);
						info.bodyEnt.color = new Color(1, 0, 0, .2f);
						info.headEnt.color = new Color(1, 0, 0, .2f);}},
				itemTouch = (e, user, infox) => {
                    var gotten = false;
                    if (infox.isItem == false) { resources[infox.style] += infox.count; info.funcs.startAnim(AnimStyle.GetSmall, true, false); gotten = true; }
					else {
						if (items[0] == ItemId.Unset) {items[0] = (ItemId)infox.style; gotten = true; }
						else if (items[1] == ItemId.Unset) {items[1] = (ItemId)infox.style; gotten = true; }
						else if (items[2] == ItemId.Unset) {items[2] = (ItemId)infox.style; gotten = true; }
                        if( gotten ) info.funcs.startAnim(AnimStyle.GetBig, true, false);}
                    if (gotten){ nameFlash = 1f; nameFlashColor = new Color(1, .9f, .8f, 1);}},
				update = e => {
					if(e.health <= 0) return;
                    var animFr = AudiencePlayerAnim.Update(playerSys.team1Health, playerSys.team2Health, ref animStyle, animSuccessful, animHurt, offset, tick, (int)k, ref animTime);
                    info.bodyEnt.sprite = players.anims[animFr];
                    var t = interp[animFr];
                    headOffset = headOffset * (1-t) + t * new v3(animx[animFr] * (info.headEnt.flipped ? -1:1), animy[animFr], -.001f);
                    bodyOffset = bodyOffset * (1 - t) + t * new v3(bodyx[animFr] * (info.headEnt.flipped ? -1 : 1), bodyy[animFr], 0);
                    info.headEnt.pos = headOffset+ bodyOffset;
                    info.bodyEnt.pos = bodyOffset;
                    headAng = headAng * (1 - t) + t * ang[animFr] * (info.headEnt.flipped ? -1 : 1);
                    info.headEnt.ang3 = new v3( 3*Mathf.Cos((tick + offset) * .0203f+121)+ 2 * Mathf.Cos((tick + offset) * .017f+231),
                        3.2f * Mathf.Cos((tick+offset) * .013f + 721) + 2.1f * Mathf.Cos((tick + offset) * .007f + 331),
                        2.8f * Mathf.Cos((tick + offset) * .023f + 521) + 2.5f * Mathf.Cos((tick + offset) * .009f + 431)+headAng );

                    if ( healthRatio <= .25f) {
						if( tick % 30 == 0) {healthBar.color = new Color(1, 0, 0, 1);}
						if (tick % 30 == 5) {healthBar.color = new Color(.33f, 0, 0, .5f);}}
					if (healthRatio <= .5f) {
						if (tick % 120 == 0) {healthBar.color = new Color(1, 0, 0, 1);}
						if (tick % 120 == 5) {healthBar.color = new Color(.33f, 0, 0, .5f);}}
					if ( Math.Abs( healthRatio - goalHealthRatio ) > .01f) { healthRatio = healthRatio * .93f + .07f * goalHealthRatio; healthBar.scale3 = new v3(1.75f * healthRatio, 1.75f, .07f);}
					if( nameFlash > 0.01f) {
						nameFlash *= .99f;
						info.label.textColor = new Color( nameFlashColor.r * nameFlash + (1-nameFlash) * nameColor.r, nameFlashColor.g * nameFlash + (1 - nameFlash) * nameColor.g, nameFlashColor.b * nameFlash + (1 - nameFlash) * nameColor.b, 1 );
						info.label.scale = 1 + nameFlash*.25f;}
					if( parms == null || parms.Length < 4 )return;
					tick++;
					var doTouch = true;
					var g = GetPlayerGrid();

					if (curLayer == LayerID.Back || curLayer == LayerID.Middle) { if (g[info.curBuilding, 0] != null && g[info.curBuilding, 0].pl.health > 0) doTouch = false; }
					if (curLayer == LayerID.Back) { if (g[info.curBuilding, 1] != null && g[info.curBuilding, 1].pl.health > 0) doTouch = false; }
					if(doTouch)gameSys.grid.Find(e.pos - new v3(0, .7f, 0), 1.75f, e, (me, targ) => { targ.buddyTouch(targ, me, new TouchInfo { flags=0, strength = 1 }); });

					var dir = new v3(goalx, -5f, goalz) - e.pos;
					if (dir.magnitude > .2f) { info.bodyEnt.flipped = e.flipped = (dir.x < 0) ? true : false; }
					if(dir.magnitude > .4f) { nm.ease( ref spd, .017f * 3, .07f ); }
					else if(dir.magnitude < .3f) { nm.ease( ref spd, 0, .05f ); info.bodyEnt.flipped = e.flipped = info.team ==1 ? false : true; }
					e.MoveBy(dir.normalized * spd );
					labelBack.pos = new v3(labelBack.pos.x, -1f + (-.4f + e.pos.z) * 1f, labelBack.pos.z);
					if (dir.magnitude > .1f) { e.ang = spd * Mathf.Cos( tick * .1f ); }} };

			labelBack.pos = new v3(0,-1.4f, -.2f );
			labelBack.scale *= 1.1f;
			labelBack.text = playerName;

			info.label.pos = new v3(-.5f,.5f,-.1f);
			info.label.text = playerName;

			healthBar.pos = new v3(-.5f, 15f, -.1f);
			healthBar.pos = new v3(-.5f, -3.5f, -.1f);

			info.headEnt.pos = new v3(0f, 1.1f, -.001f);
			info.headEnt.scale = .5f/.3f;
			if (k > 10) info.headEnt.flipped = true;
            if (k > 10) info.bodyEnt.flipped = true;

        } }}