using UnityEngine;
using System;
using System.Collections.Generic;
using V3 = UnityEngine.Vector3;

public class Ent {
	public GameSys gameSys;
	public GameObject src;
	public Transform trans;
	public SpriteRenderer spr;
	public int health;
	public Action<Ent, Ent, int> onHurt = (me, source, damage) => { };
	public Ent leader;
	public V3 vel;
	public V3 knockback;
	Action<Ent> _update;
	bool removed = false;
	public Action<Ent, Ent, UseType, int> use;
	public EntLink updLink;
	public EntLink gridLink;

	public Action<Ent> update {
		get { return _update; }
		set {
			if(_update == null) updLink.Link(gameSys.updaters);
			if(value == null) updLink.Unlink();
			_update = value;
		}
	}
	public bool useGrid {
		set { if(value == true) { gridLink.Link(gameSys.GridLink(pos)); } else { gridLink.Unlink(); } }
	}
	public void remove() {
		removed = true;
		update = null;
		gridLink.Unlink();
		gridLink = null;
		updLink = null;
		// fixme - deal with parenting stuff
		UnityEngine.Object.Destroy(src);
	}
	public Ent(GameSys sys, GameObject prefab = null) {
		src = (GameObject)UnityEngine.Object.Instantiate((prefab != null) ? prefab : sys.basePrefab, new V3(0, 0, 0), Quaternion.identity);
		trans = src.transform;
		spr = src.GetComponent<SpriteRenderer>();
		gameSys = sys;
		updLink = new EntLink(this);
		gridLink = new EntLink(this);
		use = (e, user, useType, strength) => { };
	}
	public V3 pos {
		get { return trans.localPosition; }
		set { if(value.z != trans.localPosition.z) { trans.localPosition = value; SortByZ(); } else { trans.localPosition = value; } }
	}
	public float scale { get { return trans.localScale.x; } set { trans.localScale = new V3(value, value, value); } }
	public float ang { get { return trans.eulerAngles.z; } set { trans.eulerAngles = new V3(0, 0, value); } }
	public void MoveBy(V3 moveVector) { if(removed) return; gridLink.Unlink(); trans.Translate(moveVector, Space.World); if(moveVector.z != 0) SortByZ(); gridLink.Link(gameSys.GridLink(pos)); }
	public void MoveBy(float x, float y, float z) { if(removed) return; gridLink.Unlink(); trans.Translate(new V3(x, y, z), Space.World); if(z != 0) SortByZ(); gridLink.Link(gameSys.GridLink(pos)); }
	public Sprite sprite { set { spr.sprite = value; } }
	public GameObject gameObj { get { return src; } set { src = value; } }
	public void SortByZ() { spr.sortingOrder = Math.Min(Math.Max((int)(-trans.position.z * 1024.0f), -32768), 32767); }
	public Color color { set { spr.color = value; } }
	public bool flipped { set { spr.flipX = value; } }
	public Layers layer {
		set {
			string s = "";
			switch(value) {
				case Layers.UI:
					s = "UI";
					break;
				case Layers.Game:
					s = "Default";
					break;
				case Layers.Background:
					s = "Background";
					break;
			}
			spr.sortingLayerName = s;
		}
	}
	public Transform parent {
		set { trans.parent = value; }
	}
	public List<Ent> children { set { foreach(var child in value) { child.trans.parent = trans; child.trans.localPosition = new V3(0, -.2f, -.2f); } } }
}