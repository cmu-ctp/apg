cacheImages('assets/imgs', ['ClientUI3.png']);
cacheSounds('assets/snds/fx', ['strokeup4.mp3']);
cacheGoogleWebFonts(['Caveat Brush']);

interface ClientJoinParms{
	name:string;
}

interface EmptyParms {
}

function WaitingForJoinAcknowledement(sys: APGSys): void {
	var endOfRoundSound: Phaser.Sound = sys.g.add.audio('assets/snds/fx/strokeup4.mp3', 1, false);
	var endSubgame: boolean = false, timeOut: number = 0, retry:number = 0;

	sys.handlers = new APGSubgameMessageHandler()
		.add<ClientJoinParms>( "join", p => {
			if (p.name != sys.playerName) return;

			endSubgame = true;
			endOfRoundSound.play();
			MainPlayerInput(sys);
		});

	new ent(sys.w, 60, 0, 'assets/imgs/ClientUI3.png', {
		alpha: 0,
		upd: e => {
			retry++;
			if (retry > ticksPerSecond * 4) {
				retry = 0;
				sys.sendMessageToServer<EmptyParms>("join", {});
			}
			timeOut++;
			if (timeOut > ticksPerSecond * 20) {
				endSubgame = true;
				WaitingToJoin(sys, "Something went wrong - no response from the streamer's game...  Make sure the streamer is online and still playing this game." );
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
	new enttx(sys.w, 320, 100 + 60, "Trying to Connect to Streamer's Game - Hold on a Second...", { font: '32px Caveat Brush', fill: '#222' }, {
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