using System;

namespace APG {

	public interface AudienceInterface {
		void SendMsg( string msg, object parms = null );
		void SendChatText( string msg );
		string LaunchAPGClientURL();
		void SetHandlers( NetworkMessageHandler theHandlers );
		ChatterInterface Chatters();
	}

	public class AudiencePlayersSys : AudienceInterface {

		ChatSys chatSys;
		NetworkMessageHandler handlers;
		public int time = 0;

		Action<string, object> sendMsg;
		Action<string> sendChatText;
		Func<string> launchAPGClientURL;

		public AudiencePlayersSys ( Action<string, object> theSendMsg, Action<string> theSendChatText, Func<string> theLaunchAPGClientURL ) {
			sendMsg = theSendMsg;
			sendChatText = theSendChatText;
			launchAPGClientURL = theLaunchAPGClientURL;

			chatSys = new ChatSys( this );
		}

		public void SendMsg( string msg, object parms = null ) {
			sendMsg( msg, parms );
		}
		public void SendChatText( string msg ) {
			sendChatText( msg );
		}
		public string LaunchAPGClientURL() {
			return launchAPGClientURL();
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
	}
}