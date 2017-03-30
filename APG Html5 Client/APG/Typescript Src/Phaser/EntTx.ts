class enttx extends Phaser.Text {
	upd: (m: enttx) => void = null;
	update() { if (this.upd != null) this.upd(this); }

	set scx(value: number) { this.scale.x = value; }
	set scy(value: number) { this.scale.y = value; }
	set anchorx(value: number) { this.anchor.x = value; }
	set anchory(value: number) { this.anchor.y = value; }

	ix(value: number, speed: number): enttx { this.x = this.x * (1 - speed) + speed * value; return this; }
	iy(value: number, speed: number): enttx { this.y = this.y * (1 - speed) + speed * value; return this; }
	ixy(x: number, y: number, speed: number): enttx { this.x = this.x * (1 - speed) + speed * x; this.y = this.y * (1 - speed) + speed * y; return this; }
	iscx(value: number, speed: number): enttx { this.scale.x = this.scale.x * (1 - speed) + speed * value; return this; }
	iscy(value: number, speed: number): enttx { this.scale.y = this.scale.y * (1 - speed) + speed * value; return this; }
	ial(value: number, speed: number): enttx { this.alpha = this.alpha * (1 - speed) + speed * value; return this; }
	irot(value: number, speed: number): enttx { this.rotation = this.rotation * (1 - speed) + speed * value; return this; }

	constructor(t: Phaser.Group, x: number, y: number, text: string, style?: Phaser.PhaserTextStyle,
		fields?: { rotation?: number, alpha?: number, alive?: boolean, blendMode?: PIXI.blendModes, scalex?: number, scaley?: number, anchorx?: number, anchory?: number, upd?: (m: enttx) => void }) {
		super(t.game, x, y, text, style);
		if (fields) Object.assign(this, fields);
		this.exists = true; this.visible = true; this.alive = true; this.z = t.children.length;
		t.addChild(this);
		if (t.enableBody) { t.game.physics.enable(this, t.physicsBodyType, t.enableBodyDebug); }
		if (t.cursor === null) { t.cursor = this; }
	}
}