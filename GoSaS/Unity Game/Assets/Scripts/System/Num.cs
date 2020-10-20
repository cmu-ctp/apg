using UnityEngine;
using System;
using System.Linq;
using System.Collections.Generic;
using v3 = UnityEngine.Vector3;

public static class nm {
	public static int Between(int min, int val, int max) { return Math.Max(min, Math.Min(max, val)); }
	public static float Between(float min, float val, float max) { return Math.Max(min, Math.Min(max, val)); }
	public static float FadeInOut(float t, float scale) { var outVal = Mathf.Sin(t*Mathf.PI)*scale; if(outVal > 1) outVal = 1; return outVal; }
	public static void ease(ref v3 from, v3 to, float easingFraction) { from = from * (1.0f-easingFraction) + easingFraction * to; }
	public static void ease(ref float from, float to, float easingFraction) { from = from * (1.0f - easingFraction) + easingFraction * to; }
	public static Color col( float brightness ) { return new Color(brightness,brightness,brightness,1f); }
	public static Color col( float brightness, float alpha ) { return new Color(brightness,brightness,brightness,alpha ); }
	public static v3 v3x( float xValue ) { return new v3( xValue, 0, 0 ); }
	public static v3 v3y( float yValue ) { return new v3( 0, yValue, 0 ); }
	public static v3 v3z( float zValue ) { return new v3( 0, 0, zValue ); }
	public static IEnumerable<int> Loop(this int count) { return Enumerable.Range(0, count); }
}