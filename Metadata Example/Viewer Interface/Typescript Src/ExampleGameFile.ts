/* Metadata Server Example

This is the metadata example's javascript client.

When the webpage (game.html) is opened, it will create a twitch video plugin and a
transparent HTML5 canvas on top of it, which is controlled by this code.

If the corresponding Unity game is running, set up correctly, and streaming to Twitch,
the webpage this client is embedded in will be recieving video of several fireflies flying
around in various curves while a drifting 3d camera watches them.

This client will, meanwhile, be receiving metadata about the contents of the streaming
video - specifically, it will be receiving screen space positional information about the
various fireflies as well as real time game logic statistics about them.

What this specific file does is perform some client logic and graphics rendering with that
metadata, over the video frame. Namely,

1) if the user's mouse is over one of the fireflies, that firefly will be highlighted

2) if the user clicks on a highlight firefly, the firefly will have a target put over it that will
follow the firefly in realtime.

3) If a firefly is highlighted, some statistics will be displayed about it.

That's it!

SOME NOTES:

Change the field "forceChatIRCChannelName" in game.html to change which twitch video
stream the client watches.

make sure to open game.html in Chrome with the command line parameters
"--user-data-dir="C:/whatever" --disable-web-security"  The HTML5 app reads data out
of the twitch video plugin, which is normally a violation of the browser security model
(it is regarded as a cross site scripting issue.)
 
 */

// Pre-cache all of the assets we're going to use in this app.  We have to do this to make sure these assets
// around downloaded to clients before the app launches.

function CacheGameAssets(c: Cacher): void {
	c.images('assets', ['hudselect.png', 'blueorb.png', 'background.png']);
	c.sounds('assets', ['click.mp3']);
}

// These two interfaces are the parameters for network messages.  They'll be serialized into JSON and then trasmitted across the metadata server.
// The specific fields need to stay in sync (by both type and name) with the C# code.

interface ServerFirefly{
    x: number;
	y: number;
	scale: number;
}
interface ServerFireflies{
	items: ServerFirefly[];
}

function InitializeGame(apg: APGSys): void {

	// _____________________________________ SET SHARED APP VARIABLES _______________________________________

	var phaserGameWorld: Phaser.Group = apg.w;

	// This field will be the metadata sent down from the server for the current frame.  
	var metadataForFrame: ServerFireflies = null;
	// When the user clicks the mouse, we'll pause before they're allowed to click the mouse again.
	var lastClickDelay: number = 0;
	// Index in the ServerFireflies array of the currently selected firefly.  We'll default to showing the first firefly.
	var fireflyID: number = 0;

	// Register the clicking sound
	var clickSound: Phaser.Sound = apg.g.add.audio('assets/click.mp3', .4, false);


	// _____________________________________ REGISTER CALLBACKS _______________________________________

	// Setup callbacks with the metadata subsystem.
	apg.ResetServerMessageRegistry();
	apg.Register<ServerFireflies>("fireflies", updatedMetadataForNewFrame => {
		// We register a simple callback that updates when the video frame has advanced and there is new metadata.
		// We will use this metadata in game object frame updates to change what is displayed in the overlay.
		// In theory, it would be more efficient to do the actual updating in this callback, but it's not a priority.
		metadataForFrame = updatedMetadataForNewFrame;
	});

	// _____________________________________ MAKE GAME OBJECTS _______________________________________

	// This app has four main game objects, three of which use updated metadata to change what
	// graphics are drawn over the video frame.  There is a highlight that draws when a firefly is
	// near the mouse cursor, there is a target that follows a firefly if it has been selected, there
	// is a text label showing updating gameplay specific stats of the currently selected firefly, and
	// there is a background under that text that obscures that visually jarring binary frame data
	// in the video stream.

	// _____ Mouse Highlighter _______

	// This is a highlight for the situation when the mouse cursor is roughly over one of the fireflies.
	// It let's us tell the viewer that they could click on that firefly to target it.
	// We will also do the logic in this game object to see if the mouse is down, and if so, we will
	// target that firefly, if one is highlighted, or untarget otherwise.
	var fireflyMouseHighlight: Phaser.Sprite = new Phaser.Sprite(apg.g, 0, 0, 'assets/blueorb.png');
	fireflyMouseHighlight.blendMode = PIXI.blendModes.ADD;
	fireflyMouseHighlight.anchor = new Phaser.Point(.5, .5);
	fireflyMouseHighlight.scale = new Phaser.Point(1, 1);
	fireflyMouseHighlight.update = () => {
		lastClickDelay--;
		if (metadataForFrame != null) {
			var overAFirefly:boolean = false;
			var fireflyIndex = -1;
			for (var k: number = 0; k < metadataForFrame.items.length; k++) {
				// get the screen coordinates that have been passed down as metadata.
				var x:number = APGHelper.ScreenX( metadataForFrame.items[k].x );
				var y: number = APGHelper.ScreenY(metadataForFrame.items[k].y);

				// Test if our mouse is close to the screen space coordinates of the current firefly.
				// This test is simple and hard-coded for this demo.
				if (Math.abs(apg.g.input.activePointer.x - x) < 48 && Math.abs(apg.g.input.activePointer.y - y) < 48) {

					// We are over a firefly, so record its index.
					fireflyIndex = k;
					overAFirefly = true;

					// Center the highlight on this firefly and make it visible.
					fireflyMouseHighlight.x = x;
					fireflyMouseHighlight.y = y;
					fireflyMouseHighlight.visible = true;
				}
			}
			if (!overAFirefly) {
				// The case where we are not over a firefly.  Make the highlight invisible and turn off targeting
				// if the mouse was clicked.
				fireflyMouseHighlight.visible = false;
				if (apg.g.input.activePointer.isDown && lastClickDelay <= 0) {
					fireflyID = -1;
					lastClickDelay = 20;
				}
			}
			else {
				// The case where we are over a firefly.  If the mouse was clicked,
				// play a sound and change the fireflyID.
				if (apg.g.input.activePointer.isDown && lastClickDelay <= 0) {
					fireflyID = fireflyIndex;
					clickSound.play();
					lastClickDelay = 20;
				}
			}
		}
	}
	phaserGameWorld.addChild(fireflyMouseHighlight);

	// _____ Firefly Targeter _______

	// This is a target graphic that follows the currently selected firefly, if there is one.
	var fireflyTargetGraphic: Phaser.Sprite = new Phaser.Sprite(apg.g, 0, 0, 'assets/hudselect.png');
	fireflyTargetGraphic.blendMode = PIXI.blendModes.ADD;
	fireflyTargetGraphic.anchor = new Phaser.Point(.5, .5);
	fireflyTargetGraphic.scale = new Phaser.Point(1, 1);
	fireflyTargetGraphic.update = () => {

		// if we are currently targeting a firefly, recenter the target graphic over the new screen space position of the
		// selected firefly.
		if ( fireflyID != -1 && metadataForFrame != null && metadataForFrame != undefined ) {
			fireflyTargetGraphic.visible = true;
			fireflyTargetGraphic.x = APGHelper.ScreenX(metadataForFrame.items[fireflyID].x);
			fireflyTargetGraphic.y = APGHelper.ScreenY(metadataForFrame.items[fireflyID].y);
		}
		else fireflyTargetGraphic.visible = false;
	}
	phaserGameWorld.addChild(fireflyTargetGraphic);

	// _____ Background Graphic  _______

	// This is a small bit of art that will cover up the binary data in the video frame.
	// It is also the back ground that stat text will be drawn over.
	var backgroundCoveringBinaryEncoding: Phaser.Sprite = new Phaser.Sprite(apg.g, -640, -320, 'assets/background.png');
	phaserGameWorld.addChild(backgroundCoveringBinaryEncoding);

	// _____ Stats Text _______

	// This is statistic text.  It will display game logic metadata for the currently selected firefly if, in fact, a firefly is currently selected.
	var fireflyStatsText: Phaser.Text = new Phaser.Text(apg.g, 20, 10, "", { font: '16px Caveat Brush', fill: '#112' });
	fireflyStatsText.update = () => {
		if ( fireflyID != -1 && metadataForFrame != null && metadataForFrame != undefined) {
			fireflyStatsText.visible = true;
			fireflyStatsText.text = "ID: " + fireflyID + "\nScale " + Math.floor( metadataForFrame.items[fireflyID].scale / 10000 * 48 );
		}
		else fireflyStatsText.visible = false;
	}
	phaserGameWorld.addChild(fireflyStatsText);

}