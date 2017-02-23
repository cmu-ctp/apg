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

class MessageHandler {
	onJoin: () => boolean;
	timeUpdate: (round: number, time: number) => void;
	clientUpdate: () => void;
	startSubmitInput: () => void;
	getParmCount: () => number;
	getParm:(id: number) => number;
	constructor(fields?: { onJoin?: () => boolean, timeUpdate?: (round: number, time: number) => void, clientUpdate?: () => void, startSubmitInput?: () => void, getParmCount?: () => void, getParm?: ( id:number ) => void; }) {
		this.onJoin = () => false;
		this.timeUpdate = (round: number, time: number) => { };
		this.clientUpdate = () => { };
		this.startSubmitInput = () => { };
		this.getParmCount = () => 0;
		this.getParm = (id: number) => 0;
		if (fields) Object.assign(this, fields);
	}
}

class APGSys {
	messages: MessageHandler;
	g: Phaser.Game;
	w: Phaser.World;
	gameActions: any;
	network: NetworkInterface;
	constructor(g: Phaser.Game, gameActions: any, logicIRCChannelName: string, playerName: string, chat: tmiClient) {
		this.g = g;
		this.w = g.world;
		this.gameActions = gameActions;
		this.network = APGSys.makeNetworking(g.world, logicIRCChannelName, playerName, chat, () => this.messages );
	}
	private static makeNetworking(w: Phaser.World, logicIRCChannelName: string, playerName: string, chat: tmiClient, messages: () => MessageHandler): NetworkInterface {
		return ( chat == null ) ? new NullNetwork(messages, w ) : new IRCNetwork(messages, playerName, logicIRCChannelName, chat );
	}
}

var phaserAssetCacheList: { (loader: Phaser.Loader): void; }[] = [];
function addCache(cacheFunction: (loader: Phaser.Loader) => void): boolean {
	if (phaserAssetCacheList == undefined) {
		phaserAssetCacheList = [];
	}
	phaserAssetCacheList.push(cacheFunction);
	return true;
}

function ApgSetup(gameWidth: number = 400, gameHeight: number = 300, logicIRCChannelName: string, playerName: string, chat: tmiClient, APGInputWidgetDivName: string, allowFullScreen:boolean ) {
	var phaserCached: boolean = false;
	var executeAfterPreload = null;
	var phaserGame: Phaser.Game = new Phaser.Game(gameWidth, gameHeight, Phaser.AUTO, APGInputWidgetDivName, {
		preload: () => {
			phaserGame.stage.disableVisibilityChange = true;
			phaserGame.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
			if (allowFullScreen) {
				phaserGame.scale.pageAlignHorizontally = true;
				phaserGame.input.onDown.add(goFull, this);
			}
			for (var k = 0; k < phaserAssetCacheList.length; k++) {
				phaserAssetCacheList[k](phaserGame.load);
			}
			phaserCached = true;
		},
		create: () => {
			phaserGame.input.mouse.capture = true;
			if (executeAfterPreload != null) {
				executeAfterPreload();
				executeAfterPreload = null;
			}
		},
		update: () => { },
		render: () => { }
	});
	function goFull(): void {
		phaserGame.scale.startFullScreen(true);
	}
	var gameActions;
	$.getJSON(actionList, function (data) {
		gameActions = data.all;
		if (phaserCached) ApgSetupCore();
		else executeAfterPreload = ApgSetupCore;
	});
	function ApgSetupCore(): void {
		var sys = new APGSys(phaserGame, gameActions, logicIRCChannelName, playerName, chat);
		//RacingInput.make( sys );
		MainPlayerInput.make( sys );
		//WaitingToJoin.make( sys );
		//WaitingForTwitchLogin.make( sys );
	}
}