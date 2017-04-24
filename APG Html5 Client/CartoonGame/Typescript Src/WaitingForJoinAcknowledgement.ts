function JoinAcknowledgeCache(c: Cacher): void {
	c.images('cartoongame/imgs', ['ClientUI3.png']);
	c.sounds('cartoongame/snds/fx', ['strokeup4.mp3']);
	c.googleWebFonts(['Caveat Brush']);
}

interface ClientJoinParms{
	name:string;
}

interface EmptyParms {
}

declare var ticksPerSecond: any;

function WaitingForJoinAcknowledement(apg: APGSys): void {
	var endOfRoundSound: Phaser.Sound = apg.g.add.audio('cartoongame/snds/fx/strokeup4.mp3', 1, false);
	var endSubgame: boolean = false, timeOut: number = 0, retry:number = 0;

	apg.ResetServerMessageRegistry()
		.Register<ClientJoinParms>("join", p => {
			if (p.name != apg.playerName) return;

			endSubgame = true;
			endOfRoundSound.play();
			MainPlayerInput(apg);
		});

	new ent(apg.g.world, 60, 0, 'cartoongame/imgs/ClientUI3.png', {
		alpha: 0,
		upd: e => {
			retry++;
			if (retry > ticksPerSecond * 4) {
				retry = 0;
				apg.WriteToServer<EmptyParms>("join", {});
			}
			timeOut++;
			if (timeOut > ticksPerSecond * 20) {
				endSubgame = true;
				WaitingToJoin(apg, "Something went wrong - no response from the streamer's game...  Make sure the streamer is online and still playing this game." );
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
	new enttx(apg.g.world, 320, 100 + 60, "Trying to Connect to Streamer's Game - Hold on a Second...", { font: '32px Caveat Brush', fill: '#222' }, {
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