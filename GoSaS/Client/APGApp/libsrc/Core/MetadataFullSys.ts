// This system gets data whenever and however it does.
// During Update, it possibly advances the frame number.
// Add an onUpdate callback.
// And then there needs to be a way to get specific data.

class MetadataFullSys {
	videoPlayer: any;
	canvas: any;
	vid: any;

	frameNumber: number = 0;

	useLocalTestNetworking: boolean;
	forceMetadataFrames: boolean;

	fileReadTime: number = 0;
	curFile: number = 1;
	frameStorage: {} = {};

	getHandlers: () => NetworkMessageHandler = null;

	constructor(useMetadata: boolean, url: string, onConnectionComplete: () => void, onConnectionFail: (string) => void, useLocalTestNetworking:boolean, forceMetadataFrames:boolean ) {

		this.useLocalTestNetworking = useLocalTestNetworking;
		this.forceMetadataFrames = forceMetadataFrames;

		onConnectionComplete();

		this.canvas = document.createElement("canvas");
		this.canvas.width = 100;
		this.canvas.height = 100;
		this.vid = undefined;
	}

	public SetGetHandlers(func: () => NetworkMessageHandler): void {
		this.getHandlers = func;
	}

	public SetVideoPlayer(player: any): void {
		this.videoPlayer = player;
	}

	public Data<T>(msgName: string): T {
		var j = this.frameStorage[this.frameNumber];
		if (j != null) {
			for (var k = 0; k < j.length; k++) {
				if (j[k][0] == msgName) {
					return JSON.parse(j[k][1]);
				}
			}
		}
		return null;
	}

	InitError(message: string): void {
		//console.log("Metadata Error: Couldn't find " + message);
		alert("Metadata Error: Couldn't find " + message);
	}

	SetVideoStream(): boolean {
		var thePlayer = this.videoPlayer;
		if (thePlayer == undefined) {
			this.InitError("video player div");
			return false;
		}
		var bridge = thePlayer._bridge;
		if (bridge == undefined) {
			this.InitError("video player div bridge component");
			return false;
		}
		var iframe = bridge._iframe;
		if (iframe == undefined) {
			this.InitError("video iframe");
			return false;
		}
		var doc = iframe.contentWindow.document;
		if (doc == undefined) {
			this.InitError("video iframe document");
			return false;
		}
		var elements = doc.getElementsByClassName("player-video");
		if (elements == undefined) {
			this.InitError("player-video");
			return false;
		}
		for (var j = 0; j < elements.length; j++) {
			var player = elements[j];
			if (player != undefined && player.children != null && player.children.length > 0) {
				for (var k = 0; k < player.children.length; k++) {
					var inner = player.children[k];
					if (inner.className == "js-ima-ads-container ima-ads-container") continue;
					if (inner.localName != "video") continue;
					this.vid = inner;
					return true;
				}
			}
		}
		return false;
	}

	readTextFile(file) {
		var that = this;
		var rawFile = new XMLHttpRequest();
		rawFile.open("GET", file, false);
		rawFile.onreadystatechange = function () {
			if (rawFile.readyState === 4) {
				if (rawFile.status === 404) {
					//alert("fail!");
				}
				if (rawFile.status === 200 || rawFile.status == 0) {
					var allText = rawFile.responseText;
					var t = allText.split('\n');
					for ( let v of t ){
						var s = v.split('~');
						var frame = s[0];
						if (that.frameStorage[frame] == null) that.frameStorage[frame] = [];
						that.frameStorage[frame].push([s[1],s[2]]);
					}
				}
			}
		}
		rawFile.send(null);
	}

	public Update(): void {
		if (this.useLocalTestNetworking) {
			this.fileReadTime++;
			if (this.fileReadTime >= 30) {
				this.readTextFile("TestTraffic/test" + this.curFile + ".txt");
				this.fileReadTime = 0;
			}
		}

		if (this.vid == undefined) {
			this.SetVideoStream();
		}

		var frameNumber = 0;

		if (this.forceMetadataFrames) {
			frameNumber = this.frameNumber + 1;
			console.log("Debug Forcing Frame " + frameNumber);
		}
		else if (this.vid != undefined) {
			this.canvas.getContext('2d').drawImage(this.vid, 0, 0, this.canvas.width, this.canvas.height, 0, 0, 100, 100);

			var bx = 16, by = 12, sx = 18, sy = 18;
			var ctx = this.canvas.getContext('2d');

			for (var j = 0; j < 4; j++) {
				for (var k = 0; k < 4; k++) {
					var pix = ctx.getImageData(bx + sx * j, by + sy * k, 1, 1).data[0];
					if (pix > 127) frameNumber |= 1 << (j + k * 4);
				}
			}
			//console.log("" + frameNumber);
			console.log("Via binary encoding, extracted frame number " + frameNumber);
		}

		if (frameNumber != 0) {
			if (frameNumber != this.frameNumber && this.frameStorage[frameNumber] != null && this.frameStorage[frameNumber] != undefined && this.getHandlers != null) {
				var handlers = this.getHandlers();
				var r: any = this.frameStorage[frameNumber];
				for (var k = 0; k < r.length; k++) {
					handlers.Run(NetworkMessageHandler.JoinNetworkMessage(r[k][0], r[k][1]));
				}
			}
			this.frameNumber = frameNumber;
			this.curFile = Math.floor(this.frameNumber / 60) + 3;
		}
	}
}