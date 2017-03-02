class IRCNetwork implements NetworkInterface {

// Server Messages:
// Join acknowledge
// time update
// submit please
// game update

// Client messages:
// Join Please
// Here is my update

	private chat: tmiClient;

	private channelName: string;
	private lastMessageTime: number = 0;
	private messageQueue: string[] = [];

	// don't need to pass in password.  Or onInitSuccess.  Or gameClient.
	constructor( messages: () => APGSubgameMessageHandler, player: string, logicChannelName: string, chat:tmiClient ) {
		var waitingForJoinAcknowledgement: boolean = true;
		this.channelName = '#'+logicChannelName;

		var src: IRCNetwork = this;
		chat.on("chat", function (channel: string, userstate: any, message: string, self: boolean): void {

			if (self) return;

			if (debugLogIncomingIRCChat) {
				ConsoleOutput.debugLog(channel + " " + userstate.username + " " + message, "network");
			}
			
			if (userstate.username == logicChannelName) {

				var msg = message.split(' ');

				if (msg[0] == 'join') {
					var joinName = msg[1];
					if (waitingForJoinAcknowledgement && joinName == player) {
						waitingForJoinAcknowledgement = false;
						messages().onJoin();
					}
				}
				else if (msg[0] == 't') {
					messages().timeUpdate(parseInt(msg[2]), parseInt(msg[1]));
				}
				else if (msg[0] == 's') {
					var m: APGSubgameMessageHandler = messages();

					m.startInputSubmission();

					var choiceMsg: string = "upd ";
					for (var k: number = 0; k < m.getParmCount(); k++)choiceMsg += " " + m.getParm(k);

					src.writeToChat(choiceMsg);
				}
				else if (msg[0] == 'u') {
					//alert(" *" + channel + "* " + userstate.username + " ::: " + message);
				}
			}
			else {
				// var m: MessageHandler = messages();
			}
		});
		this.chat = chat;
	}

	join(): void { this.writeToChat("join"); }

	debugChat(s: string): void { this.writeToChat(s); }

	writeToChat(s: string): void {
		if (this.lastMessageTime > 0) {
			if (this.messageQueue.length > maxBufferedIRCWrites) {
				ConsoleOutput.debugWarn( "writeToChat: maxBufferedIRCWrites exceeded.  Too many messages have been queued.  Twitch IRC limits how often clients can post into IRC channels." );
				return;
			}
			this.messageQueue.push(s);
			return;
		}
		this.chat.say(this.channelName, s);
		if (debugLogOutgoingIRCChat) {
			ConsoleOutput.debugLog(s, "network");
		}
		this.lastMessageTime = IRCWriteDelayInSeconds * ticksPerSecond;
	}

	update(): void {
		this.lastMessageTime--;

		if (this.lastMessageTime <= 0 && this.messageQueue.length > 0) {

			var delayedMessage = this.messageQueue.shift();

			this.chat.say(this.channelName, delayedMessage );
			if (debugLogOutgoingIRCChat) {
				ConsoleOutput.debugLog(delayedMessage, "network");
			}
		}
	}
}