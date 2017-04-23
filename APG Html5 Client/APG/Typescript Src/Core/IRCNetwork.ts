interface tmiClient {
	// These functions are actually returning promises.  Not sure how to express that in TS's type system.
	connect(): any;
	say(channel: string, message: string): any;
	on(evt: string, exec: Function): any;
}

class IRCNetwork{

	private chat: tmiClient;

	private channelName: string;
	private lastMessageTime: number = 0;
	private messageQueue: string[] = [];

	private getHandlers: () => NetworkMessageHandler;
	private playerName: string;
	private logicChannelName: string;

	private handleInputMessage(userName: string, message: string): void {

		if (userName == this.playerName) return;

		if (debugLogIncomingIRCChat) {
			ConsoleOutput.debugLog(userName + " " + message, "network");
		}

		console.log("testing " + userName + " vs " + this.logicChannelName);

		if (userName == this.logicChannelName) {
			var messageTemp: string[] = message.split("%%");
			for (var k = 0; k < messageTemp.length; k++) {
				this.getHandlers().Run(messageTemp[k]);
			}
		}
		else {
			var messageTemp: string[] = message.split("%%");
			for (var k = 0; k < messageTemp.length; k++) {
				this.getHandlers().RunPeer(userName, messageTemp[k]);
			}
		}
	}

	constructor(getHandlers: () => NetworkMessageHandler, player: string, logicChannelName: string, chat: tmiClient) {
		this.getHandlers = getHandlers;
		this.playerName = player;
		this.logicChannelName = logicChannelName;
		this.channelName = '#' + logicChannelName;
		this.chat = chat;
		if( chat != null )chat.on("chat", (channel: string, userstate: any, message: string, self: boolean): void => this.handleInputMessage(userstate.username, message));
	}

	sendMessageToServer<T>(message: string, parms: T): void {
		this.writeToChat(message+"###" + JSON.stringify( parms ));
	}

	sendMessageLocally<T>(user:string, message: string, parms: T): void {
		this.handleInputMessage(user, message + "###" + JSON.stringify(parms));
	}


	// Twitch refuses duplicate IRC Chat messages, which makes sense for chat, but is a problem for network updates.
	// This field toggles between appending one or two spaces to our message to avoid this filter.
	private toggleSpace: boolean = false;

	private writeToChat(s: string): void {

		if (this.lastMessageTime > 0) {
			if (this.messageQueue.length > maxBufferedIRCWrites) {
				ConsoleOutput.debugWarn( "writeToChat: maxBufferedIRCWrites exceeded.  Too many messages have been queued.  Twitch IRC limits how often clients can post into IRC channels." );
				return;
			}
			this.messageQueue.push(s);
			return;
		}

		this.toggleSpace = !this.toggleSpace;
		if( this.chat != null )this.chat.say(this.channelName, s + (this.toggleSpace ? ' ' : '  '));
		if (debugLogOutgoingIRCChat) {
			ConsoleOutput.debugLog(s, "network");
		}
		this.lastMessageTime = IRCWriteDelayInSeconds * ticksPerSecond;
	}

	update(): void {
		this.lastMessageTime--;

		if (this.lastMessageTime <= 0 && this.messageQueue.length > 0) {

			var delayedMessage = this.messageQueue.shift();

			this.toggleSpace = !this.toggleSpace;
			if (this.chat != null)this.chat.say(this.channelName, delayedMessage + (this.toggleSpace ? ' ':'  ' ) );
			if (debugLogOutgoingIRCChat) {
				ConsoleOutput.debugLog(delayedMessage, "network");
			}
		}
	}
}