function WaitingToJoinCache(c: Cacher): void {
	c.images('cartoongame/imgs', ['ClientUI3.png']);
	c.sounds('cartoongame/snds/fx', ['strokeup2.mp3']);
	c.googleWebFonts(['Caveat Brush']);
}

interface EmptyParms{
}

function WaitingToJoinTestSequence(apg: APGSys): void {
    apg.ClearLocalMessages();
    /*var roundLength: number = 15;
    for (var j = 1; j <= 10; j++) {
        var roundTimeOffset: number = (j - 1) * roundLength;
        for (var k = 0; k < roundLength + 5; k += 5)apg.WriteLocalAsServer<RoundUpdate>(roundTimeOffset + k, "time", { round: j, time: roundLength - k });
        apg.WriteLocalAsServer<PlayerUpdate>(roundTimeOffset + roundLength, "pl", { nm: apg.playerName, hp: 10, money: 100 });
    }*/
}

function WaitingToJoin(apg: APGSys, previousMessage:string = "" ): void {
	var clickSound: Phaser.Sound = apg.g.add.audio('cartoongame/snds/fx/strokeup2.mp3', .4, false);

	apg.ResetServerMessageRegistry();
    var inputUsed: boolean = false, endSubgame: boolean = false;

    var curRound: RoundUpdate = {round:1,time:45};

    apg.ResetServerMessageRegistry()
        .Register<RoundUpdate>("time", p => {

        })
        .Register<PlayerUpdate>("pl", p => {

        });

	new ent(apg.g.world, 0, 0, 'cartoongame/imgs/ClientUI3.png', {
		upd: e => {
			if (endSubgame) {
				e.x = e.x * .7 + .3 * -30;
				if (e.x < -27) e.destroy(true);
				return;
			}
			if (apg.g.input.activePointer.isDown && !inputUsed) {
				inputUsed = true;
				clickSound.play();
				WaitingForJoinAcknowledement(apg);
				apg.WriteToServer<EmptyParms>("join", {});
				endSubgame = true;
			}
		}
	});

	var tc: number = 0, textColor = { font: '32px Caveat Brush', fill: '#222' }, textColor2 = { font: '20px Caveat Brush', fill: '#811', wordWrap: true, wordWrapWidth: 430 };

	if (previousMessage != "") {
		new enttx(apg.g.world, 160, 2 * (50 + 20)+60, previousMessage, textColor2, {
			upd: e => {
				if (endSubgame) {
					e.x = e.x * .7 + .3 * -50;
					if (e.x < -47) e.destroy(true);
					return;
				}
			}
		});
	}

	new enttx(apg.g.world, 140, 2*(50 + 20)-20, "Tap or click to Connect to the Streamer's Game!", textColor, {
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
    if (apg.networkTestSequence) WaitingToJoinTestSequence(apg);
}