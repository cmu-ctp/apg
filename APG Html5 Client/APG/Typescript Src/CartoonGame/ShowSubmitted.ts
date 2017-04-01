cacheImages('assets/imgs', ['ClientUI.png']);
cacheSounds('assets/snds/fx', ['strokeup2.mp3']);
cacheGoogleWebFonts(['Caveat Brush']);
function ShowSubmitted(sys: APGSys, getRoundNumber: () => number): void {
	var inputUsed: boolean = false;
	var clickSound: Phaser.Sound = sys.g.add.audio('assets/snds/fx/strokeup2.mp3', 1, false);

	sys.handlers = new APGSubgameMessageHandler();

	new ent(sys.w, 0, 0, 'assets/imgs/ClientUI.png', {
		upd: e => {
			if (sys.g.input.activePointer.isDown && !inputUsed) {
				inputUsed = true;
				MainPlayerInput(sys);
				clickSound.play();
			}
		}
	});

	new enttx(sys.w, 60, 50 + 20, "Chosen For Round " + getRoundNumber() + ":", { font: '16px Caveat Brush', fill: '#222' });

}