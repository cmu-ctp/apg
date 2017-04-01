using System;
using System.Collections.Generic;

namespace APG {

	public class AudiencePlayerEventsHandler {

		public Action<string> onJoin = playerName => { };

		public Action<int[]> onInput = inputList => { };

		public Func<string> updateClient = () => "";
	}
}
