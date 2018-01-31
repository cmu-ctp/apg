interface ObjectConstructor { assign(target: any, ...sources: any[]): any; }
if (typeof Object.assign != 'function') {
	(function () {
		Object.assign = function (target) {
			'use strict';
			if (target === undefined || target === null) { throw new TypeError('Cannot convert undefined or null to object'); }
			var output = Object(target);
			for (var index = 1; index < arguments.length; index++) {
				var source = arguments[index];
				if (source !== undefined && source !== null)
					for (var nextKey in source)
						if (source.hasOwnProperty(nextKey))
							output[nextKey] = source[nextKey];
			}
			return output;
		};
	})();
}

class ent extends Phaser.Sprite {
    static entList: ent[];

	upd: (m: ent) => void = null;
	update() { if (this.upd != null) this.upd(this); }

    eliminate() { ent.entList[this.id] = null; this.destroy(true); this.id = -1; }

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

	set src(value: ent) { value.addChild( this ); }

    private id: number;

	constructor(t: Phaser.Group, x: number, y: number, key?: string | Phaser.RenderTexture | Phaser.BitmapData | PIXI.Texture,
		fields?: { src?:ent, rotation?: number, alpha?: number, alive?: boolean, blendMode?: PIXI.blendModes, scalex?: number, scaley?: number, anchorx?: number, anchory?: number, upd?: (m: ent) => void }) {
		super(t.game, x, y, key);
		if (fields) Object.assign(this, fields);
		this.exists = true; this.visible = true; this.alive = true; this.z = t.children.length;
		t.addChild(this);
		if (t.enableBody) { t.game.physics.enable(this, t.physicsBodyType, t.enableBodyDebug); }
        if (t.cursor === null) { t.cursor = this; }
        this.id = ent.entList.length;
        ent.entList.push(this);
	}
}

class enttx extends Phaser.Text {
    static entList: enttx[];

	upd: (m: enttx) => void = null;
    update() { if (this.upd != null) this.upd(this); }

    eliminate() { enttx.entList[this.id] = null; this.destroy(true); this.id = -1; }

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

	set src(value: ent) { value.addChild(this); }

    private id: number;

	constructor(t: Phaser.Group, x: number, y: number, text: string, style?: Phaser.PhaserTextStyle,
		fields?: { src?: ent, rotation?: number, alpha?: number, alive?: boolean, blendMode?: PIXI.blendModes, scalex?: number, scaley?: number, anchorx?: number, anchory?: number, upd?: (m: enttx) => void }) {
		super(t.game, x, y, text, style);
		if (fields) Object.assign(this, fields);
		this.exists = true; this.visible = true; this.alive = true; this.z = t.children.length;
		t.addChild(this);
		if (t.enableBody) { t.game.physics.enable(this, t.physicsBodyType, t.enableBodyDebug); }
        if (t.cursor === null) { t.cursor = this; }
        this.id = enttx.entList.length;
        enttx.entList.push(this);
	}
}