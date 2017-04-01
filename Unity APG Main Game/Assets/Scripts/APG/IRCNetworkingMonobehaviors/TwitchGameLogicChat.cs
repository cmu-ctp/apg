using UnityEngine;
using System;
using System.IO;
using APG;
#if UNITY_EDITOR
using UnityEditor;
#endif

[Serializable]
public class NetworkSettings {
	public string ChatOauth;
	public string LogicOauth;
	public string GameClientID;
	public string RedirectLink;
	public string BitlyLink;
}

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

	public string NetworkSettingPath;

	NetworkSettings settings = null;

	string launchAPGClientURL = "GAME LAUNCHING LINK NOT SET";

	TwitchIRCChat IRCChat;
	TwitchIRCLogic IRCLogic;

	//___________________________________________

	// Who should be in charge of this?
	AudiencePlayersSys apgSys = new AudiencePlayersSys();

	NetworkMessageHandler handlers;

	//___________________________________________

	public void SendMsg<T>( string msg, T parms ) {
		IRCLogic.SendMsg( msg+"###"+JsonUtility.ToJson(parms) );
	}

	public void SendChatText( string msg ) {
		IRCChat.SendMsg( msg );
	}

	public string LaunchAPGClientURL() {
		return launchAPGClientURL;
	}

	void LoadNetworkSettings() {
		if( settings != null ) {
			return;
		}

		settings = new NetworkSettings {LogicOauth = LogicOauth, ChatOauth = ChatOauth, GameClientID = GameClientID, RedirectLink = RedirectLink, BitlyLink = BitlyLink };

		try { 
			var sr = new StreamReader(Application.dataPath+"\\"+ NetworkSettingPath);
			if( sr != null ) {
				settings = JsonUtility.FromJson<NetworkSettings>( sr.ReadToEnd() );
				sr.Close();
			}
		}
		catch { }

		// Debug.Log( JsonUtility.ToJson( settings ) );

		launchAPGClientURL = "https://api.twitch.tv/kraken/oauth2/authorize?response_type=token&client_id="+settings.GameClientID+"&state="+"B+"+ChatChannelName+"+"+LogicChannelName+"&redirect_uri="+settings.RedirectLink+"&scope=user_read+channel_read+chat_login";

		if( settings.BitlyLink != "" ) {
			launchAPGClientURL = settings.BitlyLink;
		}

		Debug.Log( "HTML5 Client is launched for this game and this twitch account with the following URL: " + launchAPGClientURL );
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

	}
	public string GetLogicOauth() {
		LoadNetworkSettings();

		if( settings.LogicOauth == "" ) {
			#if UNITY_EDITOR
			EditorUtility.DisplayDialog( "Error!", 
				"In the Unity Editor, you included a TwitchGameLogicScriptChat component, but the field Logic Oauth isn't set to a valid Oauth.\n\nMake sure you have a separate twitch account for your logic channel, then get an Oauth for your logic channel here:\n\n http://www.twitchapps.com/tmi/ \n\nthen fill in that field.", 
				"Okay");
			#endif
		}

		return settings.LogicOauth;
	}
	public string GetChatOauth() {
		LoadNetworkSettings();

		if( settings.ChatOauth == "" ) {
			#if UNITY_EDITOR
			EditorUtility.DisplayDialog( "Error!", 
				"In the Unity Editor, you included a TwitchGameLogicScriptChat component, but the field Chat Oauth isn't set to a valid Oauth.\n\nGet an Oauth for your chat channel here:\n\n http://www.twitchapps.com/tmi/ \n\nthen fill in that field.", 
				"Okay");
			#endif
		}

		return settings.ChatOauth;
	}

	void InitIRCChat() {
		IRCChat = this.GetComponent<TwitchIRCChat>();
		//IRC.SendCommand("CAP REQ :twitch.tv/tags"); //register for additional data such as emote-ids, name color etc.

		IRCChat.messageRecievedEvent.AddListener(msg => {
			int msgIndex = msg.IndexOf("PRIVMSG #");
			string msgString = msg.Substring(msgIndex + ChatChannelName.Length + 11);
			string user = msg.Substring(1, msg.IndexOf('!') - 1);
			apgSys.RecordMostRecentChat( user, msgString );
		});

		IRCChat.SendMsg( "*** Chat Channel Initialized ***" );
	}

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

	public void SetHandlers( NetworkMessageHandler theHandlers ) {
		handlers = theHandlers;
	}

	public void Start() {
		InitIRCChat();
		InitIRCLogicChannel();
	}
	void Update() {
		apgSys.Update();
	}
}