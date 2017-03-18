using UnityEngine;
using System.IO;
using System.Collections.Generic;
using System;
using APG;
using UnityEditor;

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

	public void RequestPlayersUpdate() {
		IRCLogic.SendMsg("s");
	}
	public void UpdateTime( int time, int roundNumber ) {
		IRCLogic.SendMsg( "t " + time + " " + roundNumber );
	}
	public void UpdatePlayer( string key, string updateString ) {
		IRCLogic.SendMsg("u "+key+" "+updateString);
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

		if( LogicOauth == "" )
			EditorUtility.DisplayDialog( "Error!", 
				"In the Unity Editor, you included a TwitchGameLogicScriptChat component, but the field Logic Oauth isn't set to a valid Oauth.\n\nMake sure you have a separate twitch account for your logic channel, then get an Oauth for your logic channel here:\n\n http://www.twitchapps.com/tmi/ \n\nthen fill in that field.", 
				"Okay");

		return LogicOauth;
	}
	public string GetChatOauth() {
		LoadDebugOauths();

		if( ChatOauth == "" )
			EditorUtility.DisplayDialog( "Error!", 
				"In the Unity Editor, you included a TwitchGameLogicScriptChat component, but the field Chat Oauth isn't set to a valid Oauth.\n\nGet an Oauth for your chat channel here:\n\n http://www.twitchapps.com/tmi/ \n\nthen fill in that field.", 
				"Okay");

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

	Dictionary<string, Action<string, string[]>> clientCommands = new Dictionary<string, Action<string, string[]>>();

	// what messages can come from clients?
	void InitIRCLogicChannel() {
		IRCLogic = this.GetComponent<TwitchIRCLogic>();
		
		IRCLogic.messageRecievedEvent.AddListener(msg => {
			int msgIndex = msg.IndexOf("PRIVMSG #");
			string msgString = msg.Substring(msgIndex + LogicChannelName.Length + 11);
			string user = msg.Substring(1, msg.IndexOf('!') - 1);

			var fullMsg = msgString.Split(new char[] { ' ' });
			/*if(clientCommands.ContainsKey(fullMsg[0]) == true) {
				clientCommands[fullMsg[0]](user, fullMsg );
			}*/

			if(fullMsg[0] == "join") {
				// need game logic to determine if this player should be allowed to join
				// need multiple ways to join, too - join in different roles
				if( apgSys.AddPlayer(user ))IRCLogic.SendMsg("join "+user);
			}
			if(fullMsg[0] == "upd") {
				// need a better way to handle updates - different kinds of update types?  json-esque?
				var parms = new List<int>();
				for(var k = 1; k < fullMsg.Length; k++) parms.Add(Int32.Parse(fullMsg[k]));
				apgSys.SetPlayerInput( user, parms );
			}
			// register these as a dictionary instead?
			// need a way add a custom handler for unrecognized messages
		});

		/*clientCommands["join"] = (user, fullMsg) =>{
			// need game logic to determine if this player should be allowed to join
			// need multiple ways to join, too - join in different roles
			if( apgSys.AddPlayer( user ))IRCLogic.SendMsg("join "+user);
		};
		clientCommands["upd"] = (user, fullMsg) => {
			var parms = new List<int>();
			for(var k = 1; k < fullMsg.Length; k++) parms.Add(Int32.Parse(fullMsg[k]));
			apgSys.SetPlayerInput( user, parms );
		};*/

		IRCLogic.SendMsg( "*** Logic Channel Initialized ***" );
	}

	//_______________________________________________________

	public AudienceSysInterface GetAudienceSys() {
		return apgSys;
	}
	public void Start() {
		launchGameLink = "https://api.twitch.tv/kraken/oauth2/authorize?response_type=token&client_id="+GameClientID+"&state="+"B+"+ChatChannelName+"+"+LogicChannelName+"&redirect_uri="+RedirectLink+"&scope=user_read+channel_read+chat_login";

		Debug.Log( "HTML5 Client is launched for this game and this twitch account with the following URL: " + launchGameLink );
		Debug.Log( "Paste these specific URLs into Bitly for shortened URLs." );

		if( LogicChannelName == "" )
			EditorUtility.DisplayDialog( "Error!", 
				"In the Unity Editor, you included a TwitchGameLogicScriptChat component, but the field Logic Channel Name isn't set to a valid Twitch Account.  This will be used for network traffic.  Go register for a new account on Twitch if you don't have one.", 
				"Okay");
		if( ChatChannelName == "" )
			EditorUtility.DisplayDialog( "Error!", 
				"In the Unity Editor, you included a TwitchGameLogicScriptChat component, but the field Chat Channel Name isn't set to a valid Twitch Account.  This will be used for inviting players to join the game.  Go register for a new account on Twitch if you don't have one.", 
				"Okay");

		if( BitlyLink != "" ) {
			launchGameLink = BitlyLink;
		}

		gameLogic.Start();
		InitIRCChat();
		InitIRCLogicChannel();
	}
	void Update() {
		apgSys.Update();
		gameLogic.Update(this, apgSys, maxPlayers );
	}
}