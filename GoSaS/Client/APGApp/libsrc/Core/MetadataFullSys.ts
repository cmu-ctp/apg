function CacheMetadataAssets(c: Cacher): void {
	c.images('assets/metadata', ['blueorb.png', 'metadatasettings.png', 'settingsbkg.png']);
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
		if (this.inUse == false) return;
		var key:Phaser.Key = apg.g.input.keyboard.addKey(Phaser.Keyboard.ESC);
		var label: Phaser.Text, label2: Phaser.Text, frameLabel: Phaser.Text, frameAdvanceErrorLabel: Phaser.Text,
			parsingStatusLabel: Phaser.Text, videoStatus: Phaser.Text, offsetLabel: Phaser.Text;
		var gridSquares: any = [], clears: any = [];
		var bkg: Phaser.Sprite, graphics1: Phaser.Sprite, graphics2: Phaser.Sprite;
		var lastFrame: number = 0;

		var panel: Phaser.Group = new Phaser.Group(apg.g);
		apg.g.world.add(panel);

		var toggleButton: Phaser.Sprite = new Phaser.Sprite(apg.g, this.videoDestWidth - MetadataFullSys.settingButtonWidth, 0, 'assets/metadata/metadatasettings.png');
		panel.add(toggleButton);

		this.examinedVideo = apg.g.make.bitmapData(this.pixelExamineWidth, this.pixelExamineHeight);
		this.examinedVideo.copy('assets/metadata/blueorb.png');
		var videoPreviewClip:Phaser.Sprite = apg.g.make.sprite(0, 0, this.examinedVideo);
		panel.add(videoPreviewClip);
		videoPreviewClip.visible = false;

		this.settingToggleFunction = () => {
			if (this.settingsActive == false) {
				apg.w.x = -1000;
				this.settingsActive = true;

				var x1: number = this.binaryPixelLeft;
				var y1: number = this.binaryPixelTop;
				var x2: number = this.binaryPixelLeft + this.binaryPixelWidth * (MetadataFullSys.binaryEncodingColumns - 1);
				var y2: number = this.binaryPixelTop + this.binaryPixelHeight * (MetadataFullSys.binaryEncodingRows - 1);

				videoPreviewClip.visible = true;

				bkg = new Phaser.Sprite(apg.g, 0, 0, 'assets/metadata/settingsbkg.png');
				bkg.scale.x = bkg.scale.y = 40;
				bkg.alpha = .7;
				panel.add(bkg);

				graphics1 = new Phaser.Sprite(apg.g, x1, y1, 'assets/metadata/blueorb.png');
				graphics1.scale.x = graphics1.scale.y = .1;
				graphics1.anchor.set(.5);
				panel.add(graphics1);
				graphics2 = new Phaser.Sprite(apg.g, x2, y2, 'assets/metadata/blueorb.png');
				graphics2.scale.x = graphics2.scale.y = .1;
				graphics2.anchor.set(.5);
				panel.add(graphics2);

				label = new Phaser.Text(apg.g, 400, 340, "METADATA SYSTEM INFORMATION", { font: '24px Caveat Brush', fill: '#aac' });
				panel.add(label);
				parsingStatusLabel = new Phaser.Text(apg.g, 500, 380, "Frame number status: " + (this.forceMetadataFrames == true ? "DEBUG, advanced by clock" : "Reading from video image"), { font: '16px Caveat Brush', fill: '#aac' });
				panel.add(parsingStatusLabel);
				videoStatus = new Phaser.Text(apg.g, 500, 410, "Video Status: " + this.videoStatusMessage, { font: '16px Caveat Brush', fill: '#aac' });
				panel.add(videoStatus);
				offsetLabel = new Phaser.Text(apg.g, 500, 440, "Center of Upper Left Binary Digit: (" + this.binaryPixelLeft + ", " + this.binaryPixelTop + ")  Digit Width:(" + this.binaryPixelWidth + ", " + this.binaryPixelHeight + ")", { font: '16px Caveat Brush', fill: '#aac' });
				panel.add(offsetLabel);
				frameLabel = new Phaser.Text(apg.g, 500, 470, "", { font: '16px Caveat Brush', fill: '#aac' });
				panel.add(frameLabel);
				frameAdvanceErrorLabel = new Phaser.Text(apg.g, 500, 500, "", { font: '16px Caveat Brush', fill: '#f00' });
				panel.add(frameAdvanceErrorLabel);


				label2 = new Phaser.Text(apg.g, 50, 530, "To calibrate, click centers of top left and bottom right binary pixels.", { font: '32px Caveat Brush', fill: '#f44' });
				panel.add(label2);

				gridSquares = [];
				clears = [];

				for (var j:number = 0; j < MetadataFullSys.binaryEncodingColumns; j++) {
					gridSquares.push([]);
					for (var k:number = 0; k < MetadataFullSys.binaryEncodingRows; k++) {
						var pic:Phaser.Sprite = new Phaser.Sprite(apg.g, this.binaryPixelLeft + this.binaryPixelWidth * j, this.binaryPixelTop + this.binaryPixelHeight * k, 'assets/metadata/blueorb.png');
						pic.tint = 0xff0000;
						pic.scale.x = pic.scale.y = .05;
						pic.anchor.set(.5);
						panel.add(pic);
						gridSquares[j].push(pic);
						clears.push(pic);
					}
				}

				var tick:number = 0;
				var pointerIsDown:boolean = false;
				this.settingsUpdate = () => {
					if (apg.g.input.activePointer.isDown && (apg.g.input.activePointer.x < this.videoDestWidth - MetadataFullSys.settingButtonWidth || apg.g.input.activePointer.y > MetadataFullSys.settingButtonHeight)) {
						if (!pointerIsDown) {
							var dif1:number = Math.sqrt((x1 - apg.g.input.activePointer.x) * (x1 - apg.g.input.activePointer.x) + (y1 - apg.g.input.activePointer.y) * (y1 - apg.g.input.activePointer.y));
							var dif2: number = Math.sqrt((x2 - apg.g.input.activePointer.x) * (x2 - apg.g.input.activePointer.x) + (y2 - apg.g.input.activePointer.y) * (y2 - apg.g.input.activePointer.y));
							if (dif1 < dif2 ) {
								x1 = graphics1.x = apg.g.input.activePointer.x;
								y1 = graphics1.y = apg.g.input.activePointer.y;
							}
							else {
								x2 = graphics2.x = apg.g.input.activePointer.x;
								y2 = graphics2.y = apg.g.input.activePointer.y;
							}

							var xLeft: number = x1;
							var xRight: number = x2;
							if (xLeft > xRight) {
								xLeft = x2;
								xRight = x1;
							}
							var xDif: number = (xRight - xLeft) / (MetadataFullSys.binaryEncodingColumns - 1);
							var yTop: number = y1;
							var yBottom: number = y2;
							if (yTop > yBottom) {
								yTop = y2;
								yBottom = y1;
							}
							var yDif: number = (yBottom - yTop) / (MetadataFullSys.binaryEncodingRows - 1);

							this.binaryPixelLeft = xLeft;
							this.binaryPixelWidth = xDif;
							this.binaryPixelTop = yTop;
							this.binaryPixelHeight = yDif;

							offsetLabel.text = "Center of Upper Left Binary Digit: (" + this.binaryPixelLeft + ", " + this.binaryPixelTop + ")  Digit Width:(" + this.binaryPixelWidth + ", " + this.binaryPixelHeight + ")";
							for (var j: number = 0; j < MetadataFullSys.binaryEncodingColumns; j++) {
								for (var k: number = 0; k < MetadataFullSys.binaryEncodingRows; k++) {
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
					if (this.frameNumber - lastFrame > 3) frameAdvanceErrorLabel.text = "Frame Advancing Incorrectly!  Try Re-calibrating..."
					else frameAdvanceErrorLabel.text = "";
					lastFrame = this.frameNumber;
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
				panel.remove(bkg);
				panel.remove(label);
				panel.remove(label2);
				panel.remove(graphics1);
				panel.remove(graphics2);
				panel.remove(frameLabel);
				panel.remove(frameAdvanceErrorLabel);
				panel.remove(parsingStatusLabel);
				panel.remove(videoStatus);
				panel.remove(offsetLabel);
				for (var j: number = 0; j < clears.length; j++) panel.remove(clears[j]);
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
			for (var k: number = 0; k < j.length; k++) {
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
		if (this.inUse == false) return;

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

		var frameNumber: number = this.GetFrameNumber();

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
		for (var j: number = 0; j < elements.length; j++) {
			var player = elements[j];
			if (player != undefined && player.children != null && player.children.length > 0) {
				for (var k: number = 0; k < player.children.length; k++) {
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

	private readTextFile(file:string) {
		var rawFile: XMLHttpRequest = new XMLHttpRequest();
		rawFile.open("GET", file, false);
		rawFile.onreadystatechange = () => {
			if (rawFile.readyState === 4) {
				if (rawFile.status === 404) {
					//alert("fail!");
				}
				if (rawFile.status === 200 || rawFile.status == 0) {
					var allText:string = rawFile.responseText;
					var t:string[] = allText.split('\n');
					for (let v of t) {
						var s:string[] = v.split('~');
						var frame:string = s[0];
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
		var frameNumber:number = 0;
		if (this.forceMetadataFrames) {
			frameNumber = this.frameNumber + 1;
		}
		else if (this.vid != undefined) {
			var videoToContainerScaleX:number = this.vid.videoWidth / this.videoDestWidth;
			var videoToContainerScaleY: number = this.vid.videoHeight / this.videoDestHeight;

			if (this.settingsActive) {
				this.examinedVideo.copy('assets/metadata/blueorb.png', Math.random() * 10, Math.random() * 10);
				this.examinedVideo.canvas.getContext('2d').drawImage(this.vid, 0, 0, this.examinedVideo.canvas.width, this.examinedVideo.canvas.height, 0, 0, this.pixelExamineWidth, this.pixelExamineHeight);
				this.examinedVideo.update();
			}

			var ctx:CanvasRenderingContext2D = this.canvas.getContext('2d');
			ctx.drawImage(this.vid, 0, 0, this.canvas.width, this.canvas.height, 0, 0, this.pixelExamineWidth, this.pixelExamineHeight);
			for (var j:number = 0; j < MetadataFullSys.binaryEncodingColumns; j++) {
				for (var k: number = 0; k < MetadataFullSys.binaryEncodingRows; k++) {
					var pix:number = ctx.getImageData((this.binaryPixelLeft + this.binaryPixelWidth * j), (this.binaryPixelTop + this.binaryPixelHeight * k), 1, 1).data[0];
					if (pix > MetadataFullSys.pixelBinaryCutoff) frameNumber |= 1 << (j + k * MetadataFullSys.binaryEncodingColumns);
				}
			}
		}
		return frameNumber;
	}
	private static pixelBinaryCutoff: number = 127;
	private RunFrameHandlers(frameNumber: number): void {
		if (frameNumber != this.frameNumber && this.frameStorage[frameNumber] != null && this.frameStorage[frameNumber] != undefined && this.getHandlers != null) {
			var handlers:NetworkMessageHandler = this.getHandlers();
			var r: any = this.frameStorage[frameNumber];
			for (var k:number = 0; k < r.length; k++) {
				handlers.Run(NetworkMessageHandler.JoinNetworkMessage(r[k][0], r[k][1]));
			}
		}
		this.frameNumber = frameNumber;
		this.curFile = Math.floor(this.frameNumber / 60) + 3;
	}
}