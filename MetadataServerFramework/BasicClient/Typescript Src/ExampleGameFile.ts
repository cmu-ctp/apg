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
 *
 * A Note on the Structure of the Client
 *  
 *      There are two main directories for this project, Typescript Src and Website.  The first of these files
 *      contains this Typescript source, which will be transpiled into a javascript file.  The Website directory
 *      contains, of course, the actual website that will be uploaded as the game client that audience members
 *      will download to connect to the streamer's game.  This is where all game assets should go.
 */

// Pre-cache all of the assets we're going to use in this app.  We have to do this to make sure these assets
// around downloaded to clients before the app launches.

function CacheGameAssets(c: Cacher): void {
    c.images('assets', ['hudselect.png']);
}

// These two interfaces are the parameters for network messages.  They'll be serialized into JSON and then trasmitted across Twitch's IRC.
// These need to stay in sync (by both type and name) with the C# code.

interface ServerFirework{
	ID: number;
    x: number;
    y: number;
}

class BasicGame {

    // Phaser assets we'll be using

    highlighter: Phaser.Sprite = null;

    // This is a debugging aid, for testing the client without being attached to a server.  This sequence of server messages will
    // be run if apg.networkTestSequence is set to true.

    runTestSequence(apg: APGSys): void{

            // Clear local debug test messages.

        apg.ClearLocalMessages();

        // And then registered a bunch of server firework messages.

        for (var k: number = 2; k < 60; k+=3) {
            apg.WriteLocalAsServer<ServerFirework>(k, "serverFirework", { ID:0, x: Math.floor(50 + Math.random() * 750), y: Math.floor(50 + Math.random() * 350) });
        }
    }

    // In this function we'll register all possible server network messages.

	registerServerMessages(apg: APGSys): void {
		var that = this;

        // This function takes the firework locaton from the server and repositions our firework asset there, then plays a sound.
        function ServerFirework(data: ServerFirework): void {
            console.log("Got  Server Firework Message at point " + data.x + " " + data.y );
            /*that.highlighter.x = data.x;
            that.highlighter.y = data.y;
            that.highlighter.scale = new Phaser.Point(1, 1);*/
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

		var lastClickDelay: number = 0;
		var ID: number = 0;

        // Make the firework.

		var currentFrame = 0;

        this.highlighter = new Phaser.Sprite(apg.g, 0, 0, 'assets/hudselect.png');
        this.highlighter.blendMode = PIXI.blendModes.ADD;
        this.highlighter.anchor = new Phaser.Point(.5, .5);
        this.highlighter.scale = new Phaser.Point(1, 1);
		this.highlighter.update = () => {
			currentFrame++;

			this.highlighter.x = (400 + 300 * Math.cos(currentFrame * .02 - ID * .2)) / 800 * 1024;
			this.highlighter.y = (225 - 175 * Math.sin(currentFrame * .02 - ID * .2)) / 450 * 768;

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