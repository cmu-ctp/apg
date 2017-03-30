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

function RacingInput(sys: APGSys): void {
	enum PlayerChoice {
		bodyHood = 0, bodySide, bodyTrunk, defense, nitro, offense, case, pistons, plugs, airfreshner, seat, steering, tireBolts, tireBrand, tire
	}

	var statNames = [ "Fuel Cap", "Speed Cap", "Weight", "Suaveness", "Power" ];

	var timer: number = 0;
	var roundNumber: number = 1;
	var choices: number[] = [1, 1, 1, 1, 1, 1];

	var endOfRoundSound: Phaser.Sound = sys.g.add.audio('assets/snds/fx/strokeup4.mp3', 1, false);
	var warningSound: Phaser.Sound = sys.g.add.audio('assets/snds/fx/strokeup.mp3', 1, false);

	var carSet: number = 3;

	sys.messages = new APGSubgameMessageHandler({
		timeUpdate: (round, time) => {
			timer = time;
			roundNumber = round;
			if (timer < 6) { warningSound.play('', 0, 1 - (timer * 15) / 100); }
		},
		clientUpdate: () => { },
		startSubmitInput: () => {
			ShowSubmitted(sys, () => roundNumber);
			endOfRoundSound.play();
		},
		getParmCount: () => choices.length,
		getParm: (id: number) => choices[id]
	});

	var tick: number = 0, choiceLeft: number = 50, choiceUp: number = 118;
	var lastRoundUpdate: number = 0;

	var bkg: ent = new ent(sys.w, 0, 0, 'racinggame/audienceInterfaceBG.png', {
		upd: e => {
			if (roundNumber != lastRoundUpdate) {
				lastRoundUpdate = roundNumber;
			}
		}
	});

	// ______________________

	function fnt(sz: number): string {
		return '' + sz + 'px Anton';
	}

	new enttx(sys.w, 10, 10, "CAR PERFORMANCE", { font: fnt(20), fill: '#fff' });

	for (var k = 0; k < 5; k++) {
		new enttx(sys.w, 10, 48 + (72 - 48) * k, statNames[k] + ":", { font: fnt(16), fill: '#fff' });
	}

	// ______________________

	new enttx(sys.w, 12, 228, "CASING TECH", { font: fnt(20), fill: '#fff' });

	new enttx(sys.w, 15, 256, "Piston Tech:", { font: fnt(16), fill: '#fff' });
	new enttx(sys.w, 15, 275, "Sparkplug Tech:", { font: fnt(16), fill: '#fff' });

	// ______________________

	new enttx(sys.w, 152, 10, "OPTIONS", { font: fnt(20), fill: '#fff' });

	new ent(sys.w, 158, 36, "racinggame/selected.png");
	new ent(sys.w, 158, 92, "racinggame/unselected.png");
	new ent(sys.w, 158, 150, "racinggame/unselected.png");

	new enttx(sys.w, 158, 36, "Featherwate", { font: fnt(16), fill: '#0' });
	new enttx(sys.w, 158, 92, "Unguzzler", { font: fnt(16), fill: '#0' });
	new enttx(sys.w, 158, 150, "Hulkite", { font: fnt(16), fill: '#0' });

	var picChangeTick = 0;
	var picFrame = 0;

	for (var k = 1; k < 4; k++) {
		//"carPart_" + k + "_" + j
		new ent(sys.w, 220, 40, debugAllCarParts[carSet*9 + (k-1)*3+2], {scalex: .5, scaley: .5});
	}

	new enttx(sys.w, 220, 178, "-1 Weight, +1 Power", { font: fnt(24), fill: '#fff' });
}