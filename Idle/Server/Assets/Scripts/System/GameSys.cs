using UnityEngine;
using v3 = UnityEngine.Vector3;
using System;
using System.Collections.Generic;

public enum Layers { Fade, UI, UIBkg, UIMid, OverlayFX, Game, Background }

public enum UseType { PlayerBlowing, PlayerPush, BuddyTouch }

[Serializable]
public class GameSys {
	public GameObject basePrefab;
	public EntLink updaters;
	public EntLink sysUpdaters;
    public EntLink activeEnts;
    Transform camera;

	public bool gameOver = false;

	[SerializeField] float timeRemainder = 0;

	public CollisionGrid grid = new CollisionGrid(30, 30);
	public GameSys(Transform cameraTransform) {
        basePrefab = Art.Core.BasicSpriteObject.obj;
		camera = cameraTransform;
		updaters = new EntLink(null);
		sysUpdaters = new EntLink(null);
        activeEnts = new EntLink(null);
    }
	public void Sound(AudioClip sound, float volume) {
		AudioSource.PlayClipAtPoint(sound, camera.position, volume);
	}
	public ent Shadow( FixedEntPool pool, float size, float alpha, float yOffset ) {
		ent me = null;
		if( pool == null ) {
			me = new ent();
		}
		else {
			me = new PoolEnt(pool).e;
		}

		me.sprite = Art.Shadow.shadow3.spr;
		me.name ="shadow";
        me.isShadow=true;
		me.pos = new v3(0,-100,0);// give it a frame to be placed correctly.
		me.update = e => {
			e.pos = new v3( e.leader.pos.x, -5 + yOffset, e.leader.pos.z );
			e.scale = (.5f + (e.leader.pos.y - (-5f))*.03f)*size;

			if( e.leader.pos.y < -5f ) {
				e.color = new Color(1,1,1, 0 );
			}
			else {
				e.color = new Color(1,1,1, alpha*(.8f-(e.leader.pos.y - (-5f))/20f));
			}
			
		};
		return me;
	}
    public void ClearEnts()
    {
        var l = new List<ent>();
        var curUpdater = activeEnts.next;
        while (curUpdater != null){
            if (curUpdater.e != null) l.Add(curUpdater.e);
            curUpdater = curUpdater.next;
        }
        for (var k = 0; k < l.Count; k++) l[k].remove(true);
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