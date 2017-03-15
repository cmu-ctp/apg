using UnityEngine;
using v3 = UnityEngine.Vector3;

public enum Layers { UI, Game, Background }

public enum UseType { PlayerBlowing, PlayerPush, BuddyTouch }

public class GameSys {
	public GameObject basePrefab;
	public EntLink updaters;
	public EntLink sysUpdaters;
	Transform camera;

	float timeRemainder = 0;

	public CollisionGrid grid = new CollisionGrid(30, 30);
	public GameSys(GameObject corePrefab, Transform cameraTransform) {
		basePrefab = corePrefab;
		camera = cameraTransform;
		updaters = new EntLink(null);
		sysUpdaters = new EntLink(null);
	}
	public void Sound(AudioClip sound, float volume) {
		AudioSource.PlayClipAtPoint(sound, camera.position, volume);
	}
	public EntLink GridLink(v3 pos) { return grid.GetGrid(pos); }
	public void Update( bool isPaused ) {

		timeRemainder += Time.deltaTime;

		if( timeRemainder > 10f/60f )timeRemainder = 10f/60f;

		while( timeRemainder > 0 ) {

			timeRemainder -= 1f/60f;

			var curUpdater = sysUpdaters.next;
			while(curUpdater != null) {
				if(curUpdater.e != null) curUpdater.e.update(curUpdater.e);
				curUpdater = curUpdater.next;
			}

			if( !isPaused ) {
				curUpdater = updaters.next;
				while(curUpdater != null) {
					if(curUpdater.e != null) curUpdater.e.update(curUpdater.e);
					curUpdater = curUpdater.next;
				}
			}
		}
	}
}