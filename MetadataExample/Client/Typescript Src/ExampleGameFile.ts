/* Metadata Server Example
 * 
 */

// Pre-cache all of the assets we're going to use in this app.  We have to do this to make sure these assets
// around downloaded to clients before the app launches.

function CacheGameAssets(c: Cacher): void {
	c.images('assets', ['hudselect.png', 'blueorb.png', 'background.png']);
	c.sounds('assets', ['click.mp3']);
}

// These two interfaces are the parameters for network messages.  They'll be serialized into JSON and then trasmitted across the metadata server.
// These need to stay in sync (by both type and name) with the C# code.

interface ServerFirefly{
    x: number;
	y: number;
	scale: number;
}

interface ServerFireflies{
	items: ServerFirefly[];
}

function InitializeGame(apg: APGSys): void {
	var metadataInfo: ServerFireflies = null;

	// Register server messages
	apg.ResetServerMessageRegistry();
	apg.Register<ServerFireflies>("fireflies", p => {
		metadataInfo = p;
	});

	var lastClickDelay: number = 0;
	var ID: number = 0;

	var clickSound: Phaser.Sound = apg.g.add.audio('assets/click.mp3', .4, false);

	var background = new Phaser.Sprite(apg.g, -640, -320, 'assets/background.png');
	apg.g.world.addChild(background);

	var highlighter = new Phaser.Sprite(apg.g, 0, 0, 'assets/blueorb.png');
	highlighter.blendMode = PIXI.blendModes.ADD;
	highlighter.anchor = new Phaser.Point(.5, .5);
	highlighter.scale = new Phaser.Point(1, 1);
	highlighter.update = () => {
		lastClickDelay--;
		if (metadataInfo != null) {
			var selected = false;
			var curSelected = -1;
			for (var k = 0; k < metadataInfo.items.length; k++) {
				var x = APGHelper.ScreenX( metadataInfo.items[k].x );
				var y = APGHelper.ScreenY( metadataInfo.items[k].y );
				if (Math.abs(apg.g.input.activePointer.x - x) < 48 && Math.abs(apg.g.input.activePointer.y - y) < 48) {
					curSelected = k;
					highlighter.x = x;
					highlighter.y = y;
					highlighter.visible = true;
					selected = true;
				}
			}
			if (!selected) {
				highlighter.visible = false;
				if (apg.g.input.activePointer.isDown && lastClickDelay <= 0) {
					ID = -1;
					lastClickDelay = 20;
				}
			}
			else {
				if (apg.g.input.activePointer.isDown && lastClickDelay <= 0) {
					ID = curSelected;
					clickSound.play();
					lastClickDelay = 20;
				}
			}
		}
	}
	apg.g.world.addChild(highlighter);

	// Make the selector.
	var selector = new Phaser.Sprite(apg.g, 0, 0, 'assets/hudselect.png');
	selector.blendMode = PIXI.blendModes.ADD;
	selector.anchor = new Phaser.Point(.5, .5);
	selector.scale = new Phaser.Point(1, 1);
	selector.update = () => {
		if (ID == -1) {
			selector.visible = false;
		}
		else if (metadataInfo != null && metadataInfo != undefined ) {
			selector.visible = true;
			selector.x = APGHelper.ScreenX( metadataInfo.items[ID].x );
			selector.y = APGHelper.ScreenY( metadataInfo.items[ID].y );
		}
		else {
			selector.visible = false;
		}
	}
	apg.g.world.addChild(selector);

	var label = new Phaser.Text(apg.g, 20, 20, "", { font: '16px Caveat Brush', fill: '#112' });
	label.update = () => {
		if (ID == -1) {
			label.visible = false;
		}
		else if (metadataInfo != null && metadataInfo != undefined) {
			label.visible = true;
			label.text = "ID: " + ID + "\nScale " + Math.floor( metadataInfo.items[ID].scale / 10000 * 48 );
		}
		else {
			label.visible = false;
		}
	}
	apg.g.world.addChild(label);
}