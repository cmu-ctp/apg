using UnityEngine;
using System;
using System.Linq;
using System.Collections.Generic;
using V3 = UnityEngine.Vector3;

public enum Layers { UI, Game, Background }
public enum UseType { PlayerBlowing }

public class SpawnEntry {
	public Sprite icon;
	public int time;
	public Action spawn;
}

public class SpawnSys {
	public List<SpawnEntry> spawnSet = new List<SpawnEntry>();
	public int curEntry = 0;
	public void Add(int spawnTime, Action entry, Sprite icon) { spawnSet.Add(new SpawnEntry { icon=icon, time=spawnTime*60, spawn=entry }); }
	public void Add(int spawnTime, SpawnEntry src) { spawnSet.Add(new SpawnEntry { icon=src.icon, time=spawnTime*60, spawn=src.spawn }); }
	public void Sort() { spawnSet.Sort((x, y) => x.time.CompareTo(y.time)); }
	public void Update(int time) {
		if(curEntry >= spawnSet.Count) return;
		if(time > spawnSet[curEntry].time) {
			spawnSet[curEntry].spawn();
			curEntry++;
		}
	}
}

public class EntLink {
	public Ent e = null;
	public EntLink prev = null;
	public EntLink next = null;
	public EntLink(Ent src) { e = src; }
	public void Link(EntLink head) {
		if(next != null || prev != null) Unlink();
		if(head.next != null) head.next.prev = this;
		next = head.next;
		head.next = this;
		prev = head;
	}
	public void Unlink() {
		if(next != null) next.prev = prev;
		if(prev != null) prev.next = next;
		prev = next = null;
	}
}

public class CollisionGrid {
	EntLink[] grid;
	int gridx, gridy;
	int GridForXY(int x, int y) { return (y + gridy) * 2 * gridx + (x + gridx); }
	int GridID(V3 pos) {
		int idx = Num.Between(-gridx, (int)pos.x, gridx-1);
		int idy = Num.Between(-gridy, (int)pos.y, gridy-1);
		return GridForXY(idx, idy);
	}
	public CollisionGrid(int x, int y) {
		gridx = x; gridy = y;
		grid = new EntLink[(x*2)*(y*2)];
		for(var k = 0; k < (x*2)*(y*2); k++) grid[k] = new EntLink(null);
	}
	public EntLink GetGrid(V3 pos) { return grid[GridID(pos)]; }
	public void Find(V3 pos, float radius, Ent src, Action<Ent, Ent> onFind) {
		int x1 = Num.Between(-gridx, (int)(pos.x-radius-1), gridx-1);
		int x2 = Num.Between(-gridx, (int)(pos.x+radius-1), gridx-1);
		int y1 = Num.Between(-gridy, (int)(pos.y-radius+1), gridy-1);
		int y2 = Num.Between(-gridy, (int)(pos.y+radius+1), gridy-1);
		for(var x = x1; x <= x2; x++) {
			for(var y = y1; y <= y2; y++) {
				var head = grid[GridForXY(x, y)].next;
				while(head != null) {
					if(head.e != null) {
						var dif = head.e.pos - pos;
						dif.z = 0;
						if(dif.sqrMagnitude < radius * radius) {
							onFind(src, head.e);
						}
					}
					head = head.next;
				}
			}
		}
	}
}

public class GameSys {
	public GameObject basePrefab;
	public EntLink updaters;
	Transform camera;
	public CollisionGrid grid = new CollisionGrid(30, 30);
	public GameSys(GameObject corePrefab, Transform cameraTransform) {
		basePrefab = corePrefab;
		camera = cameraTransform;
		updaters = new EntLink(null);
	}
	public void Sound(AudioClip sound, float volume) {
		AudioSource.PlayClipAtPoint(sound, camera.position, volume);
	}
	public EntLink GridLink(V3 pos) { return grid.GetGrid(pos); }
	public void Update() {
		var curUpdater = updaters.next;
		while(curUpdater != null) {
			if(curUpdater.e != null) curUpdater.e.update(curUpdater.e);
			curUpdater = curUpdater.next;
		}
	}
}

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

public class DualWave {
	float amplitude1, frequency1, phase1;
	float amplitude2, frequency2, phase2;
	public DualWave(float amplitude, float frequency) {
		amplitude1 = amplitude * Rd.Fl(.7f, 1.3f);
		frequency1 = frequency * Rd.Fl(.6f, 1.4f);
		phase1 = Rd.Ang();
		amplitude2 = amplitude * Rd.Fl(.7f, 1.3f);
		frequency2 = frequency * Rd.Fl(.6f, 1.4f);
		phase2 = Rd.Ang();
	}
	public float Val(float time) {
		return amplitude1 * Mathf.Cos(time * frequency1 + phase1) + amplitude2 * Mathf.Cos(time * frequency2 + phase2);
	}
}

public static class Rd {
	public static int Int(int r1, int r2) { return (int)UnityEngine.Random.Range(r1, r2); }
	public static float Fl(float r1, float r2) { return UnityEngine.Random.Range(r1, r2); }
	public static float Fl(float r1) { return UnityEngine.Random.Range(-r1, r1); }
	public static V3 Vec(float r1, float r2) { return new V3(Fl(r1, r2), Fl(r1, r2), Fl(r1, r2)); }
	public static float Ang() { return Fl(0, Mathf.PI * 2); }
	public static Sprite Sprite(Sprite[] sprites) { return sprites[UnityEngine.Random.Range(0, sprites.Length)]; }
	public static bool Test(float chance) { return Fl(0, 1) < chance; }
}

public static class Num {
	public static int Between(int min, int val, int max) { return Math.Max(min, Math.Min(max, val)); }
	public static float FadeInOut(float t, float scale) { var outVal = Mathf.Sin(t*Mathf.PI)*scale; if(outVal > 1) outVal = 1; return outVal; }
	public static void Ease(ref V3 from, V3 to, float val) { from = from * (1.0f-val) + val * to; }
	public static void Ease(ref float from, float to, float val) { from = from * (1.0f - val) + val * to; }
	public static IEnumerable<int> Loop(this int count) { return Enumerable.Range(0, count); }
}