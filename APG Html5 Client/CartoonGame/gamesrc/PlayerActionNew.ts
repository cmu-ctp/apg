/* 
	I want a version of this that is capable of getting rid of itself in a self contained fashion.

	This should be a sub-module that takes in, as input, the two players and current stats. It should not be in charge of recieving messages.
*/

function PlayerActionNew(apg: APGSys, id: number, team: number): void {
    var w = new Phaser.Group(apg.g);
    apg.g.world.add(w);

	var fontName: string = "Caveat Brush";
	var actions: any = apg.JSONAssets['cartoongame/json/PlayActions.json'];
	var endOfRoundSound: Phaser.Sound = apg.g.add.audio('cartoongame/snds/fx/strokeup4.mp3', 1, false);
	var warningSound: Phaser.Sound = apg.g.add.audio('cartoongame/snds/fx/strokeup.mp3', 1, false);

    var itemIcons = ['stennisball', 'sbomb', 'shammer2', 'sscarymask', 'srocket2', 'sshield'];
    var itemIcons2 = ['ball', 'bomb', 'hammer', 'mask', 'rocket', 'shield'];

    var cols = ['#369', '#693', '#936', '#963', '#639', '#396', '#888', '#933', '#393', '#339'];
    var cols2 = [0x306090, 0x609030, 0x903060, 0x906030, 0x603090, 0x309060, 0x808080, 0x903030, 0x309030, 0x303090];

    var resources: number[] = [], foeResources: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    var extractResources = [[Resource.TBone, Resource.Corn], [Resource.Acid, Resource.Goo], [Resource.Corn, Resource.Beans], [Resource.FrothyDrink, Resource.Burger], [Resource.FrothyDrink, Resource.Bribe], [ Resource.Fries, Resource.Taco ]];
    var extractItems = [ ItemIds.Hammer, ItemIds.ScaryMask, ItemIds.Bomb, ItemIds.TennisBall, ItemIds.Rocket, ItemIds.Shield ];

    var resourceIcons = ['beer.png', 'burger.png', 'canofbeans.png', 'chemicals.png', 'chemicals2.png', 'corn.png', 'dollar2.png', 'fries.png', 'taco1.png', 'tbone_steak.png'];
    var firstAbilityCosts = [[Resource.Goo, Resource.Beans], [Resource.Goo, Resource.Corn], [Resource.Goo, Resource.Fries], [Resource.FrothyDrink, Resource.Beans], [Resource.Bribe, Resource.Burger], [Resource.FrothyDrink, Resource.TBone]];
    var secondAbilityCosts = [[Resource.Bribe, Resource.Burger, Resource.Fries], [Resource.Acid, Resource.Beans, Resource.TBone], [Resource.Acid, Resource.Burger, Resource.Taco], [ Resource.Bribe, Resource.Corn, Resource.TBone ],
        [ Resource.FrothyDrink, Resource.Fries, Resource.Taco ],[ Resource.Acid, Resource.Corn, Resource.Taco ]];

    var ability1Pics: string[] = ['cow', 'fish', 'flowers', 'biplane', 'policecopter', 'meds'];
    var ability2Pics: string[] = ['broccoli', 'turtles', 'sun', 'blimp', 'policecar', 'fairyability'];

    var itemHints = [
        "This button will use and use up an item... eventually.  But you need an item to use first!",
        "TENNIS BALL - Collect a handful of tennis balls and send them hurtling towards the enemy streamer in low, fast arcs.",
        "BOMB - Toss a bomb lazily at the enemy streamer.  It's tricky to hit with, but it will do a ton of damage.",
        "HAMMER - Take a handful of hammers and lob them in slow, high arcs up into the sky, possibly landing annoyingly on the head of the enemy streamer.",
        "SCARY MASK - Incomplete",
        "BOTTLE ROCKET - Grab a bunch of small rockets and throw them up at the enemy streamer.  They'll track the streamer for a while.",
        "SHIELD - Use the shield, and you can absorb one Retaliate without taking any damage.  Incomplete"];
    var buildingAction1Hints = [
        "RUDE COWS - These nonplussed cows idly munch grass all day, the lazy things, and one thing leads to another.  Use this ability to steer their revolting emisions at the enemy streamer to gag and damage them.",
        "FLYING FISH - Use this, and cheerful fish will hop and glide out of the pond and sail through the skies.  A lucky streamer who grabs a fish whlie in mid flight will be healed a bit.",
        "FLOWER CANOPY - Collect the fertile haul of the greenhouse and loft it into the sky at the enemy streamer, damaging them.",
        "TIPSY BIPLANES - Call in a squadron of extremely irresponsible and entirely unpraiseworthy tipsy biplane pilots, and send them hurtling at the enemy streamer.",
        "POLICE HELICOPTERS - Call in a helpful troop of police helicopters to guard the local skies, blocking airborne attacks against your friends for a while.",
        "ANTIBIOTIC OVERPRESCRIPTION PARTY - Get the hospital to throw its doors open, recklessly overprescribing their antibiotics and tempting the rise of resistant superbugs.  But hey, it will heal up your friends in the process."];
    var buildingAction2Hints = [
        "BROCCOLI HARVEST - Collect the bounteous harvest of the verdant farm lands and shower your friends in broccoli.  ",
        "TURTLE PARADE - Incomplete",
        "SHIMMERING SUN - Incomplete",
        "BLIMP - Let loose a mighty blimp.  It is hardy but full of useful items.  If the streamer blasts it several times, it will pop, raining down some handy tools.",
        "POLICE CARS - Incomplete",
        "DR. FAIRY, MD - Call in the doctor!  A friendly fairy will drift up into the sky, pulsing with healing energy, which will soothe your friendly streamer if they stay close to the pulses."];

    var headNum: number = id+1 + ((team==2)?10:0);
    var nameColor: string = cols[id % 10];
    var foenameColor: string = cols[7];
    var bodyColor: number = cols2[id % 10];

    var playerStats: any = {};
    var timer: number = 0;
    var buildingPic: ent;
    var headEntLeft: ent, headEntRight: ent;
    var roundNumber: number = 2;
    var nameLeft: enttx, nameRight: enttx;
    var healthLeft: ent, foeHealthBk: ent, healthRight: ent;
    // foe name color
    var choices: number[] = [1, 1, 1, 1, 1, 1];
    var myStats: PlayerUpdate = {
        nm: "",
        st: [10, // health
            10,
            0, // building
            0, // row
            -1,-1,-1], // items
        rs: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    };
    resources = myStats.rs;

    var toolTip: string = "";

    var choiceButtons: ButtonCollection[], statPicsLeft: ent[], statNumsLeft: enttx[], statPicsRight: ent[], statNumsRight: enttx[];
    var item1: number = myStats.st[4], item2: number = myStats.st[5], item3: number = myStats.st[6];
    var lastRoundUpdate: number = 0;
    var vsLabel: enttx; var itemLabelLeft: enttx; var itemLabel2: enttx; var itemPicsLeft: ent[]; var itemPicsRight: ent[], itemLabelRight:enttx;

    var healthStat: number = 10;
    var curBuilding: number = (team == 2) ? (5 - id % 6) : id % 6;
    var curRow: number = id < 6 ? 1 : 0;
    var buildingPicName: string = 'cartoongame/imgs/buildings/building1.png';
    var headPic: string = 'cartoongame/imgs/heads/headbig' + headNum + '.png';
    var sheadPic: string = 'cartoongame/imgs/sheads/shead' + headNum + '.png';
    var bodyPic: string = 'cartoongame/imgs/body' + (team == 1 ? 'right' : 'left') + '.png';
    var foeHeadPic: string = 'cartoongame/imgs/heads/headbig20.png';
    var sfoeheadPic: string = 'cartoongame/imgs/sheads/shead' + headNum + '.png';
    var accepted = false;
    var curFoe: PlayerUpdate = null;
    var foeHealthStat: number = 10, foeitem1: number = -1, foeitem2: number = -1, foeitem3: number = -1;

    var roundColors = ['#468', '#846', '#684'];

    var roundx = 160;

    var tipx = -170; var tipy = -60;
    var infox = 480; var infoy = 30;
    var statx = -110+infox; var staty = -176+infoy;
    var foestatx = -60 + infox; var foestaty = -176 + infoy; 

    var foeAdd = 130;
    var foeActive = false, foeActiveOld = true;

    var forceReset: boolean = true;

    var foeNameString: string = 'xxxFirestormxxx', foeID = 0;

    // __________________________________________________________________________

    function addActions(srcChoices: number[], setToolTip: (str: string) => void): ButtonCollection[] {
		var curCollection: number = 0;
		function add( isActions:number, choiceSet: ActionEntry[]): ButtonCollection {
			var id: number = curCollection;
            curCollection++;
            return new ButtonCollection( isActions, w, apg, 22, setToolTip, v => srcChoices[id] = v, choiceSet);}

		var o = [];
        for (var j = 0; j < actions.length; j++) {
			var p = [];
            for (var k2 = 0; k2 < actions[j].choices.length; k2++) {
                var k = k2;
                var r = actions[j].choices[k];
                var xv: number = r.x;
                if (j == 0 && team == 2) xv = 320 - xv;
                p.push(new ActionEntry(r.name, r.tip, r.pic, actions[j].x + xv, actions[j].y + r.y, r.specialID));}
            o.push(add(actions[j].isActions, p));}
		return o;}

    function reset(): void {
        choiceButtons[0].selected = curBuilding;
        choiceButtons[1].selected = curRow;
        choiceButtons[2].selected = 0;
        choiceButtons[3].selected = -1;

        choices[0] = curBuilding;//-1;
        choices[1] = curRow;//-1;
        choices[2] = 0;

        // ____________________________________________

        buildingPic.tex = 'cartoongame/imgs/buildings/building' + (curBuilding + 1) + '.png';

        if (team == 1) {
            if (foeActive && !foeActiveOld) {
                for (var r in playerLeft) playerLeft[r].x -= 32;
                for (var r in playerRight) playerRight[r].visible = true;}
            if (!foeActive && foeActiveOld) {
                for (var r in playerLeft) playerLeft[r].x += 32;
                for (var r in playerRight) playerRight[r].visible = false;}
            foeActiveOld = foeActive;

            for (var k = 0; k < 3; k++) {
                itemLabelLeft.alpha = (item1 != -1) ? 1 : .3;
                if (item1 == -1) itemPicsLeft[0].visible = false; else { itemPicsLeft[0].visible = true; itemPicsLeft[0].tex = 'cartoongame/imgs/sitems/' + itemIcons[item1] + '.png'; }
                if (item2 == -1) itemPicsLeft[1].visible = false; else { itemPicsLeft[1].visible = true; itemPicsLeft[1].tex = 'cartoongame/imgs/sitems/' + itemIcons[item2] + '.png'; }
                if (item3 == -1) itemPicsLeft[2].visible = false; else { itemPicsLeft[2].visible = true; itemPicsLeft[2].tex = 'cartoongame/imgs/sitems/' + itemIcons[item3] + '.png'; }}
            for (var k = 0; k < 10; k++) {statNumsLeft[k].tx = "" + resources[k]; statPicsLeft[k].alpha = statNumsLeft[k].alpha = (resources[k] == 0) ? .5 : 1;}

            healthLeft.scalex = .67 * (healthStat / 10);

            if (foeActive) {
                nameRight.text = foeNameString;
                headEntRight.tex = foeHeadPic;

                for (var k = 0; k < 3; k++) {
                    itemLabelRight.alpha = (foeitem1 != -1) ? 1 : .3;
                    if (foeitem1 == -1) itemPicsRight[0].visible = false; else { itemPicsRight[0].visible = true; itemPicsRight[0].tex = 'cartoongame/imgs/sitems/' + itemIcons[foeitem1] + '.png'; }
                    if (foeitem2 == -1) itemPicsRight[1].visible = false; else { itemPicsRight[1].visible = true; itemPicsRight[1].tex = 'cartoongame/imgs/sitems/' + itemIcons[foeitem2] + '.png'; }
                    if (foeitem3 == -1) itemPicsRight[2].visible = false; else { itemPicsRight[2].visible = true; itemPicsRight[2].tex = 'cartoongame/imgs/sitems/' + itemIcons[foeitem3] + '.png'; }}
                for (var k = 0; k < 10; k++) { statNumsRight[k].tx = "" + foeResources[k]; statPicsRight[k].alpha = statNumsRight[k].alpha = (foeResources[k] == 0) ? .5 : 1; }

                healthRight.scalex = .67 * (foeHealthStat / 10);}}
        else {
            if (foeActive && !foeActiveOld) {
                for (var r in playerRight) playerRight[r].x += 32;
                for (var r in playerLeft) playerLeft[r].visible = true;}
            if (!foeActive && foeActiveOld) {
                for (var r in playerRight) playerRight[r].x -= 32;
                for (var r in playerLeft)playerLeft[r].visible = false;}
            foeActiveOld = foeActive;

            for (var k = 0; k < 3; k++) {
                itemLabelRight.alpha = (item1 != -1) ? 1 : .3;
                if (item1 == -1) itemPicsRight[0].visible = false; else { itemPicsRight[0].visible = true; itemPicsRight[0].tex = 'cartoongame/imgs/sitems/' + itemIcons[item1] + '.png'; }
                if (item2 == -1) itemPicsRight[1].visible = false; else { itemPicsRight[1].visible = true; itemPicsRight[1].tex = 'cartoongame/imgs/sitems/' + itemIcons[item2] + '.png'; }
                if (item3 == -1) itemPicsRight[2].visible = false; else { itemPicsRight[2].visible = true; itemPicsRight[2].tex = 'cartoongame/imgs/sitems/' + itemIcons[item3] + '.png'; }}
            for (var k = 0; k < 10; k++) {statNumsRight[k].tx = "" + resources[k]; statPicsRight[k].alpha = statNumsRight[k].alpha = (resources[k] == 0) ? .5 : 1;}

            healthRight.scalex = .67 * (healthStat / 10);

            if(foeActive){
                nameLeft.text = foeNameString;
                headEntLeft.tex = foeHeadPic;

                for (var k = 0; k < 3; k++) {
                    itemLabelLeft.alpha = (foeitem1 != -1) ? 1 : .3;
                    if (foeitem1 == -1) itemPicsLeft[0].visible = false; else { itemPicsLeft[0].visible = true; itemPicsLeft[0].tex = 'cartoongame/imgs/sitems/' + itemIcons[foeitem1] + '.png'; }
                    if (foeitem2 == -1) itemPicsLeft[1].visible = false; else { itemPicsLeft[1].visible = true; itemPicsLeft[1].tex = 'cartoongame/imgs/sitems/' + itemIcons[foeitem2] + '.png'; }
                    if (foeitem3 == -1) itemPicsLeft[2].visible = false; else { itemPicsLeft[2].visible = true; itemPicsLeft[2].tex = 'cartoongame/imgs/sitems/' + itemIcons[foeitem3] + '.png'; }}
                for (var k = 0; k < 10; k++) { statNumsLeft[k].tx = "" + foeResources[k]; statPicsLeft[k].alpha = statNumsLeft[k].alpha = (foeResources[k] == 0) ? .5 : 1; }

                healthLeft.scalex = .67 * (foeHealthStat / 10);}}}

    apg.ResetServerMessageRegistry()
        .SetKeepAliveStatus(true)
        .RegisterDisconnect(() => {
            ent.clearAll();
            enttx.clearAll();
            WaitingToJoin(apg, "Something went wrong - no response from the streamer's game...  Make sure the streamer is online and still playing this game, then connect again!");})
        .Register<RoundParms>("startround", p => {
            accepted = false;
            endOfRoundSound.play();
            curFoe = null;
            for (var k in playerStats) {
                var f: PlayerUpdate = playerStats[k];
                if (f.nm == apg.playerName) continue;
                if (f.st[0] > 0 && (f.st[2] % 6) == curBuilding && f.st[3] == curRow) { curFoe = f; break; }
            }
            if (curFoe == null) { foeActive = false;}
            else {
                foeActive = true;
                foeID = curFoe.st[1];
                foeNameString = curFoe.nm;
                foenameColor = cols[foeID % 10];
                foeHeadPic = 'cartoongame/imgs/heads/headbig' + (foeID + 1 + ((team == 2) ? 0 : 10)) + '.png';
                foeHealthStat = curFoe.st[0];
                foeitem1 = curFoe.st[4];
                foeitem2 = curFoe.st[5];
                foeitem3 = curFoe.st[6];
                foeResources = curFoe.rs;}
            reset();})
		.Register<RoundUpdate>("time", p => {
            timer = p.time;
			roundNumber = p.round;
			if (timer < 6 && !accepted ) { warningSound.play('', 0, 1 - (timer * 15) / 100); }})
        .Register<PlayerUpdate>("pl", p => {
            playerStats[p.nm] = p;

			if (p.nm != apg.playerName) return;
            myStats = p;

            healthStat = p.st[0];

            if (p.st[3] != -1) curRow = p.st[3];
            if (p.st[2] != -1) curBuilding = p.st[2] % 6;
            item1 = p.st[4];
            item2 = p.st[5];
            item3 = p.st[6];
            resources = p.rs;
            forceReset = true;})
        .Register<SelectionParms>("submit", p => {
            if (accepted == false) { accepted = true; endOfRoundSound.play(); }
            curBuilding = choices[0];
            curRow = choices[1];
            playerStats = {};
			apg.WriteToServer<SelectionParms>("upd", { choices: choices });});

    function setToolTip(str: string): void { toolTip = str; }

    // __________________________________________________________________________

    // Full Background

    var tick: number = 0;

    new ent(w, 0, 0, 'cartoongame/imgs/bkg_guide4.png', {
        upd: e => {
            tick++;

            if (accepted) { w.y = w.y * .9 + .1 * -500; } else { w.y = w.y * .9 + .1 * 0; }

            choiceButtons[2].setParms(curBuilding, item1, item2, item3, resources, forceReset);
            forceReset = false;

            if (choiceButtons[3].selected == 0) {
                endOfRoundSound.play();
                accepted = true;
                choiceButtons[3].selected = -1;}

            choiceButtons[0].update( true );
            choiceButtons[1].update( true );
            choiceButtons[2].update(true );
            choiceButtons[3].update(true);}});

    choiceButtons = addActions(choices, setToolTip);

    new enttx(w, roundx + 260, 35, "Action for ", { font: '36px ' + fontName, fill: '#444' });
    new enttx(w, roundx + 400, 35, "Round ", { font: '36px ' + fontName, fill: roundColors[1] }, {
        upd: e => {
            if (roundNumber != lastRoundUpdate) {
                e.text = "Round " + (roundNumber);
                e.fill = roundColors[(roundNumber-1) % roundColors.length];
                lastRoundUpdate = roundNumber;}}});

    // 1. Action

    var nameHeight = 138; var healthHeight = 158;
    
    var playerLeft = [];
    var playerRight = [];
    function a1(e): void { console.log(e); playerLeft.push(e); }
    function a2(e): void { playerRight.push(e); }
    function a1l(l): void { for (var e in l) playerLeft.push(l[e]); }
    function a2l(l): void { for (var e in l)playerRight.push(l[e]); }

    buildingPic = new ent(w, infox + 140, infoy+86, buildingPicName, { color: 0xa0a0a0 });

    vsLabel = new enttx(w, infox + 160, infoy+-90 + 18 + nameHeight, 'VS', { font: '24px ' + fontName });
   
    headEntLeft = new ent(w, infox+50, infoy+((team == 1) ? 50 : 80), (team == 1) ? headPic : foeHeadPic, { scalex: (team == 1) ? .75 : .5, scaley: (team == 1) ? .75 : .5, color: (team == 1) ? 0xffffff : 0xa0a0a0 }); a1(headEntLeft);
    nameLeft = new enttx(w, infox+50, infoy+nameHeight, (team == 1) ? apg.playerName : foeNameString, { font: '12px ' + fontName, fill: (team == 1) ? nameColor : foenameColor }); a1(nameLeft);
    a1( new ent(w, infox+46, infoy+healthHeight, 'cartoongame/imgs/whiteblock.png', { color: 0, scaley: .5, scalex: .7 }) );
    healthLeft = new ent(w, infox+47, infoy+healthHeight + 1, 'cartoongame/imgs/whiteblock.png', { color: 0xff0000, scaley: .4, scalex: .67 }); a1(healthLeft);
    
    var itemLeft: number = 136+infox; var itemRight = 192+infoy; var itemVert: number = 170;

    itemLabelLeft = new enttx(w, infox+itemLeft, infoy+itemVert - 14, 'Items', { font: '10px ' + fontName, fill: '#555' }); a1(itemLabelLeft);
    itemPicsLeft = [new ent(w, itemLeft, itemVert, 'cartoongame/imgs/sitems/srocket2.png'),
        new ent(w, itemLeft, itemVert+16, 'cartoongame/imgs/sitems/srocket2.png'),
        new ent(w, itemLeft, itemVert + 32, 'cartoongame/imgs/sitems/srocket2.png')];
    a1l(itemPicsLeft);

    a1(new enttx(w, infox+52, infoy+healthHeight - 3, 'Life', { font: '10px ' + fontName, fill: '#222' }) );

    function category(msg: string, x: number, y: number): enttx {return new enttx(w, x, y, msg, { font: '18px ' + fontName, fill: '#433' });}
    function inCategory(x: number, y: number, add: number, labels: string[], bump1:boolean = false ): enttx[] {
        var labelEnts: enttx[] = [];
        var curx: number = x; var cury: number = y;
        for (var k = 0; k < labels.length; k++) { labelEnts.push(new enttx(w, curx, cury, labels[k], { font: '14px ' + fontName, fill: '#211' })); if (bump1 && k == 0) cury += 28; cury += add; if (k == 2 || k == 5) { curx += 28; cury = y; } if (k == 5) cury -= add;}
        return labelEnts;}
    function picCategory(x: number, y: number, add: number, labels: string[]): ent[] {
        var labelEnts: ent[] = [];
        var curx: number = x; var cury: number = y;
        for (var k = 0; k < labels.length; k++) { labelEnts.push(new ent(w, curx, cury, 'cartoongame/imgs/resources/' + labels[k], { scalex: .5, scaley: .5 })); cury += add; if (k == 2 || k == 5) { curx += 28; cury = y; } if (k == 5) cury -= add;}
        return labelEnts;}

    a1( new enttx(w, statx + 110 - 30 + 76, staty + 186 + 158, 'Resources', { font: '12px ' + fontName, fill: '#222' }) );

    statPicsLeft = picCategory(10 + statx + 194 - 50, staty + 360, 13, ['beer.png', 'burger.png', 'canofbeans.png', 'chemicals.png', 'chemicals2.png', 'corn.png', 'dollar2.png', 'fries.png', 'taco1.png', 'tbone_steak.png']); a1l(statPicsLeft);
    statNumsLeft = inCategory(6 + statx + 214 - 50, staty + 360, 13, ["5", "0", "0", "0", "0", "10", "0", "0", "0", "0"]); a1l(statNumsLeft);

    itemLabelRight = new enttx(w, infox+itemRight, infoy+itemVert - 14, 'Items', { font: '10px ' + fontName, fill: '#555' }); a2(itemLabelRight);
    itemPicsRight = [new ent(w, itemRight, itemVert, 'cartoongame/imgs/sitems/sbomb.png'),
    new ent(w, itemRight, itemVert + 16, 'cartoongame/imgs/sitems/sbomb.png'),
    new ent(w, itemRight, itemVert + 32, 'cartoongame/imgs/sitems/sbomb.png')];
    a2l(itemPicsRight);

    headEntRight = new ent(w, infox+230+ (team==1 ? 0:-40), infoy+((team == 1) ? 80 : 50), (team == 1) ? foeHeadPic : headPic, { scalex: (team == 1) ? .5 : .75, scaley: (team == 1) ? .5 : .75, color: (team == 1) ? 0xa0a0a0:0xffffff }); a2(headEntRight);
    nameRight = new enttx(w, infox+210, infoy+nameHeight, (team==1)?foeNameString:apg.playerName, { font: '12px ' + fontName, fill: (team==1)?foenameColor:nameColor }); a2(nameRight);
    a2( new ent(w, infox+250, infoy+healthHeight, 'cartoongame/imgs/whiteblock.png', { color: 0, scaley: .5, scalex: .7 }) );
    healthRight = new ent(w, infox+251, infoy+healthHeight + 1, 'cartoongame/imgs/whiteblock.png', { color: 0xff0000, scaley: .4, scalex: .67 }); a2(healthRight);

    a2( new enttx(w, infox+280, infoy+healthHeight - 3, 'Life', { font: '10px ' + fontName, fill: '#222' }) );
    a2( new enttx(w, foestatx + 60 + -20 + 240, foestaty + 186 + 158, 'Resources', { font: '12px ' + fontName, fill: '#222' }) );

    statPicsRight = picCategory(foestatx + foeAdd + 194 - 50, foestaty + 360, 13, ['beer.png', 'burger.png', 'canofbeans.png', 'chemicals.png', 'chemicals2.png', 'corn.png', 'dollar2.png', 'fries.png', 'taco1.png', 'tbone_steak.png']); a2l(statPicsRight);
    statNumsRight = inCategory(-4 + foestatx + foeAdd + 214 - 50, foestaty + 360, 13, ["5", "0", "0", "0", "0", "10", "0", "0", "0", "0"]); a2l(statNumsRight);

    // Time and Tip

    var tipIconsy = 80;

    new enttx(w, tipx + 250, tipy + 110, "Tip", { font: '18px ' + fontName, fill: '#433' }, { upd: e => { e.visible = (toolTip == "") ? false : true; } });
    var requiresLabel = new enttx(w, tipx + 250, tipIconsy+tipy + 260, "Cost", { font: '18px ' + fontName, fill: '#433' }); requiresLabel.visible = false;
    var resource1: ent = new ent(w, tipx + 250, tipIconsy+tipy + 280, 'cartoongame/imgs/resources/beer.png'); resource1.visible = false;
    var resource2: ent = new ent(w, 32 + tipx + 250, tipIconsy+tipy + 280, 'cartoongame/imgs/resources/beer.png'); resource2.visible = false;
    var resource3: ent = new ent(w, 64 + tipx + 250, tipIconsy+tipy + 280, 'cartoongame/imgs/resources/beer.png'); resource3.visible = false;
    var extractx: number = 48; var extracty: number = 36;
    var extractLabel = new enttx(w, -48 + extractx + tipx + 250, tipIconsy+32+extracty + tipy + 190, "Extract", { font: '18px ' + fontName, fill: '#433' }); extractLabel.visible = false;
    var extractIcon1: ent = new ent(w, extractx + tipx + 266, tipIconsy+extracty + tipy + 210, 'cartoongame/imgs/resources/beer.png'); extractIcon1.visible = false;
    var extractIcon2: ent = new ent(w, extractx + tipx + 266 + 32, tipIconsy+extracty + tipy + 210, 'cartoongame/imgs/resources/beer.png'); extractIcon2.visible = false;
    var extractIcon3: ent = new ent(w, extractx + tipx + 266 + 64, tipIconsy+extracty + tipy + 210, 'cartoongame/imgs/items/ball.png', { scalex: .5, scaley: .5 }); extractIcon3.visible = false;
    var ab1x: number = 16 + 48; var ab2x: number = 26 + 48; var aby: number = 8;
    var abilitiesLabel = new enttx(w, tipx + 250, tipIconsy+32+aby+12+tipy + 240, "Abilities", { font: '18px ' + fontName, fill: '#433' }); abilitiesLabel.visible = false;
    var lastToolTip: string = '';

    new enttx(w, tipx +260, tipy+140, "", { font: '17px ' + fontName, fill: '#455', wordWrap: true, wordWrapWidth: 250 }, {
        upd: e => {
            if (toolTip != lastToolTip) {
                e.text = toolTip;
                lastToolTip = toolTip;
                extractIcon1.visible = extractIcon2.visible = extractIcon3.visible = extractLabel.visible = abilitiesLabel.visible =  requiresLabel.visible = resource1.visible = resource2.visible = resource3.visible = false;
                if (toolTip == 'building1') { e.text = buildingAction1Hints[curBuilding]; requiresLabel.visible = true; resource1.visible = true; resource2.visible = true; resource1.tex = 'cartoongame/imgs/resources/' + resourceIcons[firstAbilityCosts[curBuilding][0]]; resource2.tex = 'cartoongame/imgs/resources/' + resourceIcons[firstAbilityCosts[curBuilding][1]]; }
                if (toolTip == 'building2') { e.text = buildingAction2Hints[curBuilding]; requiresLabel.visible = true; resource1.visible = true; resource2.visible = true; resource3.visible = true; resource1.tex = 'cartoongame/imgs/resources/' + resourceIcons[secondAbilityCosts[curBuilding][0]]; resource2.tex = 'cartoongame/imgs/resources/' + resourceIcons[secondAbilityCosts[curBuilding][1]]; resource3.tex = 'cartoongame/imgs/resources/' + resourceIcons[secondAbilityCosts[curBuilding][2]]; }
                if (toolTip == 'extract') {
                    e.text = "EXTRACT: Randomly extract a resource or item from the building you're at.  This won't work if the building is already in use this turn.  What you get depends on the quirk of the building.  You might dodge airbourne attacks sometmies when you're doing this.";
                    extractLabel.visible = extractIcon1.visible = extractIcon2.visible = extractIcon3.visible = true;
                    extractIcon1.tex = 'cartoongame/imgs/resources/' + resourceIcons[extractResources[curBuilding][0]];
                    extractIcon2.tex = 'cartoongame/imgs/resources/' + resourceIcons[extractResources[curBuilding][1]];
                    extractIcon3.tex = 'cartoongame/imgs/items/' + itemIcons2[extractItems[curBuilding]] + '.png';}
                if (toolTip == 'item1') { e.text = itemHints[item1 + 1]; }
                if (toolTip == 'item2') { e.text = itemHints[item2 + 1]; }
                if (toolTip == 'item3') { e.text = itemHints[item3 + 1]; }}}});

    var timex = 70; var timey = -100;

    category("Time", -110+650+timex, 30+336+timey);
    new enttx(w, -110 +650+timex, 30 +354+timey, "", { font: '40px ' + fontName, fill: '#688' }, { upd: e => { e.text = "" + timer; e.fill = roundColors[(roundNumber-1) % roundColors.length];}});

    if (apg.allowFullScreen) {new enttx(w, 100, 700, "Your actions were submitted just fine!  Now just relax until the next round.", { font: '18px ' + fontName, fill: '#433' });}

    reset();

    if (apg.networkTestSequence) MainInputTestSequence(apg);}