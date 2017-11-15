/*
// round start plaque - health, stat update, team stats, new opponent
*/

function CartoonAssetCache(c: Cacher): void {
	c.images('cartoongame/imgs', ['blueorb.png', 'flag1small.png', 'flag2small.png', 'littleperson.png', 'littleperson2.png', 'bodyleft.png', 'bodyright.png', 'bkg_guide4.png', 'ClientUI9.png', 'tooltip2.png', 'test.png', 'whiteblock.png', 'arrowcap.png', 'arrowmid.png', 'arrowhead.png', 'hudselect.png']);
    c.images('cartoongame/imgs/buildings', ['building1.png', 'building2.png', 'building3.png', 'building4.png', 'building5.png', 'building6.png']);
    c.images('cartoongame/imgs/heads', ['headbig1.png', 'headbig2.png', 'headbig3.png', 'headbig4.png', 'headbig5.png', 'headbig6.png', 'headbig7.png', 'headbig8.png', 'headbig9.png', 'headbig10.png', 'headbig11.png', 'headbig12.png', 'headbig13.png', 'headbig14.png', 'headbig15.png', 'headbig16.png', 'headbig17.png', 'headbig18.png', 'headbig19.png', 'headbig20.png']);
    c.images('cartoongame/imgs/sheads', ['shead1.png', 'shead2.png', 'shead3.png', 'shead4.png', 'shead5.png', 'shead6.png', 'shead7.png', 'shead8.png', 'shead9.png', 'shead10.png', 'shead11.png', 'shead12.png', 'shead13.png', 'shead14.png', 'shead15.png', 'shead16.png', 'shead17.png', 'shead18.png', 'shead19.png', 'shead20.png']);
    c.images('cartoongame/imgs/resources', ['beer.png', 'burger.png', 'canofbeans.png', 'chemicals.png', 'chemicals2.png', 'corn.png', 'dollar2.png', 'fries.png', 'taco1.png', 'tbone_steak.png']);
    c.images('cartoongame/imgs/sitems', ['stennisball.png', 'sbaseballbat.png', 'sbomb.png', 'sbroom.png', 'sclock.png', 'scomputer.png', 'shammer2.png', 'sknighthelmet.png', 'sscarymask.png', 'svacanteyemask.png', 'srocket2.png', 'sscissors2.png', 'sshield.png', 'sfalseteeth.png']);
	c.sounds('cartoongame/snds/fx', ['strokeup2.mp3', 'strokeup.mp3', 'strokeup4.mp3']);
    c.json(['cartoongame/json/TestActions.json', 'cartoongame/json/MoveActions.json', 'cartoongame/json/PlayActions.json']);

	WaitingToJoinCache(c);
	JoinAcknowledgeCache(c);
	ShowSubmittedCache(c);
	ButtonCache(c);}

interface RoundUpdate { round: number; time: number;}
interface EmptyParms { }
interface RoundParms { team1Health: number, team2Health:number }
interface SelectionParms { choices: number[];}
interface PlayerUpdate{ nm:string; st: number[]; rs: number[];}

function MainInputTestSequence(apg: APGSys): void {

    var names = ["npc1", "npc2", "npc3", "npc4", "npc5", "npc6", "npc7", "npc8", "npc9", "npcr1", "npcr2", "npcr3", "npcr4", "npcr5", "npcr6", "npcr7", "npcr8", "npcr9"];

    apg.ClearLocalMessages();
    var roundLength: number = 15;//450;//15;
    function mr() { if (Math.random() < .6) return 0; return Math.floor(Math.random() * 3) + 1;}
    //function mr() { if (Math.random() < .2) return 0; return Math.floor(Math.random() * 3) + 1; }
    for (var j = 1; j <= 10; j++ ){
        var roundTimeOffset: number = (j - 1) * roundLength;
        for (var k = 0; k < roundLength + 5; k += 5)apg.WriteLocalAsServer<RoundUpdate>(roundTimeOffset + k, "time", { round: j + 1, time: roundLength - k });
        apg.WriteLocalAsServer<SelectionParms>(roundTimeOffset + roundLength, "submit", { choices: [] });
        apg.WriteLocalAsServer<PlayerUpdate>(roundTimeOffset + roundLength+.5, "pl", {
            nm: apg.playerName,
            st: [Math.floor(Math.random() * 10) + 1, // health
                Math.floor(Math.random() * 10) + 1,
                -1, // building
                -1, // row
                -1,-1,-1], // items
            rs: [mr(), mr(), mr(), mr(), mr(), mr(), mr(), mr(), mr(), mr()]
        });
        for (var k = 0; k < names.length; k++) {
            var spot = (k < 9) ? Math.floor(k / 3) : 6 +  Math.floor((k - 9) / 3);
            var row = (k < 9) ? k%3 : (k-9)%3;
            apg.WriteLocalAsServer<PlayerUpdate>(roundTimeOffset + roundLength + .5, "pl", {
                nm: names[k],
                st: [Math.floor(Math.random() * 10) + 1, (k%10), spot, row, Math.floor(Math.random() * 6), -1, -1],
                rs: [mr(), mr(), mr(), mr(), mr(), mr(), mr(), mr(), mr(), mr()]
            });}
        apg.WriteLocalAsServer<RoundParms>(roundTimeOffset + roundLength + 1, "startround", { team1Health: Math.floor(Math.random() * 30), team2Health: Math.floor(Math.random() * 30) });}}

enum Resource { FrothyDrink = 0, Burger = 1, Beans = 2, Goo = 3, Acid = 4, Corn = 5, Bribe = 6, Fries = 7, Taco = 8, TBone = 9 }
enum ItemIds { TennisBall = 0, Bomb = 1, Hammer = 2, ScaryMask = 3, Rocket = 4, Shield = 5 }

function MainPlayerInput(apg: APGSys, id:number, team:number ): void {
    var w = new Phaser.Group(apg.g);
    apg.g.world.add(w);

	var fontName: string = "Caveat Brush";

	var actions: any = apg.JSONAssets['cartoongame/json/TestActions.json'];

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

	var buildingNames = ['farm', 'pond', 'greenhouse', 'airport', 'police station', 'hospital'];

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
    var buildingPic: ent;
    var headEntLeft: ent, headEntRight: ent;
    var roundNumber: number = 2;
    var nameLeft: enttx, nameRight: enttx;
	var healthLeft: ent, foeHealthBk: ent, healthRight: ent;
	var actionLabel: enttx;
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
    var stanceBody: ent, stanceHead: ent, locBody: ent, locHead: ent;
    var item1: number = myStats.st[4], item2: number = myStats.st[5], item3: number = myStats.st[6];
    var playerLabel: enttx;
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

    var roundx = 80;

    var tipx = 70; var tipy = 90;
    var mapRowx = 0; var mapRowy = 60;
	var mapBuildingx = 44; var mapBuildingy = -160;

	var allStx = -30; var allSty = -50;

	var statx = -110 + allStx; var staty = -176 + allSty;
	var foestatx = -60 + allStx; var foestaty = -176 + allSty; 

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

		actionLabel.text = "1. Action at " + buildingNames[curBuilding];

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

                healthLeft.scalex = .67 * (foeHealthStat / 10);}}

        // ____________________________________________

        stanceBody.y = 30 + 160 + curRow * 64;
        stanceHead.y = 30 + 146 + curRow * 64;

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
            curFoe = null;
            for (var k in playerStats) {
                var f: PlayerUpdate = playerStats[k];
                if (f.nm == apg.playerName) continue;
                if (f.st[0] > 0 && (f.st[2] % 6) == curBuilding && f.st[3] == curRow) { curFoe = f; break; }}
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
            console.log("time " + timer);
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

	var toolTime = 0;

	function setToolTip(str: string): void {
		toolTip = str;
		toolTime = 3;
	}

    // __________________________________________________________________________

    // Full Background

    var tick: number = 0;

    new ent(w, 0, 0, 'cartoongame/imgs/ClientUI9.png', {
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

	new ent(w, 0, 0, 'cartoongame/imgs/tooltip2.png', { upd: e => { toolTime--; if (toolTime == 0) toolTip = ""; e.visible = (toolTip == "") ? false : true; } });

    choiceButtons = addActions(choices, setToolTip);

    new enttx(w, roundx+260, 16, "Choices for ", { font: '45px ' + fontName, fill: '#444' });
    new enttx(w, roundx +440, 16, "Round ", { font: '45px ' + fontName, fill: roundColors[1] }, {
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

    actionLabel = new enttx(w, 60, 210, "1. Action Here", { font: '20px ' + fontName, fill: '#A00' });

	buildingPic = new ent(w, allStx + 140, allSty+86, buildingPicName, { color: 0xa0a0a0 });

	vsLabel = new enttx(w, allStx + 160, allSty + -90 + 18 + nameHeight, 'VS', { font: '24px ' + fontName });
   
	headEntLeft = new ent(w, allStx + 50, allSty+((team == 1) ? 50 : 80), (team == 1) ? headPic : foeHeadPic, { scalex: (team == 1) ? .75 : .5, scaley: (team == 1) ? .75 : .5, color: (team == 1) ? 0xffffff : 0xa0a0a0 }); a1(headEntLeft);
	nameLeft = new enttx(w, allStx + 50, allSty+nameHeight, (team == 1) ? apg.playerName : foeNameString, { font: '12px ' + fontName, fill: (team == 1) ? nameColor : foenameColor }); a1(nameLeft);
	a1(new ent(w, allStx + 46, allSty +healthHeight, 'cartoongame/imgs/whiteblock.png', { color: 0, scaley: .5, scalex: .7 }) );
	healthLeft = new ent(w, allStx + 47, allSty +healthHeight + 1, 'cartoongame/imgs/whiteblock.png', { color: 0xff0000, scaley: .4, scalex: .67 }); a1(healthLeft);

	var itemLeft: number = allStx + 136; var itemRight = allStx + 192; var itemVert: number = allSty +170;

    itemLabelLeft = new enttx(w, itemLeft, itemVert - 14, 'Items', { font: '10px ' + fontName, fill: '#555' }); a1(itemLabelLeft);
    itemPicsLeft = [new ent(w, itemLeft, itemVert, 'cartoongame/imgs/sitems/srocket2.png'),
        new ent(w, itemLeft, itemVert+16, 'cartoongame/imgs/sitems/srocket2.png'),
        new ent(w, itemLeft, itemVert + 32, 'cartoongame/imgs/sitems/srocket2.png')];
    a1l(itemPicsLeft);

	a1(new enttx(w, allStx + 52, allSty +healthHeight - 3, 'Life', { font: '10px ' + fontName, fill: '#222' }) );

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

    itemLabelRight = new enttx(w, itemRight, itemVert - 14, 'Items', { font: '10px ' + fontName, fill: '#555' }); a2(itemLabelRight);
    itemPicsRight = [new ent(w, itemRight, itemVert, 'cartoongame/imgs/sitems/sbomb.png'),
    new ent(w, itemRight, itemVert + 16, 'cartoongame/imgs/sitems/sbomb.png'),
    new ent(w, itemRight, itemVert + 32, 'cartoongame/imgs/sitems/sbomb.png')];
    a2l(itemPicsRight);

	headEntRight = new ent(w, allStx + 230 + (team == 1 ? 0 : -40), allSty+((team == 1) ? 80 : 50), (team == 1) ? foeHeadPic : headPic, { scalex: (team == 1) ? .5 : .75, scaley: (team == 1) ? .5 : .75, color: (team == 1) ? 0xa0a0a0:0xffffff }); a2(headEntRight);
	nameRight = new enttx(w, allStx + 210, allSty+nameHeight, (team==1)?foeNameString:apg.playerName, { font: '12px ' + fontName, fill: (team==1)?foenameColor:nameColor }); a2(nameRight);
	a2(new ent(w, allStx + 250, allSty +healthHeight, 'cartoongame/imgs/whiteblock.png', { color: 0, scaley: .5, scalex: .7 }) );
	healthRight = new ent(w, allStx + 251, allSty +healthHeight + 1, 'cartoongame/imgs/whiteblock.png', { color: 0xff0000, scaley: .4, scalex: .67 }); a2(healthRight);

	a2(new enttx(w, allStx + 280, allSty +healthHeight - 3, 'Life', { font: '10px ' + fontName, fill: '#222' }) );
    a2( new enttx(w, foestatx + 60 + -20 + 240, foestaty + 186 + 158, 'Resources', { font: '12px ' + fontName, fill: '#222' }) );

    statPicsRight = picCategory(foestatx + foeAdd + 194 - 50, foestaty + 360, 13, ['beer.png', 'burger.png', 'canofbeans.png', 'chemicals.png', 'chemicals2.png', 'corn.png', 'dollar2.png', 'fries.png', 'taco1.png', 'tbone_steak.png']); a2l(statPicsRight);
    statNumsRight = inCategory(-4 + foestatx + foeAdd + 214 - 50, foestaty + 360, 13, ["5", "0", "0", "0", "0", "10", "0", "0", "0", "0"]); a2l(statNumsRight);

    // 2. Location

    new enttx(w, 80+mapBuildingx + 325, 104+mapBuildingy+240, "2. Then, Move Here", { font: '20px ' + fontName, fill: '#A00' });
    new ent(w, mapBuildingx + 270, mapBuildingy +265, 'cartoongame/imgs/flag' + (team == 1 ? 1 : 2) + 'small.png');
    new ent(w, mapBuildingx + 680, mapBuildingy +265, 'cartoongame/imgs/flag' + (team == 1 ? 1 : 2)+'small.png');
    locBody = new ent(w, mapBuildingx + 330 + 64 * curBuilding, mapBuildingy +16+285, bodyPic, { scalex: 1, scaley: 1, color:bodyColor});
    locHead = new ent(w, mapBuildingx + 320 + 64 * curBuilding, mapBuildingy +16 +271, sheadPic);
    playerLabel = new enttx(w, mapBuildingx + 320 + 64 * curBuilding, mapBuildingy +16 +320-6, apg.playerName, { font: '12px ' + fontName, fill: nameColor });

    var moveArrow = [];
    for (var k = 0; k < 6; k++) { var art = 'mid'; if (k == 0) art = 'cap'; if (k == 5) art = 'head';  moveArrow.push(new ent(w, 310 + mapBuildingx + 64 * k, 280 + mapBuildingy, 'cartoongame/imgs/arrow' + art + '.png', { alpha: .5, upd: e => { e.alpha = .2 + .2 * Math.cos( tick * .03); } })); moveArrow[k].visible = false;}

    new enttx(w, mapRowx + 700, mapRowy + 110, "", { font: '24px ' + fontName, fill: '#A00' });
    stanceBody = new ent(w, mapRowx + 740, mapRowy + 160 + curRow * 64, bodyPic, { scalex: 1, scaley: 1, color: bodyColor });
    stanceHead = new ent(w, mapRowx + 731, mapRowy + 146 + curRow * 64, sheadPic);

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

    new enttx(w, tipx +260, tipy+140, "", { font: '17px ' + fontName, fill: '#455', wordWrap: true, wordWrapWidth: 346 }, {
        upd: e => {
            if (toolTip != lastToolTip) {
                e.text = toolTip;
                lastToolTip = toolTip;
                extractIcon1.visible = extractIcon2.visible = extractIcon3.visible = skillIcon2r1.visible = skillIcon2r2.visible = skillIcon2r3.visible = skillIcon2.visible = skillIcon1r1.visible = skillIcon1r2.visible = skillIcon1.visible = extractLabel.visible = abilitiesLabel.visible =  requiresLabel.visible = resource1.visible = resource2.visible = resource3.visible = false;
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
                if (toolTip == 'item3') { e.text = itemHints[item3 + 1]; }
                if (toolTip == 'farm') doBuildingTip(e, 0);
                if (toolTip == 'pond') doBuildingTip(e, 1);
                if (toolTip == 'greenhouse')doBuildingTip(e, 2);
                if (toolTip == 'airport') doBuildingTip(e, 3);
                if (toolTip == 'police') doBuildingTip(e, 4);
                if (toolTip == 'hospital') doBuildingTip(e, 5);}}
    });

	category("Time", -130 + 650 + 200, -360 + 48 + 336);
	new enttx(w, -130 + 650 + 200, -360 + 48 + 354, "", { font: '40px ' + fontName, fill: '#688' }, { upd: e => { e.text = "" + timer; e.fill = roundColors[(roundNumber-1) % roundColors.length];}});

    if (apg.allowFullScreen) {new enttx(w, 100, 700, "Your actions were submitted just fine!  Now just relax until the next round.", { font: '18px ' + fontName, fill: '#433' });}

    reset();

    if (apg.networkTestSequence) MainInputTestSequence(apg);}