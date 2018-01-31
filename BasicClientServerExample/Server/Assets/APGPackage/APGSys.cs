using System;

namespace APG {
	/**
	 * This is the interface for the streamer's game to interact with HTML5 client apps.  It contains functionality for
	 * reading and writing network messages over Twtich's IRC channels.
	*/

	public interface APGSys {

		/**
			* URL for audience members to launch the APG HTML5 client
			*/
		string LaunchAPGClientURL();

		/**
		 * DON'T RELY ON THIS YET - ITS STILL UNDER CONSTRUCTION
		 */
		ChatterInterface Chatters();

		/* _____________________________________Output______________________________________ */

		/**
		 * Communicate a message to the clients.  The message should a combination of a string message name, and an object that contains the message's
		 * parameters.  The message will be converted into a JSON representation and will then be decoded in the clients Typescript / HTML5 game.
		 * The message will need a corresponding message handler on the clients, and the parameter object will need to be mirrored and kept in sync in the Typescript code of
		 * the HTML5 game.
		 *
		 * @param msg The message name for this message being sent to the clients.
		 * @param parms The parameters connected to this message.  This field will be converted into a JSON-encoded string.
		 */
		void WriteToClients<T>( string msg, T parms );
		/**
		 * Send a message to the chat channel.
		 *
		 * @param msg The message to send to chat.
		 */
		void WriteToChat( string msg );

		/* _____________________________________Input______________________________________ */

		/**
		 * Clear all registered client message callbacks.  Useful when changing discrete game modes.
		 */
		APGSys ResetClientMessageRegistry();

		/**
		 * Register an input message handler for network messages sent by the clients.  Make sure that the message name and object
		 * containing the message's parameters are mirrored in the clients HTML5 game, in the Typescript code.
		 *
		 * @param msgName The message name for this message.
		 * @param funcForClientMessage A network message handler that is executed when a client sends a message of type "msgName". The action has as parameters the string name of the client sending the message, and the parameters of the message.
		 */
		APGSys Register<T>(string msgName, Action<string, T> funcForClientMessage);

		/* _____________________________________Testing______________________________________ */

		/**
		* Simulate recieving a message from web clients.  Only use this for testing and debugging.
		*
		* @param user The user name to be used for this local message.
		* @param msg The message name for this local message.
		* @param parms The parameters connected to this message.  This field will be converted into a JSON-encoded string.
		 */
		void WriteLocal<T>( string user, string msg, T parms );

		// These will be tested and commented later.
		/*void StartRecordingNetworking();
		void EndRecordingNetworkingAndSave( string messagesToClientsFileName, string messagesFromClientsFileName );
		void PlaybackNetworking( string messagesFromClientsFileName );*/
	}
}