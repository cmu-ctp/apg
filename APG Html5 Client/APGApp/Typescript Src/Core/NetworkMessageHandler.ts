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

	Run(message: string): boolean {

		var msgTemp:string[] = message.split("###");
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

		var msgTemp: string[] = message.split("###");
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

		this.peerInputs[msgName](user, unparsedParms);
		return true;
	}
}