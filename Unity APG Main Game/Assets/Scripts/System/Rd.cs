using UnityEngine;
using V3 = UnityEngine.Vector3;

public static class Rd {
	public static int Int(int r1, int r2) { return (int)UnityEngine.Random.Range(r1, r2); }
	public static float Fl(float r1, float r2) { return UnityEngine.Random.Range(r1, r2); }
	public static float Fl(float r1) { return UnityEngine.Random.Range(-r1, r1); }
	public static V3 Vec(float r1, float r2) { return new V3(Fl(r1, r2), Fl(r1, r2), Fl(r1, r2)); }
	public static float Ang() { return Fl(0, Mathf.PI * 2); }
	public static Sprite Sprite(Sprite[] sprites) { return sprites[UnityEngine.Random.Range(0, sprites.Length)]; }
	public static AudioClip Sound(AudioClip[] sounds) { return sounds[UnityEngine.Random.Range(0, sounds.Length)]; }
	public static bool Test(float chance) { return Fl(0, 1) < chance; }
}