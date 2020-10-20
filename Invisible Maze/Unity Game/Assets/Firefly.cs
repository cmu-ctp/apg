using UnityEngine;

public class Firefly : MonoBehaviour {

    // initialize some parameters for the motion of the firefly.
    // don't worry about this - it just drives the animation curves.
    float s1, s2,s3,s4, a1, a2, a3, a4;
    public void Start(){
        s1 = Random.Range(.01f, .02f);
        s2 = Random.Range(.01f, .02f);
        s3 = Random.Range(.01f, .02f);
        s4 = Random.Range(.01f, .02f);

        a1 = Random.Range(0, Mathf.PI * 2);
        a2 = Random.Range(0, Mathf.PI * 2);
        a3 = Random.Range(0, Mathf.PI * 2);
        a4 = Random.Range(0, Mathf.PI * 2);
    }

    int time = 0;
    void FixedUpdate () {
        // Update the position of the firefly.  Don't worry about the math here -
        // it just provides some nice curves for moving the fireflies around
        time++;
        transform.localPosition = new Vector3(
            400+200*Mathf.Cos(time*s1+a1) + 150 * Mathf.Cos(time *s2+a2), 
            225 + 150*Mathf.Cos(time * s3+a3) + 125 * Mathf.Cos(time * s4+a4), 
            0);

        // Update the scale of the firefly.  Don't worry about the specific math here - the gist
        // is that fireflies will be smaller the further they fly from the center of where they
        // are buzzing around.
        var dist = (new Vector3(400, 225, 0) - transform.localPosition).magnitude;
        var mul = 1 - dist / 500f;
        var flicker = (time % 2 == 1) ? 1 : .2f;
        mul *= flicker;
        transform.localScale = new Vector3(48*mul, 48 * mul, 1);
    }
}
