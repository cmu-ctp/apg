/*

To do:

Add money.
Get in tool tip
Gray out / alpha out buttons until they are ready to be selected. Visuals for when they transition to selectable.
Cost curves
Highlight effect?

Connect to server
Talk to server

*/

function CartoonAssetCache(c: Cacher): void {
	c.images('cartoongame/imgs', ['ClientUI11.png']);
	c.images('cartoongame/imgs/plantidle', ['flow2.png', 'flow3.png', 'flow4.png', 'flow6.png', 'flow15.png', 'grass1.png', 'bricks.png', 'rocks.png', 'dirt.png', 'button2.png','button3.png', 'divider.png','fillbar.png', 'numberbubble.png']);
	c.sounds('cartoongame/snds/fx', ['strokeup4.mp3']);

	WaitingToJoinCache(c);
	JoinAcknowledgeCache(c);
	ButtonCache(c);}

interface SelectionParms { choices: number[];}

function MainInputTestSequence(apg: APGSys): void {
    apg.ClearLocalMessages();
    var roundLength: number = 45;
    for (var j = 1; j <= 10; j++ ){
        var roundTimeOffset: number = (j - 1) * roundLength;
		apg.WriteLocalAsServer<SelectionParms>(roundTimeOffset + roundLength, "submit", { choices: [] });}}

enum Resource { FrothyDrink = 0, Burger = 1, Beans = 2, Goo = 3, Acid = 4, Corn = 5, Bribe = 6, Fries = 7, Taco = 8, TBone = 9 }

var fontName: string = "Caveat Brush";

var extraText = "";
var extraText2 = "";

class buttonsSet {
	buttons: ent[] = [];
	group: Phaser.Group;
	tip: string;
	activeButton: ent;
	mouseLatch: boolean = false;

	addTip(b: ent, tip: string): void { b.text = tip; b.use = null; this.buttons.push(b); }
	addButton(b: ent, use: (ent) => void): void { b.use = use; this.buttons.push(b); }
	addTipButton(b: ent, tip: string, use: (ent) => void): void { b.text = tip; b.use = use; this.buttons.push(b); }
	remove(b: ent): void { }

	update( mx:number, my:number, isDown:boolean ): void {
		this.tip = "meh";
		this.activeButton = null;

		for (var k = 0; k < this.buttons.length; k++) {
			var b = this.buttons[k];
			if (b.inBounds(mx, my) == true) {
				this.tip = b.text;
				this.activeButton = b;
			}
		}

		if (isDown) {
			if (this.mouseLatch == false) {
				if (this.activeButton != null && this.activeButton.use != null ) this.activeButton.use(this.activeButton);
			}
			this.mouseLatch = true;
		}
		else this.mouseLatch = false;
	}

	click(): void { }

	clearAll(): void { }
}

class singleResource { level: number = 0; amount: number = 0; }
class resources {
	static numResources = 10;
	money: number = 100;
	res: singleResource[] = [];
	constructor() {
		for (var k = 0; k < resources.numResources; k++) {
			this.res.push(new singleResource());
		}
	}
}

function addButton(apg: APGSys, buttons: Phaser.Group, statGroup: Phaser.Group, pic: string, id: number, buttonsPerRow: number, bs: buttonsSet, res:resources) {
	var artDir = "cartoongame/imgs/plantidle/";

	var filling = 0;
	var upgradeScale = (1 + id);
	var upgradeCost =1;

	var r = res.res[id];

	var fillSpeed = .04 / Math.pow( 2, id );

	var g = new Phaser.Group(apg.g);
	buttons.add(g);
	g.x = Math.floor(id / buttonsPerRow) * 224;
	g.y = (id % buttonsPerRow) * 80;

	var resourceButton = new ent(g, 0, 0, artDir + 'button2.png', {
		upd: e => {
			if (filling == 0) return;
			filling += fillSpeed;
			fillingBar.scalex = .8 * filling;
			if (filling >= 1) {
				fillingBar.scalex = 0;
				filling = 0;
				r.amount += r.level;
				statAmount.text = "" + r.amount;
			}
		}
	});
	bs.addTipButton(resourceButton, "" + id, () => {
		if ( filling > 0 || r.level < 1 ) {
			// signal the problem here
			return;
		}
		filling = .01;
	});
	new ent(g, 0, 0, artDir + pic);
	new ent(g, 8, 52, artDir +'numberbubble.png');
	var levelButton = new enttx(g, 24, 48, "0", { font: '20px ' + fontName, fill: '#fff' });

	new ent(g, 64, 8, artDir + 'fillbar.png', { scalex: .8, scaley: .8 });
	var fillingBar = new ent(g, 64, 8, artDir + 'fillbar.png', { scalex: 0, scaley: .8 });

	var buyPic = new ent(g, 72, 36, artDir +'button3.png');
	bs.addTipButton(buyPic, "" + id + " A", () => {
		if (res.money < upgradeCost * upgradeScale) {
			// signal the lack of cash here
			return;
		}
		res.money -= upgradeCost * upgradeScale;
		upgradeCost += r.level;
		r.level++;
		levelButton.text = "" + r.level;
		cost.text = "" + upgradeCost * upgradeScale;
	});
	new enttx(g, 88, 40, "Buy", { font: '20px ' + fontName, fill: '#fff' });
	var cost = new enttx(g, 128, 40, "" + (upgradeCost * upgradeScale), { font: '20px ' + fontName, fill: '#fff' });

	var stat = new Phaser.Group(apg.g);
	statGroup.add(stat);
	stat.x = 0;
	stat.y = id * 80;

	var statPic = new ent(stat, 0, 0, artDir + pic);
	bs.addTip(statPic, "" + id + " S");
	var statAmount = new enttx(stat, 120, 12, "0", { font: '64px ' + fontName, fill: '#fff' });
}

function makeButtons(apg: APGSys, bs: buttonsSet, res: resources): void {
	var buttons = new Phaser.Group(apg.g);
	bs.group.add(buttons);
	buttons.x = 450;
	buttons.y = 120;
	buttons.scale = new Phaser.Point(.7, .7);

	var stats = new Phaser.Group(apg.g);
	bs.group.add(stats);
	stats.x = 350;
	stats.y = 150;
	stats.scale = new Phaser.Point(.3, .3);

	var pics = ['flow2.png', 'flow3.png', 'flow4.png', 'flow6.png', 'grass1.png', 'bricks.png', 'rocks.png', 'dirt.png'];
	for (var k = 0; k < pics.length; k++) addButton(apg, buttons, stats, pics[k], k, 4, bs, res);
}

function MainPlayerInput(apg: APGSys, id:number, team:number ): void {
    var w = new Phaser.Group(apg.g);
    apg.g.world.add(w);

	var fontName: string = "Caveat Brush";

	// var endOfRoundSound: Phaser.Sound = apg.g.add.audio('cartoongame/snds/fx/strokeup4.mp3', 1, false);

    apg.ResetServerMessageRegistry()
        .SetKeepAliveStatus(true)
        .RegisterDisconnect(() => {
            ent.clearAll();
            enttx.clearAll();
            WaitingToJoin(apg, "Something went wrong - no response from the streamer's game...  Make sure the streamer is online and still playing this game, then connect again!");})
        .Register<SelectionParms>("submit", p => {
            });

    // __________________________________________________________________________

    // Full Background

	var bs: buttonsSet = new buttonsSet();
	bs.group = w;

    new ent(w, 0, 0, 'cartoongame/imgs/ClientUI11.png', {
		upd: e => {
			bs.update(apg.g.input.activePointer.x, apg.g.input.activePointer.y, apg.g.input.activePointer.isDown);
		}
	});

	new enttx(w, 20, 20, "?", { font: '20px ' + fontName, fill: '#fff' }, {
		upd: e => {
			e.tx = "" + bs.tip + " : " + res.money;
		}
	});

	var res = new resources();

	makeButtons(apg, bs, res);

    if (apg.networkTestSequence) MainInputTestSequence(apg);}