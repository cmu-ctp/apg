namespace APG {
	public interface AudienceInterface {
		void WriteToClients( string msg, object parms = null );
		void WriteLocal( string user, string msg, object parms = null );
		void WriteToChat( string msg );

		void SetHandlers( NetworkMessageHandler theHandlers );

		string LaunchAPGClientURL();

		ChatterInterface Chatters();

		void StartRecordingNetworking();
		void EndRecordingNetworkingAndSave( string messagesToClientsFileName, string messagesFromClientsFileName );
		void PlaybackNetworking( string messagesFromClientsFileName );
	}
}