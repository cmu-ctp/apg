using System;using v3 = UnityEngine.Vector3; using UnityEngine;

namespace APG {

	public class BuddyFuncs {

		public Action<string> onJoin = playerName => { };
		public Func<Boolean> inUse = () => false;
		public Action onLeave = () => { };

		public Action<int[]> onInput = inputList => { };
		public Action onRoundEnd = () => { };

		public Func<int> getGoalBuilding = () => 0;
		public Func<int> getLayer = () => 0;
		public Action<int> setBuilding = x => { };
		public Action<int> setGoalLayer = layer => { };
		public Func<string> getName = () => "";
		public Func<int> getHealth = () => 5;
		public Func<int> getHead = () => 0;
		public Func<Color> getColor = () => new Color(1,1,1, 1f);
		public Func<int> getAction = () => 3;
		public Func<ent> getEnt = () => null;
		public Func<ent> getHeadEnt = () => null;
		public Func<int> getBuildingAction = () => -1;
		public Func<int> getBuilding = () => 0;
		public Func<int> getItem = () => -1;
		public Action useUpSelectedItem = () => { };
		public Action useSelectedBuildingAction = () => { };
		public Action doExtract = () => { };

		public Func<v3> getPos = () => new v3(0,0,0);
		public Action doMove = () => { };
		public Action<ent> updateMove = e => { };

		public Action<APGSys> updateToClient = apg => { };
	}
}
