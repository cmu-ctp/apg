interface tmiClient {
	// These functions are actually returning promises.  Not sure how to express that in TS's type system.
	connect(): any;
	say(channel: string, message: string): any;
	on(evt: string, exec: Function): any;
}

class DelayedMessage {
    time: number;
    sender: string;
    message: string;
    next: DelayedMessage;
}

class IRCNetwork{

    disconnected: boolean;

	constructor(getHandlers: () => NetworkMessageHandler, player: string, logicChannelName: string, chat: tmiClient) {
		this.getHandlers = getHandlers;
		this.playerName = player;
		this.logicChannelName = logicChannelName;
		this.channelName = '#' + logicChannelName;
		this.chat = chat;
        if (chat != null) chat.on("chat", (channel: string, userstate: any, message: string, self: boolean): void => { this.lastReadMessageTime = this.tick; this.handleInputMessage(userstate.username, message); });
	}

	sendMessageToServer(message: string): void {
		this.writeToChat(message);
	}

    sendMessageLocally(delay: number, user: string, message: string): void {
        if (delay == 0) {
            this.handleInputMessage(user, message);
        }
        else {
            var msg: DelayedMessage = new DelayedMessage();
            msg.time = this.tick + delay * ticksPerSecond ;
            msg.sender = user;
            msg.message = message;

            if (this.localMessageHead== null) {
                this.localMessageHead = msg;
                msg.next = null;
            }
            else {
                var head: DelayedMessage = this.localMessageHead;
                var added: boolean = false;
                while (!added) {
                    if (head.next == null) {
                        head.next = msg;
                        msg.next = null;
                        added = true;
                    }
                    else if( head.next.time > msg.time ){
                        msg.next = head.next;
                        head.next = msg;
                        added = true;
                    }
                    else {
                        head = head.next;
                    }
                }
            }
        }
	}

    sendServerMessageLocally(delay: number, message): void {
        this.sendMessageLocally(delay, this.logicChannelName, message);
    }

    clearLocalMessages(): void {
        this.localMessageHead = null;
        this.tick = 0;
    }

	update( useKeepAlive:boolean ): void {
        this.lastSendMessageTime--;
        this.tick++;

		if (useKeepAlive && (this.tick % keepAliveTime == 0)) {
			this.sendMessageToServer("alive###{\"t\":" + (this.tick / keepAliveTime)+"}");
        }

        if (this.chat != null && this.tick - this.lastReadMessageTime > disconnectionTime) {
            this.disconnected = true;
        }
        else {
            this.disconnected = false;
        }

        while (this.localMessageHead != null && this.localMessageHead.time < this.tick ) {
            this.handleInputMessage(this.localMessageHead.sender, this.localMessageHead.message);
            this.localMessageHead = this.localMessageHead.next;
        }

		if (this.lastSendMessageTime <= 0 && this.messageQueue.length > 0) {

			var delayedMessage = this.messageQueue.shift();

			this.toggleSpace = !this.toggleSpace;
			if (this.chat != null) this.chat.say(this.channelName, delayedMessage + (this.toggleSpace ? ' ' : '  '));
			if (debugLogOutgoingIRCChat) {
				ConsoleOutput.debugLog(delayedMessage, "network");
			}
		}
	}

	//___________________________________________

	private chat: tmiClient;

	private channelName: string;
    private lastSendMessageTime: number = 0;
    private lastReadMessageTime: number = 0;
    private tick: number = 0;
	private messageQueue: string[] = [];

    private localMessageHead: DelayedMessage = null;

	private getHandlers: () => NetworkMessageHandler;
	private playerName: string;
	private logicChannelName: string;

	// Twitch refuses duplicate IRC Chat messages, which makes sense for chat, but is a problem for network updates.  This field toggles between appending one or two spaces to our message to avoid this filter.
	private toggleSpace: boolean = false;

	private handleInputMessage(userName: string, message: string): void {

		if (userName == this.playerName) return;

		if (debugLogIncomingIRCChat) {
			ConsoleOutput.debugLog(userName + " " + message, "network");
		}

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

	private writeToChat(s: string): void {

		if (this.lastSendMessageTime > 0) {
			if (this.messageQueue.length > maxBufferedIRCWrites) {
				ConsoleOutput.debugWarn("writeToChat: maxBufferedIRCWrites exceeded.  Too many messages have been queued.  Twitch IRC limits how often clients can post into IRC channels.");
				return;
			}
			this.messageQueue.push(s);
			return;
		}

		this.toggleSpace = !this.toggleSpace;
		if (this.chat != null) this.chat.say(this.channelName, s + (this.toggleSpace ? ' ' : '  '));
		if (debugLogOutgoingIRCChat) {
			ConsoleOutput.debugLog(s, "network");
		}
		this.lastSendMessageTime = IRCWriteDelayInSeconds * ticksPerSecond;
	}
}