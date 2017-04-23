class APGSys {

	g: Phaser.Game;

	w: Phaser.World;

	playerName: string;

	JSONAssets: { any };

	constructor(g: Phaser.Game, logicIRCChannelName: string, playerName: string, chat: tmiClient, JSONAssets: any) {

		this.g = g;
		this.w = g.world;
		this.JSONAssets = JSONAssets;
		this.playerName = playerName;
		this.network = new IRCNetwork(() => this.handlers, playerName, logicIRCChannelName, chat);
	}

	update(): void {
		this.network.update();
	}

	WriteToServer<T>(msgName: string, parmsForMessageToServer: T): void {
		this.network.sendMessageToServer(msgName, parmsForMessageToServer);
	}

	SetHandlers(theHandlers: NetworkMessageHandler): void {
		this.handlers = theHandlers;
	}

	//____________________________________________________

	private handlers: NetworkMessageHandler;

	private network: IRCNetwork;

}