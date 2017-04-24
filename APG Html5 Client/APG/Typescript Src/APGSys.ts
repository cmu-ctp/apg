interface APGSys {

	g: Phaser.Game;

	playerName: string;

	JSONAssets: { any };

	WriteToServer<T>(msgName: string, parmsForMessageToServer: T): void;

	ResetServerMessageRegistry(): APGSys;

	Register<T>(msgName: string, funcForServerMessage: (parmsForHandler: T) => void ): APGSys;

	RegisterPeer<T>(msgName: string, funcForServerMessage: (user: string, parmsForHandler: T) => void): APGSys;
}
