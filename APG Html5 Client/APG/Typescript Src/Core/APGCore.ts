interface ObjectConstructor { assign(target: any, ...sources: any[]): any; }
if (typeof Object.assign != 'function') {
	(function () {
		Object.assign = function (target) {
			'use strict';
			if (target === undefined || target === null) { throw new TypeError('Cannot convert undefined or null to object'); }
			var output = Object(target);
			for (var index = 1; index < arguments.length; index++) {
				var source = arguments[index];
				if (source !== undefined && source !== null) 
					for (var nextKey in source) 
						if (source.hasOwnProperty(nextKey)) 
							output[nextKey] = source[nextKey];
			}
			return output;
		};
	})();
}

var phaserAssetCacheList: { (loader: Phaser.Loader): void; }[] = [];
function addCache(cacheFunction: (loader: Phaser.Loader) => void): void {
	if (phaserAssetCacheList == undefined) {
		phaserAssetCacheList = [];
	}
	phaserAssetCacheList.push(cacheFunction);
}


function ApgSetup(gameWidth: number = 400, gameHeight: number = 300, logicIRCChannelName: string, playerName: string, chat: tmiClient, APGInputWidgetDivName: string, allowFullScreen: boolean) {

	if (gameWidth < 1 || gameWidth > 8192 || gameHeight < 1 || gameHeight > 8192) {
		ConsoleOutput.debugError("ApgSetup: gameWidth and gameHeight are set to " + gameWidth + ", "  + gameHeight +".  These values should be set to the width and height of the desired HTML5 app.  400 and 300 are the defaults.", "sys");
		return;
	}

	if (logicIRCChannelName == undefined || logicIRCChannelName == "") {
		ConsoleOutput.debugError("ApgSetup: logicIRCChannelName is not set.  The game cannot work without this.  This should be set to the name of a Twitch IRC channel, with no leading #.", "sys");
		return;
	}
	if (playerName == undefined || playerName == "") {
		ConsoleOutput.debugError("ApgSetup: playerName is not set.  The game cannot work without this.  This should be set to the name of a valid Twitch account.", "sys");
		return;
	}
	if (chat == undefined ) {
		ConsoleOutput.debugWarn("ApgSetup: chat is not set.  Defaulting to null networking.  chat should be intialized to a tmi cilent.", "sys");
	}
	if (APGInputWidgetDivName == undefined || APGInputWidgetDivName == "") {
		ConsoleOutput.debugError("ApgSetup: APGInputWidgetDivName is not set.  The game cannot work without this.  This should be the name of a valid div to contain the PhaserJS canvas.", "sys");
		return;
	}
	
	$.getJSON(actionList, function (data) {
		var gameActions = data.all;
		var phaserGame: Phaser.Game = new Phaser.Game(gameWidth, gameHeight, Phaser.AUTO, APGInputWidgetDivName, {
			preload: () => {
				phaserGame.stage.disableVisibilityChange = true;
				
				if (allowFullScreen) {
					phaserGame.input.onDown.add(goFull, this);
				}

				if (phaserAssetCacheList.length == 0 ) {
					ConsoleOutput.debugWarn("ApgSetup: phaserAssetCacheList.length is 0, so no assets are being cached.  This is probably an error.", "sys");
				}

				for (var k = 0; k < phaserAssetCacheList.length; k++) {
					phaserAssetCacheList[k](phaserGame.load);
				}

			},
			create: () => {
				phaserGame.input.mouse.capture = true;
				StartGame(new APGSys(phaserGame, gameActions, logicIRCChannelName, playerName, chat));
			}
		});
		function goFull(): void {
			phaserGame.scale.pageAlignHorizontally = true;
			phaserGame.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
			if (phaserGame.scale.isFullScreen) {
			}
			else {
				phaserGame.scale.startFullScreen(true);
			}
		}
	});
}
