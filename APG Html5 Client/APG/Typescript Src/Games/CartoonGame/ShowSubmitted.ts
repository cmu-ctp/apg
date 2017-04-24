function ShowSubmittedCache(c: Cacher): void {
	c.images('cartoongame/imgs', ['ClientUI3.png']);
	c.sounds('cartoongame/snds/fx', ['strokeup2.mp3']);
	c.googleWebFonts(['Caveat Brush']);
}

function ShowSubmitted(apg: APGSys, getRoundNumber: () => number): void {
	var inputUsed: boolean = false;
	var clickSound: Phaser.Sound = apg.g.add.audio('cartoongame/snds/fx/strokeup2.mp3', 1, false);

	apg.ResetServerMessageRegistry();

	new ent(apg.g.world, 0, 0, 'cartoongame/imgs/ClientUI3.png', {
		upd: e => {
			if (apg.g.input.activePointer.isDown && !inputUsed) {
				inputUsed = true;
				MainPlayerInput(apg);
				clickSound.play();
			}
		}
	});

	new enttx(apg.g.world, 60, 50 + 20, "Chosen For Round " + getRoundNumber() + ":", { font: '16px Caveat Brush', fill: '#222' });

}