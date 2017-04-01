cacheImages('assets/imgs', ['ClientUI.png']);
cacheSounds('assets/snds/fx', ['strokeup2.mp3', 'strokeup.mp3','strokeup4.mp3']);
cacheJSONs(['TestActions.json']);

interface RoundUpdate {
	round: number;
	time: number;
}

interface EmptyParms {
}

interface SelectionParms {
	choices: number[];
}

function MainPlayerInput(sys: APGSys): void {
	var fontName: string = "Caveat Brush";

	var actions: any = sys.JSONAssets['TestActions.json'];

	var endOfRoundSound: Phaser.Sound = sys.g.add.audio('assets/snds/fx/strokeup4.mp3', 1, false);
	var warningSound: Phaser.Sound = sys.g.add.audio('assets/snds/fx/strokeup.mp3', 1, false);


	function makeButtonSet(baseX: number, baseY: number, xAdd: number, yAdd: number, size: number, highlightColor: string, baseColor: string, setToolTip: (str: string) => void, setOption: (val: number) => void, buttonsInit: ActionEntry[]): ButtonCollection {
		return new ButtonCollection(sys, baseX, baseY, xAdd, yAdd, size, highlightColor, baseColor, setToolTip, setOption, buttonsInit);
	}
	function addActionSet(setToolTip: (str: string) => void): ButtonCollection {
		var o = [];
		for (var j = 0; j < actions.length; j++)o.push(new ActionEntry(actions[j].name, ""));
		return makeButtonSet(40, 80, 70, 0, 18, '#F00000', '#200000', setToolTip, v => { }, o);
	}
	function addActions(srcChoices: number[], setToolTip: (str: string) => void): ButtonCollection[] {
		var choiceLeft: number = 50, choiceUp: number = 118;
		var curCollection: number = 0;
		function add(choiceSet: ActionEntry[]): ButtonCollection {
			var id: number = curCollection;
			curCollection++;
			return makeButtonSet(choiceLeft, choiceUp, 0, 20, 14, '#F00000', '#200000', setToolTip, v => srcChoices[id] = v, choiceSet);
		}
		function st(name: string, tip: string): ActionEntry { return new ActionEntry(name, tip); }

		var o = [];
		for (var j = 0; j < actions.length; j++) {
			var p = [];
			for (var k = 0; k < actions[j].choices.length; k++) {
				var r = actions[j].choices[k];
				p.push(st(r.name, r.tip));
			}
			o.push(add(p));
		}
		return o;
	}

	var timer: number = 0;
	var roundNumber: number = 1;
	var choices: number[] = [1, 1, 1, 1, 1, 1];

	sys.handlers = new APGSubgameMessageHandler()
		.add<RoundUpdate>( "time", p => {
			timer = p.time;
			roundNumber = p.round;
			if (timer < 6) { warningSound.play('', 0, 1 - (timer * 15) / 100); }
		})
		.add<SelectionParms>( "submit", p => {
			sys.sendMessageToServer<SelectionParms>("upd", { choices: choices });
		});

	var toolTip: string = "";
	function setToolTip(str: string): void { toolTip = str; }

	var tick: number = 0, choiceLeft: number = 50, choiceUp: number = 118, tabButtons: ButtonCollection, choiceButtons: ButtonCollection[], bkg = new Image(); bkg.src = 'ClientUI.png';
	var labelColor: string = '#608080';
	var roundLabel: enttx, toolTipLabel: enttx, nextChoiceLabel: enttx;
	var lastRoundUpdate: number = 0;

	new ent(sys.w, 0, 0, 'assets/imgs/ClientUI.png', {
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
	roundLabel = new enttx(sys.w, 120, 30, "Actions for Round ", { font: '28px ' + fontName, fill: '#688' });
	toolTipLabel = new enttx(sys.w, choiceLeft + 80, 118, "ToolTip", { font: '10px ' + fontName, fill: '#688' });
	nextChoiceLabel = new enttx(sys.w, 120, 260, "Actions Selected in", { font: '14px ' + fontName, fill: '#688' });
	tabButtons = addActionSet(setToolTip);
	choiceButtons = addActions(choices, setToolTip);
}