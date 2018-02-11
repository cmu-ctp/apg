﻿// This system gets data whenever and however it does.
// During Update, it possibly advances the frame number.
// Add an onUpdate callback.
// And then there needs to be a way to get specific data.

function CacheMetadataAssets(c: Cacher): void {
	c.images('assets/metadata', ['blueorb.png', 'metadatasettings.png']);
}

class MetadataFullSys {
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

	private examinedVideo: Phaser.BitmapData;

	public InitSettingsMenu(apg: APGSys): void {
		var key = apg.g.input.keyboard.addKey(Phaser.Keyboard.ESC);
		var label, label2, frameLabel, parsingStatusLabel, videoStatus, offsetLabel, gridSquares = [], clears = [];
		var graphics1: Phaser.Sprite, graphics2: Phaser.Sprite;

		var panel = new Phaser.Group(apg.g);
		apg.g.world.add(panel);

		var toggleButton = new Phaser.Sprite(apg.g, this.videoDestWidth - MetadataFullSys.settingButtonWidth, 0, 'assets/metadata/metadatasettings.png');
		panel.add(toggleButton);

		this.examinedVideo = apg.g.make.bitmapData(this.pixelExamineWidth, this.pixelExamineHeight);
		this.examinedVideo.copy('assets/metadata/blueorb.png');
		var videoPreviewClip = apg.g.make.sprite(0, 0, this.examinedVideo);
		panel.add(videoPreviewClip);
		videoPreviewClip.visible = false;

		this.settingToggleFunction = () => {
			if (this.settingsActive == false) {
				apg.w.x = -1000;
				this.settingsActive = true;

				var x1: number = this.binaryPixelLeft - this.binaryPixelWidth / 2;
				var y1: number = this.binaryPixelTop - this.binaryPixelHeight / 2;
				var x2: number = this.binaryPixelLeft + this.binaryPixelWidth * 3.5;
				var y2: number = this.binaryPixelTop + this.binaryPixelHeight * 3.5;

				videoPreviewClip.visible = true;

				label = new Phaser.Text(apg.g, 200, 20, "METADATA SYSTEM INFORMATION", { font: '24px Caveat Brush', fill: '#aac' });
				panel.add(label);
				graphics1 = new Phaser.Sprite(apg.g, x1, y1, 'assets/metadata/blueorb.png');
				graphics1.scale.x = graphics1.scale.y = .1;
				panel.add(graphics1);
				graphics2 = new Phaser.Sprite(apg.g, x2, y2, 'assets/metadata/blueorb.png');
				graphics2.scale.x = graphics2.scale.y = .1;
				panel.add(graphics2);
				parsingStatusLabel = new Phaser.Text(apg.g, 200, 80, "Frame number status: " + (this.forceMetadataFrames == true ? "DEBUG, advanced by clock" : "Reading from video image"), { font: '16px Caveat Brush', fill: '#aac' });
				panel.add(parsingStatusLabel);
				videoStatus = new Phaser.Text(apg.g, 200, 110, "Video Status: " + this.videoStatusMessage, { font: '16px Caveat Brush', fill: '#aac' });
				panel.add(videoStatus);
				offsetLabel = new Phaser.Text(apg.g, 200, 140, "Center of Upper Left Binary Digit: (" + this.binaryPixelLeft + ", " + this.binaryPixelTop + ")  Digit Width:(" + this.binaryPixelWidth + ", " + this.binaryPixelHeight + ")", { font: '16px Caveat Brush', fill: '#aac' });
				panel.add(offsetLabel);
				frameLabel = new Phaser.Text(apg.g, 200, 170, "", { font: '16px Caveat Brush', fill: '#aac' });
				panel.add(frameLabel);

				label2 = new Phaser.Text(apg.g, 50, 450, "To calibrate, click opposite corners of the binary encoding in the video.", { font: '32px Caveat Brush', fill: '#f44' });
				panel.add(label2);

				gridSquares = [];
				clears = [];

				for (var j = 0; j < MetadataFullSys.binaryEncodingColumns; j++) {
					gridSquares.push([]);
					for (var k = 0; k < MetadataFullSys.binaryEncodingRows; k++) {
						var pic = new Phaser.Sprite(apg.g, this.binaryPixelLeft + this.binaryPixelWidth * j, this.binaryPixelTop + this.binaryPixelHeight * k, 'assets/metadata/blueorb.png');
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
					if (apg.g.input.activePointer.isDown && (apg.g.input.activePointer.x < this.videoDestWidth - MetadataFullSys.settingButtonWidth || apg.g.input.activePointer.y > MetadataFullSys.settingButtonHeight)) {
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
							var xDif = (xRight - xLeft) / MetadataFullSys.binaryEncodingColumns;
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

							offsetLabel.text = "Center of Upper Left Binary Digit: (" + this.binaryPixelLeft + ", " + this.binaryPixelTop + ")  Digit Width:(" + this.binaryPixelWidth + ", " + this.binaryPixelHeight + ")";
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
				videoPreviewClip.visible = false;
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
		};
		key.onDown.add( this.settingToggleFunction, this);
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

	private mouseLatch: boolean = false;

	private static settingButtonWidth: number = 32;
	private static settingButtonHeight: number = 32;

	public Update(activePointer: Phaser.Pointer ): void {

		if (activePointer.isDown) {
			if (this.mouseLatch == false && activePointer.x > this.videoDestWidth - MetadataFullSys.settingButtonWidth && activePointer.y < MetadataFullSys.settingButtonHeight ) {
				this.settingToggleFunction();
			}
			this.mouseLatch = true;
		}
		else {
			this.mouseLatch = false;
		}

		if (this.settingsUpdate != null) {
			this.settingsUpdate();
		}

		if (this.useLocalTestNetworking) {
			this.ReadLocalMetadataFile();
		}

		if (this.vid == undefined) {
			this.GetVideoPlugin(this.videoPlayer, this.SetVideoErrorMessage );
		}

		var frameNumber = this.GetFrameNumber();

		if (frameNumber != 0) {
			this.RunFrameHandlers(frameNumber);
		}
	}

	// _____________________________________________________________________

	private inUse: boolean;

	private videoPlayer: any;
	private canvas: HTMLCanvasElement;
	private vid: HTMLVideoElement;

	private frameNumber: number = 0;

	private useLocalTestNetworking: boolean;
	private forceMetadataFrames: boolean;

	private fileReadTime: number = 0;
	private curFile: number = 1;
	private frameStorage: {} = {};

	private binaryPixelLeft: number = 16;
	private binaryPixelTop: number = 12;
	private binaryPixelWidth: number = 18;
	private binaryPixelHeight: number = 18;

	private videoDestWidth: number;
	private videoDestHeight: number;

	private pixelExamineWidth: number = 700;
	private pixelExamineHeight: number = 500;

	private static binaryEncodingRows: number = 4;
	private static binaryEncodingColumns: number = 4;

	private getHandlers: () => NetworkMessageHandler = null;

	private settingsActive: boolean = false;
	private settingsUpdate: () => void;

	private settingToggleFunction: () => void;

	private videoStatusMessage: string = "Unset";

	private SetVideoErrorMessage(message: string): void {
		alert("Metadata Error: Couldn't find " + message);
		this.videoStatusMessage = "Failed at " + message;
	}

	private GetVideoPlugin(videoPlayer:any, onError:(string)=>void ): boolean {
		if (videoPlayer == undefined) {
			onError("video player div");
			return false;
		}
		if (videoPlayer._bridge == undefined) {
			onError("video player div bridge component");
			return false;
		}

		var iframe = videoPlayer._bridge._iframe;
		if (iframe == undefined) {
			onError("video iframe");
			return false;
		}
		if (iframe.contentWindow.document == undefined) {
			onError("video iframe document");
			return false;
		}

		var elements = iframe.contentWindow.document.getElementsByClassName("player-video");
		if (elements == undefined) {
			onError("player-video");
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

	private readTextFile(file) {
		var rawFile = new XMLHttpRequest();
		rawFile.open("GET", file, false);
		rawFile.onreadystatechange = () => {
			if (rawFile.readyState === 4) {
				if (rawFile.status === 404) {
					//alert("fail!");
				}
				if (rawFile.status === 200 || rawFile.status == 0) {
					var allText = rawFile.responseText;
					var t = allText.split('\n');
					for (let v of t) {
						var s = v.split('~');
						var frame = s[0];
						if (this.frameStorage[frame] == null) this.frameStorage[frame] = [];
						this.frameStorage[frame].push([s[1], s[2]]);
					}
				}
			}
		}
		rawFile.send(null);
	}

	private ReadLocalMetadataFile(): void {
		this.fileReadTime++;
		if (this.fileReadTime >= 30) {
			this.readTextFile("TestTraffic/test" + this.curFile + ".txt");
			this.fileReadTime = 0;
		}
	}
	private GetFrameNumber(): number {
		var frameNumber = 0;
		if (this.forceMetadataFrames) {
			frameNumber = this.frameNumber + 1;
		}
		else if (this.vid != undefined) {
			var videoToContainerScaleX = this.vid.videoWidth / this.videoDestWidth;
			var videoToContainerScaleY = this.vid.videoHeight / this.videoDestHeight;

			if (this.settingsActive) {
				this.examinedVideo.copy('assets/metadata/blueorb.png', Math.random() * 10, Math.random() * 10);
				this.examinedVideo.canvas.getContext('2d').drawImage(this.vid, 0, 0, this.examinedVideo.canvas.width, this.examinedVideo.canvas.height, 0, 0, this.pixelExamineWidth, this.pixelExamineHeight);
				this.examinedVideo.update();
			}

			var ctx = this.canvas.getContext('2d');
			ctx.drawImage(this.vid, 0, 0, this.canvas.width, this.canvas.height, 0, 0, this.pixelExamineWidth, this.pixelExamineHeight);
			for (var j = 0; j < MetadataFullSys.binaryEncodingColumns; j++) {
				for (var k = 0; k < MetadataFullSys.binaryEncodingRows; k++) {
					//var pix = ctx.getImageData((this.binaryPixelLeft + this.binaryPixelWidth * j)*videoToContainerScaleX, (this.binaryPixelTop + this.binaryPixelHeight * k)*videoToContainerScaleY, 1, 1).data[0];

					var pix = ctx.getImageData((this.binaryPixelLeft + this.binaryPixelWidth * j), (this.binaryPixelTop + this.binaryPixelHeight * k), 1, 1).data[0];
					if (pix > MetadataFullSys.pixelBinaryCutoff) frameNumber |= 1 << (j + k * MetadataFullSys.binaryEncodingColumns);
				}
			}
		}
		return frameNumber;
	}
	private static pixelBinaryCutoff: number = 127;
	private RunFrameHandlers(frameNumber: number): void {
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