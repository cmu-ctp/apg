using UnityEngine;
using v3 = UnityEngine.Vector3;
using APG;

public class AudiencePhaseStatus {
	public float midpointTimer = 0;
	public bool doingEnd = false;
	public v3 audiencePos;
	public v3 cameraPos;
	public v3 lastLookAtPos = new v3(0, 0, 0);
	public v3 lastLookFromPos = new v3(0, 0, 0);}

class BackgroundUpdates{
    public static void Make( Transform transform ){
        var tick = 0f;
        var src = new ent() { name = "worldBkg" };
        new ent { sprite = Art.Backgrounds.sky.set.files[0].spr, parent = src, ignorePause=true, pos = new v3(0, 0, 60), scale = 50, name = "Sky1", layer=Layers.Background, update=e=> { tick++; e.pos = transform.position; } };
        new ent { sprite = Art.Backgrounds.sky.set.files[4].spr, parent = src, ignorePause = true, pos = new v3(0, 0, 59), scale = 50, name = "Sky2", layer = Layers.Background, update = e=> {  e.color = new Color(1f, 1f, 1f, tick * .001f); } };
        new ent { sprite = Art.Backgrounds.LandToHorizon.spr, parent = src, ignorePause = true, pos = new v3(0, -6, 9), scale3 = new v3(5,3,1), name = "Ground", layer = Layers.Background, update = e => { e.pos = new v3( transform.position.x, transform.position.y-6, 9); } };

        new ent { sprite = Art.Overlays.screenlight.spr, parent = src, ignorePause=true, pos = new v3(0, 0, -7f), scale = 1.4f, name = "Overlay1", layer = Layers.OverlayFX,
            update = e => {
                e.pos = new v3(  transform.position.x, transform.position.y, transform.position.z + 3);
                e.color = new Color(1f, 1f, .9f, .15f + .11f * Mathf.Cos(tick * .01f + 73.0f) + .13f * Mathf.Cos(tick * .0073f + 13.0f));
                e.ang = .2f + 21f * Mathf.Cos(tick * .01f + 73.0f) + 16f * Mathf.Cos(tick * .0153f + 13.0f); } };
        new ent { sprite = Art.Overlays.screenlight.spr, parent = src, ignorePause=true, pos = new v3(0, 0, 2f), scale = 6f, name = "Overlay2", layer = Layers.OverlayFX,
            update = e => {
                e.pos = new v3(  transform.position.x, transform.position.y, 2);
                e.color = new Color(1f, 1f, .9f, .22f + .09f * Mathf.Cos(tick * .0083f + 173.0f) + .17f * Mathf.Cos(tick * .0063f + 23.0f));
                e.ang = .2f + 11f * Mathf.Cos(tick * .0111f + 173.0f) + 23f * Mathf.Cos(tick * .0273f + 213.0f); } };
        new ent { sprite = Art.Overlays.screenlight.spr, parent = src, ignorePause=true, pos = new v3(0, 0, 6f), scale = 8f, name = "Overlay3", layer = Layers.OverlayFX,
            update = e => {
                e.pos = new v3(  transform.position.x, transform.position.y, 6);
                e.color = new Color(1f, 1f, .9f, .22f + .07f * Mathf.Cos(tick * .0113f + 273.0f) + .23f * Mathf.Cos(tick * .0093f + 33.0f));
                e.ang = .2f + 17f * Mathf.Cos(tick * .0131f + 273.0f) + 13f * Mathf.Cos(tick * .0193f + 313.0f); } };}}

class MusicInfo{
    float musicVol = 1f;
    AudioSource audio;
    bool doingSongFade = false;
    AudioClip nextSong = null;

    public void Init( AudioSource srcAudio ){
		audio = srcAudio;
        //audio.clip = Art.Music.somenes19b.snd;
        audio.clip = Art.Music.rand();
        audio.loop = true;

        audio.Play();

    }
	public void FadeSongTo(AudioClip theNextSong) {
        nextSong = theNextSong;
        doingSongFade = true;}
    public void UpdateMusic() {
        if (doingSongFade) {
            musicVol *= .9f;
            audio.volume = musicVol;
			if (musicVol < .01f) {
                audio.Stop();
                audio.clip = nextSong;
                musicVol = audio.volume = 0;
                audio.Play();
                nextSong = null;
                doingSongFade = false;}}
		else {if (musicVol < .99f) { musicVol = musicVol * .9f + .1f * 1; audio.volume = musicVol;}}}}

public class FullGame {
	public static float tick = 0;
    public static int ticksPerSecond = 60;
}