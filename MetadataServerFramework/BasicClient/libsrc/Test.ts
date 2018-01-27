function CacheTestGame(c: Cacher): void {

	c.images('assets', ['ClientUI3.png']);
}

class TestGame {
	constructor(apg: APGSys) {
		var bkg: ent = new ent(apg.g.world, 0, 0, 'assets/ClientUI3.png' );
	}
}

function TestInput(apg: APGSys): void {
	new TestGame( apg );
}