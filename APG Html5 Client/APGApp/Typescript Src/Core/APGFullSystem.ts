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
        if (msgName == "") {
            ConsoleOutput.debugWarn("APGFullSystem.WriteToServer : ", "sys");
            return;
        }
        if (parmsForMessageToServer == null) {
            ConsoleOutput.debugWarn("APGFullSystem.WriteToServer : ", "sys");
            return;
        }

		this.network.sendMessageToServer(msgName, parmsForMessageToServer);
	}

    WriteLocalAsServer<T>(msgName: string, parmsForMessageToServer: T): void {
        if (msgName == "") {
            ConsoleOutput.debugWarn("APGFullSystem.WriteLocalAsServer : ", "sys");
            return;
        }
        if (parmsForMessageToServer == null) {
            ConsoleOutput.debugWarn("APGFullSystem.WriteLocalAsServer : ", "sys");
            return;
        }

		this.network.sendServerMessageLocally(msgName, parmsForMessageToServer);
	}

    WriteLocal<T>(user: string, msgName: string, parmsForMessageToServer: T): void {

        if (user == "") {
            ConsoleOutput.debugWarn("APGFullSystem.WriteLocal : ", "sys");
            return;
        }
        if (msgName == "") {
            ConsoleOutput.debugWarn("APGFullSystem.WriteLocal : ", "sys");
            return;
        }
        if (parmsForMessageToServer == null) {
            ConsoleOutput.debugWarn("APGFullSystem.WriteLocal : ", "sys");
            return;
        }

		this.network.sendMessageLocally(user, msgName, parmsForMessageToServer);
	}

	ResetServerMessageRegistry(): APGSys { this.handlers = new NetworkMessageHandler(); return this; }

    Register<T>(msgName: string, handlerForServerMessage: (parmsForHandler: T) => void): APGSys {

        if (msgName == "") {
            ConsoleOutput.debugWarn("APGFullSystem.Register : ", "sys");
            return;
        }
        if (handlerForServerMessage == null) {
            ConsoleOutput.debugWarn("APGFullSystem.Register : ", "sys");
            return;
        }

		this.handlers.Add<T>(msgName, handlerForServerMessage);
		return this;
	}

    RegisterPeer<T>(msgName: string, handlerForServerMessage: (user: string, parmsForHandler: T) => void): APGSys {

        if (msgName == "") {
            ConsoleOutput.debugWarn("APGFullSystem.RegisterPeer : ", "sys");
            return;
        }
        if (handlerForServerMessage == null) {
            ConsoleOutput.debugWarn("APGFullSystem.RegisterPeer : ", "sys");
            return;
        }

		this.handlers.AddPeerMessage<T>(msgName, handlerForServerMessage);
		return this;
	}

	//____________________________________________________

	private handlers: NetworkMessageHandler;

	private network: IRCNetwork;

}