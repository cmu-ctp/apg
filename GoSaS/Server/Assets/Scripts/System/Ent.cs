using UnityEngine;
using System;
using System.Collections.Generic;
using v3 = UnityEngine.Vector3;

public enum TouchFlag { IsAirbourne = 1<<0 }

public enum Team { None, Player1, Player2 }

public struct TouchInfo {
	public int damage;
	public int strength;
	public ent src;
	public int style;
	public bool isItem;
	public uint flags;
	public int count;
	public bool isPlayer;
	public bool showDamage;
}

// All of the Serializable / SerialField annotations  are purely for debugging - it makes them visible and inspectable in the UnityEditor at runtime.
[Serializable]
public class ent {

    public static GameSys BaseGameSys;

	[SerializeField] GameSys gameSys;
	[SerializeField] GameObject src;

	[SerializeField] Transform trans;
	[SerializeField] SpriteRenderer spr;
	[SerializeField] Renderer ren;
	[SerializeField] TextMesh tx = null;

	[SerializeField] EntLink updLink;
	[SerializeField] EntLink gridLink;
    EntLink activeLink;

    public ent textLabel = null;

	public int health;
	public ent leader;
	public v3 vel;
	public v3 knockback;

	ent shadowEnt;
	public ent shadow { set { shadowEnt = value; shadowEnt.leader=this; } }
	public bool isShadow;

	public float val1, val2;

	public Action<ent, ent, TouchInfo> onHurt = (me, source, damage) => { };
	public Action<ent, ent, TouchInfo> itemTouch;
	public Action<ent, ent, TouchInfo> breathTouch;
	public Action<ent, ent, TouchInfo> playerTouch;
	public Action<ent, ent, TouchInfo> buddyTouch;
	public Action<ent, ent, TouchInfo> shotTouch;
	public Action<ent, ent, TouchInfo> objTouch;

	[SerializeField] int sortOrder;

	[SerializeField] Action<ent> _update;
	[SerializeField] bool removed = false;
	[SerializeField] bool usingGrid = false;
	public bool ignorePause;

	public ent poolNext = null;
	[SerializeField] bool poolActive = false;
	public FixedEntPool pool = null;

	public Action<ent> update {
		get { return _update; }
		set {
			if(_update == null) {
				if( ignorePause )updLink.Link(gameSys.sysUpdaters);
				else updLink.Link(gameSys.updaters);
			}
			if(value == null) updLink.Unlink();
			_update = value;
		}
	}
	public bool inGrid {
		set { if(value == true) { usingGrid = true; gridLink.Link(gameSys.GridLink(pos)); } else { usingGrid = false; gridLink.Unlink(); } }
	}
	public void remove( bool removePool = false ) {
		if( removed ) {
			// print error message
			return;
		}
		// fixme - deal with parenting stuff
		removed = true;
		update = null;
		gridLink.Unlink();

		if( pool != null && !removePool) {
			active = false;
			pool.Reclaim( this );
		}
		else {
            activeLink.Unlink();
            activeLink = null;
            gridLink = null;
			updLink = null;
			UnityEngine.Object.Destroy(src);
		}
		
		if( shadowEnt != null ) {
			shadowEnt.remove();
			shadowEnt = null;
		}
	}
	public void poolRespawn() {
		// This is stateful, so we need reset stateful attributes.  Design consideration - making this more generic and comprehensive makes it easier to use but less performant.  Are there attributes pool users should be in charge of taking care of?
		ang = 0;
		scale = 1;
		pos = new v3( 0,0,0 );
		color = new Color(1,1,1,1);
		active=true;
		removed = false;
		isShadow = false;

		ignorePause = false;
		itemTouch = (e, user, info) => { };
		breathTouch = (e, user, info) => { };
		playerTouch = (e, user, info) => { };
		buddyTouch = (e, user, info) => { };
		shotTouch = (e, user, info) => { };
		objTouch = (e, user, info) => { };
		onHurt = (me, source, damage) => { };

		leader = shadowEnt = null;
	}
	public bool outOfBounds( int xWidth, int yWidth, bool ignoreUp ) {
		// There is some fudge factor here, so spawned objects can exist off screen in the margins.  Should make this more rigorous though.
		if(pos.x - xWidth < -13.0f ) return true;
		if(pos.x + xWidth > 13.0f ) return true;
		if(pos.y - yWidth < -8.0f ) return true;
		if(!ignoreUp && pos.y + yWidth > 8.0f ) return true;
		return false;
	}
	public bool removeIfOffScreen( bool ignoreUp = true ) {
		if(outOfBounds(0,0, ignoreUp )) {
			remove();
			return true;
		}
		return false;
	}
	public ent(GameObject prefab = null) {
        var sys = BaseGameSys;
        src = (GameObject)UnityEngine.Object.Instantiate((prefab != null) ? prefab : sys.basePrefab, new v3(0, 0, 0), Quaternion.identity);

		var entHolder = src.GetComponent<EntHolder>();
		if( entHolder != null ) {
			entHolder.linkedEnt = this;
		}

		trans = src.transform;
		spr = src.GetComponent<SpriteRenderer>();
		ren = src.GetComponent<Renderer>();
		tx = src.GetComponent<TextMesh>();
		ignorePause = false;
		isShadow = false;
		gameSys = sys;
		updLink = new EntLink(this);
		gridLink = new EntLink(this);
        activeLink = new EntLink(this);
        activeLink.Link(gameSys.activeEnts);
        itemTouch = (e, user, info) => { };
		breathTouch = (e, user, info) => { };
		playerTouch = (e, user, info) => { };
		buddyTouch = (e, user, info) => { };
		shotTouch = (e, user, info) => { };
		objTouch = (e, user, info) => { };

		leader = shadowEnt = null;
	}
	public v3 pos {
		get { return trans.localPosition; }
		set { if(usingGrid )gridLink.Unlink(); if(value.z != trans.localPosition.z) { trans.localPosition = value; SortByZ(); } else { trans.localPosition = value; } if(usingGrid )gridLink.Link( gameSys.GridLink( trans.localPosition )); }
	}
	public v3 pushCenter {
		get { return trans.localPosition- new v3(0,.7f,0); }
	}
	public float scale { get { return trans.localScale.x; } set { trans.localScale = new v3(value, value, value); } }
	public v3 scale3 { get { return trans.localScale; } set { trans.localScale = value; } }
	public float ang { get { return trans.eulerAngles.z; } set { trans.eulerAngles = new v3(0, 0, value); } }
    public v3 ang3 { get { return trans.eulerAngles; } set { trans.eulerAngles = value; } }
    public void MoveBy(v3 moveVector) { if(removed) return; gridLink.Unlink(); trans.Translate(moveVector, Space.World); if(moveVector.z != 0) SortByZ(); gridLink.Link(gameSys.GridLink(pos)); }
	public void MoveBy(float x, float y, float z) { if(removed) return; gridLink.Unlink(); trans.Translate(new v3(x, y, z), Space.World); if(z != 0) SortByZ(); gridLink.Link(gameSys.GridLink(pos)); }
	public void MoveTo(float x, float y, float z) { if(removed) return; gridLink.Unlink(); trans.position = new v3(x, y, z); if(z != 0) SortByZ(); gridLink.Link(gameSys.GridLink(pos)); }
	public Sprite sprite { set { if( spr != null)spr.sprite = value; } get { return spr.sprite; } }
    public Team team;
    public Material material { set { if (spr != null) spr.material = value; } }
	public void SortByZ() {
		if(ren != null ) {
			if( isShadow ) {
				ren.sortingOrder = sortOrder = -32768;
			}
			else {
				ren.sortingOrder = sortOrder = Math.Min(Math.Max((int)(-trans.position.z * 1024.0f), -32768), 32767); 
			}
		}
	}
	public Color color { set { if(spr != null )spr.color = value; } get { return spr.color; } }
	public bool flipped { set { if(spr != null )spr.flipX = value; } get { return spr.flipX; } }
	public string name { set { src.name = value;} get { return src.name; } }
	public bool active { set {  poolActive = value; src.SetActive( value ); } get { return poolActive; } }
	public Layers layer {
		set {
			string s = "";
			switch(value) {
				case Layers.Fade:
					s = "Fade";
					break;
				case Layers.UI:
					s = "UI";
					break;
				case Layers.UIMid:
					s = "UIMid";
					break;
				case Layers.UIBkg:
					s = "UIBkg";
					break;
                case Layers.OverlayFX:
                    s = "OverlayFX";
                    break;
                case Layers.Game:
					s = "Default";
					break;
				case Layers.Background:
					s = "Background";
					break;
			}
			if(spr != null )spr.sortingLayerName = s;
		}
	}
	// FIXME.  This has been giving me no end of grief.  How should this work?  There's a bunch of stuff that needs to get propagated down through the heirarchy.
	public ent parent {
		set { trans.parent = value.src.transform; }
	}
    public Transform parentTrans {
        set { trans.parent = value; }
    }
    public List<ent> children { set { foreach(var child in value) { child.trans.parent = trans; child.trans.localPosition = new v3(0, 0, 0); } } }

	public string text { set { tx.text = value;} get { return tx.text; } }
	public Color textColor { set { tx.color = value;} get { return tx.color; } }
	public float textAlpha { set { tx.color = new Color( tx.color.r, tx.color.g, tx.color.b, value );} get { return tx.color.a; } }
}

[Serializable]
public class FixedEntPool {
	[SerializeField] string name;
	[SerializeField] int size;
	[SerializeField] bool useFirstFree;
	[SerializeField] ent[] entSet;
	[SerializeField] ent allocHead = null;
	[SerializeField] int nextToSpawn = 0;
	[SerializeField] ent dummyEnt = null;

	public FixedEntPool( int poolSize, string poolName, bool getFirstFree=false, GameObject prefab = null ) {
		name = poolName;
		useFirstFree = getFirstFree;
		size = poolSize;
		entSet = new ent[size];
		ent lastEnt = null;

		var src = new ent() { name=poolName };

		for( var k = 0; k < size; k++ ) {
			entSet[k] = new ent(prefab) { poolNext = lastEnt, pool = this, active=false, parent=src };
			lastEnt = entSet[k];
		}
		allocHead = entSet[size-1];

		dummyEnt = new ent(prefab ) { active=false, parent=src, name="dummy" };
	}
	public void Reclaim( ent e ) {
		e.poolNext = allocHead;
		allocHead = e;
	}

	// fixme - this allocation is suboptimal.  Better to have a list that objects are explicitly added to when they are deallocated.
	public ent Alloc() {
		ent e = null;
		if( useFirstFree ) {
			e = allocHead;
			if( e != null ) {
				allocHead = e.poolNext;
			}
			else {
				Debug.Log("Warning!  FixedEntPool " + name + "is too small: allocating dummy ent" );
				// put a huge warning up about making the pool larger.
				e = dummyEnt;
			}
		}
		else { 
			e = entSet[nextToSpawn];
			nextToSpawn = (nextToSpawn+1)%size;
		}
		e.poolRespawn();
		return e;
	}
}

[Serializable]
class PoolEnt {
	public ent e;
	public PoolEnt( FixedEntPool pool, bool clear = false ) {
		e = pool.Alloc();
		// Fixme: Make clear work.
	}

	public ent textLabel {set { e.textLabel=value; } }
	public int health {set {e.health=value; } }
	public ent leader {set { e.leader=value;} }
	public v3 vel {set { e.vel=value;} }
	public v3 knockback {set { e.knockback=value;} }
	public Action<ent, ent, TouchInfo> onHurt { set { e.onHurt = value; } }
	public Action<ent, ent, TouchInfo> itemTouch { set { e.itemTouch = value; } }
	public Action<ent, ent, TouchInfo> breathTouch {set { e.breathTouch=value;} }
	public Action<ent, ent, TouchInfo> playerTouch {set { e.playerTouch=value;} }
	public Action<ent, ent, TouchInfo> buddyTouch {set { e.buddyTouch=value;} }
	public Action<ent, ent, TouchInfo> shotTouch {set { e.shotTouch=value;} }
	public Action<ent, ent, TouchInfo> objTouch { set { e.objTouch = value; } }
	public Action<ent> update {set { e.update = value;}}
	public bool inGrid {set { e.inGrid = value; }}
	public ent shadow { set { e.shadow= value; } }
	public bool ignorePause{set { e.ignorePause = value; }}
	public v3 pos {set { e.pos = value; }}
	public float scale { set { e.scale=value; } }
	public float ang { set { e.ang=value; } }
	public Sprite sprite { set { e.sprite=value; } }
    public Team team { set { e.team = value; } }
    public Color color { set { e.color = value; } }
	public bool flipped { set { e.flipped = value; } }
	public string name { set { e.name = value;} }
	public bool active { set {  e.active = value; } }
	public Layers layer { set { e.layer = value; } }
	public ent parent {set { e.parent = value; }}
	public List<ent> children { set { e.children = value; } }
	public string text { set { e.text = value;}  }
	public Color textColor { set { e.textColor = value;}  }
}