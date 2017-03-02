using UnityEngine;
using V3 = UnityEngine.Vector3;

public class DualWave {
	float amplitude1, frequency1, phase1;
	float amplitude2, frequency2, phase2;
	public DualWave(float amplitude, float frequency) {
		amplitude1 = amplitude * Rd.Fl(.7f, 1.3f);
		frequency1 = frequency * Rd.Fl(.6f, 1.4f);
		phase1 = Rd.Ang();
		amplitude2 = amplitude * Rd.Fl(.7f, 1.3f);
		frequency2 = frequency * Rd.Fl(.6f, 1.4f);
		phase2 = Rd.Ang();
	}
	public float Val(float time) {
		return amplitude1 * Mathf.Cos(time * frequency1 + phase1) + amplitude2 * Mathf.Cos(time * frequency2 + phase2);
	}
}
