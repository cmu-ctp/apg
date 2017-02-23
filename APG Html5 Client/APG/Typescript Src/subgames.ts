addCache( l => {
	l.image('clientbkg', 'assets/imgs/ClientUI.png');
	l.audio('clickThrough', 'assets/snds/fx/strokeup2.mp3');
});
function WaitingToJoin(sys: APGSys): void {
	var clickSound: Phaser.Sound = sys.g.add.audio('clickThrough', 1, false);

	sys.messages = new MessageHandler({});
	var inputUsed: boolean = false, goAway: boolean = false;

	new Ent(sys.g.world, 0, 0, 'clientbkg', {
		upd: e => {
			if (goAway) {
				e.x = e.x * .7 + .3 * -30;
				if (e.x < -27) e.destroy(true);
				return;
			}
			if (sys.g.input.activePointer.isDown && !inputUsed) {
				inputUsed = true;
				clickSound.play();
				WaitingForJoinAcknowledement(sys);
				sys.network.join();
				goAway = true;
			}
		}
	});
	var tc: number = 0, textColor = { font: '16px Arial', fill: '#222' };
	new EntTx(sys.w, 60, 50 + 20, "Click to Join Game!", textColor, {
		upd: e => {
			if (goAway) {
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

addCache( l => {
	l.image('clientbkg', 'assets/imgs/ClientUI.png');
	l.audio('endOfRound', 'assets/snds/fx/strokeup4.mp3');
});
function WaitingForJoinAcknowledement(sys: APGSys): void {
	var endOfRoundSound: Phaser.Sound = sys.g.add.audio('endOfRound', 1, false);
	var goAway: boolean = false;
	sys.messages = new MessageHandler({
		onJoin: () => { endOfRoundSound.play(); MainPlayerInput(sys); return true; }
	});
	new Ent(sys.w, 60, 0, 'clientbkg', { alpha: 0,
		upd: e => {
			if (goAway) {
				e.x = e.x * .7 + .3 * -30;
				if (e.x < -27) e.destroy(true);
				return;
			}
			e.x = e.x * .7 + .3 * 0;
			e.alpha = e.alpha * .8 + .2 * 1;
		}
	});
	new EntTx(sys.w, 160, 50 + 20, "Waiting to Connect...", { font: '16px Arial', fill: '#222' }, { alpha: 0,
		upd: e => {
			if (goAway) {
				e.x = e.x * .7 + .3 * -50;
				if (e.x < -47) e.destroy(true);
				return;
			}
			e.x = e.x * .7 + .3 * 60;
			e.alpha = e.alpha * .8 + .2 * 1;
		}
	});
}

addCache( l => {
	l.image('clientbkg', 'assets/imgs/ClientUI.png');
	l.audio('clickThrough', 'assets/snds/fx/strokeup2.mp3');
});

function ShowSubmitted (sys: APGSys, getRoundNumber: () => number):void {
	var inputUsed: boolean = false;
	var clickSound: Phaser.Sound = sys.g.add.audio('clickThrough', 1, false);

	sys.messages = new MessageHandler({});

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

addCache( l => {
	l.image('clientbkg', 'assets/imgs/ClientUI.png'); l.image('blueorb', 'assets/imgs/blueorb.png');
	l.audio('clickThrough', 'assets/snds/fx/strokeup2.mp3');
	l.audio('warning', 'assets/snds/fx/strokeup.mp3'); l.audio('endOfRound', 'assets/snds/fx/strokeup4.mp3');
});
function MainPlayerInput(sys: APGSys): void {
	function makeButtonSet(baseX: number, baseY: number, xAdd: number, yAdd: number, size: number, highlightColor: string, baseColor: string, setToolTip: (str: string) => void, setOption: (val: number) => void, buttonsInit: ActionEntry[]): ButtonCollection {
		return new ButtonCollection(sys, baseX, baseY, xAdd, yAdd, size, highlightColor, baseColor, setToolTip, setOption, buttonsInit);
	}
	function addActionSet(setToolTip: (str: string) => void): ButtonCollection {
		var o = [];
		for (var j = 0; j < sys.gameActions.length; j++)o.push(new ActionEntry(sys.gameActions[j].name, ""));
		return makeButtonSet(40, 80, 70, 0, 18, '#F00000', '#200000', setToolTip, v => { }, o);
	}
	function addActions(srcChoices: number[], setToolTip: (str: string) => void): ButtonCollection[] {
		var choiceLeft: number = 50, choiceUp: number = 118;
		var curCollection: number = 0;
		function add(choices: ActionEntry[]): ButtonCollection {
			var id: number = curCollection;
			curCollection++;
			return makeButtonSet(choiceLeft, choiceUp, 0, 20, 14, '#F00000', '#200000', setToolTip, v => srcChoices[id] = v, choices);
		}
		function st(name: string, tip: string): ActionEntry { return new ActionEntry(name, tip); }

		var o = [];
		for (var j = 0; j < sys.gameActions.length; j++) {
			var p = [];
			for (var k = 0; k < sys.gameActions[j].choices.length; k++) {
				var r = sys.gameActions[j].choices[k];
				p.push(st(r.name, r.tip));
			}
			o.push(add(p));
		}
		return o;
	}

	var timer: number = 0;
	var roundNumber: number = 1;
	var choices: number[] = [1, 1, 1, 1, 1, 1];

	var endOfRoundSound: Phaser.Sound = sys.g.add.audio('endOfRound', 1, false);
	var warningSound: Phaser.Sound = sys.g.add.audio('warning', 1, false);

	sys.messages = new MessageHandler({
		timeUpdate: (round, time) => {
			timer = time;
			roundNumber = round;
			if (timer < 6) { warningSound.play('', 0, 1 - (timer * 15) / 100); }
		},
		clientUpdate: () => { },
		startSubmitInput: () => {
			ShowSubmitted(sys, () => roundNumber);
			endOfRoundSound.play();
		},
		getParmCount: () => choices.length,
		getParm: (id: number) => choices[id]
	});

	var toolTip: string = "";
	function setToolTip(str: string): void { toolTip = str; }

	var tick: number = 0, choiceLeft: number = 50, choiceUp: number = 118, tabButtons: ButtonCollection, choiceButtons: ButtonCollection[], bkg = new Image(); bkg.src = 'ClientUI.png';
	var labelColor: string = '#608080';
	var roundLabel: EntTx, toolTipLabel: EntTx, nextChoiceLabel: EntTx;
	var lastRoundUpdate: number = 0;

	new Ent(sys.w, 0, 0, 'clientbkg', {
		upd: e => {
			if (roundNumber != lastRoundUpdate) {
				roundLabel.text = "Actions for Round " + roundNumber;
				lastRoundUpdate = roundNumber;
			}
			tabButtons.update(true);
			for (var j: number = 0; j < choiceButtons.length; j++)choiceButtons[j].update(tabButtons.selected == j);
			toolTipLabel.text = toolTip;
			nextChoiceLabel.text = "Action Selected in " + timer + " Seconds";
		}
	});
	roundLabel = new EntTx(sys.w, 120, 30, "Actions for Round ", { font: '28px Calbrini', fill: '#688' });
	toolTipLabel = new EntTx(sys.w, choiceLeft + 80, 118, "ToolTip", { font: '10px Calbrini', fill: '#688' });
	nextChoiceLabel = new EntTx(sys.w, 120, 260, "Actions Selected in", { font: '14px Calbrini', fill: '#688' });
	tabButtons = addActionSet(setToolTip);
	choiceButtons = addActions(choices, setToolTip);
}

addCache( l => {
	l.image('clientbkg', 'assets/imgs/ClientUI.png'); l.image('blueorb', 'assets/imgs/blueorb.png');
	l.audio('clickThrough', 'assets/snds/fx/strokeup2.mp3');
	l.audio('warning', 'assets/snds/fx/strokeup.mp3'); l.audio('endOfRound', 'assets/snds/fx/strokeup4.mp3');
});
function RacingInput (sys: APGSys): void {
	function makeButtonSet(baseX: number, baseY: number, xAdd: number, yAdd: number, size: number, highlightColor: string, baseColor: string, setToolTip: (str: string) => void, setOption: (val: number) => void, buttonsInit: ActionEntry[]): ButtonCollection {
		return new ButtonCollection(sys, baseX, baseY, xAdd, yAdd, size, highlightColor, baseColor, setToolTip, setOption, buttonsInit);
	}
	function addActionSet(setToolTip: (str: string) => void): ButtonCollection {
		var o = [];
		for (var j = 0; j < sys.gameActions.length; j++)o.push(new ActionEntry(sys.gameActions[j].name, ""));
		return makeButtonSet(40, 80, 70, 0, 18, '#F00000', '#200000', setToolTip, v => { }, o);
	}
	function addActions(srcChoices: number[], setToolTip: (str: string) => void): ButtonCollection[] {
		var choiceLeft: number = 50, choiceUp: number = 118;
		var curCollection: number = 0;
		function add(choices: ActionEntry[]): ButtonCollection {
			var id: number = curCollection;
			curCollection++;
			return makeButtonSet(choiceLeft, choiceUp, 0, 20, 14, '#F00000', '#200000', setToolTip, v => srcChoices[id] = v, choices);
		}
		function st(name: string, tip: string): ActionEntry { return new ActionEntry(name, tip); }

		var o = [];
		for (var j = 0; j < sys.gameActions.length; j++) {
			var p = [];
			for (var k = 0; k < sys.gameActions[j].choices.length; k++) {
				var r = sys.gameActions[j].choices[k];
				p.push(st(r.name, r.tip));
			}
			o.push(add(p));
		}
		return o;
	}

	var timer: number = 0;
	var roundNumber: number = 1;
	var choices: number[] = [1, 1, 1, 1, 1, 1];

	var endOfRoundSound: Phaser.Sound = sys.g.add.audio('endOfRound', 1, false);
	var warningSound: Phaser.Sound = sys.g.add.audio('warning', 1, false);

	sys.messages = new MessageHandler({
		timeUpdate: (round, time) => {
			timer = time;
			roundNumber = round;
			if (timer < 6) { warningSound.play('', 0, 1 - (timer * 15) / 100); }
		},
		clientUpdate: () => { },
		startSubmitInput: () => {
			ShowSubmitted(sys, () => roundNumber);
			endOfRoundSound.play();
		},
		getParmCount: () => choices.length,
		getParm: (id: number) => choices[id]
	});

	var toolTip: string = "";
	function setToolTip(str: string): void { toolTip = str; }

	var tick: number = 0, choiceLeft: number = 50, choiceUp: number = 118, tabButtons: ButtonCollection, choiceButtons: ButtonCollection[], bkg = new Image(); bkg.src = 'ClientUI.png';
	var labelColor: string = '#608080';
	var roundLabel: EntTx, toolTipLabel: EntTx, nextChoiceLabel: EntTx;
	var lastRoundUpdate: number = 0;

	new Ent(sys.w, 0, 0, 'clientbkg', {
		upd: e => {
			if (roundNumber != lastRoundUpdate) {
				roundLabel.text = "Actions for Round " + roundNumber;
				lastRoundUpdate = roundNumber;
			}
			tabButtons.update(true);
			for (var j: number = 0; j < choiceButtons.length; j++)choiceButtons[j].update(tabButtons.selected == j);
			toolTipLabel.text = toolTip;
			nextChoiceLabel.text = "Action Selected in " + timer + " Seconds";
		}
	});
	roundLabel = new EntTx(sys.w, 120, 30, "Actions for Round ", { font: '28px Calbrini', fill: '#688' });
	toolTipLabel = new EntTx(sys.w, choiceLeft + 80, 118, "ToolTip", { font: '10px Calbrini', fill: '#688' });
	nextChoiceLabel = new EntTx(sys.w, 120, 260, "Actions Selected in", { font: '14px Calbrini', fill: '#688' });
	tabButtons = addActionSet(setToolTip);
	choiceButtons = addActions(choices, setToolTip);
}