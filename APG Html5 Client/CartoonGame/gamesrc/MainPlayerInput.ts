// transitions between rounds - need to make all the parts of player update work.
// how to play - where?
// joining a game in progress versus a waiting game?
// game over - get kicked out!
// need to make (FAILED TO JOIN) not bust.
// make action icons be write in streamer game

// bit.ly link on screen between rounds
// server game ending?
// let players pick unalloced characters?
// variable number of choices
// on acceptance - shrink app
// stat update.
// player stat update effect?

function CartoonAssetCache(c: Cacher): void {
    c.images('cartoongame/imgs', ['blueorb.png', 'flag1small.png', 'flag2small.png', 'littleperson.png', 'littleperson2.png', 'bodyleft.png', 'bodyright.png', 'bkg_guide4.png']);
    c.images('cartoongame/imgs/buildings', ['building1.png', 'building2.png', 'building3.png', 'building4.png', 'building5.png', 'building6.png']);
    c.images('cartoongame/imgs/heads', ['headbig1.png', 'headbig2.png', 'headbig3.png', 'headbig4.png', 'headbig5.png', 'headbig6.png', 'headbig7.png', 'headbig8.png', 'headbig9.png', 'headbig10.png', 'headbig11.png', 'headbig12.png', 'headbig13.png', 'headbig14.png', 'headbig15.png', 'headbig16.png', 'headbig17.png', 'headbig18.png', 'headbig19.png', 'headbig20.png']);
    c.images('cartoongame/imgs/sheads', ['shead1.png', 'shead2.png', 'shead3.png', 'shead4.png', 'shead5.png', 'shead6.png', 'shead7.png', 'shead8.png', 'shead9.png', 'shead10.png', 'shead11.png', 'shead12.png', 'shead13.png', 'shead14.png', 'shead15.png', 'shead16.png', 'shead17.png', 'shead18.png', 'shead19.png', 'shead20.png']);
	c.sounds('cartoongame/snds/fx', ['strokeup2.mp3', 'strokeup.mp3', 'strokeup4.mp3']);
	c.json(['cartoongame/json/TestActions.json']);

	WaitingToJoinCache(c);
	JoinAcknowledgeCache(c);
	ShowSubmittedCache(c);
	ButtonCache(c);
}

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
    st: number[];
    rs: number[];
}

function MainInputTestSequence(apg: APGSys): void {
    apg.ClearLocalMessages();
    var roundLength: number = 45;
    for (var j = 1; j <= 10; j++ ){
        var roundTimeOffset: number = (j - 1) * roundLength;
        for (var k = 0; k < roundLength+5; k += 5)apg.WriteLocalAsServer<RoundUpdate>(roundTimeOffset + k, "time", { round: j, time: roundLength - k });
        apg.WriteLocalAsServer<SelectionParms>(roundTimeOffset + roundLength, "submit", { choices: [] });
        apg.WriteLocalAsServer<PlayerUpdate>(roundTimeOffset + roundLength, "pl", { nm: apg.playerName, st: [10,10,-1, -1], rs:[0,0,0,0,0,0,0,0] });
    }
}

function MainPlayerInput(apg: APGSys, id:number ): void {
    var w = new Phaser.Group(apg.g);
    apg.g.world.add(w);
    //var w = apg.g.world;

	var fontName: string = "Caveat Brush";

	var actions: any = apg.JSONAssets['cartoongame/json/TestActions.json'];

	var endOfRoundSound: Phaser.Sound = apg.g.add.audio('cartoongame/snds/fx/strokeup4.mp3', 1, false);
	var warningSound: Phaser.Sound = apg.g.add.audio('cartoongame/snds/fx/strokeup.mp3', 1, false);

    var cols = ['#369', '#693', '#936', '#963', '#639', '#396', '#888', '#933', '#393', '#339'];
    var cols2 = [0x306090, 0x609030, 0x903060, 0x906030, 0x603090, 0x309060, 0x808080, 0x903030, 0x309030, 0x303090];

    var headNum: number = id;
    var nameColor: string = cols[(id - 1) % 10];
    var bodyColor: number = cols2[(id - 1) % 10];
    var team: number = id > 10 ? 2 : 1;
    var actionChoices = [0, 0, 0];

    function addActions(srcChoices: number[], setToolTip: (str: string) => void): ButtonCollection[] {
		var curCollection: number = 0;
		function add(choiceSet: ActionEntry[]): ButtonCollection {
			var id: number = curCollection;
            curCollection++;
            return new ButtonCollection( w, apg, 22, setToolTip, v => srcChoices[id] = v, choiceSet);
		}

		var o = [];
		for (var j = 0; j < actions.length; j++) {
			var p = [];
            for (var k2 = 0; k2 < actions[j].choices.length; k2++) {
                var k = k2;
                var r = actions[j].choices[k];
                var xv: number = r.x;
                if (j == 0 && team == 2) xv = 320 - xv;
                p.push(new ActionEntry(r.name, r.tip, r.pic, actions[j].x + xv, actions[j].y + r.y));
			}
			o.push(add(p));
		}
		return o;
	}

	var timer: number = 0;
	var roundNumber: number = 1;
	var choices: number[] = [1, 1, 1, 1, 1, 1];
    var myStats: PlayerUpdate = { nm: "", hp: 5, loc:3,row:1 };

    var locationChoice: number = -1;
    var stanceChoice: number = -1;

    function reset():void {
        choiceButtons[0].selected = locationChoice = -1;
        choiceButtons[1].selected = stanceChoice = -1;
        choiceButtons[2].selected = -1;
        choiceButtons[3].selected = -1;
        choiceButtons[4].selected = -1;

        selected = 0;

        actionChoices = [-1, -1, -1];
        choices[0] = -1;
        choices[1] = -1;

        actionLabel.tx = "Action 1 / 3";
        actionLabels[0].tx = "Location:";
        actionLabels[1].tx = "Row:";
        for (var j: number = 0; j < 3; j++) {
            actionLabels[j + 2].tx = "Action " + (j + 1) + ": ";
        }
    }

	apg.ResetServerMessageRegistry()
		.Register<RoundUpdate>("time", p => {
            timer = p.time;
            console.log("time " + timer);
			roundNumber = p.round;
			if (timer < 6) { warningSound.play('', 0, 1 - (timer * 15) / 100); }
		})
		.Register<PlayerUpdate>("pl", p => {
			if (p.nm != apg.playerName) return;
            myStats = p;
            if (p.row != -1) lastStance = p.row;
            if (p.loc != -1) lastLocationPos = p.loc;
            accepted = false;
            w.x = 0;
            reset();
		})
        .Register<SelectionParms>("submit", p => {
            for (var k = 0; k < 3; k++)choices[k + 2] = actionChoices[k];
            if (choices[0] == - 1) choices[0] = Math.floor(Math.random() * 6);
            if (choices[1] == - 1) choices[1] = Math.floor(Math.random() * 3);
            if (choices[2] == - 1) choices[2] = Math.floor(Math.random() * 6);
            if (choices[3] == - 1) choices[3] = Math.floor(Math.random() * 6);
            if (choices[4] == - 1) choices[4] = Math.floor(Math.random() * 6);
            //console.log("choices are " + choices);
			apg.WriteToServer<SelectionParms>("upd", { choices: choices });
		});

	var toolTip: string = "";
	function setToolTip(str: string): void { toolTip = str; }

	var tick: number = 0, tabButtons: ButtonCollection, choiceButtons: ButtonCollection[], actionLabels:enttx[];
    var actionLabel:enttx;
	var lastRoundUpdate: number = 0;

    var lastLocationPos: number = 2;
    var lastStance: number = 0;
    var headPic: string = 'cartoongame/imgs/heads/headbig'+headNum+'.png';
    var sheadPic: string = 'cartoongame/imgs/sheads/shead' + headNum +'.png';
    var bodyPic: string = 'cartoongame/imgs/body'+(team==1 ? 'right':'left')+'.png';

    var selected = 0;

    var accepted = false;

    new ent(w, 0, 0, 'cartoongame/imgs/bkg_guide4.png', {
		upd: e => {
            if (choiceButtons[0].selected != -1) {
                if (locationChoice == -1) {
                    var labels = ['Dance Club','Fishing Pond','Bed and Breakfast','Commuter Airport','Day Spa','Office Park'];
                    actionLabels[0].tx = "Location: " + labels[choiceButtons[0].selected];;
                }
                locationChoice = choiceButtons[0].selected;
            }
            if (choiceButtons[1].selected != -1) {
                if (stanceChoice == -1) {
                    var labels = ['Back Row', 'Middle Row', 'Front Row'];
                    actionLabels[1].tx = "Row: " + labels[choiceButtons[1].selected];
                }
                stanceChoice = choiceButtons[1].selected;
            }
            choiceButtons[0].update( locationChoice == -1 );
            choiceButtons[1].update(stanceChoice == -1);
            choiceButtons[2].update(selected < 3);
            choiceButtons[3].update(true);
            choiceButtons[4].update(locationChoice > -1 && stanceChoice > -1 && selected >= 3 );

            if (choiceButtons[3].selected == 0) {
                reset();
            }
            if (choiceButtons[4].selected != -1) {
                //w.destroy(true,true);
                w.x = 1000;
                accepted = true;
                choiceButtons[4].selected = -1;
            }
            if (choiceButtons[2].selected != -1) {
                // record choice here.
                actionChoices[selected] = choiceButtons[2].selected;
                if (selected < 3) {
                    actionLabels[selected + 2].tx = "Action " + (selected + 1) + ": " + choiceButtons[2].selectedName;
                }
				if (selected < 2) {
					actionLabels[selected+2].tx = "Action " + (selected + 1) + ": " + choiceButtons[2].selectedName;
                    actionLabel.tx = "Action " + (selected + 2) + " / 3";
                }
                else {
                    actionLabel.tx = "";
                }
                choiceButtons[2].selected = -1;
				selected++;
			}
		}
    });

    // 4->.266f, 6->.4f, 8->.533f
    var roundColors = ['#468', '#846', '#684'];

    new enttx(w, 260, 25, "Actions for ", { font: '36px ' + fontName, fill: '#444' });
    new enttx(w, 420, 25, "Round ", { font: '36px ' + fontName, fill: roundColors[1] }, {
        upd: e => {
            if (roundNumber != lastRoundUpdate) {
                e.text = "Round " + roundNumber;
                e.fill = roundColors[(roundNumber-1) % roundColors.length];
                lastRoundUpdate = roundNumber;
            }
        }
    });

    new ent(w, 70, 10, headPic);

    new enttx(w, 260, 140, "ToolTip", { font: '17px ' + fontName, fill: '#455', wordWrap: true, wordWrapWidth: 440 }, { upd: e => { e.text = toolTip; } });
    new enttx(w, 650, 354, "", { font: '40px ' + fontName, fill: '#688' }, {
        upd: e => {
            e.text = "" + timer;
            e.fill = roundColors[(roundNumber - 1) % roundColors.length];
        }
    });
    choiceButtons = addActions(choices, setToolTip);

    new enttx(w, 250, 110, "Tip", { font: '18px ' + fontName, fill: '#433' }, {upd: e => {e.visible = (toolTip == "") ? false : true;}});

    actionLabel = new enttx(w, 40, 110, "Action 1 / 3", { font: '24px ' + fontName, fill: '#A00' });
    
    new enttx(w, 700, 110, "Row", { font: '24px ' + fontName, fill: '#A00' }, { upd: e => { e.visible = choiceButtons[1].selected == -1 } });
    new ent(w, 740, 160 + lastStance * 64, bodyPic, { scalex: 1, scaley: 1, color: bodyColor, upd: e => { e.visible = choiceButtons[1].selected == -1 } });
    new ent(w, 731, 146 + lastStance * 64, sheadPic, { upd: e => { e.visible = choiceButtons[1].selected == -1 } });

    new enttx(w, 305, 260, "Location", { font: '24px ' + fontName, fill: '#A00' }, { upd: e => { e.visible = choiceButtons[0].selected == -1 } });
    new ent(w, 270, 265, 'cartoongame/imgs/flag' + (team == 1 ? 1 : 2) + 'small.png', { scalex: 1, scaley: 1, upd: e => { e.visible = choiceButtons[0].selected == -1 } });
    new ent(w, 680, 265, 'cartoongame/imgs/flag' + (team == 1 ? 1 : 2)+'small.png', { scalex: 1, scaley: 1, upd: e => { e.visible = choiceButtons[0].selected == -1 } });
    new ent(w, 330 + 64 * lastLocationPos, 16+285, bodyPic, { scalex: 1, scaley: 1, color:bodyColor, upd: e => { e.visible = choiceButtons[0].selected == -1 } });
    new ent(w, 320 + 64 * lastLocationPos, 16 +271, sheadPic, { upd: e => { e.visible = choiceButtons[0].selected == -1 } });
    new enttx(w, 320 + 64 * lastLocationPos, 16 +320, apg.playerName, { font: '12px ' + fontName, fill: nameColor }, { upd: e => { e.visible = choiceButtons[0].selected == -1 } });

    function category(msg: string, x: number, y: number): void {
        new enttx(w, x, y, msg, { font: '18px ' + fontName, fill: '#433' });
    }

    function inCategory(x: number, y: number, add: number, labels: string[]): enttx[] {
        var labelEnts: enttx[] = [];
        for (var k = 0; k < labels.length; k++) {
            labelEnts.push(new enttx(w, x, y + k * add, labels[k], { font: '14px ' + fontName, fill: '#211' }));
        }
        return labelEnts;
    }

    category("Stats", 144, 336);
	inCategory(154, 360, 13, ["Health:", "Stamina:", "Gold:", "Tacos:", "Silver:"]);

    category("Choices", 370, 336);
    actionLabels = inCategory(380, 360, 13, ["Location:","Row:","Action 1:", "Action 2:", "Action 3:"]);

    if (apg.networkTestSequence) MainInputTestSequence( apg );
}