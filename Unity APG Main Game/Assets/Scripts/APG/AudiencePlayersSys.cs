using UnityEngine;
using System;

namespace APG {

	public interface AudienceInterface {
		void WriteToClients( string msg, object parms = null );
		void WriteLocal( string user, string msg, object parms = null );
		void WriteToChat( string msg );

		string LaunchAPGClientURL();
		void SetHandlers( NetworkMessageHandler theHandlers );
		ChatterInterface Chatters();

		void StartRecordingNetworking();
		void EndRecordingNetworkingAndSave( string messagesToClientsFileName, string messagesFromClientsFileName );
		void PlaybackNetworking( string messagesFromClientsFileName );
	}

	public class AudiencePlayersSys : AudienceInterface {

		ChatSys chatSys;
		NetworkMessageHandler handlers;
		public int time = 0;

		TwitchGameLogicChat network;
		IRCNetworkRecorder recorder;

		public AudiencePlayersSys ( TwitchGameLogicChat theNetwork, IRCNetworkRecorder theRecorder ) {
			network = theNetwork;
			recorder = theRecorder;

			chatSys = new ChatSys( this );
		}

		public void WriteLocal( string user, string msg, object parms = null ) {
			RunHandler( user, msg+"###"+JsonUtility.ToJson(parms) );
		}

		public void WriteToClients( string msg, object parms = null ) {
			network.SendMsg( msg, parms );
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