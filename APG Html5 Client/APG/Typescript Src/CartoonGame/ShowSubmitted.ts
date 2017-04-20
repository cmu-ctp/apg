cacheImages('assets/imgs', ['ClientUI3.png']);
cacheSounds('assets/snds/fx', ['strokeup2.mp3']);
cacheGoogleWebFonts(['Caveat Brush']);
function ShowSubmitted(apg: APGSys, getRoundNumber: () => number): void {
	var inputUsed: boolean = false;
	var clickSound: Phaser.Sound = apg.g.add.audio('assets/snds/fx/strokeup2.mp3', 1, false);

	apg.SetHandlers( new NetworkMessageHandler() );

	new ent(apg.w, 0, 0, 'assets/imgs/ClientUI3.png', {
		upd: e => {
			if (apg.g.input.activePointer.isDown && !inputUsed) {
				inputUsed = true;
				MainPlayerInput(apg);
				clickSound.play();
			}
		}
	});

	new enttx(apg.w, 60, 50 + 20, "Chosen For Round " + getRoundNumber() + ":", { font: '16px Caveat Brush', fill: '#222' });

}