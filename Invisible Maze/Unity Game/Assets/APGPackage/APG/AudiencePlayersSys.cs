using UnityEngine;
using System;

namespace APG {
	public class AudiencePlayersSys : APGSys {

		ChatSys chatSys;
		NetworkMessageHandler handlers;
		public int time = 0;

		TwitchNetworking network;
		IRCNetworkRecorder recorder;

		public AudiencePlayersSys(TwitchNetworking theNetwork, IRCNetworkRecorder theRecorder) {
			network = theNetwork;
			recorder = theRecorder;

			chatSys = new ChatSys(this);
		}

		public void WriteLocal<T>(string user, string msg, T parms) {
			RunHandler(user, msg + "###" + JsonUtility.ToJson(parms));
		}
		public void WriteLocalString(string user, string msg, string parms) {
			RunHandler(user, msg + "###" + parms);
		}

		public void WriteToClients<T>(string msg, T parms) {
			network.WriteMessageToClient(msg, parms);
		}
		public void WriteStringToClients(string msg, string parms) {
			network.WriteMessageStringToClient(msg, parms);
		}

		public void WriteToChat(string msg) {
			network.SendChatText(msg);
		}
		public string LaunchAPGClientURL() {
			return network.LaunchAPGClientURL();
		}
		public Texture2D MobileJoinQRCode() {
			return network.MobileJoinQRCode();
		}
		public ChatterInterface Chatters() {
			return chatSys;
		}

		public APGSys ResetClientMessageRegistry() {
			handlers = new NetworkMessageHandler();
			return this;
		}
		public APGSys Register<T>(string msgName, Action<string, T> funcForClientMessage){
			handlers.Register<T>(msgName, funcForClientMessage);
			return this;
		}
		public APGSys RegisterString(string msgName, Action<string, string> funcForClientMessage) {
			handlers.RegisterString(msgName, funcForClientMessage);
			return this;
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

        public void WriteMetadata<T>(string msg, T parms){
            network.WriteMetadata(msg, parms);
        }

	}
}