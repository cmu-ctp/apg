using System; using UnityEngine; using System.Collections.Generic; using v3 = UnityEngine.Vector3; using APG;

public class AudiencePlayerSys {
	GameSys gameSys;
	Players players;
	public float soundTick = 0; public float lastSoundTime = 0;

	// How is this currently handled?
	// And how do I want to ultimatley handle it?
	// Players should be able to comandeer NPCs.
	// Real players should get priority over NPCs for movement
	// first connection is busted...

	// need a way for players to choose which team to join, and which character to be.

	public List<BuddyFuncs> buddyFuncs = new List<BuddyFuncs>();
		BuddyFuncs[,] playerGrid = null;
		BuddyFuncs[,] oldPlayerGrid = new BuddyFuncs[12, 3];

		void RegisterHandler(BuddyFuncs funcs) { buddyFuncs.Add(funcs); }
		public void RoundUpdate() { for( var k = 0; k < buddyFuncs.Count; k++ ) { buddyFuncs[k].onRoundEnd(); }}
		public void UpdatePlayersToClients( APGSys apg ) {for( var k = 0; k < buddyFuncs.Count; k++ ) {buddyFuncs[k].updateToClient( apg );}}
		public BuddyFuncs[,] GetPlayerGrid() { return oldPlayerGrid; }
		void InitGrid() {
			playerGrid = new BuddyFuncs[12, 3];
			for (var k = 0; k < buddyFuncs.Count; k++) {
				int building = buddyFuncs[k].getGoalBuilding();
				int layer = buddyFuncs[k].getLayer();
				playerGrid[building, layer] = buddyFuncs[k];}
			oldPlayerGrid = playerGrid;}
		public void SetGoalPositions() {
			oldPlayerGrid = playerGrid;
			playerGrid = new BuddyFuncs[12, 3];
			for (var k = 0; k < 12; k++) {for (var j = 0; j < 3; j++) {playerGrid[k, j] = null;}}
			var offset = rd.i(0, 1000);
			var blocked = new List<BuddyFuncs>();
			for (var k2 = 0; k2 < buddyFuncs.Count; k2++) {
				var k = (k2 + offset) % buddyFuncs.Count;
				if (buddyFuncs[k].getHealth() <= 0) continue;
				int building = buddyFuncs[k].getGoalBuilding();
				int layer = buddyFuncs[k].getLayer();
				if (playerGrid[building, layer] == null) playerGrid[building, layer] = buddyFuncs[k];
				else {blocked.Add(buddyFuncs[k]);}}
			var reallyBlocked = new List<BuddyFuncs>();
			for( var k = 0; k < blocked.Count; k++) {
				int building = blocked[k].getGoalBuilding();
				int layer = blocked[k].getLayer();
				var building2 = (building) % 6;
				if (layer > 0 && playerGrid[building, layer - 1] == null) playerGrid[building, layer - 1] = blocked[k];
				else if (layer < 2 && playerGrid[building, layer + 1] == null) playerGrid[building, layer + 1] = blocked[k];
				else if (building2 > 0 && playerGrid[building - 1, layer] == null) playerGrid[building - 1, layer] = blocked[k];
				else if (building2 < 5 && playerGrid[building + 1, layer] == null) playerGrid[building + 1, layer] = blocked[k];
				else if (building2 > 0 && layer > 0 && playerGrid[building - 1, layer - 1] == null) playerGrid[building - 1, layer - 1] = blocked[k];
				else if (building2 < 5 && layer > 0 && playerGrid[building + 1, layer - 1] == null) playerGrid[building + 1, layer - 1] = blocked[k];
				else if (building2 > 0 && layer < 2 && playerGrid[building - 1, layer + 1] == null) playerGrid[building - 1, layer + 1] = blocked[k];
				else if (building2 < 5 && layer < 2 && playerGrid[building + 1, layer + 1] == null) playerGrid[building + 1, layer + 1] = blocked[k];
				else {reallyBlocked.Add(blocked[k]);}}
			if (reallyBlocked.Count > 0) {
				for( var k = 0; k < reallyBlocked.Count; k++) {
					int baseVal = blocked[k].getGoalBuilding() < 6 ? 0:6;
					bool found = false;
					for( var l = 0; l < 3 && !found; l++ )for( var j = 0; j < 6 && !found; j++ )if(playerGrid[j + baseVal, l] == null) {found = true;playerGrid[j + baseVal, l] = reallyBlocked[k];}}}
			for( var k = 0; k < 12; k++ )for( var l = 0; l < 3; l++)if( playerGrid[k,l] != null) {playerGrid[k, l].setBuilding(k);playerGrid[k, l].setGoalLayer(l);}}

	public void Setup(GameSys theGameSys, Players thePlayers, FoeSys foeSys, PlayerSys playerSys, APGSys apg, TreatSys treats) {
		gameSys = theGameSys;
		players = thePlayers;
		Buddies(playerSys, treats );
		InitGrid();}
	void React(v3 pos, Sprite msg) {var delay = 30;new ent(gameSys) { sprite = msg, name="react", pos = pos, scale = 1, update = e => { delay--; if(delay <= 0) e.remove(); } };}
	public void Ghost(v3 pos, ent leader, int team ) {
		float stopDist = rd.f(-4, -2), fadeOffset = rd.Ang(), tick = 0;
		var goalOffset = rd.Vec(-2, 2); 
		new ent(gameSys) {
			sprite = ( team == 2 ? players.angel2 : players.angel1 ), pos = pos, scale = .35f, leader=leader,
			update = e => {
				tick++;
				e.color = nm.col(1, .5f + .5f * Mathf.Cos(tick * .02f + fadeOffset));
				var goal = e.leader.pos - e.pos + goalOffset;
				var spd = Mathf.Max( (goal.magnitude - stopDist)*.003f, 0 );
				if(spd > 0) e.MoveBy(goal.normalized * spd);}};}

	[Serializable]
	struct PlayerUpdate{ public string nm; public int[] st; public int[] rs;}

	void Buddies(PlayerSys playerSys, TreatSys treats) {
		var bsrc = new ent(gameSys) { name="buddySet" };
		var nameColors = new Color[] { new Color(.2f, .4f, .6f, 1f), new Color(.4f, .6f, .2f, 1f), new Color(.6f, .2f, .4f, 1f), new Color(.6f, .4f, .2f, 1f), new Color(.4f, .2f, .6f, 1f), new Color(.2f, .6f, .4f, 1f), new Color(.533f, .533f, .533f, 1f), new Color(.6f, .2f, .2f, 1f), new Color(.2f, .6f, .2f, 1f), new Color(.2f, .2f, .6f, 1f) };
		var firstAbilityCosts = new Resource[,] { { Resource.Goo, Resource.Beans }, { Resource.Goo, Resource.Corn }, { Resource.Goo, Resource.Fries }, { Resource.FrothyDrink, Resource.Beans }, { Resource.Bribe, Resource.Burger }, { Resource.FrothyDrink, Resource.TBone } };
		var secondAbilityCosts = new Resource[,] { { Resource.Bribe, Resource.Burger, Resource.Fries }, { Resource.Acid, Resource.Beans, Resource.TBone}, { Resource.Acid, Resource.Burger, Resource.Taco }, { Resource.Bribe, Resource.Corn, Resource.TBone }, 
			{ Resource.FrothyDrink, Resource.Fries, Resource.Taco }, { Resource.Acid, Resource.Corn, Resource.Taco } };
		var extractResources = new Resource[,] { { Resource.TBone, Resource.Corn }, { Resource.Acid, Resource.Goo }, { Resource.Corn, Resource.Beans }, { Resource.FrothyDrink, Resource.Burger }, { Resource.FrothyDrink, Resource.Bribe }, { Resource.Fries, Resource.Taco } };
		var extractItems = new ItemIds[] { ItemIds.Hammer, ItemIds.ScaryMask, ItemIds.Bomb, ItemIds.TennisBall, ItemIds.Rocket, ItemIds.Shield };
		var maxHealth = 10;
		for ( var k2 = 0; k2 < 20; k2++ ) {
			var k = Mathf.Floor( k2 / 2 ) + (k2%2 == 1 ? 10:0);
			bool inUse = false;
			var nameColor = nameColors[(int)k % 10];
			var label = new ent(gameSys, players.textName) { pos = new v3(0, 0, 0), text="", textColor=nameColor };
			var healthBar = new ent(gameSys) { sprite = players.healthBarCenter, pos = new v3(0, 0, 0), scale=.1f, color=new Color(.33f,0,0, .5f) };
			var labelBack = new ent(gameSys, players.textName) { pos = new v3(0, 0, 0), text="", textColor=new Color(0,0,0,1), children = new List<ent> { label, healthBar }};
			var head = new ent(gameSys) { pos = new v3(0, 0, 0), sprite = players.heads[(int)k], color = new Color(1, 1, 1, 1) };
			var parms = new int[] { 0, 0, 0, 0, 0, 0, 0 };
			var bufferedParms = new int[] { 0, 0, 0, 0, 0, 0, 0 };
			var goalx = (k < 10) ? -9.5f + 8.5f * ((k % 6) / 6f) : 9.5f - 8.5f * (((k - 10) % 6) / 6f);
			var goalz = (k<6 || (k>9&&k<16))?-.4f:.4f;
			var team = (k < 10 ) ? 1:2;
			ent pl = null;
			var buildingGoal = (int)((k < 10) ? (k % 6) : (k - 10) % 6);
			var delayGoalX = 0f; var delayGoalZ = 0f;
			var goalLayer = (k < 6 || (k > 9 && k < 16)) ? 0 : 2;
			var actionId = 0;
			var resources = new int[] { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 };
			var items = new int[] { -1, -1, -1 };
			//var resources = new int[] { 10, 10, 10, 10, 10, 10, 10, 10, 10, 10 }; //var items = new int[] { rd.i(0,6), rd.i(0, 6), rd.i(0, 6) };
			var nameFlash = 0f; var nameFlashColor = new Color(0, 0, 0, 0);
			var buddyID = k; var tick = 0; var spd = 0f; var healthRatio = 1f; var goalHealthRatio = 1f;
			var itemId = -1;
			var buildingActionId = -1;
			int curBuilding = buildingGoal;
			int curLayer = goalLayer;
			var playerName = "npc" + k;
			var outOfUseName = playerName;
			var dodging = false;

			RegisterHandler(new BuddyFuncs {
				onJoin = name => {
					playerName = name;
					label.text = name;
					labelBack.text = name;
					healthBar.pos = new v3(-.5f, -3.5f, -.1f);
					inUse = true;},
				inUse = () => inUse,
				onLeave = () => {
					inUse = false;
					playerName = outOfUseName;
					label.text = outOfUseName;
					labelBack.text = outOfUseName;},
				getName = () => label.text,
				getHealth = () => pl.health,
				getHead = () => (int)k,
				getAction = () => actionId,
				getEnt = () => pl,
				getHeadEnt = () => head,
				getBuildingAction = () => buildingActionId,
				getItem = () => itemId,

				useUpSelectedItem = () => {
					if (actionId == 8) { items[2] = -1; }
					if (actionId == 7) { items[1] = items[2]; items[2] = -1; }
					if (actionId == 6) { items[0] = items[1]; items[1] = items[2]; items[2] = -1; }},
				useSelectedBuildingAction = () => {
					if (actionId == 4) {
						resources[(int)firstAbilityCosts[curBuilding%6, 0]]--;
						resources[(int)firstAbilityCosts[curBuilding % 6, 1]]--;}
					if (actionId == 5) {
						resources[(int)secondAbilityCosts[curBuilding % 6, 0]]--;
						resources[(int)secondAbilityCosts[curBuilding % 6, 1]]--;
						resources[(int)secondAbilityCosts[curBuilding % 6, 2]]--;}},
				doExtract = () => {
					var rat = rd.f(0, 1);
					if (rat < .45f) {
						resources[(int)extractResources[curBuilding % 6, 0]]++;
						new ent(gameSys) {
							sprite = treats.theTreats.resources[(int)extractResources[curBuilding % 6, 0]], pos = new v3( pl.pos.x, -3f+pl.pos.y, rd.f(.5f)), scale = .4f, name="extractResource", health=60, ignorePause=true, layer=Layers.UI,
							update = e => {
								e.health--;
								e.scale *= 1.01f;
								e.pos = e.pos + new v3(0, .002f, 0);
								e.color = new Color(1, 1, 1, e.health / 120f);
								if (e.health < 0) { e.remove(); return;} } };}
					else if (rat < .9f) {
						resources[(int)extractResources[curBuilding % 6, 1]]++;
						new ent(gameSys) {
							sprite = treats.theTreats.resources[(int)extractResources[curBuilding % 6, 1]], pos = new v3( pl.pos.x, -3f+pl.pos.y, rd.f(.5f)), scale = .4f, name="extractResource", health=60, ignorePause=true, layer=Layers.UI,
							update = e => {
								e.health--;
								e.scale *= 1.01f;
								e.pos = e.pos + new v3(0, .002f, 0);
								e.color = new Color(1, 1, 1, e.health / 120f);
								if (e.health < 0) { e.remove(); return;} } };}
					else {
						var show = true;
						if (items[0] == -1) { items[0] = (int)extractItems[curBuilding % 6]; }
						else if (items[1] == -1) { items[1] = (int)extractItems[curBuilding % 6]; }
						else if (items[2] == -1) { items[2] = (int)extractItems[curBuilding % 6]; }
						else { show = false;  }
						if( show) {
							new ent(gameSys) {
								sprite = treats.theTreats.items[(int)extractItems[curBuilding % 6]], pos = new v3( pl.pos.x, -3f+pl.pos.y, rd.f(.5f)), scale = .4f, name="extractItem", health=60, ignorePause=true, layer=Layers.UI,
								update = e => {
									e.health--;
									e.scale *= 1.01f;
									e.pos = e.pos + new v3(0, .002f, 0);
									e.color = new Color(1, 1, 1, e.health / 120f);
									if (e.health < 0) { e.remove(); return;} } };}}},

				getColor = () => nameColors[(int)k % 10],
				onInput = inputs => { bufferedParms = inputs; },
				getGoalBuilding = () => buildingGoal + ( team == 2 ? 6:0 ),
				getLayer = () => goalLayer,
				setBuilding = building => { buildingGoal = building; delayGoalX = (-9.5f + 8.5f * ((building % 6) / 6f)) * ((building < 6) ? 1 : -1); },
				getBuilding = () => curBuilding,
				setGoalLayer = layer => { goalLayer = layer;  delayGoalZ = -.4f + .4f * layer; },
				getPos = () =>pl.pos,
				doMove = () => { goalx = delayGoalX; goalz = delayGoalZ; curBuilding = buildingGoal; curLayer = goalLayer; },
				updateMove = e => {
					var dir = new v3(goalx, -5f, goalz) - e.pos;
					if (dir.magnitude > .2f) { e.flipped = (dir.x < 0) ? true : false; }
					if (dir.magnitude > .4f) { nm.ease(ref spd, .017f * 3, .07f); }
					else if (dir.magnitude < .3f) { nm.ease(ref spd, 0, .05f); e.flipped = team == 1 ? false : true; }
					e.MoveBy(dir.normalized * spd);
					labelBack.pos = new v3(labelBack.pos.x, -1f + (-.4f + e.pos.z) * 1f, labelBack.pos.z);
					if (dir.magnitude > .1f) { e.ang = spd * Mathf.Cos(tick * .1f); }},
				onRoundEnd = () => {
					if( !inUse) { bufferedParms = new int[] { rd.i(0, 6), rd.i(0, 3), rd.f(0, 1) < .7f ? rd.i(0, 4) : rd.i(0, 9), rd.i(0, 7), rd.i(0, 6), 1 }; }
					parms = bufferedParms;
					parms[0] = nm.Between(0, parms[0], 5);
					parms[1] = nm.Between(0, parms[1], 2);
					parms[2] = nm.Between(0, parms[2], 8);
					buildingGoal =  parms[0];
					goalLayer = parms[1];
					actionId = parms[2];
					itemId = buildingActionId = -1;
					if (actionId == 3) dodging = true; else dodging = false;
					if (actionId == 4) { if (resources[(int)firstAbilityCosts[curBuilding % 6, 0]] < 1 || resources[(int)firstAbilityCosts[curBuilding % 6, 1]] < 1) { actionId = 0; } else buildingActionId = (curBuilding%6)*2;  }
					if (actionId == 5) { if (resources[(int)secondAbilityCosts[curBuilding % 6, 0]] < 1 || resources[(int)secondAbilityCosts[curBuilding % 6, 1]] < 1 || resources[(int)secondAbilityCosts[curBuilding % 6, 2]] < 1) { actionId = 0; } else buildingActionId = (curBuilding % 6) * 2 + 1; }
					if (actionId == 6) { if (items[0] == -1) actionId = 0; else itemId = items[0]; }
					if (actionId == 7) { if (items[1] == -1) actionId = 0; else itemId = items[1]; }
					if (actionId == 8) { if (items[2] == -1) actionId = 0; else itemId = items[2]; }},
				updateToClient = apg => { apg.WriteToClients("pl", new PlayerUpdate { nm = playerName, st=new int[] { pl.health, (int)(k%10), buildingGoal, goalLayer, items[0], items[1], items[2] }, rs= resources });}});

			pl = new ent(gameSys) {
				sprite = players.anims[14], pos = new v3(goalx, -5, goalz), scale = .505f, health = maxHealth, children = new List<ent> { labelBack, head }, flipped=(k<10) ? false : true, leader= (k < 10) ? playerSys.playerEnt : ( playerSys.player2Ent != null ) ? playerSys.player2Ent:playerSys.playerEnt,
					name = "buddy"+k, inGrid=true, parent = bsrc, shadow=gameSys.Shadow(players.shadow, null, 1, .4f, 0 ), color= nameColors[(int)k % 10],
				onHurt = (e, src, dmg) => {
					if ((dmg.flags & ((int)TouchFlag.IsAirbourne)) != 0 && dodging && rd.Test(.5f)) return;
					e.health-=dmg.damage;
					goalHealthRatio = (e.health / (float)maxHealth);
					if (e.health > 0) {
						if (dmg.showDamage) {
							if (soundTick - lastSoundTime > 10) { gameSys.Sound(players.hurtSound, 1); lastSoundTime = soundTick; }
							React(e.pos + new v3(0, 0, -.2f), players.owMsg);
							nameFlash = 1f;
							nameFlashColor = new Color(1, 0, 0, 1);}}
					else {
						gameSys.Sound(players.dieSound, 1);
						label.text = "";
						labelBack.text = "";
						healthBar.active = false;
						Ghost(e.pos, e.leader, team);
						React(e.pos + new v3(0, 0, -.2f), players.ughMsg);
						e.color = new Color(1, 0, 0, .2f);
						head.color = new Color(1, 0, 0, .2f);}},
				itemTouch = (e, user, info) => {
					if (info.isItem == false) { resources[info.style] += info.count; }
					else {
						if (items[0] == -1) items[0] = info.style;
						else if (items[1] == -1) items[1] = info.style;
						else if (items[2] == -1) items[2] = info.style;}
					nameFlash = 1f;
					nameFlashColor = new Color(1, .9f, .8f, 1);},
				update = e => {
					if(e.health <= 0) return;
					if( healthRatio <= .25f) {
						if( tick % 30 == 0) {healthBar.color = new Color(1, 0, 0, 1);}
						if (tick % 30 == 5) {healthBar.color = new Color(.33f, 0, 0, .5f);}}
					if (healthRatio <= .5f) {
						if (tick % 120 == 0) {healthBar.color = new Color(1, 0, 0, 1);}
						if (tick % 120 == 5) {healthBar.color = new Color(.33f, 0, 0, .5f);}}
					if ( Math.Abs( healthRatio - goalHealthRatio ) > .01f) { healthRatio = healthRatio * .93f + .07f * goalHealthRatio; healthBar.scale3 = new v3(1.75f * healthRatio, 1.75f, .07f);}
					if( nameFlash > 0.01f) {
						nameFlash *= .99f;
						label.textColor = new Color( nameFlashColor.r * nameFlash + (1-nameFlash) * nameColor.r, nameFlashColor.g * nameFlash + (1 - nameFlash) * nameColor.g, nameFlashColor.b * nameFlash + (1 - nameFlash) * nameColor.b, 1 );
						label.scale = 1 + nameFlash*.25f;}
					if( parms == null || parms.Length < 4 )return;
					tick++;
					var doTouch = true;
					var g = GetPlayerGrid();

					if (curLayer == 2 || curLayer == 1) { if (g[curBuilding, 0] != null && g[curBuilding, 0].getEnt().health > 0) doTouch = false; }
					if (curLayer == 2) { if (g[curBuilding, 1] != null && g[curBuilding, 1].getEnt().health > 0) doTouch = false; }
					if(doTouch)gameSys.grid.Find(e.pos - new v3(0, .7f, 0), 1.75f, e, (me, targ) => { targ.buddyTouch(targ, me, new TouchInfo { flags=0, strength = 1 }); });

					var dir = new v3(goalx, -5f, goalz) - e.pos;
					if (dir.magnitude > .2f) { e.flipped = (dir.x < 0) ? true : false; }
					if(dir.magnitude > .4f) { nm.ease( ref spd, .017f * 3, .07f ); }
					else if(dir.magnitude < .3f) { nm.ease( ref spd, 0, .05f ); e.flipped = team==1 ? false : true; }
					e.MoveBy(dir.normalized * spd );
					labelBack.pos = new v3(labelBack.pos.x, -1f + (-.4f + e.pos.z) * 1f, labelBack.pos.z);
					if (dir.magnitude > .1f) { e.ang = spd * Mathf.Cos( tick * .1f ); }} };

			labelBack.pos = new v3(0,-1.4f, -.2f );
			labelBack.scale *= 1.1f;
			label.pos = new v3(-.5f,.5f,-.1f);
			healthBar.pos = new v3(-.5f, 15f, -.1f);

			label.text = playerName;
			labelBack.text = playerName;
			healthBar.pos = new v3(-.5f, -3.5f, -.1f);

			head.pos = new v3(0f, 1.1f, -.001f);
			head.scale = .5f/.3f;
			if (k > 10) head.flipped = true;}}}