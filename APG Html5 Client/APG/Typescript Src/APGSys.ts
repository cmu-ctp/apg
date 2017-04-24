interface Cacher {

	assets(cacheFunction: (loader: Phaser.Loader) => void): void;

	images(dir: string, imageList: string[]): void;

	sounds(dir: string, soundList: string[]): void;

	googleWebFonts(googleWebFontNames: string[]): void;

	json(fileNames: string[]): void;
}

interface APGSys {

	g: Phaser.Game;

	playerName: string;

	JSONAssets: { any };

	WriteToServer<T>(msgName: string, parmsForMessageToServer: T): void;

	ResetServerMessageRegistry(): APGSys;

	Register<T>(msgName: string, funcForServerMessage: (parmsForHandler: T) => void ): APGSys;

	RegisterPeer<T>(msgName: string, funcForServerMessage: (user: string, parmsForHandler: T) => void): APGSys;
}
