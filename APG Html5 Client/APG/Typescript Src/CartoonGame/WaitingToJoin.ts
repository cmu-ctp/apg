cacheImages('assets/imgs', ['ClientUI.png']);
cacheSounds('assets/snds/fx', ['strokeup2.mp3']);
cacheGoogleWebFonts(['Caveat Brush']);

function WaitingToJoin(sys: APGSys): void {
	var clickSound: Phaser.Sound = sys.g.add.audio('assets/snds/fx/strokeup2.mp3', 1, false);

	sys.messages = new APGSubgameMessageHandler({});
	var inputUsed: boolean = false, endSubgame: boolean = false;

	new ent(sys.g.world, 0, 0, 'assets/imgs/ClientUI.png', {
		upd: e => {
			if (endSubgame) {
				e.x = e.x * .7 + .3 * -30;
				if (e.x < -27) e.destroy(true);
				return;
			}
			if (sys.g.input.activePointer.isDown && !inputUsed) {
				inputUsed = true;
				clickSound.play();
				WaitingForJoinAcknowledement(sys);
				sys.network.join();
				endSubgame = true;
			}
		}
	});

	var tc: number = 0, textColor = { font: '16px Caveat Brush', fill: '#222' };
	new enttx(sys.w, 60, 50 + 20, "Click to Join Game!", textColor, {
		upd: e => {
			if (endSubgame) {
				e.x = e.x * .7 + .3 * -50;
				if (e.x < -47) e.destroy(true);
				return;
			}
			tc++;
			if (tc % 120 < 60) e.visible = false;
			else e.visible = true;
		}
	});

}