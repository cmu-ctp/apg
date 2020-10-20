function WaitingToJoinCache(c: Cacher): void {
	c.images('cartoongame/imgs', ['ClientUI3.png']);
	c.images('cartoongame/imgs/tutorial', ['clientHowToPlay.jpg', 'clientIngameScreen.jpg', 'clientMainTitle.jpg', 'clientPickAction.jpg', 'clientPickMove.jpg', 'clientWatchStats.jpg', 'clientPlayerAction.jpg', 'clientFinalClick.jpg']);
	c.sounds('cartoongame/snds/fx', ['strokeup2.mp3']);
	c.googleWebFonts(['Caveat Brush']);
}

interface EmptyParms{ }

function TutorialFlipbook(apg: APGSys, pageNames:string[] ) {
	function makeTutorialPage(label: string):ent {
		return new ent(apg.g.world, 240, 0, 'cartoongame/imgs/tutorial/' + label + '.jpg', {
			health: 2,
			upd: e => {
				if (e.health == 1) {
					e.y = e.y * .7 + .3 * -240;
					if (e.y < -230) e.eliminate();}}});}
	var pageEnt: ent = makeTutorialPage(pageNames[0]);
	var pointerDownLatch: boolean = false, curPage: number = 0;
	return () => {
		var doneWithTutorial: boolean = false;
		if (apg.g.input.activePointer.isDown) {
			if (pointerDownLatch == false) {
				pageEnt.health = 1;
				curPage++;
				if (curPage < pageNames.length) pageEnt = makeTutorialPage(pageNames[curPage]);
				else { doneWithTutorial = true; }}
			pointerDownLatch = true;}
		else { pointerDownLatch = false; }
		return doneWithTutorial;};}

function WaitingToJoinTestSequence(apg: APGSys): void { apg.ClearLocalMessages(); }

function WaitingToJoin(apg: APGSys, previousMessage: string = ""): void {

    apg.ResetServerMessageRegistry().SetKeepAliveStatus(false);
    apg.WriteToServer<EmptyParms>("debugAppLaunch", {});

	//var updateTutorial = TutorialFlipbook(apg, ['clientMainTitle', 'clientHowToPlay', 'clientPickAction', 'clientPickMove', 'clientWatchStats', 'clientIngameScreen', 'clientPlayerAction', 'clientFinalClick'] );
	var updateTutorial = TutorialFlipbook(apg, ['clientMainTitle']);

	var clickSound: Phaser.Sound = apg.g.add.audio('cartoongame/snds/fx/strokeup2.mp3', .4, false);
	var inputUsed: boolean = false, endSubgame: boolean = false;
	function tryEnd(e: enttx | ent, x: number): boolean { if (endSubgame) { e.x = e.x * .7 + .3 * x; if (e.x < x + 3) e.eliminate(); return true; } return false; }
	new ent(apg.g.world, 0, 0, 'cartoongame/imgs/ClientUI3.png', {
		scalex:0,scaley:0,
		upd: e => {
			if (tryEnd(e, -30)) return;
			var doneWithTutorial = updateTutorial();
            if ( apg.g.input.activePointer.isDown && doneWithTutorial && !inputUsed) {
				inputUsed = true;
				clickSound.play();
				WaitingForJoinAcknowledement(apg);
				apg.WriteToServer<EmptyParms>("join", {});
				endSubgame = true;}}});

	if (apg.networkTestSequence) WaitingToJoinTestSequence(apg);
}