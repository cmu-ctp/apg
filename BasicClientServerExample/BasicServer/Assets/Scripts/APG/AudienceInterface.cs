namespace APG {
	public interface AudienceInterface {
		void WriteToClients<T>( string msg, T parms );
		void WriteLocal<T>( string user, string msg, T parms );
		void WriteToChat( string msg );

		void SetHandlers( NetworkMessageHandler theHandlers );

		string LaunchAPGClientURL();

		ChatterInterface Chatters();

		void StartRecordingNetworking();
		void EndRecordingNetworkingAndSave( string messagesToClientsFileName, string messagesFromClientsFileName );
		void PlaybackNetworking( string messagesFromClientsFileName );
	}
}