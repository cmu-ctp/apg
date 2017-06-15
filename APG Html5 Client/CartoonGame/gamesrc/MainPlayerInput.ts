function CartoonAssetCache(c: Cacher): void {
	c.images('cartoongame/imgs', ['ClientUI3.png']);
	c.sounds('cartoongame/snds/fx', ['strokeup2.mp3', 'strokeup.mp3', 'strokeup4.mp3']);
	c.json(['cartoongame/json/TestActions.json']);

	WaitingToJoinCache(c);
	JoinAcknowledgeCache(c);
	ShowSubmittedCache(c);
	ButtonCache(c);
}

// 3 actions.

// left right up down
// defend build activate assist harvest heal
// up to 4 items

interface RoundUpdate {
	round: number;
	time: number;
}

interface EmptyParms {
}

interface SelectionParms {
	choices: number[];
}

interface PlayerUpdate{
	nm:string;
	hp:number;
	money:number;
}

function MainInputTestSequence(apg: APGSys): void {
    for (var j = 1; j <= 10; j++ ){
        var roundTimeOffset: number = (j - 1) * 45;
        for (var k = 0; k < 50; k += 5)apg.WriteLocalAsServer<RoundUpdate>(roundTimeOffset + k, "time", { round: j, time: 45 - k });
        apg.WriteLocalAsServer<SelectionParms>(roundTimeOffset + 45, "submit", { choices: [] });
        apg.WriteLocalAsServer<PlayerUpdate>(roundTimeOffset + 45, "pl", { nm: apg.playerName, hp: 10, money: 100 });
    }
}

function MainPlayerInput(apg: APGSys): void {
	var w = apg.g.world;

	var fontName: string = "Caveat Brush";

	var actions: any = apg.JSONAssets['cartoongame/json/TestActions.json'];

	var endOfRoundSound: Phaser.Sound = apg.g.add.audio('cartoongame/snds/fx/strokeup4.mp3', 1, false);
	var warningSound: Phaser.Sound = apg.g.add.audio('cartoongame/snds/fx/strokeup.mp3', 1, false);

	function makeButtonSet(baseX: number, baseY: number, xAdd: number, yAdd: number, size: number, highlightColor: string, baseColor: string, setToolTip: (str: string) => void, setOption: (val: number) => void, buttonsInit: ActionEntry[]): ButtonCollection {
		return new ButtonCollection(apg, baseX, baseY, xAdd, yAdd, size, highlightColor, baseColor, setToolTip, setOption, buttonsInit);
	}
	function addActions(srcChoices: number[], setToolTip: (str: string) => void): ButtonCollection[] {
		var choiceLeft: number = 170, choiceUp: number = 130;
		var curCollection: number = 0;
		function add(choiceSet: ActionEntry[]): ButtonCollection {
			var id: number = curCollection;
			curCollection++;
			return makeButtonSet(choiceLeft, choiceUp, 0, 60, 22, '#F00000', '#200000', setToolTip, v => srcChoices[id] = v, choiceSet);
		}
		function st(name: string, tip: string, pic:string ): ActionEntry { return new ActionEntry(name, tip, pic); }

		var o = [];
		for (var j = 0; j < actions.length; j++) {
			var p = [];
			var j2 = j;
			if (j2 == 1 || j2 == 2) j2 = 0;
			for (var k = 0; k < actions[j2].choices.length; k++) {
				var r = actions[j2].choices[k];
				p.push(st(r.name, r.tip, r.pic));
			}
			o.push(add(p));
		}
		return o;
	}

	var timer: number = 0;
	var roundNumber: number = 1;
	var choices: number[] = [1, 1, 1, 1, 1, 1];
	var myStats: PlayerUpdate = { nm: "", hp: 3, money: 0 };

	apg.ResetServerMessageRegistry()
		.Register<RoundUpdate>("time", p => {
			timer = p.time;
			roundNumber = p.round;
			if (timer < 6) { warningSound.play('', 0, 1 - (timer * 15) / 100); }
		})
		.Register<PlayerUpdate>("pl", p => {
			if (p.nm != apg.playerName) return;
			myStats = p;

			//choiceButtons[5].selected = -1;
			choiceButtons[4].selected = -1;
			choiceButtons[3].selected = -1;
			selected = 0;
			for (var j: number = 0; j < 3; j++) {
				actionLabels[j].tx = "Action " + (j + 1) + ": ";
				choiceButtons[j].selected = -1;
			}
		})
		.Register<SelectionParms>("submit", p => {
			apg.WriteToServer<SelectionParms>("upd", { choices: choices });
		});

	var toolTip: string = "";
	function setToolTip(str: string): void { toolTip = str; }

	var tick: number = 0, choiceLeft: number = 50, choiceUp: number = 118, tabButtons: ButtonCollection, choiceButtons: ButtonCollection[], actionLabels:enttx[];
	var labelColor: string = '#608080';
	var roundLabel: enttx, toolTipLabel: enttx, nextChoiceLabel: enttx;
	var lastRoundUpdate: number = 0;

	var selected = 0;

	new ent(w, 0, 0, 'cartoongame/imgs/ClientUI3.png', {
		upd: e => {
			if (roundNumber != lastRoundUpdate) {
				roundLabel.text = "Choices for Round " + roundNumber;
				lastRoundUpdate = roundNumber;
			}
			for (var j: number = 0; j < choiceButtons.length; j++)choiceButtons[j].update(selected == j);
			if (selected == 3 && choiceButtons[selected].selected == 1) {
				choiceButtons[selected].selected = -1;
				selected = 0;
				for (var j: number = 0; j < 3; j++) {
					actionLabels[j].tx = "Action " + (j + 1) + ": ";
					choiceButtons[j].selected = -1;
				}
			}
			if (choiceButtons[selected].selected != -1) {
				if (selected < 3) {
					actionLabels[selected].tx = "Action " + (selected + 1) + ": " + choiceButtons[selected].selectedName;
				}
				selected++;
			}
			toolTipLabel.text = toolTip;
			nextChoiceLabel.text = "" + timer;
		}
	});
	roundLabel = new enttx(w, 220, 25, "Actions for Round ", { font: '54px ' + fontName, fill: '#688' });
	toolTipLabel = new enttx(w, 420, 160, "ToolTip", { font: '20px ' + fontName, fill: '#455', wordWrap: true, wordWrapWidth: 330 });
	nextChoiceLabel = new enttx(w, 650, 350, "", { font: '40px ' + fontName, fill: '#688' });
	choiceButtons = addActions(choices, setToolTip);

	function category(msg: string, x: number, y: number ):void {
		new enttx(w, x, y, msg, { font: '18px ' + fontName, fill: '#433' });
	}

	function inCategory(x: number, y: number, add: number, labels: string[]): enttx[] {
		var labelEnts: enttx[] = [];
		for (var k = 0; k < labels.length; k++) {
			labelEnts.push( new enttx(w, x, y + k*add, labels[k], { font: '14px ' + fontName, fill: '#211' }) );
		}
		return labelEnts;
	}

	category("RESOURCES", 40, 100);
	inCategory(50, 120, 16, ["Health:", "Gold:", "Tacos:", "Silver:"]);

	/*category("STATS", 40, 120 + 64 + 8);
	inCategory(50, 120 + 64 + 8+20, 16, ["Defense:", "Action+", "Heal+", "Item Get+", "Work+"]);
	*/
	category("Actions", 40, 300);
    actionLabels = inCategory(50, 320, 16, ["Action 1:", "Action 2:", "Action 3:"]);

    if (apg.networkTestSequence) {
        MainInputTestSequence( apg );
    }
}