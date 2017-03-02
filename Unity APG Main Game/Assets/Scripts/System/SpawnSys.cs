using UnityEngine;
using System;
using System.Collections.Generic;
using V3 = UnityEngine.Vector3;

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