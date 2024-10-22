﻿var carParts;

function CacheRacingGame(c: Cacher): void {
	c.assets(l => {
		var assetSets = ["bodyHood", "bodySide", "bodyTrunk", "defense", "nitro", "offense", "case", "pistons", "plugs", "airfreshner", "seat", "steering", "tireBolts", "tireBrand", "tire"];

		carParts = [];
		for (var k = 0; k < 5; k++) {
			carParts.push([]);
			for (var j = 0; j < 3; j++) {
				carParts[k].push([]);
			}
		}

		for (var k = 0; k < assetSets.length; k++) {
			for (var j = 1; j < 4; j++) {
				var s = "carPart_" + k + "_" + j;
				l.image(s, "racinggame/" + assetSets[k] + j + ".png");
				carParts[Math.floor(k / 3)][k % 3].push(s);
			}
		}
	});

	c.images('racinggame', ['audienceInterfaceBG.png', 'selected.png', 'unselected.png']);
	c.sounds('cartoongame/snds/fx', ['strokeup2.mp3', 'strokeup.mp3', 'strokeup4.mp3']);
	c.googleWebFonts(['Anton']);
}


// "join"
interface JoinParms {
}

interface TeamInfo{
	pitStopID:number;
    part1:string;
	part2: string;
	part3: string;
}

// "part"
interface ChosenPart {
	pitstopID: number;
	partID: number;
	currentPart: number;
}

//"joinawk"
interface JoinAwk
{
	msg: string;
	user: string;
}

// make messages from server get handled

class RacingGame {

	select1: ent;
	select2: ent;
	select3: ent;

	baseEnt: ent;

	allInput: ent;

	addArt(apg: APGSys, sc:number): void {

		var statNames = ["Fuel Cap", "Speed Cap", "Weight", "Suaveness", "Power"];

		// ______________________

		function fnt(sz: number): string {
			sz *= sc;
			return '' + sz + 'px Anton';
		}

		var w = apg.g.world;

		new enttx(w, sc * 10, sc * 10, "CAR PERFORMANCE", { font: fnt(20), fill: '#fff' });

		for (var k = 0; k < 5; k++) {
			new enttx(w, sc * 10, sc * (48 + (72 - 48) * k), statNames[k] + ":", { font: fnt(16), fill: '#fff' });
		}

		// ______________________

		this.categoryLabel1 = new enttx(w, sc * 12, sc * 228, "CASING TECH", { font: fnt(18), fill: '#fff' });

		this.categoryLabel2 = new enttx(w, sc * 15, sc * 250, "Piston Tech:", { font: fnt(14), fill: '#fff' });
		this.categoryLabel3 = new enttx(w, sc * 15, sc * 265, "Sparkplug Tech:", { font: fnt(14), fill: '#fff' });

		// ______________________

		new enttx(w, sc * 152, sc * 10, "OPTIONS", { font: fnt(20), fill: '#fff' });

		this.select1 = new ent(w, sc * 158, sc * 36, "racinggame/selected.png", { alpha: 1 });
		this.select2 = new ent(w, sc * 158, sc * 92, "racinggame/unselected.png", { alpha: .5 });
		this.select3 = new ent(w, sc * 158, sc * 150, "racinggame/unselected.png", { alpha: .5 });

		this.partLabel1 = new enttx(w, sc * 158, sc * 36, "Featherwate", { font: fnt(16), fill: '#0' });
		this.partLabel2 = new enttx(w, sc * 158, sc * 92, "Unguzzler", { font: fnt(16), fill: '#0' });
		this.partLabel3 = new enttx(w, sc * 158, sc * 150, "Hulkite", { font: fnt(16), fill: '#0' });

		var picChangeTick = 0;
		var picFrame = 0;

		this.carPart1 = new ent(w, sc * 220, sc * 40, carParts[this.pitstopID][0][0], { scalex: sc * .4, scaley: sc * .4 });
		this.carPart2 = new ent(w, sc * 220, sc * 40, carParts[this.pitstopID][1][0], { scalex: sc * .4, scaley: sc * .4 });
		this.carPart3 = new ent(w, sc * 220, sc * 40, carParts[this.pitstopID][2][0], { scalex: sc * .4, scaley: sc * .4 });

		this.myPart = this.carPart1;

		new enttx(w, sc * 220, sc * 178, "-1 Weight, +1 Power", { font: fnt(24), fill: '#fff' });

		this.joinBkg = new ent(w, 0, 0, "racinggame/selected.png", { alpha: 1, scalex: sc * 10, scaley: sc * 10 });

		this.joinText = new enttx(w, sc * 40, sc * 178, "Tap Anywhere to Join Game", { font: fnt(18), fill: '#0' });
	}

	categoryLabel1: enttx;
	categoryLabel2: enttx;
	categoryLabel3: enttx;

	joinBkg: ent;
	joinText: enttx;

	partLabel1: enttx;
	partLabel2: enttx;
	partLabel3: enttx;

	carPart1: ent;
	carPart2: ent;
	carPart3: ent;

	myPart: ent = null;

	pitstopID: number = 0;
	timer: number = 0;
	choices: number[] = [1, 1, 1, 1, 1, 1];
	roundNumber: number = 1;
	warningSound: Phaser.Sound;

	myPitstop: TeamInfo = { pitStopID: 0, part1:"", part2:"", part3:"" };

	haveJoined: boolean = false;
	tryingToJoin: boolean = false;
	haveStarted: boolean = false;

	curPlayerChoice: number = 1;

	mySpot = -1;

	makeHandlers(apg: APGSys): void {
		var that = this;

		function JoinAcknowledge(joinInfo: JoinAwk): void {
			if (joinInfo.user == apg.playerName) {
				if (that.haveJoined == false) {
					that.joinText.text = "Joined Streamer's game!  Waiting for game to start...";
					that.haveJoined = true;
				}
			}
		}
		function Team(teamInfo: TeamInfo): void {
			if (that.mySpot != -1) return;

			if (teamInfo.part1 == apg.playerName) that.mySpot = 0;
			if (teamInfo.part2 == apg.playerName) that.mySpot = 1;
			if (teamInfo.part3 == apg.playerName) that.mySpot = 2;

			if (that.mySpot == -1) return;

			if (!that.haveStarted) {
				that.haveStarted = true;
				that.joinText.destroy();
				that.joinBkg.destroy();
				that.joinText = null;
				that.joinBkg = null;
			}
			that.myPitstop = teamInfo;
			that.pitstopID = teamInfo.pitStopID;

			that.carPart1.loadTexture(carParts[that.pitstopID][0][0]);
			that.carPart2.loadTexture(carParts[that.pitstopID][1][0]);
			that.carPart3.loadTexture(carParts[that.pitstopID][2][0]);

			that.categoryLabel1.text = "Casing Tech: " + teamInfo.part1;
			that.categoryLabel2.text = "Piston Tech: " + teamInfo.part2;
			that.categoryLabel3.text = "Sparkplug Tech: " + teamInfo.part3;

			if (that.mySpot == 0) {
				that.categoryLabel1.text = "CASING TECH: " + teamInfo.part1;
				that.myPart = that.carPart1;
			}
			if (that.mySpot == 1) {
				that.categoryLabel2.text = "PISTON TECH: " + teamInfo.part2;
				that.myPart = that.carPart2;
			}
			if (that.mySpot == 2) {
				that.categoryLabel3.text = "SPARKPLUG TECH: " + teamInfo.part3;
				that.myPart = that.carPart3;
			}
		}
		function PlayerChoice(user: string, partInfo: ChosenPart): void {
			if (partInfo.pitstopID == that.pitstopID) {
				if (partInfo.partID == 0) {
					that.carPart1.loadTexture(carParts[that.pitstopID][0][partInfo.currentPart]);
				}
				if (partInfo.partID == 1) {
					that.carPart2.loadTexture(carParts[that.pitstopID][1][partInfo.currentPart]);
				}
				if (partInfo.partID == 2) {
					that.carPart3.loadTexture(carParts[that.pitstopID][2][partInfo.currentPart]);
				}
			}
		}

		apg.ResetServerMessageRegistry();
		// also handle join acknowledge
		apg.Register<JoinAwk>("joinawk", JoinAcknowledge);
		apg.Register<TeamInfo>("team", Team);
		apg.RegisterPeer<ChosenPart>("select", PlayerChoice);
	}

	constructor(apg: APGSys) {
		enum PlayerChoice {
			bodyHood = 0, bodySide, bodyTrunk, defense, nitro, offense, case, pistons, plugs, airfreshner, seat, steering, tireBolts, tireBrand, tire
		}

		var endOfRoundSound: Phaser.Sound = apg.g.add.audio('cartoongame/snds/fx/strokeup4.mp3', 1, false);
		this.warningSound = apg.g.add.audio('cartoongame/snds/fx/strokeup.mp3', 1, false);

		var tick: number = 0, choiceLeft: number = 50, choiceUp: number = 118;
		var lastRoundUpdate: number = 0;

		this.makeHandlers( apg );

		var sc: number = 1.5;

		var inputUsed = false;

		var joinTimer:number = 0;

		var tc: number = 0;

		var bkg: ent = new ent(apg.g.world, 0, 0, 'racinggame/audienceInterfaceBG.png', {
			scalex: sc, scaley: sc,
			upd: e => {

				/*tc++;
				if (tc == 60) {
					apg.WriteLocalAsServer<JoinAwk>( 0, "joinawk", { msg: "", user: apg.playerName });
				}
				if (tc == 62) {
					apg.WriteLocalAsServer<TeamInfo>(0, "team", { pitStopID: 1, part1: apg.playerName, part2: "Fireface", part3: "wex3l" });
				}
				if (tc > 90 && (tc % 120 == 0)) {
					apg.WriteLocal<ChosenPart>( 0, "Fireface", "select", { pitstopID: this.pitstopID, partID: 1, currentPart: Math.floor( Math.random()*3) });
				}
				if (tc > 90 && (tc % 120 == 60)) {
					apg.WriteLocal<ChosenPart>( 0, "wex3l", "select", { pitstopID: this.pitstopID, partID: 2, currentPart: Math.floor(Math.random() * 3) });
				}*/

				if (!this.haveJoined) {
					if (!this.tryingToJoin) {
						if (apg.g.input.activePointer.isDown == true) {
							this.tryingToJoin = true;
							this.joinText.text = "Asking to join Streamer's game - wait for a resposne";
							apg.WriteToServer<JoinParms>("join", {});
						}
					}
					else {
						joinTimer++;
						if (joinTimer > 60 * 5 * 4) {
							this.tryingToJoin = false;
							this.joinText.text = "Trouble joining Streamer's game.  Tap to try again.";
						}
						else if (joinTimer % (60 * 5) == 0) {
							apg.WriteToServer<JoinParms>("join", {});
						}
					}
					return;
				}

				if (apg.g.input.activePointer.isDown == false) inputUsed = false;

				if (apg.g.input.activePointer.isDown == true) {
					if (!inputUsed) {
						if (apg.g.input.x > 237 && apg.g.input.x < 285 && apg.g.input.y > 54 && apg.g.input.y < 103) {
							if (this.curPlayerChoice != 1) apg.WriteToServer<ChosenPart>("select", { pitstopID: this.pitstopID, partID: this.mySpot, currentPart: 0 });

							this.myPart.loadTexture(carParts[this.pitstopID][this.mySpot][0]);

							this.curPlayerChoice = 1;
							this.select1.alpha = 1;
							this.select2.alpha = .5;
							this.select3.alpha = .5;
						}
						if (apg.g.input.x > 237 && apg.g.input.x < 285 && apg.g.input.y > 138 && apg.g.input.y < 187) {
							if (this.curPlayerChoice != 2) apg.WriteToServer<ChosenPart>("select", { pitstopID: this.pitstopID, partID: this.mySpot, currentPart: 1 });

							this.myPart.loadTexture(carParts[this.pitstopID][this.mySpot][1]);

							this.curPlayerChoice = 2;
							this.select1.alpha = .5;
							this.select2.alpha = 1;
							this.select3.alpha = .5;
						}
						if (apg.g.input.x > 237 && apg.g.input.x < 285 && apg.g.input.y > 225 && apg.g.input.y < 276) {
							if (this.curPlayerChoice != 3) apg.WriteToServer<ChosenPart>("select", { pitstopID: this.pitstopID, partID: this.mySpot, currentPart: 2 });

							this.myPart.loadTexture(carParts[this.pitstopID][this.mySpot][2]);

							this.curPlayerChoice = 3;
							this.select1.alpha = .5;
							this.select2.alpha = .5;
							this.select3.alpha = 1;
						}
					}
					inputUsed = true;
				}
			}
		});

		this.addArt( apg, sc );
	}
}

function RacingInput(apg: APGSys): void {
	new RacingGame( apg );
}