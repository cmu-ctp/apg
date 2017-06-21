function JoinAcknowledgeCache(c: Cacher): void {
	c.images('cartoongame/imgs', ['ClientUI3.png']);
	c.sounds('cartoongame/snds/fx', ['strokeup4.mp3']);
	c.googleWebFonts(['Caveat Brush']);
}

interface ClientJoinParms{
    name: string;
    team: number;
    playerID: number;
    started:boolean;
}

interface EmptyParms {
}

declare var ticksPerSecond: any;

function WaitingForJoinAcknowledgeTestSequence(apg: APGSys): void {
    apg.ClearLocalMessages();
    apg.WriteLocalAsServer<ClientJoinParms>(.1, "join", { name: apg.playerName, started: true, playerID: 6, team: 1 });
}

function WaitingForJoinAcknowledement(apg: APGSys): void {
	var endOfRoundSound: Phaser.Sound = apg.g.add.audio('cartoongame/snds/fx/strokeup4.mp3', 1, false);
	var endSubgame: boolean = false, timeOut: number = 0, retry:number = 0;

    var playerID = -1, team = -1, connected=false;
	apg.ResetServerMessageRegistry()
		.Register<ClientJoinParms>("join", p => {
			if (p.name != apg.playerName) return;

            if (p.started) {
                endSubgame = true;
                endOfRoundSound.play();
                MainPlayerInput(apg, p.playerID, p.team);
            }
            else {
                connected = true;
                playerID = p.playerID;
                team = p.team;
                msg.tx = "Connected!  Waiting for streamer to start playing!";
            }
        })
        .Register<EmptyParms>("start", p => {
            endSubgame = true;
            endOfRoundSound.play();
            MainPlayerInput(apg, playerID, team);
        });

    if (apg.networkTestSequence) {
        WaitingForJoinAcknowledgeTestSequence(apg);
    }

	new ent(apg.g.world, 60, 0, 'cartoongame/imgs/ClientUI3.png', {
		alpha: 0,
        upd: e => {
            if (!connected) {
                retry++;
                if (retry > ticksPerSecond * 4) {
                    retry = 0;
                    apg.WriteToServer<EmptyParms>("join", {});
                }
                timeOut++;
                if (timeOut > ticksPerSecond * 20) {
                    endSubgame = true;
                    WaitingToJoin(apg, "Something went wrong - no response from the streamer's game...  Make sure the streamer is online and still playing this game.");
                    return;
                }
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
	var msg = new enttx(apg.g.world, 320, 100 + 60, "Trying to Connect to Streamer's Game - Hold on a Second...", { font: '32px Caveat Brush', fill: '#222' }, {
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