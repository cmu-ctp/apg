using System;
using System.Collections.Generic;

namespace APG {

	public class AudiencePlayerEventsHandler {

		public Action<string> onJoin = playerName => { };

		public Action<List<int>> onInput = inputList => { };

		public Func<string> updateClient = () => "";
	}
}
