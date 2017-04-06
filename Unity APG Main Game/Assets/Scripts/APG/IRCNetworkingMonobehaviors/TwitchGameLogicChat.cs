using UnityEngine;
using System;
using System.IO;
using System.Text;
using APG;
#if UNITY_EDITOR
using UnityEditor;
#endif

[RequireComponent(typeof(TwitchIRCChat))]
[RequireComponent(typeof(TwitchIRCLogic))]
public class TwitchGameLogicChat:MonoBehaviour {

	public string LogicOauth;
	public string LogicChannelName;
	public string ChatOauth;
	public string ChatChannelName;

	public string GameClientID;
	public string RedirectLink;

	public string BitlyLink;

	public string NetworkSettingPath;

	//___________________________________________

	public AudienceInterface GetAudienceSys() {
		return apg;
	}

	//___________________________________________

	[Serializable]
	struct EmptyMsg{
	}

	[Serializable]
	class NetworkSettings {
		public string ChatOauth;
		public string LogicOauth;
		public string GameClientID;
		public string RedirectLink;
		public string BitlyLink;
	}
	
	//___________________________________________

	NetworkSettings settings = null;

	string launchAPGClientURL = "GAME LAUNCHING LINK NOT SET";

	EmptyMsg emptyMsg = new EmptyMsg();

	TwitchIRCChat IRCChat;
	TwitchIRCLogic IRCLogic;

	AudiencePlayersSys apg;

	int time = 0;

	IRCNetworkRecorder recorder = new IRCNetworkRecorder();

	//___________________________________________


	void LoadNetworkSettings() {
		if( settings != null ) {
			return;
		}

		settings = new NetworkSettings {LogicOauth = LogicOauth, ChatOauth = ChatOauth, GameClientID = GameClientID, RedirectLink = RedirectLink, BitlyLink = BitlyLink };

		try { 
			using (StreamReader sr = new StreamReader(Application.dataPath+"\\"+ NetworkSettingPath)){
				settings = JsonUtility.FromJson<NetworkSettings>( sr.ReadToEnd() );
            }
		}
		catch {
		}

		// Debug.Log( JsonUtility.ToJson( settings ) );

		launchAPGClientURL = "https://api.twitch.tv/kraken/oauth2/authorize?response_type=token&client_id="+settings.GameClientID+"&state="+"B+"+ChatChannelName+"+"+LogicChannelName+"&redirect_uri="+settings.RedirectLink+"&scope=user_read+channel_read+chat_login";

		if( settings.BitlyLink != "" ) {
			launchAPGClientURL = settings.BitlyLink;
		}

		Debug.Log( "HTML5 Client is launched for this game and this twitch account with the following URL: " + launchAPGClientURL );
		Debug.Log( "Paste these specific URLs into Bitly for shortened URLs." );

		#if UNITY_EDITOR
		if( LogicChannelName == "" ) {
			EditorUtility.DisplayDialog( "Error!", 
				"In the Unity Editor, you included a TwitchGameLogicScriptChat component, but the field Logic Channel Name isn't set to a valid Twitch Account.  This will be used for network traffic.  Go register for a new account on Twitch if you don't have one.", 
				"Okay");
		}
		if( ChatChannelName == "" ) {
			EditorUtility.DisplayDialog( "Error!", 
				"In the Unity Editor, you included a TwitchGameLogicScriptChat component, but the field Chat Channel Name isn't set to a valid Twitch Account.  This will be used for inviting players to join the game.  Go register for a new account on Twitch if you don't have one.", 
				"Okay");
		}
		if( settings.LogicOauth == "" ) {
			EditorUtility.DisplayDialog( "Error!", 
				"In the Unity Editor, you included a TwitchGameLogicScriptChat component, but the field Logic Oauth isn't set to a valid Oauth.\n\nMake sure you have a separate twitch account for your logic channel, then get an Oauth for your logic channel here:\n\n http://www.twitchapps.com/tmi/ \n\nthen fill in that field.", 
				"Okay");
		}
		if( settings.ChatOauth == "" ) {
			EditorUtility.DisplayDialog( "Error!", 
				"In the Unity Editor, you included a TwitchGameLogicScriptChat component, but the field Chat Oauth isn't set to a valid Oauth.\n\nGet an Oauth for your chat channel here:\n\n http://www.twitchapps.com/tmi/ \n\nthen fill in that field.", 
				"Okay");
		}
		#endif
	}

	void InitIRCChat() {
		
		//IRC.SendCommand("CAP REQ :twitch.tv/tags"); //register for additional data such as emote-ids, name color etc.

		IRCChat.messageRecievedEvent.AddListener(msg => {
			int msgIndex = msg.IndexOf("PRIVMSG #");
			string msgString = msg.Substring(msgIndex + ChatChannelName.Length + 11);
			string user = msg.Substring(1, msg.IndexOf('!') - 1);
			apg.RecordMostRecentChat( user, msgString );
		});

		IRCChat.SendMsg( "*** Chat Channel Initialized ***" );
	}

	void InitIRCLogicChannel() {

		IRCLogic.messageRecievedEvent.AddListener(msg => {
			int msgIndex = msg.IndexOf("PRIVMSG #");
			string msgString = msg.Substring(msgIndex + LogicChannelName.Length + 11);
			string user = msg.Substring(1, msg.IndexOf('!') - 1);

			Debug.Log( " " + msgString );

			apg.RunHandler( user, msgString );

			recorder.WriteFromClientMsg( time, user, msgString );
		});

		IRCLogic.SendMsg( "*** Logic Channel Initialized ***" );
	}

	static readonly int maxIRCMsgLength = 512;
	static readonly int splitterLength = "%%".Length;
	StringBuilder bufferedCommands = new StringBuilder( maxIRCMsgLength + 1 );

	public void SendMsg( string msg, object parms ) {
		if( parms == null )parms = emptyMsg;

		var s = msg+"###"+JsonUtility.ToJson(parms);

		if( bufferedCommands.Length + splitterLength + s.Length > maxIRCMsgLength ) {
			IRCLogic.SendMsg( bufferedCommands.ToString() );
			bufferedCommands.Length = 0;
			bufferedCommands.Append( s );
		}
		else if( bufferedCommands.Length > 0 ) {
			bufferedCommands.Append( "%%" ).Append( s );
		}
		else {
			bufferedCommands.Append( s );
		}
		
		recorder.WriteToClientMsg( time, "server", s );
	}

	public void SendChatText( string msg ) {
		IRCChat.SendMsg( msg );
	}

	public string LaunchAPGClientURL() {
		return launchAPGClientURL;
	}

	void Awake() {
		Debug.Log( "Starting GameLogicChat");

		apg = new AudiencePlayersSys( this, recorder );

		LoadNetworkSettings();

		IRCChat = this.GetComponent<TwitchIRCChat>();
		IRCChat.oauthFunc = () => settings.ChatOauth;
		IRCChat.channelNameFunc = () => ChatChannelName;

		IRCLogic = this.GetComponent<TwitchIRCLogic>();
		IRCLogic.oauthFunc = () => settings.LogicOauth;
		IRCLogic.channelNameFunc = () => LogicChannelName;
	}

	void Start() {
		InitIRCChat();
		InitIRCLogicChannel();
	}
	void Update() {
		time++;
		if( bufferedCommands.Length > 0 ) {
			IRCLogic.SendMsg( bufferedCommands.ToString() );
			bufferedCommands.Length = 0;
		}
		apg.Update();
	}
}