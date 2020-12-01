using System;
using UnityEngine;

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

		Texture2D MobileJoinQRCode();

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
		 * Communicate a message to the clients without using JSON encoding.  The message should a combination of a string message name, and a string that contains the message's
		 * parameters.  This function will be more error prone, but it might be preferrable for performance or flexibility reasons.
		 * The message will need a corresponding message handler on the clients, and the parameter object will need to be mirrored and kept in sync in the Typescript code of
		 * the HTML5 game.
		 * You should really prefer to use WriteToClients unless you have a compelling reason to use this.
		 *
		 * @param msg The message name for this message being sent to the clients.
		 * @param parms The parameters connected to this message.  This field will be converted into a JSON-encoded string.
		 */
		void WriteStringToClients(string msg, string parms);

		/**
		 * Send a message to the chat channel.
		 *
		 * @param msg The message to send to chat.
		 */
		void WriteToChat( string msg );

        /**
		 * Communicate a message to the clients.  The message should a combination of a string message name, and an object that contains the message's
		 * parameters.  The message will be converted into a JSON representation and will then be decoded in the clients Typescript / HTML5 game.
		 * The message will need a corresponding message handler on the clients, and the parameter object will need to be mirrored and kept in sync in the Typescript code of
		 * the HTML5 game.
         * NOTE:  This function will route the message through the external metadata server.  This is intended for larger, more frequent messages that are fairly
         * time sensitive.  The metadata server broadcasts a large number of messages down to the HTML5 client, 
         * where they are buffered and then synced up with Twitches high latency video.  This is primarily
         * intended for per-frame information used for compositing client side graphics and HUD information over the video stream.
		 *
		 * @param msg The message name for this message being sent to the clients.
		 * @param parms The parameters connected to this message.  This field will be converted into a JSON-encoded string.
		 */
       // void WriteMetadata<T>(string msg, T parms);

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

		/**
		 * Register an input message handler for network messages sent by the clients.  Make sure that the message name and object
		 * containing the message's parameters are mirrored in the clients HTML5 game, in the Typescript code.
		 *
		 * @param msgName The message name for this message.
		 * @param funcForClientMessage A network message handler that is executed when a client sends a message of type "msgName". The action has as parameters the string name of the client sending the message, and the parameters of the message.
		 */
		APGSys RegisterString(string msgName, Action<string, string> funcForClientMessage);

		/* _____________________________________Testing______________________________________ */

		/**
		* Simulate recieving a message from web clients.  Only use this for testing and debugging.
		*
		* @param user The user name to be used for this local message.
		* @param msg The message name for this local message.
		* @param parms The parameters connected to this message.  This field will be converted into a JSON-encoded string.
		 */
		void WriteLocal<T>( string user, string msg, T parms );

		/**
		* Simulate recieving a message from web clients.  Only use this for testing and debugging.
		*
		* @param user The user name to be used for this local message.
		* @param msg The message name for this local message.
		* @param parms The parameters connected to this message.  This field will be converted into a JSON-encoded string.
		 */
		void WriteLocalString(string user, string msg, string parms);


		// These will be tested and commented later.
		/*void StartRecordingNetworking();
		void EndRecordingNetworkingAndSave( string messagesToClientsFileName, string messagesFromClientsFileName );
		void PlaybackNetworking( string messagesFromClientsFileName );*/
	}

	public static class Helper {
		public static Vector2 ScreenPosition(Camera camera, Vector3 position) {
			var screenPos = camera.WorldToScreenPoint(position);
			return new Vector2((int)(10000 * screenPos.x / camera.pixelWidth), (int)(10000 * screenPos.y / camera.pixelHeight));
		}

		public static Vector2 ScreenPosition(Camera camera, MonoBehaviour gameObject) {
			return ScreenPosition(camera, gameObject.transform.position);
		}

		private static Vector2[] boundsHelper = new Vector2[8];
		private static Vector2 min = Vector2.zero;
		private static Vector2 max = Vector2.zero;

		public static Rect ScreenRect(Camera camera, Renderer renderer) {
			return ScreenRect(camera, renderer.bounds);
		}

		public static Rect ScreenRect(Camera camera, Collider collider) {
			return ScreenRect(camera, collider.bounds);
		}

		public static Rect ScreenRect(Camera camera, Bounds bounds) {
			boundsHelper[0] = APG.Helper.ScreenPosition(camera, new Vector3(bounds.min.x, bounds.max.y, bounds.min.z));  //ftl
			boundsHelper[1] = APG.Helper.ScreenPosition(camera, new Vector3(bounds.max.x, bounds.max.y, bounds.min.z));  //ftr
			boundsHelper[2] = APG.Helper.ScreenPosition(camera, new Vector3(bounds.max.x, bounds.min.y, bounds.min.z));  //fbr
			boundsHelper[3] = APG.Helper.ScreenPosition(camera, new Vector3(bounds.min.x, bounds.min.y, bounds.min.z));  //fbl
			boundsHelper[4] = APG.Helper.ScreenPosition(camera, new Vector3(bounds.min.x, bounds.max.y, bounds.max.z));  //btl
			boundsHelper[5] = APG.Helper.ScreenPosition(camera, new Vector3(bounds.max.x, bounds.max.y, bounds.max.z));  //btr
			boundsHelper[6] = APG.Helper.ScreenPosition(camera, new Vector3(bounds.max.x, bounds.min.y, bounds.max.z));  //bbr
			boundsHelper[7] = APG.Helper.ScreenPosition(camera, new Vector3(bounds.min.x, bounds.min.y, bounds.max.z));   //bbl

			/* Get Max and Min bounding box positions */

			min = boundsHelper[0];
			max = boundsHelper[0];

			foreach (Vector2 vec in boundsHelper) {
				min = Vector2.Min(min, vec);
				max = Vector2.Max(max, vec);
			}

			return new Rect(min.x, min.y, max.x - min.x, max.y - min.y);
		}
	}
}