/* Basic Server and Client Example
 * 
 *		This is a simple demonstration of the library in action.  It is intended to show simple usage of 
 *		caching images and sounds on the HTML5 client, sending network messages from the server
 *		to clients, handling server messages on clients, sending messages from clients to the server,
 *		and handling client messages on the server, and simple Unity and Phaser usage.
 *		
 *		The high-level functionality will look as follows: there is a night sky displayed on the
 *		streamer's screen, and on all HTML5 clients as well.
 *		
 *		When the streamer clicks their mouse anywhere on their screen, a firework will explode
 *		in that location on all clients screens.  And if any client taps or clicks their screen, a firework
 *		will explode on the streamer's screen in that location.
 */

// Pre-cache all of the assets we're going to use in this app.  We have to do this to make sure these assets
// around downloaded to clients before the app launches.

function CacheGameAssets(c: Cacher): void {
    c.images('assets', ['night.jpg', 'firework.png']);
    c.sounds('assets', ['boom.mp3']);
	c.googleWebFonts(['Anton']);
}

// These two interfaces are the parameters for network messages.  They'll be serialized into JSON and then trasmitted across Twitch's IRC.
// These need to stay in sync (by both type and name) with the C# code.

interface ServerFirework{
    x: number;
    y: number;
}

interface clientFirework {
    x: number;
    y: number;
}

class BasicGame {

    // Phaser assets we'll be using

    fireworkPic: Phaser.Sprite = null;
    boomSound: Phaser.Sound = null;

    // This is a debugging aid, for testing the client without being attached to a server.  This sequence of server messages will
    // be run if apg.networkTestSequence is set to true.

    runTestSequence(apg: APGSys): void{

            // Clear local debug test messages.

        apg.ClearLocalMessages();

        // And then registered a bunch of server firework messages.

        for (var k: number = 2; k < 60; k+=3) {
            apg.WriteLocalAsServer<ServerFirework>(k, "serverFirework", { x: Math.floor(50 + Math.random() * 750), y: Math.floor(50 + Math.random() * 350) });
        }
    }

    // In this function we'll register all possible server network messages.

	registerServerMessages(apg: APGSys): void {
		var that = this;

        // This function takes the firework locaton from the server and repositions our firework asset there, then plays a sound.
        function ServerFirework(data: ServerFirework): void {
            console.log("Got  Server Firework Message at point " + data.x + " " + data.y );
            that.fireworkPic.x = data.x;
            that.fireworkPic.y = data.y;
            that.fireworkPic.scale = new Phaser.Point(1, 1);
            that.boomSound.play();
		}

        // Clear registered server messages

		apg.ResetServerMessageRegistry();

        // Register the server firework message

        apg.Register<ServerFirework>("serverFirework", ServerFirework);
	}

    // This is our main entry point

    constructor(apg: APGSys) {

        // Register server messages

		this.registerServerMessages( apg );

        // Register our debug server messages if needed

        if (apg.networkTestSequence) {
            this.runTestSequence(apg);
        }

        // Register sound asset

        this.boomSound = apg.g.add.audio('assets/boom.mp3', 1, false);

        // Make the sky background
        // Additionally, add an update function that will check whether we've clicked the mouse / tapped the screen
        // If we have, and it's been long enough since our last tap, send a message to the server about
        // where we tapped.

        var lastClickDelay: number = 0;
        var background: Phaser.Sprite = new Phaser.Sprite(apg.g, 0, 0, 'assets/night.jpg');
        background.update = () => {
            lastClickDelay--;
            if( apg.g.input.activePointer.isDown && lastClickDelay <= 0 ){
                lastClickDelay = 120;

                var data: clientFirework = { x: apg.g.input.activePointer.x, y: apg.g.input.activePointer.y };
                apg.WriteToServer<clientFirework>("clientFirework", data);
                console.log("Writing client firework message at point " + data.x + " " + data.y);
            }
        };
        apg.g.world.addChild(background);

        // Make the firework.

        this.fireworkPic = new Phaser.Sprite(apg.g, 0, 0, 'assets/firework.png');
        this.fireworkPic.blendMode = PIXI.blendModes.ADD;
        this.fireworkPic.anchor = new Phaser.Point(.5, .5);
        this.fireworkPic.scale = new Phaser.Point(1, 1);
        this.fireworkPic.update = () => {
            this.fireworkPic.scale.x *= .7;
            this.fireworkPic.scale.y *= .7;
        }
        apg.g.world.addChild(this.fireworkPic);
	}
}

function InitializeGame(apg: APGSys): void {
	new BasicGame( apg );
}