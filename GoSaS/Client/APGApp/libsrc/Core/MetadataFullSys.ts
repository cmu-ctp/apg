// This system gets data whenever and however it does.
// During Update, it possibly advances the frame number.
// Add an onUpdate callback.
// And then there needs to be a way to get specific data.

class MetadataFullSys {
	inUse: boolean;

	videoPlayer: any;
	canvas: any;
	vid: any;

	frameNumber: number = 0;

	useLocalTestNetworking: boolean;
	forceMetadataFrames: boolean;

	fileReadTime: number = 0;
	curFile: number = 1;
	frameStorage: {} = {};

/*	binaryPixelLeft: number = 16;
	binaryPixelTop: number = 12;
	binaryPixelWidth: number = 18;
	binaryPixelHeight: number = 18;*/

	binaryPixelLeft: number = 16;
	binaryPixelTop: number = 12;
	binaryPixelWidth: number = 18;
	binaryPixelHeight: number = 18;

	videoDestWidth: number;
	videoDestHeight: number;

	pixelExamineWidth: number = 200;
	pixelExamineHeight: number = 200;

	static binaryEncodingRows: number = 4;
	static binaryEncodingColumns: number = 4;

	getHandlers: () => NetworkMessageHandler = null;

	constructor(useMetadata: boolean, width: number, height: number, url: string, onConnectionComplete: () => void, onConnectionFail: (string) => void, useLocalTestNetworking:boolean, forceMetadataFrames:boolean ) {
		this.inUse = useMetadata;

		this.useLocalTestNetworking = useLocalTestNetworking;
		this.forceMetadataFrames = forceMetadataFrames;

		this.videoDestWidth = width;
		this.videoDestHeight = height;

		onConnectionComplete();

		this.canvas = document.createElement("canvas");
		this.canvas.width = this.pixelExamineWidth;
		this.canvas.height = this.pixelExamineHeight;
		this.vid = undefined;
	}

	settingsActive: boolean = false;
	settingsUpdate: () => void;

	public InitSettingsMenu(apg: APGSys): void {
		var key = apg.g.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
		var label, label2, frameLabel, parsingStatusLabel, videoStatus, offsetLabel, gridSquares = [], clears = [];
		var graphics1: Phaser.Sprite, graphics2: Phaser.Sprite;

		var panel = new Phaser.Group(apg.g);
		apg.g.world.add(panel);

		key.onDown.add(() => {
			if (this.settingsActive == false) {
				apg.w.x = -1000;
				this.settingsActive = true;

				var x1: number = this.binaryPixelLeft - this.binaryPixelWidth / 2;
				var y1: number = this.binaryPixelTop - this.binaryPixelHeight / 2;
				var x2: number = this.binaryPixelLeft + this.binaryPixelWidth * 3.5;
				var y2: number = this.binaryPixelTop + this.binaryPixelHeight * 3.5;

				label = new Phaser.Text(apg.g, 200, 20, "METADATA SETTINGS", { font: '24px Caveat Brush', fill: '#aac' });
				panel.add(label);
				label2 = new Phaser.Text(apg.g, 200, 50, "Click opposite corners of the binary encoding in the video.", { font: '16px Caveat Brush', fill: '#aac' });
				panel.add(label2);
				graphics1 = new Phaser.Sprite(apg.g, x1, y1, 'assets/blueorb.png');
				graphics1.scale.x = graphics1.scale.y = .1;
				panel.add(graphics1);
				graphics2 = new Phaser.Sprite(apg.g, x2, y2, 'assets/blueorb.png');
				graphics2.scale.x = graphics2.scale.y = .1;
				panel.add(graphics2);
				parsingStatusLabel = new Phaser.Text(apg.g, 200, 80, "Frame number status: " + ( this.forceMetadataFrames == true ? "DEBUG, advanced by clock":"Reading from video image"), { font: '16px Caveat Brush', fill: '#aac' });
				panel.add(parsingStatusLabel);
				videoStatus = new Phaser.Text(apg.g, 200, 110, "Video Status: " + this.videoStatusMessage, { font: '16px Caveat Brush', fill: '#aac' });
				panel.add(videoStatus);
				offsetLabel = new Phaser.Text(apg.g, 200, 140, "Center: ("+this.binaryPixelLeft+", "+this.binaryPixelTop+")  Add:("+this.binaryPixelWidth+", "+this.binaryPixelHeight+")", { font: '16px Caveat Brush', fill: '#aac' });
				panel.add(offsetLabel);
				frameLabel = new Phaser.Text(apg.g, 200, 170, "", { font: '16px Caveat Brush', fill: '#aac' });
				panel.add(frameLabel);

				gridSquares = [];
				clears = [];

				for (var j = 0; j < MetadataFullSys.binaryEncodingColumns; j++) {
					gridSquares.push([]);
					for (var k = 0; k < MetadataFullSys.binaryEncodingRows; k++) {
						var pic = new Phaser.Sprite(apg.g, this.binaryPixelLeft + this.binaryPixelWidth * j, this.binaryPixelTop + this.binaryPixelHeight * k, 'assets/blueorb.png');
						pic.tint = 0xff0000;
						pic.scale.x = pic.scale.y = .05;
						panel.add(pic);
						gridSquares[j].push(pic);
						clears.push(pic);
					}
				}

				var tick = 0;
				var curSelection = 0;
				var pointerIsDown = false;
				this.settingsUpdate = () => {
					if (apg.g.input.activePointer.isDown) {
						if (!pointerIsDown) {
							if (curSelection == 0) {
								curSelection = 1;
								x1 = graphics1.x = apg.g.input.activePointer.x - 8;
								y1 = graphics1.y = apg.g.input.activePointer.y - 8;
							}
							else {
								x2 = graphics2.x = apg.g.input.activePointer.x - 8;
								y2 = graphics2.y = apg.g.input.activePointer.y - 8;
								curSelection = 0;
							}
							var xLeft = x1;
							var xRight = x2;
							if (xLeft > xRight) {
								xLeft = x2;
								xRight = x1;
							}
							var xDif = (xRight - xLeft)/MetadataFullSys.binaryEncodingColumns;
							var yTop = y1;
							var yBottom = y2;
							if (yTop > yBottom) {
								yTop = y2;
								yBottom = y1;
							}
							var yDif = (yBottom - yTop) / MetadataFullSys.binaryEncodingRows;

							this.binaryPixelLeft = xLeft + xDif / 2;
							this.binaryPixelWidth = xDif;
							this.binaryPixelTop = yTop + yDif / 2;
							this.binaryPixelHeight = yDif;

							offsetLabel.text = "Center: (" + this.binaryPixelLeft + ", " + this.binaryPixelTop + ")  Add:(" + this.binaryPixelWidth + ", " + this.binaryPixelHeight + ")";
							for (var j = 0; j < MetadataFullSys.binaryEncodingColumns; j++) {
								for (var k = 0; k < MetadataFullSys.binaryEncodingRows; k++) {
									gridSquares[j][k].x = this.binaryPixelLeft + this.binaryPixelWidth * j;
									gridSquares[j][k].y = this.binaryPixelTop + this.binaryPixelHeight * k;
								}
							}
						}
						pointerIsDown = true;
					}
					else {
						pointerIsDown = false;
					}
					tick++;
					frameLabel.text = "Current video frame is " + this.frameNumber;
					if (tick == 30) {
						graphics1.visible = graphics2.visible = false;
					}
					if (tick == 60) {
						tick = 0;
						graphics1.visible = graphics2.visible = true;
					}
				};
			}
			else {
				apg.w.x = 0;
				this.settingsActive = false;
				panel.remove(label);
				panel.remove(label2);
				panel.remove(graphics1);
				panel.remove(graphics2);
				panel.remove(frameLabel);
				panel.remove(parsingStatusLabel);
				panel.remove(videoStatus);
				panel.remove(offsetLabel);
				for (var j = 0; j < clears.length; j++) panel.remove(clears[j]);
				clears = [];
				gridSquares = [];
				this.settingsUpdate = null;
			}
		}, this);
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

	videoStatusMessage: string = "Unset";

	InitError(message: string): void {
		alert("Metadata Error: Couldn't find " + message);
		this.videoStatusMessage = "Failed at " + message;
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
					this.videoStatusMessage = "Active and working";
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

	static pixelBinaryCutoff: number = 127;
	public Update(): void {

		if (this.settingsUpdate != null) this.settingsUpdate();

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
		}
		else if (this.vid != undefined) {
			var videoToContainerScaleX = this.vid.videoWidth / this.videoDestWidth;
			var videoToContainerScaleY = this.vid.videoHeight / this.videoDestHeight;

			this.canvas.getContext('2d').drawImage(this.vid, 0, 0, this.canvas.width, this.canvas.height, 0, 0, this.pixelExamineWidth, this.pixelExamineHeight);
			var ctx = this.canvas.getContext('2d');
			for (var j = 0; j < MetadataFullSys.binaryEncodingColumns; j++) {
				for (var k = 0; k < MetadataFullSys.binaryEncodingRows; k++) {
					//var pix = ctx.getImageData((this.binaryPixelLeft + this.binaryPixelWidth * j)*videoToContainerScaleX, (this.binaryPixelTop + this.binaryPixelHeight * k)*videoToContainerScaleY, 1, 1).data[0];
					var pix = ctx.getImageData((this.binaryPixelLeft + this.binaryPixelWidth * j), (this.binaryPixelTop + this.binaryPixelHeight * k), 1, 1).data[0];
					if (pix > MetadataFullSys.pixelBinaryCutoff) frameNumber |= 1 << (j + k * MetadataFullSys.binaryEncodingColumns);
				}
			}
			//console.log("Frame is " + frameNumber);
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