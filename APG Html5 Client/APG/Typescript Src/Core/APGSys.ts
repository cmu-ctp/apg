class APGSys {

	messages: APGSubgameMessageHandler;

	g: Phaser.Game;

	w: Phaser.World;

	JSONAssets: { any };

	network: NetworkInterface;

	constructor(g: Phaser.Game, logicIRCChannelName: string, playerName: string, chat: tmiClient, JSONAssets:any ) {
		this.g = g;
		this.w = g.world;
		this.JSONAssets = JSONAssets;
		this.network = APGSys.makeNetworking(g.world, logicIRCChannelName, playerName, chat, () => this.messages);
	}

	private static makeNetworking(w: Phaser.World, logicIRCChannelName: string, playerName: string, chat: tmiClient, messages: () => APGSubgameMessageHandler): NetworkInterface {
		if (chat == null) {
			return new NullNetwork(messages, w);
		}

		return new IRCNetwork(messages, playerName, logicIRCChannelName, chat);
	}
}