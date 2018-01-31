/*
The APGSubgameMessageHandler is a set of functions that the networking system uses.
*/

class NetworkMessageHandler {

	private inputs: any = {};
	private peerInputs: any = {};

	constructor() {
		this.inputs = {};
		this.peerInputs = {};
	}

    public static JoinNetworkMessage(message: string, parms: string): string {
        return message + '###' + parms;
    }

	public static SplitNetworkMessage(joinedMessage: string): string[] {
        return joinedMessage.split("###");
    }


	Add<T>(msgName: string, handlerForServerMessage: (parmsForHandler: T) => void): NetworkMessageHandler {
		this.inputs[msgName] =
			function (s: string): void {
				var v: T = JSON.parse(s);
				handlerForServerMessage(v);
			}
		return this;
	}

	AddPeerMessage<T>(msgName: string, handlerForServerMessage: (user:string, parmsForHandler: T) => void): NetworkMessageHandler {
		this.peerInputs[msgName] =
			function (src:string, s: string): void {
				var v: T = JSON.parse(s);
				handlerForServerMessage(src, v);
			}
		return this;
	}

    AddString(msgName: string, handlerForServerMessage: (parmsForHandler: string) => void): NetworkMessageHandler {
        this.inputs[msgName] = handlerForServerMessage;
        return this;
    }


	Run(message: string): boolean {

        var msgTemp: string[] = NetworkMessageHandler.SplitNetworkMessage(message);
		if (msgTemp.length != 2) {
			ConsoleOutput.debugError("Bad Network Message: " + message, "network");
			return false;
		}
		var msgName: string = msgTemp[0];
		var unparsedParms: string = msgTemp[1];

		if (this.inputs[msgName] == undefined) {
			ConsoleOutput.debugError("Unknown Network Message: " + msgName + " with parameters " + unparsedParms, "network");
			return false;
		}

		this.inputs[msgName](unparsedParms);
		return true;
	}

	RunPeer(user:string, message: string): boolean {

        var msgTemp: string[] = NetworkMessageHandler.SplitNetworkMessage( message );
		if (msgTemp.length != 2) {
			ConsoleOutput.debugError("Bad Network Message: " + message, "network");
			return false;
		}
		var msgName: string = msgTemp[0];
		var unparsedParms: string = msgTemp[1];

		if (this.peerInputs[msgName] == undefined) {
			ConsoleOutput.debugError("Unknown Network Message: " + msgName + " with parameters " + unparsedParms, "network");
			return false;
		}

		this.peerInputs[msgName](user, unparsedParms);
		return true;
	}
}