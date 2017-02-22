class Ent extends Phaser.Sprite {
	upd: (m: Ent) => void = null;
	update() { if (this.upd != null) this.upd(this); }

	set scalex(value: number) { this.scale.x = value; }
	set scaley(value: number) { this.scale.y = value; }
	set anchorx(value: number) { this.anchor.x = value; }
	set anchory(value: number) { this.anchor.y = value; }

	ix(value: number, speed: number): Ent { this.x = this.x * (1 - speed) + speed * value; return this; }
	iy(value: number, speed: number): Ent { this.y = this.y * (1 - speed) + speed * value; return this; }
	ixy(x: number, y: number, speed: number): Ent { this.x = this.x * (1 - speed) + speed * x; this.y = this.y * (1 - speed) + speed * y; return this; }
	iscaley(value: number, speed: number): Ent { this.scale.y = this.scale.y * (1 - speed) + speed * value; return this; }
	ialpha(value: number, speed: number): Ent { this.alpha = this.alpha * (1 - speed) + speed * value; return this; }
	irotation(value: number, speed: number): Ent { this.rotation = this.rotation * (1 - speed) + speed * value; return this; }

	constructor(t: Phaser.Group, x: number, y: number, key?: string | Phaser.RenderTexture | Phaser.BitmapData | PIXI.Texture,
		fields?: { rotation?: number, alpha?: number, alive?: boolean, blendMode?: PIXI.blendModes, scalex?: number, scaley?: number, anchorx?: number, anchory?: number, upd?: (m: Ent) => void }) {
		super(t.game, x, y, key);
		if (fields) Object.assign(this, fields);
		this.exists = true; this.visible = true; this.alive = true; this.z = t.children.length;
		t.addChild(this);
		if (t.enableBody) { t.game.physics.enable(this, t.physicsBodyType, t.enableBodyDebug); }
		if (t.cursor === null) { t.cursor = this; }
	}
}

class EntTx extends Phaser.Text {
	upd: (m: EntTx) => void = null;
	update() { if (this.upd != null) this.upd(this); }

	set scx(value: number) { this.scale.x = value; }
	set scy(value: number) { this.scale.y = value; }
	set anchorx(value: number) { this.anchor.x = value; }
	set anchory(value: number) { this.anchor.y = value; }

	ix(value: number, speed: number): EntTx { this.x = this.x * (1 - speed) + speed * value; return this; }
	iy(value: number, speed: number): EntTx { this.y = this.y * (1 - speed) + speed * value; return this; }
	ixy(x: number, y: number, speed: number): EntTx { this.x = this.x * (1 - speed) + speed * x; this.y = this.y * (1 - speed) + speed * y; return this; }
	iscx(value: number, speed: number): EntTx { this.scale.x = this.scale.x * (1 - speed) + speed * value; return this; }
	iscy(value: number, speed: number): EntTx { this.scale.y = this.scale.y * (1 - speed) + speed * value; return this; }
	ial(value: number, speed: number): EntTx { this.alpha = this.alpha * (1 - speed) + speed * value; return this; }
	irot(value: number, speed: number): EntTx { this.rotation = this.rotation * (1 - speed) + speed * value; return this; }

	constructor(t: Phaser.Group, x: number, y: number, text: string, style?: Phaser.PhaserTextStyle,
		fields?: { rotation?: number, alpha?: number, alive?: boolean, blendMode?: PIXI.blendModes, scalex?: number, scaley?: number, anchorx?: number, anchory?: number, upd?: (m: EntTx) => void }) {
		super(t.game, x, y, text, style);
		if (fields) Object.assign(this, fields);
		this.exists = true; this.visible = true; this.alive = true; this.z = t.children.length;
		t.addChild(this);
		if (t.enableBody) { t.game.physics.enable(this, t.physicsBodyType, t.enableBodyDebug); }
		if (t.cursor === null) { t.cursor = this; }
	}
}

class scroller {
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