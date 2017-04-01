using UnityEngine;
using System.IO;
using APG;
#if UNITY_EDITOR
using UnityEditor;
#endif

[RequireComponent(typeof(TwitchIRCChat))]
[RequireComponent(typeof(TwitchIRCLogic))]
public class TwitchGameLogicChat:MonoBehaviour, IRCNetworkingInterface {

	//___________________________________________

	public string LogicOauth;
	public string LogicChannelName;
	public string ChatOauth;
	public string ChatChannelName;

	public string GameClientID;
	public string RedirectLink;

	public string BitlyLink;

	//___________________________________________

	string launchGameLink = "GAME LAUNCHING LINK NOT SET";

	TwitchIRCChat IRCChat;
	TwitchIRCLogic IRCLogic;

	// Who should be in charge of what?
	AudiencePlayersSys apgSys = new AudiencePlayersSys();

	// This, right here, needs to be much better thought through.
	APGBasicGameLogic gameLogic = new APGBasicGameLogic();
	public int maxPlayers = 20;

	//___________________________________________

	public void SendMsg<T>( string msg, T parms ) {
		IRCLogic.SendMsg( msg+"###"+JsonUtility.ToJson(parms) );
	}

	private string DisplayLinks() {
		return "" + launchGameLink;
	}

	public void InviteEmptyGame() {
		IRCChat.SendMsg("Up to 20 people can play!  Join here: " + DisplayLinks() );
	}
	public void InvitePartiallyFullGame() {
		IRCChat.SendMsg("" + apgSys.activePlayers + " of " + maxPlayers + " are playing!  Join here: " + DisplayLinks());
	}
	public void InviteFullGame() {
		IRCChat.SendMsg("The game is full!  Get in line to play: " + DisplayLinks());
	}

	//___________________________________________

	void LoadDebugOauths() {
		try { 
			// format of this file, for debugging purposes: logic_channel_oauth chat_channel_oauth
			var sr = new StreamReader(@"C:\APG\apg_debug_oauths.txt");
			if( sr != null ) {
				var fileContents = sr.ReadToEnd();
				var vals = fileContents.Split(new char[] { ' ' });
				ChatOauth = vals[0];
				LogicOauth = vals[1];
				GameClientID = vals[2];
				RedirectLink = vals[3];
				launchGameLink = "https://api.twitch.tv/kraken/oauth2/authorize?response_type=token&client_id="+GameClientID+"&state="+"B+"+ChatChannelName+"+"+LogicChannelName+"&redirect_uri="+RedirectLink+"&scope=user_read+channel_read+chat_login";
				BitlyLink = vals[4];
				sr.Close();
			}
		}
		catch { }
	}
	public string GetLogicOauth() {
		LoadDebugOauths();

		if( LogicOauth == "" ) {
			#if UNITY_EDITOR
			EditorUtility.DisplayDialog( "Error!", 
				"In the Unity Editor, you included a TwitchGameLogicScriptChat component, but the field Logic Oauth isn't set to a valid Oauth.\n\nMake sure you have a separate twitch account for your logic channel, then get an Oauth for your logic channel here:\n\n http://www.twitchapps.com/tmi/ \n\nthen fill in that field.", 
				"Okay");
			#endif
		}

		return LogicOauth;
	}
	public string GetChatOauth() {
		LoadDebugOauths();

		if( ChatOauth == "" ) {
			#if UNITY_EDITOR
			EditorUtility.DisplayDialog( "Error!", 
				"In the Unity Editor, you included a TwitchGameLogicScriptChat component, but the field Chat Oauth isn't set to a valid Oauth.\n\nGet an Oauth for your chat channel here:\n\n http://www.twitchapps.com/tmi/ \n\nthen fill in that field.", 
				"Okay");
			#endif
		}

		return ChatOauth;
	}

	void InitIRCChat() {
		IRCChat = this.GetComponent<TwitchIRCChat>();
		//IRC.SendCommand("CAP REQ :twitch.tv/tags"); //register for additional data such as emote-ids, name color etc.

		IRCChat.messageRecievedEvent.AddListener(msg => {
			int msgIndex = msg.IndexOf("PRIVMSG #");
			string msgString = msg.Substring(msgIndex + ChatChannelName.Length + 11);
			string user = msg.Substring(1, msg.IndexOf('!') - 1);
			apgSys.LogChat( user, msgString );
		});

		IRCChat.SendMsg( "*** Chat Channel Initialized ***" );
	}

	public NetworkMessageHandler handlers;

	void InitIRCLogicChannel() {
		IRCLogic = this.GetComponent<TwitchIRCLogic>();
		
		IRCLogic.messageRecievedEvent.AddListener(msg => {
			int msgIndex = msg.IndexOf("PRIVMSG #");
			string msgString = msg.Substring(msgIndex + LogicChannelName.Length + 11);
			string user = msg.Substring(1, msg.IndexOf('!') - 1);

			Debug.Log( " " + msgString );

			handlers.Run( user, msgString );
		});

		IRCLogic.SendMsg( "*** Logic Channel Initialized ***" );
	}

	//_______________________________________________________

	public AudienceSysInterface GetAudienceSys() {
		return apgSys;
	}

	public void SetHandlers( NetworkMessageHandler _handlers ) {
		handlers = _handlers;
	}

	public void Start() {
		launchGameLink = "https://api.twitch.tv/kraken/oauth2/authorize?response_type=token&client_id="+GameClientID+"&state="+"B+"+ChatChannelName+"+"+LogicChannelName+"&redirect_uri="+RedirectLink+"&scope=user_read+channel_read+chat_login";

		Debug.Log( "HTML5 Client is launched for this game and this twitch account with the following URL: " + launchGameLink );
		Debug.Log( "Paste these specific URLs into Bitly for shortened URLs." );

		if( LogicChannelName == "" ) {
			#if UNITY_EDITOR
			EditorUtility.DisplayDialog( "Error!", 
				"In the Unity Editor, you included a TwitchGameLogicScriptChat component, but the field Logic Channel Name isn't set to a valid Twitch Account.  This will be used for network traffic.  Go register for a new account on Twitch if you don't have one.", 
				"Okay");
			#endif
		}
		if( ChatChannelName == "" ) {
			#if UNITY_EDITOR
			EditorUtility.DisplayDialog( "Error!", 
				"In the Unity Editor, you included a TwitchGameLogicScriptChat component, but the field Chat Channel Name isn't set to a valid Twitch Account.  This will be used for inviting players to join the game.  Go register for a new account on Twitch if you don't have one.", 
				"Okay");
			#endif
		}

		if( BitlyLink != "" ) {
			launchGameLink = BitlyLink;
		}

		gameLogic.Start( this, apgSys );
		InitIRCChat();
		InitIRCLogicChannel();
	}
	void Update() {
		apgSys.Update();
		gameLogic.Update(this, apgSys, maxPlayers );
	}
}