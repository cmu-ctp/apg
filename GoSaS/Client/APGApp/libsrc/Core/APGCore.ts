function ApgSetup( appParms:AppParms, networkingTestSequence: boolean, disableNetworking: boolean, logicIRCChannelName: string, APGInputWidgetDivName: string, allowFullScreen: boolean,
	engineParms: EngineParms, onLoadEnd: () => void, handleOrientation: () => void, metadataSys: MetadataFullSys) {

	if (appParms.gameWidth < 1 || appParms.gameWidth > 8192 || appParms.gameHeight < 1 || appParms.gameHeight > 8192) {
		ConsoleOutput.debugError("ApgSetup: gameWidth and gameHeight are set to " + appParms.gameWidth + ", " + appParms.gameHeight +".  These values should be set to the width and height of the desired HTML5 app.  400 and 300 are the defaults.", "sys");
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

	appParms.cacheFunction(cache);
	CacheMetadataAssets(cache);

	cache.LoadJSONAsset(LoadPhaserAssets); 

	function LoadPhaserAssets() {
		var game: Phaser.Game = new Phaser.Game(appParms.gameWidth, appParms.gameHeight, Phaser.AUTO, APGInputWidgetDivName, {
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
			if (engineParms.metadataDoneLoading == false) {
				engineParms.metadataLoadedFunction = launchGameFull;
			}
			else {
				launchGameFull();
			}
		}

		function launchGameFull() {

            onLoadEnd();

            var apg: APGFullSystem = new APGFullSystem(game, logicIRCChannelName, engineParms.playerName, engineParms.chat, cache.JSONAssets, networkingTestSequence, allowFullScreen, metadataSys );
			var showingOrientationWarning = false;
			setInterval(function () {
				handleOrientation();
				apg.update();
			}, 1000 / 60);
			appParms.gameLaunchFunction(apg);

		}
	}
}