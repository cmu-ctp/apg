class ActionEntry {
	label: string;
	tooltip: string;
	constructor(label: string, tooltip: string) {
		this.label = label;
		this.tooltip = tooltip;
	}
}

cacheImages('assets/imgs', ['blueorb.png']);
cacheSounds('assets/snds/fx', ['strokeup2.mp3']);

class ButtonCollection {

	selected: number;
	update: (active: boolean) => void;

	constructor(sys:APGSys, baseX: number, baseY: number, xAdd: number, yAdd: number, size: number, highlightColor: string, baseColor: string, setToolTip: (str: string) => void, setOption: (val: number) => void, buttonsInit: ActionEntry[]) {
		let fx1 = 0, fx2 = 0, fy1 = 0, fy2 = 0, updateActive:boolean = false;

		var big: ButtonCollection = this;
		this.selected = 0;
		this.update = active => {
			updateActive = active;
		};

		let clickSound: Phaser.Sound = sys.g.add.audio('assets/snds/fx/strokeup2.mp3', 1, false);
		var fontName: string = "Caveat Brush";

		function addOption(id: number, str: string, x: number, y: number, toolTip: string): void {
			let highlighted: boolean = false, highlightVertical: number = size * 3 / 4, highlightHorizontal: number = size * 16 / 40, x1: number = x, x2: number = x + str.length * highlightHorizontal, y1: number = y - highlightVertical, y2: number = y+10,
				mul: number = 1, spd: number = .07 + .26 * Math.random(), lastHighlight: boolean = false, inputUsed:boolean = false;

			if (id == 0) {
				fx1 = x1;
				fx2 = x2;
				fy1 = y1;
				fy2 = y2;
			}

			var textColor = { font: '18px ' + fontName, fill: '#222' };
			new enttx(sys.w, 60, 50 + 20, str, textColor, {
				upd: e => {
					mul = mul * (1 - spd) + spd * (updateActive ? 1 : 0);

					e.x = x + 10 * 1.5 * (1 - mul);
					e.y = y - 14 * 1.5 + 20 * 1.5 * (1 - mul);
					e.alpha = mul;
					e.scx = e.scy = size * mul * .05;

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

					if (sys.g.input.activePointer.isDown == false) inputUsed = false;

					if (!updateActive) {return;}
					highlighted = true;
					if (sys.g.input.x < x1 || sys.g.input.x > x2 || sys.g.input.y < y1 || sys.g.input.y > y2) highlighted = false;
					if (highlighted) { setToolTip(toolTip); }
					if (highlighted && sys.g.input.activePointer.isDown && inputUsed == false) {
						clickSound.play();
						big.selected = id;
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
			addOption(k, b.label, baseX, baseY, b.tooltip);
			baseX += xAdd;
			baseY += yAdd;
		}

		function addSelector(): void {
			let goalx: number = 0, goaly: number = 0, mul: number = 1, tick: number = Math.random() * Math.PI * 2, tickScale: number = Math.random() * .8 + .4;
			new ent(sys.w, 50, 50, 'assets/imgs/blueorb.png', { scalex : .24, scaley : .24,
				upd: e => {
					e.x = goalx;
					e.y = goaly;
					e.alpha = mul * (.5 + .2 * Math.cos(tick * tickScale));

					tick += .05;
					mul = mul * .8 + .2 * (updateActive ? 1 : 0);
					if (e.alpha < .01) {
						if (e.visible == true) e.visible = false;
					}
					if (e.visible == false) e.visible = true;

					if (mul < .05) return;
					goalx = goalx * .9 + .1 * ((fx1) - 16);
					goaly = goaly * .9 + .1 * ((fy1 + fy2) / 2 - 12);
				}
			});
		}
		addSelector();
	}
}