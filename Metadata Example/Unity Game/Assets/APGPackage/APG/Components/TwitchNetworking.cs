using UnityEngine;
using System;
using System.IO;
using System.Collections.Generic;
using System.Net;
using System.Text;
using System.Text.RegularExpressions;
using APG;
using ZXing;
using ZXing.QrCode;
#if UNITY_EDITOR
using UnityEditor;
#endif

interface NetworkChannel{
    void SendMsg(string msg);
    void SetOAuthFunc(Func<string> func);
    void SetChannelNameFunc(Func<string> func);
    void SetMessageRecievedListener(UnityEngine.Events.UnityAction<string> call);
}

class NullNetwork : NetworkChannel{
    public void SendMsg(string msg) { }
    public void SetOAuthFunc(Func<string> func) { }
    public void SetChannelNameFunc(Func<string> func) { }
    public void SetMessageRecievedListener(UnityEngine.Events.UnityAction<string> call) { }
}

[RequireComponent(typeof(TwitchIRCChat))]
[RequireComponent(typeof(TwitchIRCLogic))]
public class TwitchNetworking:MonoBehaviour {

    [Header("Main Features")]

    [Tooltip("")]
    public bool UseTwitchIRCTraffic = true;

    [Tooltip("")]
    public bool UseMetadata = false;

    [Header("Testing Features")]

    [Tooltip("")]
    public bool UseSingleMachineTestNetworking = true;

    public string SingleMachineTestNetworkingDirectory = ".." + Path.DirectorySeparatorChar + "Client" + Path.DirectorySeparatorChar + "website" + Path.DirectorySeparatorChar + "TestTraffic";

    [Header("IRC Networking Fields")]

    [Tooltip("")]
	public string LogicOauth;
	[Tooltip("Twitch account name for the game network traffic")]
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

    [Header("Misc")]

    [SerializeField] NetworkSettings settings = null;

    public GameObject FrameNumber;

    //___________________________________________

    public APGSys GetAudienceSys() {
		if (apg == null) Initialize();
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

	

	EmptyMsg emptyMsg = new EmptyMsg();

    NetworkChannel IRCChat;
    NetworkChannel IRCLogic;

    AudiencePlayersSys apg = null;

	int time = 0;

	Texture2D mobileQRCode = null;

	IRCNetworkRecorder recorder = new IRCNetworkRecorder();

    //___________________________________________

    private static Color32[] Encode(string textForEncoding, int width, int height){
        var writer = new BarcodeWriter { Format = BarcodeFormat.QR_CODE, Options = new QrCodeEncodingOptions { Height = height, Width = width } };
        return writer.Write(textForEncoding);
    }

    private Texture2D generateQR(string text){
        var encoded = new Texture2D(256, 256);
        var color32 = Encode(text, encoded.width, encoded.height);
        encoded.SetPixels32(color32);
        encoded.Apply();
        return encoded;
    }

    private Uri ShortenUri(Uri longUri, string login, string apiKey, bool addHistory){
        const string bitlyUrl = @"http://api.bit.ly/shorten?longUrl={0}&apiKey={1}&login={2}&version=2.0.1&format=json&history={3}";
        var request = WebRequest.Create(string.Format(bitlyUrl, longUri, apiKey, login, addHistory ? "1" : "0"));
        var response = (HttpWebResponse)request.GetResponse();
        string bitlyResponse;
        using (var reader = new StreamReader(response.GetResponseStream())){
            bitlyResponse = reader.ReadToEnd();
        }
        response.Close();
        if (!string.IsNullOrEmpty(bitlyResponse)){
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

		var settingPath = Application.dataPath+ Path.DirectorySeparatorChar + NetworkSettingPath;

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

			mobileQRCode = generateQR(longUrl);

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

		IRCChat.SetMessageRecievedListener(msg => {
			int msgIndex = msg.IndexOf("PRIVMSG #");
			string msgString = msg.Substring(msgIndex + settings.ChatChannelName.Length + 11);
			string user = msg.Substring(1, msg.IndexOf('!') - 1);
			apg.RecordMostRecentChat( user, msgString );
		});

		IRCChat.SendMsg( "*** Chat Channel Initialized ***" );
	}

	int lastLogicWriteTime = -1;

	void InitIRCLogicChannel() {

		IRCLogic.SetMessageRecievedListener(msg => {
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

    StringBuilder cachedMetaData = new StringBuilder();

    public void WriteMetadata<T>(string msg, T parms){
        var parmsString = JsonUtility.ToJson(parms);

        cachedMetaData.Append("" + time + "~" + msg + "~" + parmsString + "\r\n");

        if ((time % 60) == 0){
            if (UseSingleMachineTestNetworking){
                System.IO.File.WriteAllText(SingleMachineTestNetworkingDirectory + Path.DirectorySeparatorChar + "test" + Mathf.Floor(time / 60) + ".txt", cachedMetaData.ToString());
            }
            cachedMetaData.Length = 0;
        }

        // METADATA - Send the message along with parmsString to the metadata server

        // make this cache a message
        // then send the entire message in its FixedUpdate function
    }

    public void WriteMessageToClient<T>(string msg, T parms) {
		WriteMessageStringToClient(msg, JsonUtility.ToJson(parms));
	}

	public void WriteMessageStringToClient( string msg, string parms ) {
		var s = msg+"###"+parms;

		if( bufferedCommands.Length + splitterLength + s.Length > maxIRCMsgLength ) {
			if (time - lastLogicWriteTime < 30 ) {
				commandQueue.Enqueue(bufferedCommands.ToString());
			}
			else {
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

	public Texture2D MobileJoinQRCode() {
		if(mobileQRCode == null) {

		}
		return mobileQRCode;
	}

	void Initialize() {
		Debug.Log("Starting GameLogicChat");

		apg = new AudiencePlayersSys(this, recorder);

        if (UseSingleMachineTestNetworking){
            IRCChat = new NullNetwork();
            IRCLogic = new NullNetwork();
        }
        else{
            LoadNetworkSettings();

            IRCChat = this.GetComponent<TwitchIRCChat>();
            IRCLogic = this.GetComponent<TwitchIRCLogic>();
        }
        IRCChat.SetOAuthFunc(() => settings.ChatOauth);
        IRCChat.SetChannelNameFunc(() => settings.ChatChannelName);
        IRCLogic.SetOAuthFunc(() => settings.LogicOauth);
        IRCLogic.SetChannelNameFunc(() => settings.LogicChannelName);
    }

    public int GetTime() { return time; }

    void Awake() {
		if( apg==null) Initialize();
	}

	void Start() {
        FrameNumber.active = UseMetadata;

        if (UseSingleMachineTestNetworking){
            System.IO.DirectoryInfo di = new DirectoryInfo(SingleMachineTestNetworkingDirectory);
            foreach (FileInfo file in di.GetFiles()) file.Delete();
        }

        InitIRCChat();
        InitIRCLogicChannel();
        // METADATA - Init connection to metadata server here
    }

    [Serializable]
    struct AliveParms { public int t; }

    void FixedUpdate(){
        time++;
        if ((time % (50 * 20)) == 0){
            WriteMessageToClient("alive", new AliveParms());
        }
        if (time - lastLogicWriteTime > 30){
            if (bufferedCommands.Length > 0){
                //Debug.Log("Sending buffered commands " + time +" "+ bufferedCommands );
                IRCLogic.SendMsg(bufferedCommands.ToString());
                bufferedCommands.Length = 0;
                lastLogicWriteTime = time;
            }
            else if (commandQueue.Count > 0){
                var cmd = commandQueue.Dequeue();
                //Debug.Log("Sending enqueued commands "+time+ " " + cmd);
                IRCLogic.SendMsg(cmd);
                lastLogicWriteTime = time;
            }
        }
        apg.Update();
    }
}