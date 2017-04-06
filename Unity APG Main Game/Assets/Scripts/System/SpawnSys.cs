using UnityEngine;
using System;
using System.Collections.Generic;
using v3 = UnityEngine.Vector3;

public class SpawnEntry {
	public Sprite icon;
	public float iconYOffset = 0;
	public int time;
	public float scale = 1f;
	public Action spawn;
	public string message ="";
}

public class SpawnSys {
	public List<SpawnEntry> spawnSet = new List<SpawnEntry>();
	public int curEntry = 0;
	public string incomingMessage = "";
	public int incomingMessageTime = 0;
	public void Add(int spawnTime, SpawnEntry src) { spawnSet.Add(new SpawnEntry { icon=src.icon, time=spawnTime*60, spawn=src.spawn, iconYOffset=src.iconYOffset, message=src.message, scale=src.scale }); }
	public void Sort() { spawnSet.Sort((x, y) => x.time.CompareTo(y.time)); }
	public void Update(int time) {
		if(curEntry >= spawnSet.Count) return;
		if(( time > spawnSet[curEntry].time - 60 * 2.5f ) && ( spawnSet[curEntry].message != "" ) ) {
			incomingMessage = spawnSet[curEntry].message;
			incomingMessageTime = spawnSet[curEntry].time;
		}
		if(time > spawnSet[curEntry].time) {
			spawnSet[curEntry].spawn();
			curEntry++;
			incomingMessage = "";
		}
	}
}