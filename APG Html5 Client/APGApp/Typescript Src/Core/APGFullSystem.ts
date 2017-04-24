class APGFullSystem implements APGSys {

	g: Phaser.Game;

	playerName: string;

	JSONAssets: { any };

	constructor(g: Phaser.Game, logicIRCChannelName: string, playerName: string, chat: tmiClient, JSONAssets: any) {

		this.g = g;
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

	ResetServerMessageRegistry(): APGSys { this.handlers = new NetworkMessageHandler(); return this; }

	Register<T>(msgName: string, handlerForServerMessage: (parmsForHandler: T) => void ): APGSys {
		this.handlers.Add<T>(msgName, handlerForServerMessage);
		return this;
	}

	RegisterPeer<T>(msgName: string, handlerForServerMessage: (user: string, parmsForHandler: T) => void): APGSys {
		this.handlers.AddPeerMessage<T>(msgName, handlerForServerMessage);
		return this;
	}

	//____________________________________________________

	private handlers: NetworkMessageHandler;

	private network: IRCNetwork;

}