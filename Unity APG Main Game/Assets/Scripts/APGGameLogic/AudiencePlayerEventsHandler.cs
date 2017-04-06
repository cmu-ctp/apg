using System;

namespace APG {

	public class AudiencePlayerEventsHandler {

		public Action<string> onJoin = playerName => { };

		public Action<int[]> onInput = inputList => { };
		public Action onRoundEnd = () => { };

		public Action<AudienceInterface, string> updateToClient = (apg, userName) => { };
	}
}
