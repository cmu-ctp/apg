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
		public int x;
		public int y;
        public int scale;
    }
    [Serializable]
    struct ServerFireworks
    {
        public ServerFirework[] items;
    }

    public Firework[] fireworks;

    // This is the monobehavior the takes care of all IRC networking.

    public Camera camera;

    public TwitchNetworking networking;
    APG.APGSys apg;

    ServerFireworks metadataUpdate;

	void Start () {
		Application.runInBackground = true;

        apg = networking.GetAudienceSys();

        metadataUpdate = new ServerFireworks();
        metadataUpdate.items = new ServerFirework[fireworks.Length];
    }

    public int GetCurrentFrame() { return time; }

    int time = 0;

	void FixedUpdate () {
        time++;

        camera.transform.position = new Vector3( 
            400 + 100 * Mathf.Cos( time * .013f + 72) + 100 * Mathf.Cos(time * .0065f + 172), 
            225 + 80 * Mathf.Cos(time * .011f + 372) + 70 * Mathf.Cos(time * .0071f + 672), 
            -400 + 30 * Mathf.Cos(time * .0073f + 1372) + 40 * Mathf.Cos(time * .0087f + 1672));

        for( var k = 0; k < fireworks.Length; k++ ){
            var screenPos = camera.WorldToScreenPoint(fireworks[k].transform.position);
            metadataUpdate.items[k].x = (int)(10000 * screenPos.x / camera.pixelWidth);
            metadataUpdate.items[k].y = (int)(10000 * screenPos.y / camera.pixelHeight );
            metadataUpdate.items[k].scale = (int)(10000 * fireworks[k].transform.localScale.x / 48f);
        }
        apg.WriteMetadata<ServerFireworks>("firework", metadataUpdate);
	}
}