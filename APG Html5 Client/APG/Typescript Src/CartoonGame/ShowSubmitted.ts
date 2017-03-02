addCache(l => {
	l.image('clientbkg', 'assets/imgs/ClientUI.png');
	l.audio('clickThrough', 'assets/snds/fx/strokeup2.mp3');
});

function ShowSubmitted(sys: APGSys, getRoundNumber: () => number): void {
	var inputUsed: boolean = false;
	var clickSound: Phaser.Sound = sys.g.add.audio('clickThrough', 1, false);

	sys.messages = new APGSubgameMessageHandler({});

	new Ent(sys.w, 0, 0, 'clientbkg', {
		upd: e => {
			if (sys.g.input.activePointer.isDown && !inputUsed) {
				inputUsed = true;
				MainPlayerInput(sys);
				clickSound.play();
			}
		}
	});

	new EntTx(sys.w, 60, 50 + 20, "Chosen For Round " + getRoundNumber() + ":", { font: '16px Arial', fill: '#222' });

}