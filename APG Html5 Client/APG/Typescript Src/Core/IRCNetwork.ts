interface tmiClient {
	// These functions are actually returning promises.  Not sure how to express that in TS's type system.
	connect(): any;
	say(channel: string, message: string): any;
	on(evt: string, exec: Function): any;
}

class IRCNetwork{

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

	constructor(getHandlers: () => APGSubgameMessageHandler, player: string, logicChannelName: string, chat: tmiClient, w: Phaser.World ) {
		this.channelName = '#'+logicChannelName;

		var src: IRCNetwork = this;

		chat.on("chat", function (channel: string, userstate: any, message: string, self: boolean): void {

			if (self) return;

			if (debugLogIncomingIRCChat) {
				ConsoleOutput.debugLog(channel + " " + userstate.username + " " + message, "network");
			}

			if (userstate.username == logicChannelName) {
				getHandlers().run( message );
			}
			else {
			}
		});
		this.chat = chat;
	}

	sendMessageToServer<T>(msg: string, parms: T): void {
		this.writeToChat(msg+"###" + JSON.stringify( parms ));
	}

	private writeToChat(s: string): void {

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