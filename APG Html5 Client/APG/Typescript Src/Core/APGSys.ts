class APGSys {

	messages: APGSubgameMessageHandler;

	g: Phaser.Game;

	w: Phaser.World;

	JSONAssets: { any };

	network: NetworkInterface;

	constructor(g: Phaser.Game, logicIRCChannelName: string, playerName: string, chat: tmiClient, JSONAssets: any) {
		console.log("making apgsys");
		this.g = g;
		this.w = g.world;
		this.JSONAssets = JSONAssets;
		this.network = APGSys.makeNetworking(g.world, logicIRCChannelName, playerName, chat, () => this.messages);
	}

	private static makeNetworking(w: Phaser.World, logicIRCChannelName: string, playerName: string, chat: tmiClient, messages: () => APGSubgameMessageHandler): NetworkInterface {
		console.log("starting up " + chat);
		if (chat == null) {
			ConsoleOutput.debugWarn("Chat is null - defaulting to null networking.");
			return new NullNetwork(messages, w);
		}

		return new IRCNetwork(messages, playerName, logicIRCChannelName, chat, w);
	}
}