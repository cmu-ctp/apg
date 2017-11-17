using UnityEngine;

public class Firework : MonoBehaviour {
    public int ID;
    public GameLogic source;
	void FixedUpdate () {
        transform.localPosition = new Vector3(400+300*Mathf.Cos(source.GetCurrentFrame()*.02f - ID * .2f), 225 + 175*Mathf.Sin(source.GetCurrentFrame() * .02f - ID * .2f), 0);
    }
}
