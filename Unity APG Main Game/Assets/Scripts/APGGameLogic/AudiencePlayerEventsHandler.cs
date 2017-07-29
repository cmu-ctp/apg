using System;using v3 = UnityEngine.Vector3;

namespace APG {

	public class AudiencePlayerEventsHandler {

		public Action<string> onJoin = playerName => { };

		public Action<int[]> onInput = inputList => { };
		public Action onRoundEnd = () => { };

		public Func<int> getGoalBuilding = () => 0;
		public Func<int> getLayer = () => 0;
		public Action<int> setBuilding = x => { };
		public Action<int> setGoalLayer = layer => { };
		public Func<string> getName = () => "";
		public Func<int> getHealth = () => 3;
		public Action<int> showActionStart = frames => { };

		public Func<PlayerEndOfRoundInfo> getEndOfRoundInfo = () => new PlayerEndOfRoundInfo();
		public Func<v3> getPos = () => new v3(0,0,0);
		public Action doMove = () => { };

		public Action<APGSys, string> updateToClient = (apg, userName) => { };
	}
}
