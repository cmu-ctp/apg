class Scroller {
	b: Phaser.BitmapData; img: Phaser.Image; img2: Phaser.Image; img3: Phaser.Image; img4: Phaser.Image; x: number; y: number; px: number = 0; py: number = 0; windowx: number; windowy: number; clearOnScroll: boolean;
	constructor(g: Phaser.Game, x: number, y: number, windowx: number, windowy: number, clearOnScroll: boolean) {
		this.x = x; this.y = y; this.windowx = windowx; this.windowy = windowy; this.clearOnScroll = clearOnScroll;
		this.b = g.make.bitmapData(x, y);
		this.img = this.b.addToWorld(); this.img.x = this.img.y = 0;
		this.img2 = this.b.addToWorld(); this.img.x = x; this.img.y = 0;
		this.img3 = this.b.addToWorld(); this.img.x = 0; this.img.y = y;
		this.img4 = this.b.addToWorld(); this.img.x = x; this.img.y = y;
		this.b.fill(0, 0, 0, 0);
	}
	draw(s: Phaser.Sprite, x: number, y: number, sc: number): void {
		x += this.px; y += this.py;
		this.b.draw(s, x, y, s.width * sc, s.height * sc);
		// fixme - these should almost never be happen, so optimize for that case
		this.b.draw(s, x - this.x, y, s.width * sc, s.height * sc);
		this.b.draw(s, x, y - this.y, s.width * sc, s.height * sc);
		this.b.draw(s, x - this.x, y - this.y, s.width * sc, s.height * sc);
	}
	scrollBy(x: number, y: number): void {
		if (this.clearOnScroll) {
			var x1: number, y1: number, x2: number, y2: number;
			if (y < 0) {
				x1 = this.px; y1 = this.py + this.windowy + y; x2 = this.px + this.windowx; y2 = this.py + this.windowy;
				if (x1 > this.x) x1 -= this.x; if (y1 > this.y) y1 -= this.y; if (x2 > this.x) x2 -= this.x; if (y2 > this.y) y2 -= this.y;
				if (y1 < y2) this.b.clear(x1, y1, x2 - x1, y2 - y1);
				else {
					this.b.clear(x1, 0, x2 - x1, y2);
					this.b.clear(x1, y1, x2 - x1, this.y - y1);
				}
			}
		}
		this.px += x; if (this.px < 0) this.px += this.x; if (this.px > this.x) this.px -= this.x;
		this.py += y; if (this.py < 0) this.py += this.y; if (this.py > this.y) this.py -= this.y;
		this.doScroll(this.px, this.py);
	}
	doScroll(x: number, y: number): void {
		this.px = x % this.x; if (x < 0) this.px -= this.x;
		this.py = y % this.y; if (y < 0) this.py -= this.y;
		this.img.x = -this.px; this.img.y = -this.py;
		this.img2.x = -this.px + this.x; this.img2.y = -this.py;
		this.img3.x = -this.px; this.img3.y = -this.py + this.y;
		this.img4.x = -this.px + this.x; this.img4.y = -this.py + this.y;
	}
}