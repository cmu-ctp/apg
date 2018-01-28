function PlayerMovement(apg: APGSys, id:number, team:number ): void {
    var w = new Phaser.Group(apg.g);
    apg.g.world.add(w);

	var fontName: string = "Caveat Brush";

	var actions: any = apg.JSONAssets['cartoongame/json/MoveActions.json'];

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

    var buildingHints = [
        "FARM - A rustic farm, soothing with pastoral delights.  These produce the finest in organic free-range broccoli and cage free cows.  Family owned for millenia, they're certified organic by the ATF.",
        "POND - A simple fishing hole of no note.  Local rumors say deep in the bowels of this very shallow pond drift massive tentacles, and burbling from the murk rises the odd sound Ph'nglui mglw'nafh....",
        "GREENHOUSE - A state of the art plant nurturing facility.  Contrary to claims spread by the valued team members of local fast food shops, this greenhouse only grows licit, nonmedical plants, man.",
        "AIRPORT - A cozy commuter airport with 3 gates.  A cinnamon bun shops sells icing blobs with bits of bun, security takes all of 3 minutes, and all flights require 3 connecting flights to get anywhere.",
        "POLICE STATION - The local constabulary.  They keep the peace, but owing to increasing civil forfeiture laws, the piece they keep is getting to be rather large.",
        "HOSPITAL - A local clinic."];

    var headNum: number = id+1 + ((team==2)?10:0);
    var nameColor: string = cols[id % 10];
    var foenameColor: string = cols[7];
    var bodyColor: number = cols2[id % 10];

    var playerStats: any = {};
    var timer: number = 0;
    var roundNumber: number = 2;
    var foeHealthBk: ent;
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

    var choiceButtons: ButtonCollection[];
    var stanceBody: ent, stanceHead: ent, locBody: ent, locHead: ent;
    var playerLabel: enttx;
    var lastRoundUpdate: number = 0;

    var curBuilding: number = (team == 2) ? (5 - id % 6) : id % 6;
    var curRow: number = id < 6 ? 1 : 0;
    var headPic: string = 'cartoongame/imgs/heads/headbig' + headNum + '.png';
    var sheadPic: string = 'cartoongame/imgs/sheads/shead' + headNum + '.png';
    var bodyPic: string = 'cartoongame/imgs/body' + (team == 1 ? 'right' : 'left') + '.png';
    var accepted = false;

    var roundColors = ['#468', '#846', '#684'];

    var roundx = 100;

    var tipx = -170; var tipy = -60;
    var mapRowx = -150; var mapRowy = 60-32-16;
    var mapBuildingx = 44; var mapBuildingy = -160-32;

    var forceReset: boolean = true;

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

        stanceBody.x = mapRowx + 740 + (curRow - 1) * 40;
        stanceHead.x = mapRowx + 731 + (curRow - 1) * 40;


        stanceBody.y = 30 + 160 + curRow * 40;
        stanceHead.y = 30 + 146 + curRow * 40;

        locBody.x = 30 + 330 + 64 * (team == 1 ? curBuilding : 5 - curBuilding);
        locHead.x = 30 + 320 + 64 * (team == 1 ? curBuilding : 5 - curBuilding);
        playerLabel.x = 30 + 320 + 64 * (team == 1 ? curBuilding : 5 - curBuilding);
    }

    apg.ResetServerMessageRegistry()
        .SetKeepAliveStatus(true)
        .RegisterDisconnect(() => {
            ent.clearAll();
            enttx.clearAll();
            WaitingToJoin(apg, "Something went wrong - no response from the streamer's game...  Make sure the streamer is online and still playing this game, then connect again!");})
        .Register<RoundParms>("startround", p => {
            accepted = false;
            endOfRoundSound.play();
            reset();})
		.Register<RoundUpdate>("time", p => {
            timer = p.time;
            console.log("time " + timer);
			roundNumber = p.round;
			if (timer < 6 && !accepted ) { warningSound.play('', 0, 1 - (timer * 15) / 100); }})
        .Register<PlayerUpdate>("pl", p => {
            playerStats[p.nm] = p;

			if (p.nm != apg.playerName) return;
            myStats = p;

            if (p.st[3] != -1) curRow = p.st[3];
            if (p.st[2] != -1) curBuilding = p.st[2] % 6;
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

    new enttx(w, roundx+260, 25, "Position for ", { font: '36px ' + fontName, fill: '#444' });
    new enttx(w, roundx +420, 25, "Round ", { font: '36px ' + fontName, fill: roundColors[1] }, {
        upd: e => {
            if (roundNumber != lastRoundUpdate) {
                e.text = "Round " + (roundNumber);
                e.fill = roundColors[(roundNumber-1) % roundColors.length];
                lastRoundUpdate = roundNumber;}}});

    // 2. Location

    function category(msg: string, x: number, y: number): enttx { return new enttx(w, x, y, msg, { font: '18px ' + fontName, fill: '#433' }); }

    new ent(w, mapBuildingx + 270, mapBuildingy +265, 'cartoongame/imgs/flag' + (team == 1 ? 1 : 2) + 'small.png');
    new ent(w, mapBuildingx + 680, mapBuildingy +265, 'cartoongame/imgs/flag' + (team == 1 ? 1 : 2)+'small.png');
    locBody = new ent(w, mapBuildingx + 330 + 64 * curBuilding, mapBuildingy +16+285, bodyPic, { scalex: 1, scaley: 1, color:bodyColor});
    locHead = new ent(w, mapBuildingx + 320 + 64 * curBuilding, mapBuildingy +16 +271, sheadPic);
    playerLabel = new enttx(w, mapBuildingx + 320 + 64 * curBuilding, mapBuildingy +16 +320, apg.playerName, { font: '12px ' + fontName, fill: nameColor });

    var moveArrow = [];
    for (var k = 0; k < 6; k++) { var art = 'mid'; if (k == 0) art = 'cap'; if (k == 5) art = 'head';  moveArrow.push(new ent(w, 310 + mapBuildingx + 64 * k, 280 + mapBuildingy, 'cartoongame/imgs/arrow' + art + '.png', { alpha: .5, upd: e => { e.alpha = .2 + .2 * Math.cos( tick * .03); } })); moveArrow[k].visible = false;}

    new enttx(w, mapRowx + 700, mapRowy + 110, "", { font: '24px ' + fontName, fill: '#A00' });
    stanceBody = new ent(w, mapRowx + 740 + (curRow-1)*40, mapRowy + 160 + curRow * 40, bodyPic, { scalex: 1, scaley: 1, color: bodyColor });
    stanceHead = new ent(w, mapRowx + 731 + (curRow - 1) * 40, mapRowy + 146 + curRow * 40, sheadPic);

    // Time and Tip

    new enttx(w, tipx + 250, tipy + 110, "Tip", { font: '18px ' + fontName, fill: '#433' }, { upd: e => { e.visible = (toolTip == "") ? false : true; } });
    var requiresLabel = new enttx(w, tipx + 250, tipy + 260, "Cost", { font: '18px ' + fontName, fill: '#433' }); requiresLabel.visible = false;
    var resource1: ent = new ent(w, tipx + 250, tipy + 280, 'cartoongame/imgs/resources/beer.png'); resource1.visible = false;
    var resource2: ent = new ent(w, 32 + tipx + 250, tipy + 280, 'cartoongame/imgs/resources/beer.png'); resource2.visible = false;
    var resource3: ent = new ent(w, 64 + tipx + 250, tipy + 280, 'cartoongame/imgs/resources/beer.png'); resource3.visible = false;
    var extractx: number = 48; var extracty: number = 36;
    var extractLabel = new enttx(w, -48+extractx + tipx + 250, 32+extracty + tipy + 190, "Extract", { font: '18px ' + fontName, fill: '#433' }); extractLabel.visible = false;
    var extractIcon1: ent = new ent(w, extractx+tipx + 266, extracty + tipy + 210, 'cartoongame/imgs/resources/beer.png'); extractIcon1.visible = false;
    var extractIcon2: ent = new ent(w, extractx +tipx + 266 + 32, extracty + tipy + 210, 'cartoongame/imgs/resources/beer.png'); extractIcon2.visible = false;
    var extractIcon3: ent = new ent(w, extractx +tipx + 266 + 64, extracty + tipy + 210, 'cartoongame/imgs/items/ball.png', { scalex: .5, scaley: .5 }); extractIcon3.visible = false;
    var ab1x: number = 16 + 48; var ab2x: number = 26 + 48; var aby: number = 8;
    var abilitiesLabel = new enttx(w, tipx + 250, 32+aby+12+tipy + 240, "Abilities", { font: '18px ' + fontName, fill: '#433' }); abilitiesLabel.visible = false;
    var skillIcon1: ent = new ent(w, ab1x+tipx + 250, aby+tipy + 276, 'cartoongame/imgs/abilities/biplane.png', { scalex:.5, scaley: .5 }); skillIcon1.visible = false;
    var skillIcon1r1: ent = new ent(w, ab1x +tipx + 250, aby +tipy + 310, 'cartoongame/imgs/resources/beer.png', { scalex: .5, scaley: .5 }); skillIcon1r1.visible = false;
    var skillIcon1r2: ent = new ent(w, ab1x +tipx + 250 + 16, aby +tipy + 310, 'cartoongame/imgs/resources/beer.png', { scalex: .5, scaley: .5 }); skillIcon1r2.visible = false;
    var skillIcon2: ent = new ent(w, 40 + ab2x+tipx + 250, aby +tipy + 276, 'cartoongame/imgs/abilities/blimp.png', { scalex: .5, scaley: .5 }); skillIcon2.visible = false;
    var skillIcon2r1: ent = new ent(w, 40 + ab2x +tipx + 250, aby +tipy + 310, 'cartoongame/imgs/resources/beer.png', { scalex: .5, scaley: .5 }); skillIcon2r1.visible = false;
    var skillIcon2r2: ent = new ent(w, 40 + ab2x +tipx + 250 + 16, aby +tipy + 310, 'cartoongame/imgs/resources/beer.png', { scalex: .5, scaley: .5 }); skillIcon2r2.visible = false;
    var skillIcon2r3: ent = new ent(w, 40 + ab2x +tipx + 250 + 32, aby +tipy + 310, 'cartoongame/imgs/resources/beer.png', { scalex: .5, scaley: .5 }); skillIcon2r3.visible = false;
    var lastToolTip: string = '';

    function doBuildingTip(e: enttx, id: number): void {
        var res = 'cartoongame/imgs/resources/';
        e.text = buildingHints[id]; abilitiesLabel.visible = extractLabel.visible = skillIcon1r1.visible = skillIcon1r2.visible = skillIcon1.visible = skillIcon2r1.visible = skillIcon2r2.visible = skillIcon2r3.visible = skillIcon2.visible = extractIcon1.visible = extractIcon2.visible = extractIcon3.visible = true;
        extractIcon1.tex = res + resourceIcons[extractResources[id][0]];
        extractIcon2.tex = res + resourceIcons[extractResources[id][1]];
        extractIcon3.tex = 'cartoongame/imgs/items/' + itemIcons2[extractItems[id]] + '.png';
        var alpha1 = (resources[firstAbilityCosts[id][0]] > 0 && resources[firstAbilityCosts[id][1]] > 0) ? 1 : .5;
        skillIcon1.tex = 'cartoongame/imgs/abilities/' + ability1Pics[id] + '.png'; skillIcon1.alpha = alpha1;
        skillIcon1r1.tex = res + resourceIcons[firstAbilityCosts[id][0]]; skillIcon1r1.alpha = alpha1;
        skillIcon1r2.tex = res + resourceIcons[firstAbilityCosts[id][1]]; skillIcon1r2.alpha = alpha1;
        var alpha2 = (resources[secondAbilityCosts[id][0]] > 0 && resources[secondAbilityCosts[id][1]] > 0 && resources[secondAbilityCosts[id][2]] > 0) ? 1 : .5;
        skillIcon2.tex = 'cartoongame/imgs/abilities/' + ability2Pics[id] + '.png'; skillIcon2.alpha = alpha2;
        skillIcon2r1.tex = res + resourceIcons[secondAbilityCosts[id][0]]; skillIcon2r1.alpha = alpha2;
        skillIcon2r2.tex = res + resourceIcons[secondAbilityCosts[id][1]]; skillIcon2r2.alpha = alpha2;
        skillIcon2r3.tex = res + resourceIcons[secondAbilityCosts[id][2]]; skillIcon2r3.alpha = alpha2;}

    new enttx(w, tipx + 260, tipy + 140, "", { font: '17px ' + fontName, fill: '#455', wordWrap: true, wordWrapWidth: 250 }, {
        upd: e => {
            if (toolTip != lastToolTip) {
                e.text = toolTip;
                lastToolTip = toolTip;
                extractIcon1.visible = extractIcon2.visible = extractIcon3.visible = skillIcon2r1.visible = skillIcon2r2.visible = skillIcon2r3.visible = skillIcon2.visible = skillIcon1r1.visible = skillIcon1r2.visible = skillIcon1.visible = extractLabel.visible = abilitiesLabel.visible =  requiresLabel.visible = resource1.visible = resource2.visible = resource3.visible = false;
                if (toolTip == 'farm') doBuildingTip(e, 0);
                if (toolTip == 'pond') doBuildingTip(e, 1);
                if (toolTip == 'greenhouse')doBuildingTip(e, 2);
                if (toolTip == 'airport') doBuildingTip(e, 3);
                if (toolTip == 'police') doBuildingTip(e, 4);
                if (toolTip == 'hospital') doBuildingTip(e, 5);}}
    });

    var timex = 70; var timey = -100;

    category("Time", -110+650+timex, 30+336+timey);
    new enttx(w, -110 +650+timex, 30 +354+timey, "", { font: '40px ' + fontName, fill: '#688' }, { upd: e => { e.text = "" + timer; e.fill = roundColors[(roundNumber-1) % roundColors.length];}});

    if (apg.allowFullScreen) {new enttx(w, 100, 700, "Your actions were submitted just fine!  Now just relax until the next round.", { font: '18px ' + fontName, fill: '#433' });}

    reset();

    if (apg.networkTestSequence) MainInputTestSequence(apg);}