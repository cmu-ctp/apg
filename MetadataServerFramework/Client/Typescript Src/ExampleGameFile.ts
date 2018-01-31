/* Metadata Server Example
 * 
 */

// Pre-cache all of the assets we're going to use in this app.  We have to do this to make sure these assets
// around downloaded to clients before the app launches.

function CacheGameAssets(c: Cacher): void {
    c.images('assets', ['hudselect.png']);
}

// These two interfaces are the parameters for network messages.  They'll be serialized into JSON and then trasmitted across the metadata server.
// These need to stay in sync (by both type and name) with the C# code.

interface ServerFirework{
    x: number;
    y: number;
}

interface ServerFireworks{
	items: ServerFirework[];
}

class ServerFireworksInst {
	items: ServerFirework[];
}

class BasicGame {

    // Phaser assets we'll be using
    highlighter: Phaser.Sprite = null;

    // This is our main entry point
    constructor(apg: APGSys) {

		var metadataInfo: ServerFireworks = null;

        // Register server messages
		apg.ResetServerMessageRegistry();
		apg.Register<ServerFireworks>("firework", p => {
			metadataInfo = p;
		});

		var lastClickDelay: number = 0;
		var ID: number = 0;

        // Make the highlighter.
        this.highlighter = new Phaser.Sprite(apg.g, 0, 0, 'assets/hudselect.png');
        this.highlighter.blendMode = PIXI.blendModes.ADD;
        this.highlighter.anchor = new Phaser.Point(.5, .5);
        this.highlighter.scale = new Phaser.Point(1, 1);
		this.highlighter.update = () => {

			if (metadataInfo != null) {
				this.highlighter.x = metadataInfo.items[ID].x * 1024 / 10000;
				this.highlighter.y = (1 - metadataInfo.items[ID].y / 10000) * (768 - 96 - 96);
			}

			lastClickDelay--;
			if (apg.g.input.activePointer.isDown && lastClickDelay <= 0) {
				ID = (ID + 1) % 8;
				lastClickDelay = 20;
			}
        }
        apg.g.world.addChild(this.highlighter);
	}
}

function InitializeGame(apg: APGSys): void {
	new BasicGame( apg );
}