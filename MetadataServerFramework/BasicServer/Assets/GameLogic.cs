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

using System;
using UnityEngine;

public class GameLogic : MonoBehaviour {

	// These two structs are the parameters for the network messages.  They'll be serialized into JSON and then trasmitted across Twitch's IRC.
	// Note that these fields need the [Serializable] attribute.
	// These need to stay in sync (by both type and name) with the Typescript code.

	[Serializable]
	struct ServerFirework {
        public int ID;
		public float x;
		public float y;
	}

    public Firework[] fireworks;

    // This is the monobehavior the takes care of all IRC networking.

    public TwitchNetworking networking;

	//

    APG.MetadataSys metadata;

	void Start () {
		Application.runInBackground = true;

		// We call the following function to get the audience networking interface from our networking component.

        metadata = networking.GetAudienceSys().GetMetadataSys();
    }

    public int GetCurrentFrame() { return metadata.currentFrame; }

	void FixedUpdate () {

        foreach( var f in fireworks)
        {
            var data = new ServerFirework {
                ID = f.ID,
                x = f.transform.position.x,
                y = f.transform.position.y
            };

            metadata.Write<ServerFirework>( "firework", data );
        }
        metadata.AdvanceFrame();
	}
}