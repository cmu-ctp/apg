/**
 *
 * This file contains the two primary interfaces you'll use to interact with the client app.
 *
 * To setup a new game, in your game's .html file, you'll set two functions as fields in the object appParms.
 * The parameters for these two functions will be the two interfaces found below.
 *
 * The first is an asset caching function named cacheFunction, which will register all the external data files
 * used by your game (images, sounds, json files, google web fonts).  Your client app won't actually run until
 * all external assets have been downloaded.  The asset caching function will have, as a parameter, a
 * an object with a Cacher interface, which provides functions to register different asset types for caching.
 *
 * The second function actually launches your game. It is called gameLaunchFunction.  This function will have,
 * as a paramater, an object with a APGSys interface.  This interface handles sending and recieving network
 * traffic with the server, exposes cached JSON data, and also contains a reference to a live, constructed
 * PhaserJS Game object.
 */

interface Cacher {

    /**
     * Register an arbitrary asset caching function that uses a Phaser.Loader.  Useful for more complicated
     * asset profiles.
     * This function is required because at the time the app's cacheFunction is called, Phaser hasn't yet been
    * initialized.
    *
     * @param cacheFunction
     */
	assets(cacheFunction: (loader: Phaser.Loader) => void): void;

    /**
     * Register an array of images from a shared directory.  After being cached,
     * these images will be referenced in Phaser with their full path names.  This
     * is just a convenience wrapper around Phaser's normal single sprite caching
     * functionality, found in Phaser.Loader.
     *
     * @param dir Subdirectory the images are located in
     * @param imageList Array of image filenames to be precached
     */
	images(dir: string, imageList: string[]): void;

    /**
     * Register an array of sounds from a shared directory.  After being cached,
     * these sounds will be referenced in Phaser with their full path names.  This
     * is just a convenience wrapper around Phaser's normal single sound caching
     * functionality, found in Phaser.Loader.
     *
     * @param dir Subdirectory the sounds are located in
     * @param soundList Array of sound filenames to be precached
     */
	sounds(dir: string, soundList: string[]): void;

    /**
     * Register an array of google webfonts to be cached.  Go to https://fonts.google.com/ to find fonts.
     *
     * @param googleWebFontNames An array of googlewebfont names to be precached
     */
    googleWebFonts(googleWebFontNames: string[]): void;

    /**
     * Register a JSON file to be parsed into a regular Javascript object at app load time.  Useful for
     * game logic constants, custom levels or waves, etc.
     *
     * @param fileNames 
     */
	json(fileNames: string[]): void;
}

/**
 * This is the interface for client games to interact with the client app framework.  It contains functionality for
 * working with Phaser, pre-caching of several asset types, and reading and writing network messages over Twtich's
 * IRC channels.
 */

interface APGSys {

    /**
    * If this is set to true, the client is longer receiving network traffic from the server and needs to return to notify the user and return to a "try to connect" state.
    */
    disconnected: boolean;

     /**
     * The Phase.Game instance used by the app.  Phaser is a very fully featured, very powerful HTML5 library - see https://phaser.io/examples for examples
     * of how to use Phaser.
     */
	g: Phaser.Game;

     /**
	* A phaser group representing your game world.  
     */
	w: Phaser.Group;

     /**
     * If this is set to true, a client game should simulate server network traffic
     */
    networkTestSequence: boolean;

    /**
    * If this is set to true, the client game has the ability to be fullscreen (usually mobile)
    */
    allowFullScreen: boolean;

     /**
     * The player name for the client.  This will be automatically filled in when the player logs in to Twitch.
     */
	readonly playerName: string;

     /**
     * A Dictionary of JSON assets that were optionally precached at app launch with the Cacher.json function.
     */
    readonly JSONAssets: { any };

     /**
     * 
     */
    SetKeepAliveStatus( val:boolean ): APGSys;

    /* _____________________________________Output______________________________________ */

     /**
     * Communicate a message to the server.  The message should a combination of a string message name, and an object that contains the message's
     * parameters.  The message will be converted into a JSON representation and will then be decoded in the streamer's Unity game.
     * The message will need a corresponding message handler on the server, and the parameter object will need to be mirrored and kept in sync in the C# code of
     * the Unity game.
     *
     * @param msgName The message name for this message being sent to the server.
     * @param parmsForMessageToServer The parameters connected to this message.  This field will be converted into a JSON-encoded string.
     */
	WriteToServer<T>(msgName: string, parmsForMessageToServer: T): void;

    /**
    * Communicate a message directly to the server without using JSON.  The message should a combination of a string message name, and a string that contains the message's
    * parameters.  This might be preferrable for performance reasons, but it will be more error-prone.
    * The message will need a corresponding message handler on the server, and the parameter object will need to be mirrored and kept in sync in the C# code of
    * the Unity game.
    * You should really prefer to use WriteToServer unless you have a compelling reason to use this.
    *
    * @param msg The message name for this message being sent to the server.
    */
    WriteStringToServer(msgName: string, parms: string): void;


    /* _____________________________________Input______________________________________ */

     /**
     * Clear all registered server message callbacks.  Useful when changing discrete game modes.
     */
	ResetServerMessageRegistry(): APGSys;

     /**
     * Register an input message handler for network messages sent by the server.  Make sure that the message name and object
     * containing the message's parameters are mirrored in the streamer's Unity game, in the C# code.
     *
     * @param msgName The message name for this message.
     * @param funcForServerMessage A network message handler that is executed when the server sends a message of type "msgName".
     */
	Register<T>(msgName: string, funcForServerMessage: (parmsForHandler: T) => void ): APGSys;

     /**
     * Register an input message handler for network messages sent by other audience players in peer HTML5 client apps.
     *
     * @param msgName The message name for this message.
     * @param funcForServerMessage A network message handler that is executed when peer clients send a message of type "msgName".
     */
    RegisterPeer<T>(msgName: string, funcForServerMessage: (user: string, parmsForHandler: T) => void): APGSys;

     /**
     * Register an input message handler for network messages sent by the server.  Make sure that the message name and string
     * containing the message's parameters are mirrored in the streamer's Unity game, in the C# code.  This won't use JSON to
     * encode the message, so it might be preferrable for performance reasons.
     *
     * @param msgName The message name for this message.
     * @param funcForServerMessage A network message handler that is executed when the server sends a message of type "msgName".
     */
	RegisterString(msgName: string, funcForServerMessage: (parmsForHandler: string) => void ): APGSys;

     /**
     * Register a message handler for situations when the client stops receiving server messages for too long.
     *
     * @param disconnectFunc A message handler that is executed when the client stops receiving server messages for too long.
     */
	RegisterDisconnect(disconnectFunc: () => void ): APGSys;

    /* _____________________________________Metadata______________________________________ */

	Metadata<T>(msgName: string): T;

    /* _____________________________________Testing______________________________________ */

    /**
    * Simulate recieving a message from the server.
    *
    * @param delay The amount of time to delay before sending this message, in seconds.
    * @param msgName The message name for this local message.  Only use this for testing and debugging.
    * @param parmsForMessageToServer The parameters connected to this message.  This field will be converted into a JSON-encoded string.
    */
    WriteLocalAsServer<T>(delay:number, msgName: string, parmsForMessageToServer: T): void;

    /**
    * Simulate recieving a message from another peer web client.  Only use this for testing and debugging.
    *
    * @param delay The amount of time to delay before sending this message, in seconds.
    * @param user The user name to be used for this local message.
    * @param msgName The message name for this local message.
    * @param parmsForMessageToServer The parameters connected to this message.  This field will be converted into a JSON-encoded string.
    */
    WriteLocal<T>(delay: number, user: string, msgName: string, parmsForMessageToServer: T): void;

    /**
    * Simulate recieving a message from the server.
    *
    * @param delay The amount of time to delay before sending this message, in seconds.
    * @param msgName The message name for this local message.  Only use this for testing and debugging.
    * @param parmsForMessageToServer The parameters connected to this message.
    */
    WriteLocalStringAsServer(delay: number, msgName: string, parmsForMessageToServer: string): void;


    /**
    * When changing game modes, make sure that any delayed messages from previous modes are cleared.
    */
    ClearLocalMessages(): void;
}

class APGHelper {
	// Well fixme here, obviously.
	public static ScreenX(val: number): number { return val / 10000 * 1024; }
	public static ScreenY(val: number): number { return (1 - val / 10000) * (768 - 96 - 96); }
}