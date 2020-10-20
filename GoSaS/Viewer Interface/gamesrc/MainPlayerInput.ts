/*
// round start plaque - health, stat update, team stats, new opponent
*/

function CartoonAssetCache(c: Cacher): void {
	c.images('cartoongame/imgs', ['blueorb.png', 'flag1small.png', 'flag2small.png', 'littleperson.png', 'littleperson2.png', 'bodyleft.png', 'bodyright.png', 'bkg_guide4.png', 'ClientUI11.png', 'tooltip2.png', 'test.png', 'whiteblock.png', 'arrowcap.png', 'arrowmid.png', 'arrowhead.png', 'hudselect.png']);
    c.images('cartoongame/imgs/buildings', ['building1.png', 'building2.png', 'building3.png', 'building4.png', 'building5.png', 'building6.png']);
    c.images('cartoongame/imgs/heads', ['headbig1.png', 'headbig2.png', 'headbig3.png', 'headbig4.png', 'headbig5.png', 'headbig6.png', 'headbig7.png', 'headbig8.png', 'headbig9.png', 'headbig10.png', 'headbig11.png', 'headbig12.png', 'headbig13.png', 'headbig14.png', 'headbig15.png', 'headbig16.png', 'headbig17.png', 'headbig18.png', 'headbig19.png', 'headbig20.png']);
    c.images('cartoongame/imgs/sheads', ['shead1.png', 'shead2.png', 'shead3.png', 'shead4.png', 'shead5.png', 'shead6.png', 'shead7.png', 'shead8.png', 'shead9.png', 'shead10.png', 'shead11.png', 'shead12.png', 'shead13.png', 'shead14.png', 'shead15.png', 'shead16.png', 'shead17.png', 'shead18.png', 'shead19.png', 'shead20.png']);
    c.images('cartoongame/imgs/resources', ['beer.png', 'burger.png', 'canofbeans.png', 'chemicals.png', 'chemicals2.png', 'corn.png', 'dollar2.png', 'fries.png', 'taco1.png', 'tbone_steak.png']);
    c.images('cartoongame/imgs/sitems', ['stennisball.png', 'sbaseballbat.png', 'sbomb.png', 'sbroom.png', 'sclock.png', 'scomputer.png', 'shammer2.png', 'sknighthelmet.png', 'sscarymask.png', 'svacanteyemask.png', 'srocket2.png', 'sscissors2.png', 'sshield.png', 'sfalseteeth.png']);
	c.sounds('cartoongame/snds/fx', ['strokeup2.mp3', 'strokeup.mp3', 'strokeup4.mp3']);
    c.json(['cartoongame/json/TestActions.json', 'cartoongame/json/MoveActions.json', 'cartoongame/json/PlayActions.json']);

	WaitingToJoinCache(c);
	JoinAcknowledgeCache(c);
	ButtonCache(c);}

interface RoundUpdate { round: number; time: number;}
interface EmptyParms { }
interface RoundParms { team1Health: number, team2Health:number }
interface SelectionParms { choices: number[];}
interface PlayerUpdate{ nm:string; st: number[]; rs: number[];}

function MainInputTestSequence(apg: APGSys): void {

    var names = ["npc1", "npc2", "npc3", "npc4", "npc5", "npc6", "npc7", "npc8", "npc9", "npcr1", "npcr2", "npcr3", "npcr4", "npcr5", "npcr6", "npcr7", "npcr8", "npcr9"];

    apg.ClearLocalMessages();
    var roundLength: number = 45;//45;//15;
    function mr() { if (Math.random() < .6) return 0; return Math.floor(Math.random() * 3) + 1;}
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

class Player {
	name: string;
	headPic: string;
	smallHeadPic: string;
	nameColor: string;
	healthStat: number = 10;
	items: number[] = [-1,-1,-1];
	resources: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];;
	constructor(name: string, headNum:number) {
		this.name = name;
		this.headPic = 'cartoongame/imgs/heads/headbig' + headNum + '.png';
		this.smallHeadPic = 'cartoongame/imgs/sheads/shead' + headNum + '.png';}}

class StatPanel {
	panelGroup: Phaser.Group;
	headEnt: ent;
	name: enttx;
	health: ent;
	statPics: ent[];
	statNums: enttx[];
	itemLabel: enttx;
	itemPics: ent[]; }

class ToolTip {
	toolTip: string = "";
	toolTime = 0;}

function addActions( apg:APGSys, w:Phaser.Group, team:number, srcChoices: number[], setToolTip: (str: string) => void): ButtonCollection[] {
	var curCollection: number = 0;
	function add( isActions:number, choiceSet: ActionEntry[]): ButtonCollection {
		var id: number = curCollection;
        curCollection++;
        return new ButtonCollection( isActions, w, apg, 22, setToolTip, v => srcChoices[id] = v, choiceSet);}

	var o = [];
	var actions: any = apg.JSONAssets['cartoongame/json/TestActions.json'];
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


function MakeToolTip( apg:APGSys, w:Phaser.Group, player:Player, fontName:string, tip:ToolTip, getBuilding:()=>number ):void{
	var extractResources = [[Resource.TBone, Resource.Corn], [Resource.Acid, Resource.Goo], [Resource.Corn, Resource.Beans], [Resource.FrothyDrink, Resource.Burger], [Resource.FrothyDrink, Resource.Bribe], [Resource.Fries, Resource.Taco]];
	var extractItems = [ItemIds.Hammer, ItemIds.ScaryMask, ItemIds.Bomb, ItemIds.TennisBall, ItemIds.Rocket, ItemIds.Shield];

	var resourceIcons = ['beer.png', 'burger.png', 'canofbeans.png', 'chemicals.png', 'chemicals2.png', 'corn.png', 'dollar2.png', 'fries.png', 'taco1.png', 'tbone_steak.png'];
	var firstAbilityCosts = [[Resource.Goo, Resource.Beans], [Resource.Goo, Resource.Corn], [Resource.Goo, Resource.Fries], [Resource.FrothyDrink, Resource.Beans], [Resource.Bribe, Resource.Burger], [Resource.FrothyDrink, Resource.TBone]];
	var secondAbilityCosts = [[Resource.Bribe, Resource.Burger, Resource.Fries], [Resource.Acid, Resource.Beans, Resource.TBone], [Resource.Acid, Resource.Burger, Resource.Taco], [Resource.Bribe, Resource.Corn, Resource.TBone],
	[Resource.FrothyDrink, Resource.Fries, Resource.Taco], [Resource.Acid, Resource.Corn, Resource.Taco]];

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
	var itemIcons2 = ['ball', 'bomb', 'hammer', 'mask', 'rocket', 'shield'];
	var ability1Pics: string[] = ['cow', 'fish', 'flowers', 'biplane', 'policecopter', 'meds'];
	var ability2Pics: string[] = ['broccoli', 'turtles', 'sun', 'blimp', 'policecar', 'fairyability'];

	var k: number;

	var tooltipSet = new Phaser.Group(apg.g);
	tooltipSet.x = 10;
	tooltipSet.y = 100;
	w.add(tooltipSet);

	var lastTip: string = "";
	var onTipTime: number = 0;
	new ent(tooltipSet, -320, -200, 'cartoongame/imgs/tooltip2.png', {
		upd: e => {
			tip.toolTime--;
			if (tip.toolTime == 0) tip.toolTip = "";
			if (tip.toolTip == lastTip && tip.toolTip != "" ) {
				onTipTime++;}
			else {
				onTipTime = 0;
				lastTip = tip.toolTip;}
			if (tip.toolTip == "" || onTipTime < 45) tooltipSet.alpha = tooltipSet.alpha * .7;
			else tooltipSet.alpha = tooltipSet.alpha * .85 + .15 * 1.;}});

	new enttx(tooltipSet, 0, 4, "Tip", { font: '18px ' + fontName, fill: '#433' }, { upd: e => { e.visible = (tip.toolTip == "") ? false : true; } });
	var requiresLabel = new enttx(tooltipSet, 0, 150, "Cost", { font: '18px ' + fontName, fill: '#433' }, { visible: false });
	var resources: ent[] = [];
	for (k = 0; k < 3; k++)resources.push(new ent(tooltipSet, 32 * k, 170, 'cartoongame/imgs/resources/beer.png', { visible: false }));

	var extractSet = new Phaser.Group(apg.g); tooltipSet.add(extractSet); extractSet.x = 64; extractSet.y = 136;
	var extractLabel = new enttx(extractSet, -64, 12, "Extract", { font: '18px ' + fontName, fill: '#433' }, { visible: false });
	var extracts: ent[] = [];
	for (k = 0; k < 3; k++)extracts.push(new ent(extractSet, 32 * k, 0, 'cartoongame/imgs/resources/beer.png', { visible: false }));
	extracts[2].scalex = extracts[2].scaley = .5;

	var aby: number = 174;
	var abilitiesLabel = new enttx(tooltipSet, 0, aby + 8, "Abilities", { font: '18px ' + fontName, fill: '#433' }, { visible: false });

	var skill1Set = new Phaser.Group(apg.g); tooltipSet.add(skill1Set); skill1Set.x = 64;
	var skillIcon1: ent = new ent(skill1Set, 0, aby, 'cartoongame/imgs/abilities/biplane.png', { scalex: .5, scaley: .5, visible: false });
	var skillIcons1: ent[] = [];
	for (k = 0; k < 2; k++)skillIcons1.push( new ent(skill1Set, k * 16, aby + 34, 'cartoongame/imgs/resources/beer.png', { scalex: .5, scaley: .5, visible: false }) );

	var ab2x: number = 0; 
	var skill2Set = new Phaser.Group(apg.g); tooltipSet.add(skill2Set); skill2Set.x = 114;
	var skillIcon2: ent = new ent(skill2Set, 0, aby, 'cartoongame/imgs/abilities/blimp.png', { scalex: .5, scaley: .5, visible: false }); skillIcon2.visible = false;
	var skillIcons2: ent[] = [];
	for (k = 0; k < 3; k++)skillIcons2.push(new ent(skill2Set, k * 16, aby + 34, 'cartoongame/imgs/resources/beer.png', { scalex: .5, scaley: .5, visible:false }));

	var lastToolTip: string = '';

	function doBuildingTip(e: enttx, id: number): void {
		var k: number;
		var res = 'cartoongame/imgs/resources/';
		e.text = buildingHints[id];
		abilitiesLabel.visible = extractLabel.visible = skillIcons1[0].visible = skillIcons1[1].visible = skillIcon1.visible = skillIcons2[0].visible = skillIcons2[1].visible = skillIcons2[2].visible = skillIcon2.visible = extracts[0].visible = extracts[1].visible = extracts[2].visible = true;
		for (k = 0; k < 2;k++)extracts[k].tex = res + resourceIcons[extractResources[id][k]];
		extracts[2].tex = 'cartoongame/imgs/items/' + itemIcons2[extractItems[id]] + '.png';
		var alpha1 = (player.resources[firstAbilityCosts[id][0]] > 0 && player.resources[firstAbilityCosts[id][1]] > 0) ? 1 : .5;
		skillIcon1.tex = 'cartoongame/imgs/abilities/' + ability1Pics[id] + '.png'; skillIcon1.alpha = alpha1;
		for (k = 0; k < 2; k++) { skillIcons1[k].tex = res + resourceIcons[firstAbilityCosts[id][k]]; skillIcons1[k].alpha = alpha1; }
		var alpha2 = (player.resources[secondAbilityCosts[id][0]] > 0 && player.resources[secondAbilityCosts[id][1]] > 0 && player.resources[secondAbilityCosts[id][2]] > 0) ? 1 : .5;
		skillIcon2.tex = 'cartoongame/imgs/abilities/' + ability2Pics[id] + '.png'; skillIcon2.alpha = alpha2;
		for (k = 0; k < 3; k++) { skillIcons2[k].tex = res + resourceIcons[secondAbilityCosts[id][k]]; skillIcons2[k].alpha = alpha2; }}

	new enttx(tooltipSet, 10, 30, "", { font: '17px ' + fontName, fill: '#455', wordWrap: true, wordWrapWidth: 346 }, {
		upd: e => {
			tooltipSet.x = tooltipSet.x * .93 + .07 * (apg.g.input.activePointer.x < 420 ? 20:apg.g.input.activePointer.x - 400);
			tooltipSet.y = tooltipSet.y * .93 + .07 * (apg.g.input.activePointer.y < 240 ? 0 : apg.g.input.activePointer.y - 240);
			if (tip.toolTip != lastToolTip) {
				var buildingID: number = getBuilding();
				e.text = tip.toolTip;
				lastToolTip = tip.toolTip;
				extracts[0].visible = extracts[1].visible = extracts[2].visible = skillIcons2[0].visible = skillIcons2[1].visible = skillIcons2[2].visible = skillIcon2.visible = skillIcons1[0].visible = skillIcons1[1].visible = skillIcon1.visible = extractLabel.visible = abilitiesLabel.visible =  requiresLabel.visible = resources[0].visible = resources[1].visible = resources[2].visible = false;
				if (tip.toolTip == 'building1') { e.text = buildingAction1Hints[buildingID]; requiresLabel.visible = true; resources[0].visible = true; resources[1].visible = true; resources[0].tex = 'cartoongame/imgs/resources/' + resourceIcons[firstAbilityCosts[buildingID][0]]; resources[1].tex = 'cartoongame/imgs/resources/' + resourceIcons[firstAbilityCosts[buildingID][1]]; }
				if (tip.toolTip == 'building2') { e.text = buildingAction2Hints[buildingID]; requiresLabel.visible = true; resources[0].visible = true; resources[1].visible = true; resources[2].visible = true; resources[0].tex = 'cartoongame/imgs/resources/' + resourceIcons[secondAbilityCosts[buildingID][0]]; resources[1].tex = 'cartoongame/imgs/resources/' + resourceIcons[secondAbilityCosts[buildingID][1]]; resources[2].tex = 'cartoongame/imgs/resources/' + resourceIcons[secondAbilityCosts[buildingID][2]]; }
				if (tip.toolTip == 'extract') {
					e.text = "EXTRACT: Randomly extract a resource or item from the building you're at.  This won't work if the building is already in use this turn.  What you get depends on the quirk of the building.  You might dodge airbourne attacks sometmies when you're doing this.";
					extractLabel.visible = extracts[0].visible = extracts[1].visible = extracts[2].visible = true;
					extracts[0].tex = 'cartoongame/imgs/resources/' + resourceIcons[extractResources[buildingID][0]];
					extracts[1].tex = 'cartoongame/imgs/resources/' + resourceIcons[extractResources[buildingID][1]];
					extracts[2].tex = 'cartoongame/imgs/items/' + itemIcons2[extractItems[buildingID]] + '.png';}
				if (tip.toolTip == 'item1') { e.text = itemHints[player.items[0] + 1]; }
				if (tip.toolTip == 'item2') { e.text = itemHints[player.items[1] + 1]; }
				if (tip.toolTip == 'item3') { e.text = itemHints[player.items[2] + 1]; }
				if (tip.toolTip == 'farm') doBuildingTip(e, 0);
				if (tip.toolTip == 'pond') doBuildingTip(e, 1);
				if (tip.toolTip == 'greenhouse')doBuildingTip(e, 2);
				if (tip.toolTip == 'airport') doBuildingTip(e, 3);
				if (tip.toolTip == 'police') doBuildingTip(e, 4);
				if (tip.toolTip == 'hospital') doBuildingTip(e, 5);}}});}

function MakeStats(apg: APGSys, player: Player, foe: Player, fontName: string, team: number, w: Phaser.Group, buildingPicName: string, actionLabelTextProps: object, getCurBuilding:()=>number, getFoeActive:()=>boolean): () => void{
	var itemIcons = ['stennisball', 'sbomb', 'shammer2', 'sscarymask', 'srocket2', 'sshield'];
	var nameHeight = 138; 
	var actionLabel: enttx = new enttx(w, 334, 92, "1. Action Here", actionLabelTextProps, {});
	var statsSet = new Phaser.Group(apg.g); w.add(statsSet); statsSet.x = 540; statsSet.y = 50;
	var building:ent = new ent(statsSet, 90, 86, buildingPicName, { color: 0xa0a0a0});
	var vsLabel:enttx = new enttx(statsSet, 110, -72 + nameHeight, 'VS', { font: '24px ' + fontName });

	function MakePanel(panel: StatPanel, teamTest: number, basex: number, headx: number, headoffset: number, namex: number, healthlabx: number, healthx: number, itemx: number, resx: number, rexlabx: number, resnumx: number):void {
		function inCategory(src: Phaser.Group, x: number, y: number, add: number, labels: string[], bump1: boolean = false): enttx[] {
			var labelEnts: enttx[] = [];
			var curx: number = x; var cury: number = y;
			for (var k = 0; k < labels.length; k++) { labelEnts.push(new enttx(src, curx, cury, labels[k], { font: '14px ' + fontName, fill: '#211' })); if (bump1 && k == 0) cury += 28; cury += add; if (k == 2 || k == 5) { curx += 28; cury = y; } if (k == 5) cury -= add; }
			return labelEnts;
		}
		function picCategory(src: Phaser.Group, x: number, y: number, add: number, labels: string[]): ent[] {
			var labelEnts: ent[] = [];
			var curx: number = x; var cury: number = y;
			for (var k = 0; k < labels.length; k++) { labelEnts.push(new ent(src, curx, cury, 'cartoongame/imgs/resources/' + labels[k], { scalex: .5, scaley: .5 })); cury += add; if (k == 2 || k == 5) { curx += 28; cury = y; } if (k == 5) cury -= add; }
			return labelEnts;
		}

		var coreSet = panel.panelGroup = new Phaser.Group(apg.g); statsSet.add(coreSet); coreSet.x = basex; coreSet.y = 0;
		panel.headEnt = new ent(coreSet, headx + (team == teamTest ? headoffset : 0), ((team == teamTest) ? 50 : 80), (team == teamTest) ? player.headPic : foe.headPic, { scalex: (team == teamTest) ? .75 : .5, scaley: (team == teamTest) ? .75 : .5, color: (team == teamTest) ? 0xffffff : 0xa0a0a0 });
		panel.name = new enttx(coreSet, namex, nameHeight, (team == teamTest) ? player.name : foe.name, { font: '12px ' + fontName, fill: (team == teamTest) ? player.nameColor : foe.nameColor });
		var healthHeight = 158;
		new enttx(coreSet, healthlabx, healthHeight - 3, 'Life', { font: '10px ' + fontName, fill: '#222' });
		new ent(coreSet, healthx, healthHeight, 'cartoongame/imgs/whiteblock.png', { color: 0, scaley: .5, scalex: .7 });
		panel.health = new ent(coreSet, healthx+1, healthHeight + 1, 'cartoongame/imgs/whiteblock.png', { color: 0xff0000, scaley: .4, scalex: .67 });

		var itemSet = new Phaser.Group(apg.g); coreSet.add(itemSet); itemSet.x = itemx; itemSet.y = 170;
		panel.itemLabel = new enttx(itemSet, 0, -14, 'Items', { font: '10px ' + fontName, fill: '#555' });
		panel.itemPics = [new ent(itemSet, 0, 0, 'cartoongame/imgs/sitems/srocket2.png'),
			new ent(itemSet, 0, 16, 'cartoongame/imgs/sitems/srocket2.png'),
			new ent(itemSet, 0, 32, 'cartoongame/imgs/sitems/srocket2.png')];

		var resSet = new Phaser.Group(apg.g); coreSet.add(resSet); resSet.x = resx; resSet.y = 184;
		new enttx(resSet, rexlabx, -16, 'Resources', { font: '12px ' + fontName, fill: '#222' });
		panel.statPics = picCategory(resSet, resnumx, 0, 13, ['beer.png', 'burger.png', 'canofbeans.png', 'chemicals.png', 'chemicals2.png', 'corn.png', 'dollar2.png', 'fries.png', 'taco1.png', 'tbone_steak.png']);
		panel.statNums = inCategory(resSet, resnumx+16, 0, 13, ["5", "0", "0", "0", "0", "10", "0", "0", "0", "0"]);
	}
	var left: StatPanel = new StatPanel, right: StatPanel = new StatPanel();
	MakePanel( left, 1, 0, 0, 0, 0, 2, -4, 86, -10, 6, 4 );
	MakePanel(right, 2, 150, 30, -40, 10, 80, 50, -8, 20, 0, -6 );

	var foeActiveOld = true;

	return () => {
		var buildingNames = ['farm', 'pond', 'greenhouse', 'airport', 'police station', 'hospital'];

		var curBuilding:number = getCurBuilding();
		building.tex = 'cartoongame/imgs/buildings/building' + (curBuilding + 1) + '.png';
		actionLabel.text = "1. Action at " + buildingNames[curBuilding];

		var me: StatPanel, other: StatPanel;
		var panelx: number, panelsidex: number;
		var foeActive = getFoeActive();

		if (team == 1) { me = left; other = right; panelx = 0; panelsidex = 32; }
		else { me = right; other = left; panelx = 150; panelsidex = -32; }
		if (foeActive && !foeActiveOld) { me.panelGroup.x = panelx; other.panelGroup.visible = true;}
		if (!foeActive && foeActiveOld) { me.panelGroup.x = panelx + panelsidex; other.panelGroup.visible = false;}
		foeActiveOld = foeActive;

		me.itemLabel.alpha = (player.items[0] != -1) ? 1 : .3;
		for (var k = 0; k < 3; k++) { if (player.items[k] == -1) me.itemPics[k].visible = false; else { me.itemPics[k].visible = true; me.itemPics[k].tex = 'cartoongame/imgs/sitems/' + itemIcons[player.items[k]] + '.png'; }}
		for (var k = 0; k < 10; k++) { me.statNums[k].tx = "" + player.resources[k]; me.statPics[k].alpha = me.statNums[k].alpha = (player.resources[k] == 0) ? .5 : 1;}

		me.health.scalex = .67 * (player.healthStat / 10);

		if (foeActive) {
			other.name.text = foe.name;
			other.headEnt.tex = foe.headPic;

			other.itemLabel.alpha = (foe.items[0] != -1) ? 1 : .3;
			for (var k = 0; k < 3; k++) { if (foe.items[k] == -1) other.itemPics[k].visible = false; else { other.itemPics[k].visible = true; other.itemPics[k].tex = 'cartoongame/imgs/sitems/' + itemIcons[foe.items[k]] + '.png'; }}
			for (var k = 0; k < 10; k++) { other.statNums[k].tx = "" + foe.resources[k]; other.statPics[k].alpha = other.statNums[k].alpha = (foe.resources[k] == 0) ? .5 : 1; }

			other.health.scalex = .67 * (foe.healthStat / 10);}}};

function MakeLocation(apg: APGSys, w: Phaser.Group, id: number, team:number, fontName:string, actionLabelTextProps:object, bodyPic:string, player:Player, getBuilding:()=>number ):()=>void{
	var cols2 = [0x306090, 0x609030, 0x903060, 0x906030, 0x603090, 0x309060, 0x808080, 0x903030, 0x309030, 0x303090];
	var bodyColor: number = cols2[id % 10];
	var buildingSet = new Phaser.Group(apg.g); w.add(buildingSet); buildingSet.x = 344; buildingSet.y = 300;
	new enttx(buildingSet, 85, 94, "2. Then, Move Here", actionLabelTextProps);
	new ent(buildingSet, -44, 15, 'cartoongame/imgs/flag' + (team == 1 ? 1 : 2) + 'small.png');
	new ent(buildingSet, 340, 15, 'cartoongame/imgs/flag' + (team == 1 ? 1 : 2) + 'small.png');
	var building: number = getBuilding();
	var locBody: ent = new ent(buildingSet, 64 * building, 51, bodyPic, { scalex: 1, scaley: 1, color: bodyColor });
	var locHead: ent = new ent(buildingSet, 64 * building, 37, player.smallHeadPic);
	var playerLabel: enttx = new enttx(buildingSet, 64 * building, 80, player.name, { font: '12px ' + fontName, fill: player.nameColor });
	return () => {
		var curBuilding: number = getBuilding();
		locBody.x = 16 + 64 * (team == 1 ? curBuilding : 5 - curBuilding);
		locHead.x = 6 + 64 * (team == 1 ? curBuilding : 5 - curBuilding);
		playerLabel.x = 6 + 64 * (team == 1 ? curBuilding : 5 - curBuilding);
	};}

/*
	 show results for previous round

	announce new round
*/

function MakeRoundPlaque(apg: APGSys, player: Player, foe: Player, fontName: string, isShowPlaque: () => boolean, endShow:()=>void): void {
	var w = new Phaser.Group(apg.g);
	apg.g.world.add(w);

	new ent(w, 0, 0, 'cartoongame/imgs/tooltip2.png', {
		upd: e => {
			w.y = w.y * .8 + .2 * (isShowPlaque() ? 0 : -500);
			if (!isShowPlaque()) return;
			if (apg.g.input.activePointer.isDown) endShow();
		}
	});
	new enttx(w, 8, 8, "Choices for ", { font: '45px ' + fontName, fill: '#444' });
}





















function MainPlayerInput(apg: APGSys, id:number, team:number ): void {
    var w = new Phaser.Group(apg.g);
    apg.g.world.add(w);

	var fontName: string = "Caveat Brush";

	var endOfRoundSound: Phaser.Sound = apg.g.add.audio('cartoongame/snds/fx/strokeup4.mp3', 1, false);
	var warningSound: Phaser.Sound = apg.g.add.audio('cartoongame/snds/fx/strokeup.mp3', 1, false);

    var cols = ['#369', '#693', '#936', '#963', '#639', '#396', '#888', '#933', '#393', '#339'];
    var timer: number = 0;
    var choices: number[] = [1, 1, 1, 1, 1, 1];

    var choiceButtons: ButtonCollection[];
    var curBuilding: number = (team == 2) ? (5 - id % 6) : id % 6;
    var curRow: number = id < 6 ? 1 : 0;

	var player: Player = new Player(apg.playerName, id + 1 + ((team == 2) ? 10 : 0) );
	player.nameColor = cols[id % 10];

	var foe: Player = new Player('xxxFirestormxxx', 20 );
	foe.nameColor = cols[7];

	var accepted = false;
	var showRoundPlaque: boolean = false;
	var roundNumber: number = 2;
    var foeActive = false;
    var forceReset: boolean = true;

    // __________________________________________________________________________

    function reset(): void {
        choiceButtons[0].selected = curBuilding;
        choiceButtons[1].selected = curRow;
        choiceButtons[2].selected = 0;
        choiceButtons[3].selected = -1;

        choices[0] = curBuilding;//-1;
        choices[1] = curRow;//-1;
        choices[2] = 0;

		updateStats();
		updateLocation();
    }

	var playerStats: any = {};
    apg.ResetServerMessageRegistry()
        .SetKeepAliveStatus(true)
        .RegisterDisconnect(() => {
            ent.clearAll();
            enttx.clearAll();
            WaitingToJoin(apg, "Something went wrong - no response from the streamer's game...  Make sure the streamer is online and still playing this game, then connect again!");})
        .Register<RoundParms>("startround", p => {
            accepted = false;
			//showRoundPlaque = true;
            endOfRoundSound.play();
            var curFoe:PlayerUpdate = null;
            for (var k in playerStats) {
                var f: PlayerUpdate = playerStats[k];
                if (f.nm == apg.playerName) continue;
                if (f.st[0] > 0 && (f.st[2] % 6) == curBuilding && f.st[3] == curRow) { curFoe = f; break; }}
            if (curFoe == null) { foeActive = false;}
            else {
                foeActive = true;
                var foeID:number = curFoe.st[1];
                foe.name = curFoe.nm;
                foe.nameColor = cols[foeID % 10];
                foe.headPic = 'cartoongame/imgs/heads/headbig' + (foeID + 1 + ((team == 2) ? 0 : 10)) + '.png';
                foe.healthStat = curFoe.st[0];
                foe.items[0] = curFoe.st[4];
                foe.items[1] = curFoe.st[5];
                foe.items[2] = curFoe.st[6];
                foe.resources = curFoe.rs;}
            reset();})
		.Register<RoundUpdate>("time", p => {
            timer = p.time;
            console.log("time " + timer);
			roundNumber = p.round;
			if (timer < 6 && !accepted ) { warningSound.play('', 0, 1 - (timer * 15) / 100); }})
        .Register<PlayerUpdate>("pl", p => {
            playerStats[p.nm] = p;

			if (p.nm != apg.playerName) return;

			player.healthStat = p.st[0];

            if (p.st[3] != -1) curRow = p.st[3];
            if (p.st[2] != -1) curBuilding = p.st[2] % 6;
			player.items[0] = p.st[4];
			player.items[1] = p.st[5];
			player.items[2] = p.st[6];
			player.resources = p.rs;
            forceReset = true;})
        .Register<SelectionParms>("submit", p => {
            if (accepted == false) { accepted = true; endOfRoundSound.play(); }
            curBuilding = choices[0];
            curRow = choices[1];
            playerStats = {};
			apg.WriteToServer<SelectionParms>("upd", { choices: choices });});

    // __________________________________________________________________________

    // Full Background

    new ent(w, 0, 0, 'cartoongame/imgs/ClientUI11.png', {
        upd: e => {
            if (accepted) { w.y = w.y * .9 + .1 * -500; } else { w.y = w.y * .9 + .1 * 0; }

			choiceButtons[2].setParms(curBuilding, player.items[0], player.items[1], player.items[2], player.resources, forceReset);
            forceReset = false;

            if (choiceButtons[3].selected == 0) {
                endOfRoundSound.play();
                accepted = true;
                choiceButtons[3].selected = -1;}

            choiceButtons[0].update( true );
            //choiceButtons[1].update( true );
            choiceButtons[2].update(true );
            choiceButtons[3].update(true);}});

	var tip: ToolTip = new ToolTip();
	choiceButtons = addActions(apg, w, team, choices, str => { tip.toolTip = str; tip.toolTime = 3; });

	var roundColors = ['#468', '#846', '#684'];

	var lastRoundUpdate: number = 0;
	new enttx(w, 404, 8, "Choices for ", { font: '45px ' + fontName, fill: '#444' });
	new enttx(w, 584, 8, "Round ", { font: '45px ' + fontName, fill: roundColors[1] }, {
        upd: e => {
            if (roundNumber != lastRoundUpdate) {
                e.text = "Round " + (roundNumber);
                e.fill = roundColors[(roundNumber-1) % roundColors.length];
                lastRoundUpdate = roundNumber;}}});

	var actionLabelTextProps: object = { font: '20px ' + fontName, fill: '#A00' };
	var updateStats: () => void = MakeStats(apg, player, foe, fontName, team, w, 'cartoongame/imgs/buildings/building1.png', actionLabelTextProps, () => curBuilding, () => foeActive);
	var updateLocation: () => void = MakeLocation(apg, w, id, team, fontName, actionLabelTextProps, 'cartoongame/imgs/body' + (team == 1 ? 'right' : 'left') + '.png', player, () => curBuilding);
	MakeToolTip(apg, w, player, fontName, tip, () => curBuilding);

	var timeSet = new Phaser.Group(apg.g); w.add(timeSet); timeSet.x = 760; timeSet.y = 24;
	new enttx(timeSet, 0, 0, "Time", { font: '18px ' + fontName, fill: '#433' });
	new enttx(timeSet, 0, 18, "", { font: '40px ' + fontName, fill: '#688' }, { upd: e => { e.text = "" + timer; e.fill = roundColors[(roundNumber-1) % roundColors.length];}});

	//MakeRoundPlaque(apg, player, foe, fontName, () => showRoundPlaque, () => { showRoundPlaque = false; accepted = false; });

    if (apg.allowFullScreen) {new enttx(w, 100, 700, "Your actions were submitted just fine!  Now just relax until the next round.", { font: '18px ' + fontName, fill: '#433' });}

    reset();

    if (apg.networkTestSequence) MainInputTestSequence(apg);}