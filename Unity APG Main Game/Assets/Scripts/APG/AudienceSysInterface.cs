using System.Collections.Generic;

namespace APG {

	public interface AudienceSysInterface {

		void RegisterHandler( AudiencePlayerEventsHandler events );

		int PlayerCount();

		string PlayerName( int playerNumber );

		List<int> PlayerInput( int playerNumber );

		bool AddPlayer( string playerName );

		bool SetPlayerInput( string playerName, List<int> input );

		ChatterInterface Chatters();
	}
}
