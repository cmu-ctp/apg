using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class FrameCounter : MonoBehaviour {

    public GameLogic source;
    public int id;

    SpriteRenderer spr;

    void Start()
    {
        spr = GetComponent<SpriteRenderer>();
    }

    void Update () {
		if( (source.GetCurrentFrame() & (1 << id)) != 0)
        {
            spr.color = new Color(1, 1, 1, 1);
        }
        else
        {
            spr.color = new Color(0, 0, 0, 1);
        }
	}
}
