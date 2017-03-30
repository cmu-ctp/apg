class ent extends Phaser.Sprite {
	upd: (m: ent) => void = null;
	update() { if (this.upd != null) this.upd(this); }

	set scalex(value: number) { this.scale.x = value; }
	set scaley(value: number) { this.scale.y = value; }
	set anchorx(value: number) { this.anchor.x = value; }
	set anchory(value: number) { this.anchor.y = value; }

	ix(value: number, speed: number): ent { this.x = this.x * (1 - speed) + speed * value; return this; }
	iy(value: number, speed: number): ent { this.y = this.y * (1 - speed) + speed * value; return this; }
	ixy(x: number, y: number, speed: number): ent { this.x = this.x * (1 - speed) + speed * x; this.y = this.y * (1 - speed) + speed * y; return this; }
	iscaley(value: number, speed: number): ent { this.scale.y = this.scale.y * (1 - speed) + speed * value; return this; }
	ialpha(value: number, speed: number): ent { this.alpha = this.alpha * (1 - speed) + speed * value; return this; }
	irotation(value: number, speed: number): ent { this.rotation = this.rotation * (1 - speed) + speed * value; return this; }

	set tex(value: string) {this.loadTexture(value);}

	constructor(t: Phaser.Group, x: number, y: number, key?: string | Phaser.RenderTexture | Phaser.BitmapData | PIXI.Texture,
		fields?: { rotation?: number, alpha?: number, alive?: boolean, blendMode?: PIXI.blendModes, scalex?: number, scaley?: number, anchorx?: number, anchory?: number, upd?: (m: ent) => void }) {
		super(t.game, x, y, key);
		if (fields) Object.assign(this, fields);
		this.exists = true; this.visible = true; this.alive = true; this.z = t.children.length;
		t.addChild(this);
		if (t.enableBody) { t.game.physics.enable(this, t.physicsBodyType, t.enableBodyDebug); }
		if (t.cursor === null) { t.cursor = this; }
	}
}