using UnityEngine;
using V3 = UnityEngine.Vector3;

public enum Layers { UI, Game, Background }


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