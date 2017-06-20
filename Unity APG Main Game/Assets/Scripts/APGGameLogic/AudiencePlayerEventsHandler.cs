using System;

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

		public Func<PlayerEndOfRoundInfo> getEndOfRoundInfo = () => new PlayerEndOfRoundInfo();

		public Action<APGSys, string> updateToClient = (apg, userName) => { };
	}
}
