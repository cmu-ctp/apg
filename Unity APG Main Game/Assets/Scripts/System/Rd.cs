using UnityEngine;
using v3 = UnityEngine.Vector3;

public static class rd {
	public static int i(int r1, int r2) { return (int)UnityEngine.Random.Range(r1, r2); }
	public static float f(float r1, float r2) { return UnityEngine.Random.Range(r1, r2); }
	public static float f(float r1) { return UnityEngine.Random.Range(-r1, r1); }
	public static v3 Vec(float r1, float r2) { return new v3(f(r1, r2), f(r1, r2), f(r1, r2)); }
	public static float Ang() { return f(0, Mathf.PI * 2); }
	public static Sprite Sprite(Sprite[] sprites) { return sprites[UnityEngine.Random.Range(0, sprites.Length)]; }
	public static AudioClip Sound(AudioClip[] sounds) { return sounds[UnityEngine.Random.Range(0, sounds.Length)]; }
	public static bool Test(float chance) { return f(0, 1) < chance; }
}