function ApgSetup(assetCacheFunction:( Cacher )=>void, gameLaunchFunction:(APGSys)=>void, disableNetworking:boolean, isMobile:boolean, gameWidth: number = 400, gameHeight: number = 300, logicIRCChannelName: string, APGInputWidgetDivName: string, allowFullScreen: boolean, engineParms:any, onLoadEnd:()=>void, handleOrientation:()=>void ) {

	if (gameWidth < 1 || gameWidth > 8192 || gameHeight < 1 || gameHeight > 8192) {
		ConsoleOutput.debugError("ApgSetup: gameWidth and gameHeight are set to " + gameWidth + ", "  + gameHeight +".  These values should be set to the width and height of the desired HTML5 app.  400 and 300 are the defaults.", "sys");
		return;
	}

	if (disableNetworking == false) {
		if (logicIRCChannelName == undefined || logicIRCChannelName == "") {
			ConsoleOutput.debugError("ApgSetup: logicIRCChannelName is not set.  The game cannot work without this.  This should be set to the name of a Twitch IRC channel, with no leading #.", "sys");
			return;
		}
	}
	if (APGInputWidgetDivName == undefined || APGInputWidgetDivName == "") {
		ConsoleOutput.debugError("ApgSetup: APGInputWidgetDivName is not set.  The game cannot work without this.  This should be the name of a valid div to contain the PhaserJS canvas.", "sys");
		return;
	}

	var cache = new AssetCacher();

	assetCacheFunction( cache );

	cache.LoadJSONAsset(LoadPhaserAssets); 

	function LoadPhaserAssets() {
		var game: Phaser.Game = new Phaser.Game(gameWidth, gameHeight, Phaser.AUTO, APGInputWidgetDivName, {
			preload: () => {
				game.stage.disableVisibilityChange = true;

				if (allowFullScreen) {
					game.scale.pageAlignHorizontally = true;
					game.scale.pageAlignVertically = true;
					game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
					game.scale.setResizeCallback(gameResized, this);
					function gameResized(manager: Phaser.ScaleManager, bounds) {
						var scale = Math.min(window.innerWidth / game.width, window.innerHeight / game.height);
						manager.setUserScale(scale, scale, 0, 0);
					}
				}

				cache.Run(game);
			},
			create: () => {
				game.input.mouse.capture = true;

				if (cache.phaserGoogleWebFontList == undefined || cache.phaserGoogleWebFontList.length == 0) {
					initLaunchGame();
				}
			}
		}, true );

		WebFontConfig = {
			//  'active' means all requested fonts have finished loading.  We need a delay after loading to give browser time to get sorted for fonts, for some reason.
			active: function () { game.time.events.add(Phaser.Timer.SECOND, initLaunchGame, this); },
			google: {
				families: cache.phaserGoogleWebFontList
			}
		};

		function initLaunchGame() {
			if (engineParms.chat == null && disableNetworking == false ) {
				engineParms.chatLoadedFunction = launchGame;
			}
			else {
				launchGame();
			}
		}

		function launchGame() {
			onLoadEnd();
			var apg: APGFullSystem = new APGFullSystem(game, logicIRCChannelName, engineParms.playerName, engineParms.chat, cache.JSONAssets);
			var showingOrientationWarning = false;
			setInterval(function () {
				handleOrientation();
				apg.update();
			}, 1000 / 60);
			gameLaunchFunction(apg);
		}
	}
}