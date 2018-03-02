function ButtonCache(c: Cacher): void {
    c.images('cartoongame/imgs', ['blueorb.png', 'buttontest.png', 'middle.png', 'activate.png', 'assist.png', 'bag1.png', 'bag2.png', 'bag3.png', 'build.png', 'defend.png', 'harvest.png', 'heal.png', 'leftarrow.png', 'moveback.png', 'movein.png', 'rightarrow.png', 'accept.png', 'redo.png', 'strikeback.png', 'slash.png', 'recklessability.png', 'hudselect.png']);
    c.images('cartoongame/imgs/items', ['ball.png', 'baseballbat.png', 'bomb.png', 'broom.png', 'clock.png', 'computer.png', 'hammer.png', 'helmet.png', 'mask.png', 'mask2.png', 'rocket.png', 'scissors.png', 'shield.png', 'teeth.png']);
    c.images('cartoongame/imgs/abilities', ['biplane.png', 'blimp.png', 'broccoli.png', 'cow.png', 'policecar.png', 'policecopter.png', 'fairyability.png', 'fish.png', 'flowers.png', 'meds.png', 'sun.png', 'turtles.png']);
	c.sounds('cartoongame/snds/fx', ['strokeup2.mp3']);}

class ActionEntry {
	label: string;
	pic: string;
    tooltip: string;
    x: number;
    y: number;
    specialID: number = 0;
	constructor(label: string, tooltip: string, pic:string, x:number, y:number, specialID:number ) {
		this.label = label;
		this.tooltip = tooltip;
        this.pic = pic;
        this.x = x;
        this.y = y;
        this.specialID = specialID;}}

class ButtonCollection {

	selected: number;
	selectedName: string;
	update: (active: boolean) => void;

    item1: number = -2; private item2: number = -2; private item3: number = -2; private building:number=-1;

    buttons:ent[] = [];

    itemPics: string[] = ['ball', 'bomb', 'hammer', 'mask', 'rocket', 'shield'];
    ability1Pics: string[] = ['cow', 'fish', 'flowers', 'biplane','policecopter', 'meds'];
    ability2Pics: string[] = ['broccoli', 'turtles', 'sun', 'blimp', 'policecar', 'fairyability' ];

    building1Active: boolean = true;
    building2Active: boolean = true;

    setParms(building: number, item1: number, item2: number, item3: number, resources: number[], forceReset:boolean): void {

        var firstAbilityCosts = [[Resource.Goo, Resource.Beans], [Resource.Goo, Resource.Corn], [Resource.Goo, Resource.Fries], [Resource.FrothyDrink, Resource.Beans], [Resource.Bribe, Resource.Burger], [Resource.FrothyDrink, Resource.TBone]];
        var secondAbilityCosts = [[Resource.Bribe, Resource.Burger, Resource.Fries], [Resource.Acid, Resource.Beans, Resource.TBone], [Resource.Acid, Resource.Burger, Resource.Taco], [Resource.Bribe, Resource.Corn, Resource.TBone],
        [Resource.FrothyDrink, Resource.Fries, Resource.Taco], [Resource.Acid, Resource.Corn, Resource.Taco]];

        if (this.item1 != item1) { this.item1 = item1; if (item1 == -1) { this.buttons[6].alpha = .2; this.buttons[6].tex = 'cartoongame/imgs/bag1.png';} else { this.buttons[6].alpha = 1; this.buttons[6].tex = 'cartoongame/imgs/items/' + this.itemPics[item1] + '.png'; } }
        if (this.item2 != item2) { this.item2 = item2; if (item2 == -1) { this.buttons[7].alpha = .2; this.buttons[7].tex = 'cartoongame/imgs/bag2.png';} else { this.buttons[7].alpha = 1; this.buttons[7].tex = 'cartoongame/imgs/items/' + this.itemPics[item2] + '.png'; }}
        if (this.item3 != item3) { this.item3 = item3; if (item3 == -1) { this.buttons[8].alpha = .2; this.buttons[8].tex = 'cartoongame/imgs/bag3.png';} else { this.buttons[8].alpha = 1; this.buttons[8].tex = 'cartoongame/imgs/items/' + this.itemPics[item3] + '.png'; }}
        if (this.building != building || forceReset ) {
            this.building = building;
            this.buttons[4].tex = 'cartoongame/imgs/abilities/' + this.ability1Pics[building] + '.png';
            this.buttons[5].tex = 'cartoongame/imgs/abilities/' + this.ability2Pics[building] + '.png';
            this.building1Active = (resources[firstAbilityCosts[building][0]] == 0 || resources[firstAbilityCosts[building][1]] == 0) ? false : true;
            this.building2Active = (resources[secondAbilityCosts[building][0]] == 0 || resources[secondAbilityCosts[building][1]] == 0 || resources[secondAbilityCosts[building][2]] == 0) ? false : true;
            this.buttons[4].alpha = this.building1Active ? 1 : .2;
            this.buttons[5].alpha = this.building2Active ? 1 : .2;} }

	constructor(isActions:number, w:Phaser.Group, apg:APGSys, size: number, setToolTip: (str: string) => void, setOption: (val: number) => void, buttonsInit: ActionEntry[]) {
		let fx1 = 0, fx2 = 0, fy1 = 0, fy2 = 0, updateActive:boolean = false;

		var big: ButtonCollection = this;
		this.selected = -1;
		this.update = active => { updateActive = active; };

		let clickSound: Phaser.Sound = apg.g.add.audio('cartoongame/snds/fx/strokeup2.mp3', .4, false);
		var fontName: string = "Caveat Brush";

        var highlightTime: number = 0;
        var selx: number = -150; var sely: number = -150;

        var buts = this.buttons;
        var that = this;

		function addOption(id: number, str: string, x: number, y: number, toolTip: string, pic:string, specialID:number ): void {
			let highlighted: boolean = false, highlightVertical: number = 56, highlightHorizontal: number = size * 16 / 40, x1: number = x, x2: number = x + 56, y1: number = y - highlightVertical/2+8, y2: number = y + highlightVertical/2+8,
				mul: number = 1, spd: number = .07 + .26 * Math.random(), lastHighlight: boolean = false, inputUsed:boolean = false;

			if (id == 0) {
				fx1 = x1;
				fx2 = x2;
				fy1 = y1;
				fy2 = y2;}

            var bkg: ent = new ent(w, x, y - 20, 'cartoongame/imgs/' + pic, {});
            buts.push(bkg);
			if (str === '') bkg.visible = false;
            new enttx(w, 60, 50 + 20, "", {}, {
				upd: e => {
					mul = mul * (1 - spd) + spd * (updateActive ? 1 : 0);

					e.x = x +10 + 10 * 1.5 * (1 - mul);
					e.y = y +35 - 14 * 1.5 + 20 * 1.5 * (1 - mul);
					e.alpha = mul;
					e.scx = e.scy = size * mul * .05;
					bkg.scalex = bkg.scaley = mul;

					if (e.alpha < .01) {
						if (e.visible == true) e.visible = false;
						return;}
					if (e.visible == false) e.visible = true;

					lastHighlight = highlighted;

					if (apg.g.input.activePointer.isDown == false) inputUsed = false;

					if (!updateActive) {return;}
					highlighted = true;
					if (apg.g.input.x < x1 || apg.g.input.x > x2 || apg.g.input.y < y1 || apg.g.input.y > y2 || str == "" ) highlighted = false;
					if (highlighted) {
                        setToolTip(toolTip);
                        highlightTime = 2;
						fx1 = x1;
						fx2 = x2;
						fy1 = y1;
                        fy2 = y2;
                    }
                    if (that.selected == id) { selx = (x1 + x2) / 2 -32; sely = (y1 + y2) / 2-32; }
                    if (isActions && id == 4 && that.building1Active == false) return;
                    if (isActions && id == 5 && that.building2Active == false) return;
                    if (isActions && id == 6 && that.item1 == -1) return;
                    if (isActions && id == 7 && that.item2 == -1) return;
                    if (isActions && id == 8 && that.item3 == -1) return;
                    if (highlighted && (sysTick - lastMouseUpTime < 5) && !apg.g.input.activePointer.isDown && inputUsed == false) {
						lastMouseUpTime = -1000;
						clickSound.play();
						big.selected = id;
						big.selectedName = str;
						inputUsed = true;
						setOption(id);
						fx1 = x1;
						fx2 = x2;
						fy1 = y1;
						fy2 = y2; } } });}
		for (var k: number = 0; k < buttonsInit.length; k++) {
			var b: ActionEntry = buttonsInit[k];
			addOption(k, b.label, b.x, b.y, b.tooltip, b.pic + '.png', b.specialID );}

        var seltick: number = 0;
        var selected: ent = new ent(w, -150, -150, 'cartoongame/imgs/hudselect.png', { alpha: .3, upd: e => { e.x = e.x * .8 + .2 * selx; e.y = e.y * .8 + .2 * sely; seltick++; e.visible = (seltick % 120 > 10) ? true : false; }});

		var sysTick: number = 0;
		var lastMouseUpTime: number = -1000;
		var mouseDown: boolean = false;

		function addSelector(): void {
			let goalx: number = 0, goaly: number = 0, mul: number = 1, tick: number = Math.random() * Math.PI * 2, tickScale: number = Math.random() * .8 + .4;
			new ent(w, 50, 50, 'cartoongame/imgs/blueorb.png', { scalex : .3, scaley : .3,
                upd: e => {
  					e.x = goalx;
					e.y = goaly;
					e.alpha = mul * (.3 + .1 * Math.cos(tick * tickScale));

					tick += .05;
					mul = mul * .8 + .2 * (updateActive ? 1 : 0);
					if (updateActive) {
						sysTick++;
						if (apg.g.input.activePointer.isDown == false) {
							if (mouseDown == true) { lastMouseUpTime = sysTick;}
							mouseDown = false;}
						else { mouseDown = true; } }
					else {
						lastMouseUpTime = -1000;
						mouseDown = false; }
					if (e.alpha < .01) { if (e.visible) e.visible = false; }
					if (!e.visible ) e.visible = true;

                    highlightTime--;
                    if( highlightTime < 0 )e.visible = false;

					if (mul < .05) return;
					goalx = goalx * .6 + .4 * ((fx1+fx2)/2 - 16);
					goaly = goaly * .6 + .4 * ((fy1 + fy2) / 2 - 12);}});}
		addSelector();}}