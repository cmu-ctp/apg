namespace APG {

	public interface IRCNetworkingInterface {

		void SendMsg<T>( string msg, T parms );

		void SendChatText( string msg );

		string LaunchAPGClientURL();

		AudienceSysInterface GetAudienceSys();

		void SetHandlers( NetworkMessageHandler handlers );
	}
}
