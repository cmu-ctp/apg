using UnityEngine;
using System;

class SpawnContent{
	public static void InitSpawns(SpawnSys spawnSys, FoeSys foeSys, TreatSys treatSys) {

		var foeTime = 50;
		var foeOffset = 6;

		var turnEnd = new SpawnEntry { icon = Art.UI.waveDivider.spr, spawn = () => { }, message = "", scale = 5 };
		var roundMarker = new SpawnEntry { icon = Art.UI.waveDivider.spr, spawn = () => { }, message = "", scale = 2, iconYOffset = -.7f };
		for (var k = 1; k < 20; k++) spawnSys.Add(5+50 * k, turnEnd);

        var rounds = new Sprite[] { Art.UI.RoundNums.round1.spr, Art.UI.RoundNums.round2.spr, Art.UI.RoundNums.round3.spr, Art.UI.RoundNums.round4.spr, Art.UI.RoundNums.round5.spr, Art.UI.RoundNums.round6.spr,
            Art.UI.RoundNums.round7.spr, Art.UI.RoundNums.round8.spr, Art.UI.RoundNums.round9.spr, Art.UI.RoundNums.round10.spr, Art.UI.RoundNums.round11.spr, Art.UI.RoundNums.round12.spr};
		for (var k = 0; k < 12; k++) spawnSys.Add(5 + 50 * k + 36, new SpawnEntry { icon = rounds[k], spawn = () => { }, message = "", scale = 8, iconYOffset = -.9f });

		var smallPositive = new SpawnEntry[] { treatSys.balloonClusterLeft, treatSys.balloonClusterBottomLeft, treatSys.balloonClusterRight, treatSys.balloonClusterBottomRight };
		var smallPositiveUnbiased = new SpawnEntry[] { treatSys.balloonClusterBottom };
		var bigPositive = new SpawnEntry[] { treatSys.balloonGridLeft, treatSys.balloonGridRight };
		var bigPositiveUnbiased = new SpawnEntry[] { treatSys.balloonGridAll, treatSys.balloonGridCenter };

        var normalFoes = new SpawnEntry[] { foeSys.beardGame.beardGuy, foeSys.beardGame.beardGuy, foeSys.plantGame.plantGuy};
        //var normalFoes = new SpawnEntry[] { foeSys.dogGame.dog };

        //var normalFoeGames = new Subgame[] { foeSys.dogGame };
        var normalFoeGames = new Subgame[] { foeSys.beardGame };
        //var normalFoeGames = new Subgame[] { foeSys.plantGame };

        Func<SpawnEntry[], SpawnEntry> rs = choices => choices[rd.i(0, choices.Length)];

		Action<SpawnEntry[], int, int> addTwo = (choices, time, timeAdd) => {
			var id = rd.i(0, choices.Length);
			var id2 = (id + choices.Length / 2) % choices.Length;
			spawnSys.Add(time, choices[id]);
			spawnSys.Add(time + timeAdd, choices[id2]);};

		addTwo(smallPositive, 6, 6);
		spawnSys.Add(18, rs(smallPositiveUnbiased));

        //spawnSys.Add(foeOffset, rs(normalFoes));
        normalFoeGames[rd.i(0, normalFoeGames.Length)].Run(foeOffset, spawnSys);

        addTwo(smallPositive, 24, 6);

		addTwo(smallPositive, 46, 6);

		spawnSys.Add(foeOffset + foeTime, rs(normalFoes));

		spawnSys.Add(68, rs(smallPositiveUnbiased));

		spawnSys.Add(foeOffset + foeTime*2, rs(normalFoes));

		addTwo(smallPositive, 90, 6);

		spawnSys.Add(110, rs(bigPositiveUnbiased));

		spawnSys.Add(foeOffset + foeTime*3, rs(normalFoes));

		addTwo(bigPositive, 140, 6);

		addTwo(smallPositive, 160, 6);

		spawnSys.Add(foeOffset + foeTime*4, rs(normalFoes));

		addTwo(smallPositive, 190, 6);

		addTwo(smallPositive, 200 + 6, 6);
		spawnSys.Add(200 + 18, rs(smallPositiveUnbiased));

		spawnSys.Add(foeOffset + foeTime*5, rs(normalFoes));

		addTwo(smallPositive, 200 + 24, 6);

		addTwo(smallPositive, 200 + 46, 6);

		spawnSys.Add(foeOffset + foeTime*6, rs(normalFoes));

		spawnSys.Add(200 + 68, rs(smallPositiveUnbiased));

		spawnSys.Add(foeOffset + foeTime*7, rs(normalFoes));

		addTwo(smallPositive, 200 + 90, 6);

		spawnSys.Add(200 + 110, rs(bigPositiveUnbiased));

		spawnSys.Add(foeOffset + foeTime*8, rs(normalFoes));

		addTwo(bigPositive, 200 + 140, 6);

		addTwo(smallPositive, 200 + 160, 6);

		spawnSys.Add(foeOffset + foeTime*9, rs(normalFoes));

		addTwo(smallPositive, 200 + 190, 6);

		spawnSys.Sort();}}