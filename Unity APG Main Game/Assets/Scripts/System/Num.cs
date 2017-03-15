using UnityEngine;
using System;
using System.Linq;
using System.Collections.Generic;
using v3 = UnityEngine.Vector3;

public static class nm {
	public static int Between(int min, int val, int max) { return Math.Max(min, Math.Min(max, val)); }
	public static float FadeInOut(float t, float scale) { var outVal = Mathf.Sin(t*Mathf.PI)*scale; if(outVal > 1) outVal = 1; return outVal; }
	public static void ease(ref v3 from, v3 to, float val) { from = from * (1.0f-val) + val * to; }
	public static void ease(ref float from, float to, float val) { from = from * (1.0f - val) + val * to; }
	public static IEnumerable<int> Loop(this int count) { return Enumerable.Range(0, count); }
}