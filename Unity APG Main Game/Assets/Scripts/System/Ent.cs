using UnityEngine;
using System;
using System.Collections.Generic;
using V3 = UnityEngine.Vector3;

public class Ent {
	public GameSys gameSys;
	public GameObject src;
	public Ent textLabel = null;
	public Transform trans;
	public SpriteRenderer spr;
	public TextMesh tx = null;
	public int health;
	public Action<Ent, Ent, int> onHurt = (me, source, damage) => { };
	public Ent leader;
	public V3 vel;
	public V3 knockback;
	Action<Ent> _update;
	bool removed = false;
	public Action<Ent, Ent, UseType, int> use;
	public Action<Ent, Ent, UseType, int> playerTouch;
	public Action<Ent, Ent, UseType, int> buddyTouch;
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
	bool usingGrid = false;
	public bool useGrid {
		set { if(value == true) { usingGrid = true; gridLink.Link(gameSys.GridLink(pos)); } else { usingGrid = false; gridLink.Unlink(); } }
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
	public bool outOfBounds( int xWidth, int yWidth ) {
		// There is some fudge factor here, so spawned objects can exist off screen in the margins.  Should make this more rigorous though.
		if(pos.x - xWidth < -13.0f ) return true;
		if(pos.x + xWidth > 13.0f ) return true;
		if(pos.y - yWidth < -8.0f ) return true;
		if(pos.y + yWidth > 8.0f ) return true;
		return false;
	}
	public bool removeIfOffScreen() {
		if(outOfBounds(0,0)) {
			remove();
			return true;
		}
		return false;
	}
	public Ent(GameSys sys, GameObject prefab = null) {
		src = (GameObject)UnityEngine.Object.Instantiate((prefab != null) ? prefab : sys.basePrefab, new V3(0, 0, 0), Quaternion.identity);
		trans = src.transform;
		spr = src.GetComponent<SpriteRenderer>();
		gameSys = sys;
		updLink = new EntLink(this);
		gridLink = new EntLink(this);
		use = (e, user, useType, strength) => { };
		playerTouch = (e, user, useType, strength) => { };
		buddyTouch = (e, user, useType, strength) => { };
	}
	public V3 pos {
		get { return trans.localPosition; }
		set { if(usingGrid )gridLink.Unlink(); if(value.z != trans.localPosition.z) { trans.localPosition = value; SortByZ(); } else { trans.localPosition = value; } if(usingGrid )gridLink.Link( gameSys.GridLink( trans.localPosition )); }
	}
	public V3 pushCenter {
		get { return trans.localPosition- new V3(0,.7f,0); }
	}
	public float scale { get { return trans.localScale.x; } set { trans.localScale = new V3(value, value, value); } }
	public float ang { get { return trans.eulerAngles.z; } set { trans.eulerAngles = new V3(0, 0, value); } }
	public void MoveBy(V3 moveVector) { if(removed) return; gridLink.Unlink(); trans.Translate(moveVector, Space.World); if(moveVector.z != 0) SortByZ(); gridLink.Link(gameSys.GridLink(pos)); }
	public void MoveBy(float x, float y, float z) { if(removed) return; gridLink.Unlink(); trans.Translate(new V3(x, y, z), Space.World); if(z != 0) SortByZ(); gridLink.Link(gameSys.GridLink(pos)); }
	public Sprite sprite { set { spr.sprite = value; } }
	public GameObject gameObj { get { return src; } set { src = value; } }
	public void SortByZ() { if(spr != null )spr.sortingOrder = Math.Min(Math.Max((int)(-trans.position.z * 1024.0f), -32768), 32767); }
	public Color color { set { spr.color = value; } }
	public bool flipped { set { spr.flipX = value; } }
	public string name { set { src.name = value;} }
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