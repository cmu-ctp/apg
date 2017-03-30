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
		this.tick--;

		var m: APGSubgameMessageHandler = this.messages();
		if (this.waitingForJoinAcknowledgement) {
			if (m.onJoin() == true) {
				this.waitingForJoinAcknowledgement = false;
			}
			return;
		}

		if (this.tick == 0) {
			this.tick = secondsPerChoice * ticksPerSecond;
			this.round++;
			m.startInputSubmission();
			m.clientUpdate();
		}
		else if (this.tick <= (5 * ticksPerSecond) && this.tick % ticksPerSecond == 0) {
			m.timeUpdate(this.round, this.tick / ticksPerSecond);
		}
		else if (this.tick % (ticksPerSecond * 5) == 0) {
			m.timeUpdate(this.round, this.tick / ticksPerSecond);
		}
	}
}