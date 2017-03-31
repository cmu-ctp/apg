class NullNetwork implements NetworkInterface {

	private tick: number = secondsPerChoice * ticksPerSecond;

	private round: number = 1;

	private waitingForJoinAcknowledgement: boolean = true;

	private messages: () => APGSubgameMessageHandler;

	constructor(messages: () => APGSubgameMessageHandler, w: Phaser.World) {
		this.messages = messages;
		new ent(w, 0, 0, '', { upd: e => { this.update(); } });
	}

	join(): void { }

	debugChat(s: string): void { }

	update(): void {
		
	}
}