cacheImages('cartoongame/imgs', ['ClientUI3.png']);
cacheSounds('cartoongame/snds/fx', ['strokeup2.mp3']);
cacheGoogleWebFonts(['Caveat Brush']);

interface EmptyParms{
}

function WaitingToJoin(apg: APGSys, previousMessage:string = "" ): void {
	var clickSound: Phaser.Sound = apg.g.add.audio('cartoongame/snds/fx/strokeup2.mp3', 1, false);

	apg.SetHandlers(new NetworkMessageHandler());
	var inputUsed: boolean = false, endSubgame: boolean = false;

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
		new enttx(apg.w, 160, 2 * (50 + 20)+60, previousMessage, textColor2, {
			upd: e => {
				if (endSubgame) {
					e.x = e.x * .7 + .3 * -50;
					if (e.x < -47) e.destroy(true);
					return;
				}
			}
		});
	}

	new enttx(apg.w, 140, 2*(50 + 20)-20, "Tap or click to Connect to the Streamer's Game!", textColor, {
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