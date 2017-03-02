namespace APG {

	public interface IRCNetworkingInterface {

		void RequestPlayersUpdate();

		void UpdateTime( int time, int roundNumber );

		void UpdatePlayer( string key, string updateString );

		void InviteEmptyGame();

		void InvitePartiallyFullGame();

		void InviteFullGame();

		AudienceSysInterface GetAudienceSys();
	}
}
