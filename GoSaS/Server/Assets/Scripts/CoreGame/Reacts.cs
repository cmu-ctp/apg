using UnityEngine;
using System.Collections.Generic;
using v3 = UnityEngine.Vector3;

public class Reacts : MonoBehaviour { public GameObject textName; public Sprite shockBkg, talkBkg;}

public class ReactSys {
	Reacts reacts;
	const int numReacts = 10;
	FixedEntPool entPool;
	FixedEntPool textEntPool;

/*
	private Texture2D generateQR(string text) {
		var encoded = new Texture2D(256, 256);
		var color32 = Encode(text, encoded.width, encoded.height);
		encoded.SetPixels32(color32);
		encoded.Apply();
		return encoded;}
 
*/

	public void Init( Reacts theReacts ) {
		reacts = theReacts;
		var src = new ent() { name="reactSet" };
		entPool = new FixedEntPool( numReacts, "reacts" );
		for( var k = 0; k < numReacts; k++ ) { new PoolEnt( entPool ) { sprite = reacts.shockBkg, name="react", scale = 2, update = null, active=false, parent = src }; }
		var tsrc = new ent() { name="reactTextSet" };
		textEntPool = new FixedEntPool( numReacts, "reactsText", false, reacts.textName );
		for( var k = 0; k < numReacts; k++ ) { new PoolEnt( textEntPool ) { name="reactText", scale = .06f, update = null, active=false, parent = tsrc, text="" };}}

	public void React(v3 pos, string msg, Color color) {ReactCore( reacts.shockBkg, pos, msg, color, 1.5f, 1, 1 );}
	public void Chat(v3 pos, string msg, Color color, float scale) {ReactCore( reacts.talkBkg, pos, msg, color, 3, 1.3f, scale );}
	void ReactCore( Sprite spr, v3 pos, string msg, Color color, float scale, float textScale, float allScale) {
		new PoolEnt( entPool ) { active= true, sprite = spr, pos = pos, scale=scale*allScale, health = 30, update = e => { e.health--; if(e.health <= 0) { e.active = false; e.remove(); } }};
		new PoolEnt( textEntPool ) { active= true, text = msg, pos = pos+new v3(0,0,-.1f), health = 30, scale = .045f * textScale * allScale, update = e => {e.health--;if(e.health <= 0) { e.active = false; e.remove(); }}};}}
