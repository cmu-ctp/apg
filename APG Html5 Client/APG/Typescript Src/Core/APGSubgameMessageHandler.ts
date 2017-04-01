/*
The APGSubgameMessageHandler is a set of functions that the networking system uses.
*/

class APGSubgameMessageHandler {

	private inputs: any = {};

	constructor() {
		this.inputs = {};
	}

	add<T>(msgName: string, handlerForServerMessage: (parmsForHandler: T) => void): APGSubgameMessageHandler {
		this.inputs[msgName] =
			function (s: string): void {
				var v: T = JSON.parse(s);
				handlerForServerMessage(v);
			}
		return this;
	}

	run(message: string): boolean {
		var msgTemp = message.split("###");
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
}