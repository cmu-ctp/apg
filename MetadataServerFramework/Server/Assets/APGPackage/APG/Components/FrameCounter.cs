using UnityEngine;

public class FrameCounter : MonoBehaviour {

    public TwitchNetworking source;
    public int id;

    CanvasRenderer spr;

    void Start()
    {
        spr = GetComponent<CanvasRenderer>();
    }

    void Update () {
		if( (source.GetTime() & (1 << id)) != 0)
        {
            spr.SetColor(new Color(1, 1, 1, 1));
        }
        else
        {
            spr.SetColor(new Color(0, 0, 0, 1));
        }
	}
}
