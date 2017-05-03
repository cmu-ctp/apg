using System;

namespace APG {

	public class AudiencePlayerEventsHandler {

		public Action<string> onJoin = playerName => { };

		public Action<int[]> onInput = inputList => { };
		public Action onRoundEnd = () => { };

		public Func<int> getGoalBuilding = () => 0;
		public Action<float> setGoalX = x => { };

		public Func<PlayerEndOfRoundInfo> getEndOfRoundInfo = () => new PlayerEndOfRoundInfo();

		public Action<AudienceInterface, string> updateToClient = (apg, userName) => { };
	}
}
