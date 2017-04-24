using UnityEngine;

namespace APG {
	public class AudiencePlayersSys : AudienceInterface {

		ChatSys chatSys;
		NetworkMessageHandler handlers;
		public int time = 0;

		TwitchNetworking network;
		IRCNetworkRecorder recorder;

		public AudiencePlayersSys ( TwitchNetworking theNetwork, IRCNetworkRecorder theRecorder ) {
			network = theNetwork;
			recorder = theRecorder;

			chatSys = new ChatSys( this );
		}

		public void WriteLocal<T>( string user, string msg, T parms ) {
			RunHandler( user, msg+"###"+JsonUtility.ToJson(parms) );
		}

		public void WriteToClients<T>( string msg, T parms ) {
			network.WriteMessageToClient( msg, parms );
		}
		public void WriteToChat( string msg ) {
			network.SendChatText( msg );
		}
		public string LaunchAPGClientURL() {
			return network.LaunchAPGClientURL();
		}
		public void SetHandlers( NetworkMessageHandler theHandlers ) {
			handlers = theHandlers;
		}
		public ChatterInterface Chatters() {
			return chatSys;
		}

		public void RunHandler( string user, string msgString ) {
			handlers.Run( user, msgString );
		}
		public void Update() {
			time++;
		}
		public void RecordMostRecentChat( string name, string msg) {
			chatSys.Log( name, msg, time );
		}

		public void StartRecordingNetworking() {
			recorder.StartRecordingNetworking();
		}
		public void EndRecordingNetworkingAndSave( string messagesToClientsFileName, string messagesFromClientsFileName ) {
			recorder.EndRecordingNetworkingAndSave( messagesFromClientsFileName, messagesFromClientsFileName );
		}
		public void PlaybackNetworking( string messagesFromClientsFileName ) {
			recorder.PlaybackNetworking( messagesFromClientsFileName );
		}

	}
}