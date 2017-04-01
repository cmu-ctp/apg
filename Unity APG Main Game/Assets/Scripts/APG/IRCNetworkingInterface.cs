namespace APG {

	public interface IRCNetworkingInterface {

		void SendMsg<T>( string msg, T parms );

		void InviteEmptyGame();

		void InvitePartiallyFullGame();

		void InviteFullGame();

		AudienceSysInterface GetAudienceSys();
	}
}
