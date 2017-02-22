// Server Messages:
// Join acknowledge
// time update
// submit please
// game update

// Client messages:
// Join Please
// Here is my update

interface tmiClient {
	// These functions are actually returning promises.  Not sure how to express that in TS's type system.
	connect(): any;
	say(channel: string, message: string): any;
	on(evt: string, exec: Function): any;
}
interface tmiIFace { client(options: Object): void; }
declare var tmi: tmiIFace;

//_____________________________________________________________________________________________

interface NetworkInterface {
	join(): void;
	update(): void;
	debugChat( s:string ): void;
}

class NullNetwork implements NetworkInterface {
	private tick: number = secondsPerChoice * ticksPerSecond;
	private round: number = 1;
	private waitingForJoinAcknowledgement: boolean = true;
	private messages: ()=>MessageHandler;
	constructor(messages: () => MessageHandler, w: Phaser.World) {
		this.messages = messages;
		new Ent(w, 0, 0, '', { upd: e => { this.update(); } });
	}
	join(): void { }
	debugChat( s:string ): void { }
	update(): void {
		this.tick--;
		var m: MessageHandler = this.messages();
		if (this.waitingForJoinAcknowledgement) {
			if (m.onJoin() == true) {
				this.waitingForJoinAcknowledgement = false;
			}
			return;
		}
		if (this.tick == 0) {
			this.tick = secondsPerChoice * ticksPerSecond;
			this.round++;
			m.startSubmitInput();
			m.clientUpdate();
		}
		else if (this.tick <= (5 * ticksPerSecond) && this.tick % ticksPerSecond == 0) { m.timeUpdate(this.round, this.tick / ticksPerSecond); }
		else if (this.tick % (ticksPerSecond * 5) == 0) { m.timeUpdate(this.round, this.tick / ticksPerSecond); }
	}
}

class IRCNetwork implements NetworkInterface {
	private chat: tmiClient;
	private channelName: string;

	// don't need to pass in password.  Or onInitSuccess.  Or gameClient.
	constructor( messages: () => MessageHandler, player: string, logicChannelName: string, chat:tmiClient ) {

		var waitingForJoinAcknowledgement: boolean = true;

		this.channelName = '#'+logicChannelName;

		chat.on("chat", function (channel: string, userstate: any, message: string, self: boolean): void {
			if (self) return;
			if (userstate.username == logicChannelName) {
				var msg = message.split(' ');
				if (msg[0] == 'join') {
					var joinName = msg[1];
					if (waitingForJoinAcknowledgement && joinName == player) {
						waitingForJoinAcknowledgement = false;
						messages().onJoin();
					}
				}
				else if (msg[0] == 't') { messages().timeUpdate(parseInt(msg[2]), parseInt(msg[1])); }
				else if (msg[0] == 's') {
					var m: MessageHandler = messages();
					m.startSubmitInput();
					var choiceMsg: string = "upd ";
					for (var k: number = 0; k < m.getParmCount(); k++)choiceMsg += " " + m.getParm(k);
					chat.say(logicChannelName, choiceMsg);
				}
				else if (msg[0] == 'u') {
					//alert(" *" + channel + "* " + userstate.username + " ::: " + message);
				}
			}
			else {
				var m: MessageHandler = messages();
			}
		});
		this.chat = chat;
	}
	join(): void { this.chat.say(this.channelName, "join"); }
	debugChat( s:string ): void { this.chat.say(this.channelName, s ); }
	update(): void { }
}