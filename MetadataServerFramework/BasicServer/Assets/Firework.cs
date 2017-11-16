using UnityEngine;

public class Firework : MonoBehaviour {
	void FixedUpdate () {
		transform.localScale = transform.localScale * .7f;
	}
}
