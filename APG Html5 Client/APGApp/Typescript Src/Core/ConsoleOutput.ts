
class ConsoleOutput {
	static error(s: string, tag: string = "") {
		console.error("Error: " + s);

		if (debugErrorsAsAlerts) {
			alert("Error: " + s);
		}
	}
	static warn(s: string, tag: string = "") {
		console.warn("Warning: " + s);
	}
	static info(s: string, tag: string = "") {
		console.info(s);
	}
	static log(s: string, tag: string = "") {
		console.log(s);
	}
	static debugError(s: string, tag: string = "") {
		if (!debugPrintMessages) return;

		console.error("Error: " + s);

		if (debugErrorsAsAlerts) {
			alert("Error: " + s);
		}
	}
	static debugWarn(s: string, tag: string = "") {
		if (!debugPrintMessages) return;

		console.warn( "Warning: " + s);
	}
	static debugInfo(s: string, tag: string = "") {
		if (!debugPrintMessages) return;

		console.info(s);
	}
	static debugLog(s: string, tag: string = "") {
		if (!debugPrintMessages) return;

		console.log(s);
	}

	static logAsset(s: string, tag: string = "") {
		if (!debugShowAssetMessages) return;

		console.log( "Successfully loaded " + s );
	}
}
