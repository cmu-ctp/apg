using UnityEngine;
using System;
using v3 = UnityEngine.Vector3;
using System.Collections.Generic;

class IntroPlaques{
    static void MakeIntroPlaque2(Transform transform ){

        new ent() { ignorePause = true, sprite = Art.UI.Title.howtoplay.spr, parentTrans = transform, scale = 1.3f, pos = new v3(0, 0, 10), health = 1,
            update = e2 => {
                if (Input.GetKey(KeyCode.Escape) || Input.GetKey(KeyCode.Space) || Input.GetButton("Fire1") || Input.GetButton("Fire2")) e2.health = 0;
                if (e2.health > 0) { var v = e2.pos; nm.ease(ref v, new v3(0, 0, 10), .1f); e2.pos = v; }
                else { var v = e2.pos; nm.ease(ref v, new v3(0, -10, 10), .1f); e2.pos = v; }
                if (e2.pos.y < -9f) e2.remove();}};}

    public static void MakeIntroPlaque(GameObject assets, Action doExit ) {
        var xs = new float[] {-4, 4, -3f, 4, -2f };
        var ys = new float[] {4, 2.5f, 1, -.5f, -2 };
        var scs = new float[] { .6f, .4f, .6f,.4f,.6f };
        var side = new float[] { 2, .5f, 2, .7f, 2f };
        var balloonx = new float[] { 0, 0, 0, 0, 0 };
        var titlePics = new ImageEntry[] { Art.UI.Title.gods, Art.UI.Title.of, Art.UI.Title.socks, Art.UI.Title.and, Art.UI.Title.spoons };
        for (var k2 = 0; k2 < 5;k2++) {
            var balloons = new List<ent>();
            for (var j = 0; j < 3; j++)
                balloons.Add(new ent() { ignorePause = true, name="titleWordBalloon", sprite = Art.Toys.Balloons.set.files[(k2 * 3 + j) % 8].spr, scale = .35f, pos = new v3(0, 0, 1) });
            var k = k2;
            var tick = 0;
            var center = new v3(rd.f(-20, 20), rd.f(15, 30), rd.f(-15, 15));
            var centerGoal = new v3(0, 0, 0);
            var delay = k2 * 20;
            var escape = false;
		    new ent() { ignorePause = true, sprite = titlePics[k2].spr, parentTrans = assets.transform, scale = scs[k2]+.15f, pos = center, health = 1, children = balloons, name="titleWord",
			    update = e2 => {
                    if (Input.GetKey(KeyCode.Escape) || Input.GetKey(KeyCode.Space) || Input.GetButton("Fire1") || Input.GetButton("Fire2")) { escape = true; centerGoal= new v3(rd.f(-20, 20), rd.f(15, 30), rd.f(-15, 15)); delay = k * 2; }
                    if (escape == true){
                        if (delay > 0) delay--;
                        else center = center * .99f + .01f * centerGoal;
                        e2.ang = .2f + 3f * Mathf.Cos(tick * .01f + 73.0f+k*77) + 2.3f * Mathf.Cos(tick * .0153f + 13.0f+k*47);
                        e2.pos = center+new v3(
                            xs[k] + .3f * Mathf.Cos(tick * .008f + 73.0f+k*32) + .13f * Mathf.Cos(tick * .0123f + 13.0f+k*71), 
                            ys[k] + .1f * Mathf.Cos(tick * .009f + 73.0f+k*66) + .17f * Mathf.Cos(tick * .0133f + 13.0f+k*83), 
                            10  + .5f * Mathf.Cos(tick * .011f + 73.0f+k*44) + .3f * Mathf.Cos(tick * .0143f + 13.0f+k*21));
                        if (e2.pos.y > 12f) { e2.remove(); if (k == 0) { /*exitingTitle = true;*/ doExit(); MakeIntroPlaque2( assets.transform ); } }
                        return;}
                    if (delay > 0) { delay--; return; }
                    center = center * .98f + .02f * centerGoal;
                    tick++;
                    e2.ang = .2f + 3f * Mathf.Cos(tick * .01f + 73.0f+k*77) + 2.3f * Mathf.Cos(tick * .0153f + 13.0f+k*47);
                    e2.pos = center+new v3(
                        xs[k] + .3f * Mathf.Cos(tick * .008f + 73.0f+k*32) + .13f * Mathf.Cos(tick * .0123f + 13.0f+k*71), 
                        ys[k] + .1f * Mathf.Cos(tick * .009f + 73.0f+k*66) + .17f * Mathf.Cos(tick * .0133f + 13.0f+k*83), 
                        10  + .5f * Mathf.Cos(tick * .011f + 73.0f+k*44) + .3f * Mathf.Cos(tick * .0143f + 13.0f+k*21));
                    for (var j = 0; j < 3; j++) balloons[j].ang = -e2.ang;}};
            for (var j = 0; j < 3; j++) balloons[j].pos = new v3(balloonx[k2]+ -side[k2] + 2 * j*side[k2], 2, 1);}}}