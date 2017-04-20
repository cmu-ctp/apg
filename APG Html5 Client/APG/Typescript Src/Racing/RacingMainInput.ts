var debugAllCarParts = [];

cachePhaserAssets( l => {
	var assetSets = ["bodyHood", "bodySide", "bodyTrunk", "defense", "nitro", "offense", "case", "pistons", "plugs", "airfreshner", "seat", "steering", "tireBolts", "tireBrand", "tire"];

	for (var k = 0; k < assetSets.length; k++) {
		for (var j = 1; j < 4; j++) {
			l.image("carPart_" + k + "_" + j, "racinggame/" + assetSets[k] + j + ".png");
			debugAllCarParts.push( "carPart_" + k + "_" + j );
		}
	}
});

cacheImages('racinggame', ['audienceInterfaceBG.png', 'selected.png', 'unselected.png']);
cacheSounds('assets/snds/fx', ['strokeup2.mp3', 'strokeup.mp3', 'strokeup4.mp3']);
cacheGoogleWebFonts(['Anton']);

interface RacingRoundUpdate {
	round: number;
	time: number;
}

interface RacingSelectionParms {
	choices: number[];
}

interface RacingPlayerUpdate {
	nm: string;
	hp: number;
	money: number;
}

// fix app size
// make input work
// make messages from server get handled
// make messages to server (and other clients) get handled

class RacingGame {

	addArt(apg: APGSys, carSet:number): void {

		var statNames = ["Fuel Cap", "Speed Cap", "Weight", "Suaveness", "Power"];

		// ______________________

		function fnt(sz: number): string {
			sz *= 2;
			return '' + sz + 'px Anton';
		}

		new enttx(apg.w, 2 * 10, 2 * 10, "CAR PERFORMANCE", { font: fnt(20), fill: '#fff' });

		for (var k = 0; k < 5; k++) {
			new enttx(apg.w, 2 * 10, 2 * (48 + (72 - 48) * k), statNames[k] + ":", { font: fnt(16), fill: '#fff' });
		}

		// ______________________

		new enttx(apg.w, 2 * 12, 2 * 228, "CASING TECH", { font: fnt(20), fill: '#fff' });

		new enttx(apg.w, 2 * 15, 2 * 256, "Piston Tech:", { font: fnt(16), fill: '#fff' });
		new enttx(apg.w, 2 * 15, 2 * 275, "Sparkplug Tech:", { font: fnt(16), fill: '#fff' });

		// ______________________

		new enttx(apg.w, 2 * 152, 2 * 10, "OPTIONS", { font: fnt(20), fill: '#fff' });

		new ent(apg.w, 2 * 158, 2 * 36, "racinggame/selected.png");
		new ent(apg.w, 2 * 158, 2 * 92, "racinggame/unselected.png");
		new ent(apg.w, 2 * 158, 2 * 150, "racinggame/unselected.png");

		new enttx(apg.w, 2 * 158, 2 * 36, "Featherwate", { font: fnt(16), fill: '#0' });
		new enttx(apg.w, 2 * 158, 2 * 92, "Unguzzler", { font: fnt(16), fill: '#0' });
		new enttx(apg.w, 2 * 158, 2 * 150, "Hulkite", { font: fnt(16), fill: '#0' });

		var picChangeTick = 0;
		var picFrame = 0;

		for (var k = 1; k < 4; k++) {
			//"carPart_" + k + "_" + j
			new ent(apg.w, 2 * 220, 2 * 40, debugAllCarParts[carSet * 9 + (k - 1) * 3 + 2], { scalex: 1, scaley: 1 });
		}

		new enttx(apg.w, 2 * 220, 2 * 178, "-1 Weight, +1 Power", { font: fnt(24), fill: '#fff' });
	}

	timer: number = 0;
	choices: number[] = [1, 1, 1, 1, 1, 1];
	roundNumber: number = 1;
	warningSound: Phaser.Sound;

	makeHandlers(apg: APGSys): void {

		function Time(roundUpdate: RacingRoundUpdate): void {
			this.timer = roundUpdate.time;
			this.roundNumber = roundUpdate.round;
			if (this.timer < 6) { this.warningSound.play('', 0, 1 - (this.timer * 15) / 100); }
		}
		function PlayerStats(playerUpdate: RacingPlayerUpdate): void {
			if (playerUpdate.nm != apg.playerName) return;
			//myStats = p;
		}
		function Submit(selectionParms: RacingSelectionParms): void {
			apg.WriteToServer<RacingSelectionParms>("upd", { choices: this.choices });
		}

		var handlers: NetworkMessageHandler = new NetworkMessageHandler();
		handlers.Add<RacingRoundUpdate>("time", Time);
		handlers.Add<RacingPlayerUpdate>("pl", PlayerStats);
		handlers.Add<RacingSelectionParms>("submit", Submit);
		apg.SetHandlers( handlers );
	}

	constructor(apg: APGSys ) {
		enum PlayerChoice {
			bodyHood = 0, bodySide, bodyTrunk, defense, nitro, offense, case, pistons, plugs, airfreshner, seat, steering, tireBolts, tireBrand, tire
		}

		var endOfRoundSound: Phaser.Sound = apg.g.add.audio('assets/snds/fx/strokeup4.mp3', 1, false);
		this.warningSound = apg.g.add.audio('assets/snds/fx/strokeup.mp3', 1, false);

		var carSet: number = 3;

		var tick: number = 0, choiceLeft: number = 50, choiceUp: number = 118;
		var lastRoundUpdate: number = 0;

		this.makeHandlers( apg );

		var bkg: ent = new ent(apg.w, 0, 0, 'racinggame/audienceInterfaceBG.png', {
			scalex: 2, scaley: 2,
			upd: e => {
				if (this.roundNumber != lastRoundUpdate) {
					lastRoundUpdate = this.roundNumber;
				}
			}
		});

		this.addArt( apg, carSet );
	}
}

function RacingInput(apg: APGSys): void {
	new RacingGame( apg );
}