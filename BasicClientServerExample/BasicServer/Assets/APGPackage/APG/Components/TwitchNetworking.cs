using UnityEngine;
using System;
using System.IO;
using System.Collections.Generic;
using System.Net;
using System.Text;
using System.Text.RegularExpressions;
using APG;
#if UNITY_EDITOR
using UnityEditor;
#endif

[RequireComponent(typeof(TwitchIRCChat))]
[RequireComponent(typeof(TwitchIRCLogic))]
public class TwitchNetworking:MonoBehaviour {

	[Tooltip("")]
	public string LogicOauth;
	[Tooltip("Twitch account name for the game network traffice")]
	public string LogicChannelName;
	[Tooltip("")]
	public string ChatOauth;
	[Tooltip("Twitch account name for the game chat traffic.  This is used to invite audience members to join the game.")]
	public string ChatChannelName;

	[Tooltip("")]
	public string GameClientID;
	[Tooltip("")]
	public string RedirectLink;

	[Tooltip("Name of file to save network settings in, relative Assets folder.  If this file exists, the fields set in the Unity Editor will be ignored.")]
	public string NetworkSettingPath;

	//___________________________________________

	public APGSys GetAudienceSys() {
		return apg;
	}

	//___________________________________________

	[Serializable]
	struct EmptyMsg{
	}

	[Serializable]
	class NetworkSettings {
		public string ChatChannelName;
		public string ChatOauth;
		public string LogicChannelName;
		public string LogicOauth;
		public string GameClientID;
		public string RedirectLink;
		public string BitlyLink;
	}
	
	//___________________________________________

	[SerializeField] NetworkSettings settings = null;

	EmptyMsg emptyMsg = new EmptyMsg();

	TwitchIRCChat IRCChat;
	TwitchIRCLogic IRCLogic;

	AudiencePlayersSys apg;

	int time = 0;

	IRCNetworkRecorder recorder = new IRCNetworkRecorder();

	//___________________________________________

	private Uri ShortenUri(Uri longUri, string login, string apiKey, bool addHistory) {
	  const string bitlyUrl = @"http://api.bit.ly/shorten?longUrl={0}&apiKey={1}&login={2}&version=2.0.1&format=json&history={3}";
	  var request = WebRequest.Create(string.Format(bitlyUrl, longUri, apiKey, login, addHistory ? "1" : "0"));
	  var response = (HttpWebResponse)request.GetResponse();
	  string bitlyResponse;
	  using (var reader = new StreamReader(response.GetResponseStream())) {
		bitlyResponse = reader.ReadToEnd();
	  }
	  response.Close();
	  if (!string.IsNullOrEmpty(bitlyResponse)) {
		const RegexOptions options = ((RegexOptions.IgnorePatternWhitespace | RegexOptions.Multiline) | RegexOptions.IgnoreCase);
		const string rx = "\"shortUrl\":\\ \"(?<short>.*?)\"";
		Regex reg = new Regex(rx, options);
		string tmp = reg.Match(bitlyResponse).Groups["short"].Value;
		return string.IsNullOrEmpty(tmp) ? longUri : new Uri(tmp);
	  }
	  return longUri;
	}

	void LoadNetworkSettings() {
		settings = new NetworkSettings { ChatChannelName = ChatChannelName, LogicChannelName = LogicChannelName, LogicOauth = LogicOauth, ChatOauth = ChatOauth, GameClientID = GameClientID, RedirectLink = RedirectLink, BitlyLink = "" };

		var settingPath = Application.dataPath+"\\"+ NetworkSettingPath;

		try { 
			using (StreamReader sr = new StreamReader(settingPath)){
				settings = JsonUtility.FromJson<NetworkSettings>( sr.ReadToEnd() );
            }
		}
		catch {
		}

		var forceSettingsWrite = false;

		if( false ) {// settings.BitlyLink != "" ) {
		}
		else {
			var longUrl = "https://api.twitch.tv/kraken/oauth2/authorize?response_type=token&client_id="+settings.GameClientID+"&state="+settings.GameClientID+"+"+settings.ChatChannelName+"+"+settings.LogicChannelName+"&redirect_uri="+settings.RedirectLink+"&scope=user_read+channel_read+chat_login";

			Debug.Log( "Use the following URL for a bitly link:" + longUrl );

			//settings.BitlyLink = ShortenUri( new Uri( longUrl ), "kenzidelx", "R_9945fa5fc55249e28f45da879047ba24", false ).ToString();

			//Debug.Log( "So link is " + settings.BitlyLink );

			//forceSettingsWrite = true;
		}

		if( forceSettingsWrite || (!File.Exists( settingPath ) && ( settings.LogicChannelName != "" && settings.ChatChannelName != "" && settings.LogicOauth != "" && settings.ChatOauth != "" ))) {
			File.WriteAllText( settingPath, JsonUtility.ToJson( settings ) );
		}

		#if UNITY_EDITOR
		if( settings.LogicChannelName == "" ) {
			EditorUtility.DisplayDialog( "Error!", 
				"In the Unity Editor, you included a TwitchGameLogicScriptChat component, but the field Logic Channel Name isn't set to a valid Twitch Account.  This will be used for network traffic.  Go register for a new account on Twitch if you don't have one.", 
				"Okay");
		}
		if( settings.ChatChannelName == "" ) {
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
			string msgString = msg.Substring(msgIndex + settings.ChatChannelName.Length + 11);
			string user = msg.Substring(1, msg.IndexOf('!') - 1);
			apg.RecordMostRecentChat( user, msgString );
		});

		IRCChat.SendMsg( "*** Chat Channel Initialized ***" );
	}

	int lastLogicWriteTime = -1;

	void InitIRCLogicChannel() {

		IRCLogic.messageRecievedEvent.AddListener(msg => {
			int msgIndex = msg.IndexOf("PRIVMSG #");
			string msgString = msg.Substring(msgIndex + settings.LogicChannelName.Length + 11);
			string user = msg.Substring(1, msg.IndexOf('!') - 1);

			Debug.Log( " " + msgString );

			apg.RunHandler( user, msgString );

			recorder.WriteFromClientMsg( time, user, msgString );
		});

		IRCLogic.SendMsg( "*** Logic Channel Initialized ***" );
	}

	static readonly int maxIRCMsgLength = 480;
	static readonly int splitterLength = "%%".Length;
	StringBuilder bufferedCommands = new StringBuilder( maxIRCMsgLength + 1 );
	Queue<string> commandQueue = new Queue<string>();

	public void WriteMessageToClient<T>( string msg, T parms ) {
		var s = msg+"###"+JsonUtility.ToJson(parms);

		if( bufferedCommands.Length + splitterLength + s.Length > maxIRCMsgLength ) {
			if (time - lastLogicWriteTime < 30 ) {
				//Debug.Log("Enqueing " + time+ " " + bufferedCommands);
				commandQueue.Enqueue(bufferedCommands.ToString());
			}
			else {
				//Debug.Log("Sending " + time + " " + bufferedCommands);
				IRCLogic.SendMsg(bufferedCommands.ToString());
				lastLogicWriteTime = time;
			}
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
		return settings.BitlyLink;
	}

	void Awake() {
		Debug.Log( "Starting GameLogicChat");

		apg = new AudiencePlayersSys( this, recorder );

		LoadNetworkSettings();

		IRCChat = this.GetComponent<TwitchIRCChat>();
		IRCChat.oauthFunc = () => settings.ChatOauth;
		IRCChat.channelNameFunc = () => settings.ChatChannelName;

		IRCLogic = this.GetComponent<TwitchIRCLogic>();
		IRCLogic.oauthFunc = () => settings.LogicOauth;
		IRCLogic.channelNameFunc = () => settings.LogicChannelName;
	}

	void Start() {
		InitIRCChat();
		InitIRCLogicChannel();
	}

	void FixedUpdate() {
		time++;
		if( (time % (50 * 20)) == 0 ) {
			WriteMessageToClient("alive", new EmptyMsg());
		}
		if (time - lastLogicWriteTime > 30) {
			if (bufferedCommands.Length > 0) {
				//Debug.Log("Sending buffered commands " + time +" "+ bufferedCommands );
				IRCLogic.SendMsg(bufferedCommands.ToString());
				bufferedCommands.Length = 0;
				lastLogicWriteTime = time;
			}
			else if( commandQueue.Count > 0) {
				var cmd = commandQueue.Dequeue();
				//Debug.Log("Sending enqueued commands "+time+ " " + cmd);
				IRCLogic.SendMsg( cmd );
				lastLogicWriteTime = time;
			}
		}
		apg.Update();

	}

}