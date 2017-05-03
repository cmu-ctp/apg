function CacheGameAssets(c: Cacher): void {
	c.images('assets', ['bkg.png']);
	c.googleWebFonts(['Anton']);
}

interface JoinAwk
{
	msg: string;
	user: string;
}

class BasicGame {
	registerServerMessages(apg: APGSys): void {
		var that = this;

		function JoinAcknowledge(joinInfo: JoinAwk): void {
		}

		apg.ResetServerMessageRegistry();
		// also handle join acknowledge
		apg.Register<JoinAwk>("joinawk", JoinAcknowledge);
	}

	constructor(apg: APGSys) {
		this.registerServerMessages( apg );

		var background: Phaser.Sprite = new Phaser.Sprite(apg.g, 0, 0, 'assets/bkg.png');
		apg.g.world.addChild(background);
	}
}

function InitializeGame(apg: APGSys): void {
	new BasicGame( apg );
}