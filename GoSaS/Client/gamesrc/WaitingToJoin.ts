﻿function WaitingToJoinCache(c: Cacher): void {
	c.images('cartoongame/imgs', ['ClientUI3.png']);
	c.images('cartoongame/imgs/tutorial', ['clientHowToPlay.jpg', 'clientIngameScreen.jpg', 'clientMainTitle.jpg', 'clientPickAction.jpg', 'clientPickMove.jpg', 'clientWatchStats.jpg', 'clientPlayerAction.jpg', 'clientFinalClick.jpg']);
	c.sounds('cartoongame/snds/fx', ['strokeup2.mp3']);
	c.googleWebFonts(['Caveat Brush']);}
interface EmptyParms{ }

interface PlayerMetadata { id:number; x:number; y:number; }

function WaitingToJoinTestSequence(apg: APGSys): void { apg.ClearLocalMessages();}
function WaitingToJoin(apg: APGSys, previousMessage: string = ""): void {

    var clickSound: Phaser.Sound = apg.g.add.audio('cartoongame/snds/fx/strokeup2.mp3', .4, false);
    var inputUsed: boolean = false, endSubgame: boolean = false; var curRound: RoundUpdate = { round: 1, time: 45 };

    function tryEnd(e: enttx | ent, x: number): boolean { if (endSubgame) { e.x = e.x * .7 + .3 * x; if (e.x < x + 3) e.eliminate(); return true; } return false; }

    apg.ResetServerMessageRegistry().SetKeepAliveStatus(false);
    apg.WriteToServer<EmptyParms>("debugAppLaunch", {});

	var vx = 0, vy = 0;

	apg.Register<PlayerMetadata>("frame", p => {
		vx = p.x; vy = p.y;
	});

	var curPage: number = 0;
	var pointerDownLatch: boolean = false;
	var pageEnt: ent;
	var pageNames = ['clientMainTitle', 'clientHowToPlay', 'clientPickAction', 'clientPickMove', 'clientWatchStats', 'clientIngameScreen', 'clientPlayerAction', 'clientFinalClick'];
	var doneWithTutorial: boolean = false;

	function makeTutorialPage(label: string):ent {
		return new ent(apg.g.world, 240, 0, 'cartoongame/imgs/tutorial/' + label + '.jpg', {
			health: 2,
			upd: e => {
				if (e.health == 1) {
					e.y = e.y * .7 + .3 * -240;
					if (e.y < -230) e.eliminate();}}});}


	new ent(apg.g.world, 0, 0, 'cartoongame/imgs/ClientUI3.png', {
		scalex:0,scaley:0,
		upd: e => {
			if (tryEnd(e, -30)) return;
			if (apg.g.input.activePointer.isDown) {
				if (pointerDownLatch == false) {
					pageEnt.health = 1;
					curPage++;
					if (curPage < pageNames.length) pageEnt = makeTutorialPage(pageNames[curPage]);
					else {doneWithTutorial = true;}}
				pointerDownLatch = true;}
			else {pointerDownLatch = false;}
            if ( apg.g.input.activePointer.isDown && doneWithTutorial && !inputUsed) {
				inputUsed = true;
				clickSound.play();
				WaitingForJoinAcknowledement(apg);
				apg.WriteToServer<EmptyParms>("join", {});
				endSubgame = true;
			}
		}
	});

	pageEnt = makeTutorialPage('clientMainTitle');
	

	var tc: number = 0, textColor = { font: '32px Caveat Brush', fill: '#222' }, textColor2 = { font: '20px Caveat Brush', fill: '#811', wordWrap: true, wordWrapWidth: 430 };
	if (previousMessage != "") {new enttx(apg.g.world, 200, 60, previousMessage, textColor2, {upd: e => {if (tryEnd(e, -50)) return;}});}
    /*else{ new enttx(apg.g.world, 140, 60, "Thanks for helping playtest Gods of Socks and Spoons!", textColor2, {upd: e => {if (tryEnd(e, -50)) return;}});
        new enttx(apg.g.world, 140, 160, "Two streamers face off.  Help one beat the other.  Each round, perform an action and then move - then the streamer will protect you in an action phase.  Only you can hurt and defeat the foe streamer (with items and special abilities) and win!  ", textColor2, {
			upd: e => { if (tryEnd(e, -50)) return; }
		});
	}*/

	/*new enttx(apg.g.world, 140, 380, "Tap or click to Connect to the Streamer's Game!", textColor, {
		upd: e => { if (tryEnd(e, -50)) return; tc++; e.visible = (tc % 120 < 60) ? false : true; }
	});*/

	if (apg.networkTestSequence) WaitingToJoinTestSequence(apg);
}