using UnityEngine;

public class Firework : MonoBehaviour {
    public int ID;
    public GameLogic source;

    float s1, s2,s3,s4;
    float a1, a2, a3, a4;
    public void Start()
    {
        s1 = Random.Range(.01f, .02f);
        s2 = Random.Range(.01f, .02f);
        s3 = Random.Range(.01f, .02f);
        s4 = Random.Range(.01f, .02f);

        a1 = Random.Range(0, Mathf.PI * 2);
        a2 = Random.Range(0, Mathf.PI * 2);
        a3 = Random.Range(0, Mathf.PI * 2);
        a4 = Random.Range(0, Mathf.PI * 2);
    }
    void FixedUpdate () {
        var t = source.GetCurrentFrame();
        transform.localPosition = new Vector3(
            400+200*Mathf.Cos(t*s1+a1) + 150 * Mathf.Cos(t *s2+a2), 
            225 + 150*Mathf.Cos(t * s3+a3) + 125 * Mathf.Cos(t * s4+a4), 
            0);
        var dist = (new Vector3(400, 225, 0) - transform.localPosition).magnitude;
        var mul = 1 - dist / 500f;
        transform.localScale = new Vector3(48*mul, 48 * mul, 1);
    }
}
