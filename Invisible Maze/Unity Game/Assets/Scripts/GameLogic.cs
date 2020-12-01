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

    public GameObject fireFlyPrefab;

	void Start () {

    }
    
    private int fireFlyCounter = 0;

    void Update() {
        if (Input.GetKeyDown(KeyCode.S)) {
            GameObject fly = GameObject.Instantiate(fireFlyPrefab);
            fly.name = "new" + fireFlyCounter;
            fireFlyCounter++;
        }
    }
}