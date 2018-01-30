// This system gets data whenever and however it does.
// During Update, it possibly advances the frame number.
// Add an onUpdate callback.
// And then there needs to be a way to get specific data.

class MetadataFullSys {

	currentFrame: number = 0;
	videoPlayer: any;

	onUpdateFunc: (metadataSys: MetadataFullSys) => void = null;

	canvas: any;
	vid: any;

	frameNumber: number;

	constructor(url: string, onConnectionComplete: () => void, onConnectionFail: (string) => void) {

		onConnectionComplete();

		this.canvas = document.createElement("canvas");
		this.canvas.width = 100;
		this.canvas.height = 100;

		this.vid = undefined;
	}

	public SetVideoPlayer(player: any): void {
		this.videoPlayer = player;
	}

	public Data<T>(msgName: string): T { return null; }

	SetVideoStream(): boolean {
		var thePlayer = this.videoPlayer;
		if (thePlayer == undefined) return false;
		var bridge = thePlayer._bridge;
		if (bridge == undefined) return false;
		var iframe = bridge._iframe;
		if (iframe == undefined) return false;
		var doc = iframe.contentWindow.document;
		if (doc == undefined) return false;
		var elements = doc.getElementsByClassName("player-video");
		if (elements == undefined) return false;
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

	public Update(): void {
		if (this.vid == undefined) {
			this.SetVideoStream();
		}

		if (this.vid != undefined) {
			this.canvas.getContext('2d').drawImage(this.vid, 0, 0, this.canvas.width, this.canvas.height, 0, 0, 100, 100);

			var bx = 16, by = 12, sx = 18, sy = 18;
			var ctx = this.canvas.getContext('2d');

			var frameNumber = 0;

			for (var j = 0; j < 4; j++) {
				for (var k = 0; k < 4; k++) {
					var pix = ctx.getImageData(bx + sx * j, by + sy * k, 1, 1).data[0];
					if (pix > 127) frameNumber |= 1 << (j + k * 4);
				}
			}
			console.log("" + frameNumber);
			this.frameNumber = frameNumber;
		}

		if (this.onUpdateFunc != null) {
			this.onUpdateFunc(this);
		}
	}
}