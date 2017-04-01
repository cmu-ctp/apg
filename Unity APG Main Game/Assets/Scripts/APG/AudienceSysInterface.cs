using System.Collections.Generic;

namespace APG {

	public interface AudienceSysInterface {

		void RegisterHandler( AudiencePlayerEventsHandler events );

		int PlayerCount();

		string PlayerName( int playerNumber );

		int[] PlayerInput( int playerNumber );

		bool AddPlayer( string playerName );

		bool SetPlayerInput( string playerName, int[] input );

		ChatterInterface Chatters();
	}
}
