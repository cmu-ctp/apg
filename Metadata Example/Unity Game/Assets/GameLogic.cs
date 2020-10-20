/* Basic Metadata Example
 * 
 * Here is what this game example does.
 * 
 * There are some number of fireflies.  They will fly around the screen.
 * The game's camera will animate as this happens, to add visual interest and
 * make the scene a bit more complex.
 * The game will then also broadcast the screen space coordinates of the fireflies
 * every frame, to be used by the HTML5 client for compositing logic.
 * 
 */

using System;
using UnityEngine;

public class GameLogic : MonoBehaviour {

    // These two structs are the parameters for the network messages.  
    // They'll be serialized into JSON and then trasmitted across Twitch's IRC.
	// Note that these fields need the [Serializable] attribute.
	// These need to stay in sync (by both type and name) with the Typescript code.
	[Serializable]
	struct ServerFirefly {
		public int x;
		public int y;
        public int scale;
    }
    [Serializable]
    struct ServerFireflies{
        public ServerFirefly[] items;
    }

    // This will be the fireflies we'll be watching in the video - we'll be broadcasting
    // their screen space positions as metadata for the HTML5 client to use.
    public Firefly[] fireflies;

    // This is the camera for the application.  We need this to be able to
    // determine where, in screen space, the fireflies are.
    public Camera mainCamera;

    // This is the APG networking component.  We're not actually using
    // the twitch part of it here - the metadata system is a subcomponent of it.
    public TwitchNetworking networking;

    // This is the structure we will fill in as parameters for our broadcasted
    // metadata message.
    ServerFireflies metadataUpdateParms = new ServerFireflies();

	void Start () {
        // make sure the unity game doesn't pause if we change focus, which we almost
        // certainly will be while testing.
		Application.runInBackground = true;

        // we will be 
        metadataUpdateParms.items = new ServerFirefly[fireflies.Length];
    }

    float time2 = 0;
	void FixedUpdate () {
        // Move the camera around, changing both its position and orientation.
        // The hardcode math here is the generate certain kinds of desired motion -
        // it's not important that you understand how it works.
        time2 += .3f;
        mainCamera.transform.position = new Vector3( 
            400 + 100 * Mathf.Cos( time2 * .013f + 72) + 100 * Mathf.Cos(time2 * .0065f + 172), 
            225 + 80 * Mathf.Cos(time2 * .011f + 372) + 70 * Mathf.Cos(time2 * .0071f + 672), 
            -500 + 10 * Mathf.Cos(time2 * .0073f + 1372) + 8 * Mathf.Cos(time2 * .0087f + 1672)
            );
        mainCamera.transform.rotation = Quaternion.Euler( new Vector3(
            4 * Mathf.Cos(time2 * .013f + 172) + 3 * Mathf.Cos(time2 * .0065f + 1172),
            3 * Mathf.Cos(time2 * .011f + 1372) + 2 * Mathf.Cos(time2 * .0071f + 1672),
            0 ) );

        // The fireflies will be updating their positions and scale in their own update functions.
        // The following section of code will let's the metadata system know that this
        // is the particular metadata we want to send down to the clients.
        for ( var k = 0; k < fireflies.Length; k++ ){
            var screenPos = APG.Helper.ScreenPosition(mainCamera, fireflies[k]);
            metadataUpdateParms.items[k].x = (int)screenPos.x;
            metadataUpdateParms.items[k].y = (int)screenPos.y;
            metadataUpdateParms.items[k].scale = (int)(10000 * fireflies[k].transform.localScale.x / 48f);
        }
        // And once we've filled up our metadata, this is how we tell the metadata system
        // that we want to broadcast that information.
        networking.GetAudienceSys().WriteMetadata<ServerFireflies>("fireflies", metadataUpdateParms);
	}
}