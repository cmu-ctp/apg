function ButtonCache(c: Cacher): void {
	c.images('cartoongame/imgs', ['blueorb.png', 'buttontest.png', 'activate.png', 'assist.png', 'bag1.png', 'bag2.png', 'bag3.png', 'build.png', 'defend.png', 'harvest.png', 'heal.png', 'leftarrow.png', 'moveback.png', 'movein.png', 'rightarrow.png', 'accept.png','redo.png']);
	c.sounds('cartoongame/snds/fx', ['strokeup2.mp3']);
}

class ActionEntry {
	label: string;
	pic: string;
	tooltip: string;
	constructor(label: string, tooltip: string, pic:string ) {
		this.label = label;
		this.tooltip = tooltip;
		this.pic = pic;
	}
}

class ButtonCollection {

	selected: number;
	selectedName: string;
	update: (active: boolean) => void;

	constructor(apg:APGSys, baseX: number, baseY: number, xAdd: number, yAdd: number, size: number, highlightColor: string, baseColor: string, setToolTip: (str: string) => void, setOption: (val: number) => void, buttonsInit: ActionEntry[]) {
		let fx1 = 0, fx2 = 0, fy1 = 0, fy2 = 0, updateActive:boolean = false, startX:number = baseX, startY:number = baseY;

		var w = apg.g.world;

		var big: ButtonCollection = this;
		this.selected = -1;
		this.update = active => {
			updateActive = active;
		};

		let clickSound: Phaser.Sound = apg.g.add.audio('cartoongame/snds/fx/strokeup2.mp3', 1, false);
		var fontName: string = "Caveat Brush";

		function addOption(id: number, str: string, x: number, y: number, toolTip: string, pic:string ): void {
			let highlighted: boolean = false, highlightVertical: number = /*size * 3 / 4*/56, highlightHorizontal: number = size * 16 / 40, x1: number = x, x2: number = x + /*str.length * highlightHorizontal*/56, y1: number = y - highlightVertical/2+8, y2: number = y + highlightVertical/2+8/*+10*/,
				mul: number = 1, spd: number = .07 + .26 * Math.random(), lastHighlight: boolean = false, inputUsed:boolean = false;

			if (id == 0) {
				fx1 = x1;
				fx2 = x2;
				fy1 = y1;
				fy2 = y2;
			}

			var textColor = { font: '18px ' + fontName, fill: '#222' };
			var bkg: ent = new ent(w, x, y - 20, 'cartoongame/imgs/'+pic, {});
			if (str === '') bkg.visible = false;
			new enttx(w, 60, 50 + 20, "", textColor, {
				upd: e => {
					mul = mul * (1 - spd) + spd * (updateActive ? 1 : 0);

					e.x = x +10 + 10 * 1.5 * (1 - mul);
					e.y = y +35 - 14 * 1.5 + 20 * 1.5 * (1 - mul);
					e.alpha = mul;
					e.scx = e.scy = size * mul * .05;
					bkg.scalex = bkg.scaley = mul;

					if (e.alpha < .01) {
						if (e.visible == true) e.visible = false;
						return;
					}
					if (e.visible == false) e.visible = true;

					if (highlighted) {
						if (!lastHighlight) e.addColor(highlightColor, 0);
					}
					else {
						if (lastHighlight) e.addColor(baseColor, 0);
					}
					lastHighlight = highlighted;

					if (apg.g.input.activePointer.isDown == false) inputUsed = false;

					if (!updateActive) {return;}
					highlighted = true;
					if (apg.g.input.x < x1 || apg.g.input.x > x2 || apg.g.input.y < y1 || apg.g.input.y > y2 || str == "" ) highlighted = false;
					if (highlighted) {
						setToolTip(toolTip);
						fx1 = x1;
						fx2 = x2;
						fy1 = y1;
						fy2 = y2;
					}
					if (highlighted && (sysTick - lastMouseUpTime < 5 ) && !apg.g.input.activePointer.isDown && inputUsed == false) {
						lastMouseUpTime = -1000;
						clickSound.play();
						big.selected = id;
						big.selectedName = str;
						inputUsed = true;
						setOption(id);
						fx1 = x1;
						fx2 = x2;
						fy1 = y1;
						fy2 = y2;
					}
				}
			});
		}
		for (var k: number = 0; k < buttonsInit.length; k++) {
			var b: ActionEntry = buttonsInit[k];
			addOption(k, b.label, baseX, baseY, b.tooltip, b.pic + '.png' );
			baseX += xAdd;
			baseY += yAdd;
			if (k == 1 || k == 6 || k == 11) baseY += 10;
			if (k == 4 || k == 9) {
				baseY = startY;
				baseX += 60;
			}
		}

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
							if (mouseDown == true) {
								lastMouseUpTime = sysTick;
							}
							mouseDown = false;
						}
						else {
							mouseDown = true;
						}
					}
					else {
						lastMouseUpTime = -1000;
						mouseDown = false;
					}
					if (e.alpha < .01) {
						if (e.visible == true) e.visible = false;
					}
					if (e.visible == false) e.visible = true;

					if (mul < .05) return;
					goalx = goalx * .6 + .4 * ((fx1+fx2)/2 - 16);
					goaly = goaly * .6 + .4 * ((fy1 + fy2) / 2 - 12);
				}
			});
		}
		addSelector();
	}
}