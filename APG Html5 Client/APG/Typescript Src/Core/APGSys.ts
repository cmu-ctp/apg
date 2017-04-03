class APGSys {

	handlers: APGSubgameMessageHandler;

	g: Phaser.Game;

	w: Phaser.World;

	playerName: string;

	JSONAssets: { any };

	private network: IRCNetwork;

	constructor(g: Phaser.Game, logicIRCChannelName: string, playerName: string, chat: tmiClient, JSONAssets: any) {

		this.g = g;
		this.w = g.world;
		this.JSONAssets = JSONAssets;
		this.playerName = playerName;
		this.network = new IRCNetwork(() => this.handlers, playerName, logicIRCChannelName, chat, this.w);
	}

	update(): void {
		this.network.update();
	}

	sendMessageToServer<T>(msgName: string, parmsForMessageToServer: T): void {
		this.network.sendMessageToServer(msgName, parmsForMessageToServer);
	}
}