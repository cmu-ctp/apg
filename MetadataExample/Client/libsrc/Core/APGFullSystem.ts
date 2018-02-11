class APGFullSystem implements APGSys {

    disconnected: boolean;

    networkTestSequence: boolean;

	g: Phaser.Game;

	w: Phaser.Group;

    playerName: string;

    allowFullScreen: boolean;

    useKeepAlive: boolean;

	JSONAssets: { any };

	metadata: MetadataFullSys;

	constructor(g: Phaser.Game, logicIRCChannelName: string, playerName: string, chat: tmiClient, JSONAssets: any, networkTestSequence:boolean, allowFullScreen:boolean, metadataSys:MetadataFullSys ) {
		this.g = g;
		this.w = new Phaser.Group(g);
		g.world.add(this.w);
		this.JSONAssets = JSONAssets;
		this.metadata = metadataSys;
		metadataSys.SetGetHandlers(() => this.handlers);
		metadataSys.InitSettingsMenu( this );
        if (playerName == "") playerName = "ludolab";
        this.useKeepAlive = false;
        this.playerName = playerName;
        this.allowFullScreen = allowFullScreen;
        this.networkTestSequence = networkTestSequence;
		this.network = new IRCNetwork(() => this.handlers, playerName, logicIRCChannelName, chat);
	}

    SetKeepAliveStatus(val: boolean): APGSys {
        this.useKeepAlive = val;
        return this;
    }

	update(): void {
        this.network.update( this.useKeepAlive );
        // under what conditions shouldn't the disconnect function be called?
        if (this.disconnected == false && this.network.disconnected == true && this.onDisconnect != null) this.onDisconnect();
		this.disconnected = this.network.disconnected;
		this.metadata.Update( this.g.input.activePointer );
	}

    CheckMessageParameters<T>(funcName: string, message: string, parmsForMessageToServer: T): boolean {
        if (message == "") {
            ConsoleOutput.debugWarn("APGFullSystem." + funcName + ": Missing message name", "sys");
            return false;
        }
        if (parmsForMessageToServer == null) {
            ConsoleOutput.debugWarn("APGFullSystem." + funcName + ": Missing message parameters ", "sys");
            return false;
        }
        return true;
    }

    CheckMessageRegisterFunction<T>(funcName: string, message: string, funcForMessageFromServer: T): boolean {
        if (message == "") {
            ConsoleOutput.debugWarn("APGFullSystem." + funcName + ": Missing message name", "sys");
            return false;
        }
        if (funcForMessageFromServer == null) {
            ConsoleOutput.debugWarn("APGFullSystem." + funcName + ": Missing function", "sys");
            return false;
        }
        return true;
    }

    WriteToServer<T>( message: string, parmsForMessageToServer: T): void {
        if (!this.CheckMessageParameters("WriteToServer", message, parmsForMessageToServer)) return;

        this.network.sendMessageToServer(NetworkMessageHandler.JoinNetworkMessage( message, JSON.stringify(parmsForMessageToServer)));
	}

    WriteStringToServer(message: string, parmsForMessageToServer: string): void {
        if (!this.CheckMessageParameters("WriteStringToServer", message, parmsForMessageToServer)) return;

		this.network.sendMessageToServer(NetworkMessageHandler.JoinNetworkMessage( message, parmsForMessageToServer));
    }


    WriteLocalAsServer<T>(delay: number, message: string, parmsForMessageToServer: T): void {
        if (!this.CheckMessageParameters("WriteLocalAsServer", message, parmsForMessageToServer)) return;

		this.network.sendServerMessageLocally(delay, NetworkMessageHandler.JoinNetworkMessage( message, JSON.stringify(parmsForMessageToServer) ));
	}

    WriteLocalStringAsServer(delay: number, message: string, parmsForMessageToServer: string): void {
        if (!this.CheckMessageParameters("WriteLocalStringAsServer", message, parmsForMessageToServer)) return;

		this.network.sendServerMessageLocally(delay, NetworkMessageHandler.JoinNetworkMessage( message, parmsForMessageToServer ));
    }


    WriteLocal<T>( delay:number, user: string, message: string, parmsForMessageToServer: T): void {

        if (user == "") {
            ConsoleOutput.debugWarn("APGFullSystem.WriteLocal : ", "sys");
            return;
        }
        if (!this.CheckMessageParameters("WriteLocal", message, parmsForMessageToServer)) return;
        
		this.network.sendMessageLocally(delay, user, NetworkMessageHandler.JoinNetworkMessage( message, JSON.stringify(parmsForMessageToServer)) );
    }

    ClearLocalMessages(): void {
        this.network.clearLocalMessages();
    }

    ResetServerMessageRegistry(): APGSys { this.handlers = new NetworkMessageHandler(); this.onDisconnect = null; return this; }

    Register<T>(message: string, handlerForServerMessage: (parmsForHandler: T) => void): APGSys {
        if (!this.CheckMessageRegisterFunction("Register", message, handlerForServerMessage)) return this;

		this.handlers.Add<T>(message, handlerForServerMessage);
		return this;
	}

    RegisterPeer<T>(message: string, handlerForServerMessage: (user: string, parmsForHandler: T) => void): APGSys {
        if (!this.CheckMessageRegisterFunction("RegisterPeer", message, handlerForServerMessage)) return this;

		this.handlers.AddPeerMessage<T>(message, handlerForServerMessage);
		return this;
	}

    RegisterString(message: string, handlerForServerMessage: (parmsForHandler: string) => void): APGSys {
        if (!this.CheckMessageRegisterFunction("RegisterString", message, handlerForServerMessage)) return this;

        this.handlers.AddString(message, handlerForServerMessage);
        return this;
    }

    RegisterDisconnect(disconnectFunc: () => void): APGSys {
        this.onDisconnect = disconnectFunc;
        return this;
    }

	public Metadata<T>(msgName: string): T { return this.metadata.Data<T>(msgName); }

	//____________________________________________________

    private handlers: NetworkMessageHandler;
    private onDisconnect: () => void;

	private network: IRCNetwork;

}