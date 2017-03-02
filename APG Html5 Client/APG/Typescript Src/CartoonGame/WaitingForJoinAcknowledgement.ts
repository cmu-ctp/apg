addCache(l => {
	l.image('clientbkg', 'assets/imgs/ClientUI.png');
	l.audio('endOfRound', 'assets/snds/fx/strokeup4.mp3');
});
function WaitingForJoinAcknowledement(sys: APGSys): void {
	var endOfRoundSound: Phaser.Sound = sys.g.add.audio('endOfRound', 1, false);
	var endSubgame: boolean = false, timeOut: number = 0;
	sys.messages = new APGSubgameMessageHandler({
		onJoin: () => {
			endSubgame = true;
			endOfRoundSound.play();
			MainPlayerInput(sys);
			return true;
		}
	});
	new Ent(sys.w, 60, 0, 'clientbkg', {
		alpha: 0,
		upd: e => {
			timeOut++;
			if (timeOut > ticksPerSecond * 30) {
				endSubgame = true;
				WaitingToJoin(sys);
				return;
			}
			if (endSubgame) {
				e.x = e.x * .7 + .3 * -30;
				if (e.x < -27) e.destroy(true);
				return;
			}
			e.x = e.x * .7 + .3 * 0;
			e.alpha = e.alpha * .8 + .2 * 1;
		}
	});
	var tick: number = 0;
	new EntTx(sys.w, 160, 50 + 20, "Waiting to Connect...", { font: '16px Arial', fill: '#222' }, {
		alpha: 0,
		upd: e => {
			if (endSubgame) {
				e.x = e.x * .7 + .3 * -50;
				if (e.x < -47) e.destroy(true);
				return;
			}
			tick++;
			e.x = e.x * .7 + .3 * 60;
			e.alpha = e.alpha * .8 + .2 * (.5 + .5 * Math.cos(tick * .01));
		}
	});
}