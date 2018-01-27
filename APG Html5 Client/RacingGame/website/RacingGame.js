var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var MetadataFullSys = (function () {
    function MetadataFullSys(url, onConnectionComplete, onConnectionFail) {
        this.currentFrame = 0;
        this.onUpdateFunc = null;
        onConnectionComplete();
        this.canvas = document.createElement("canvas");
        this.canvas.width = 100;
        this.canvas.height = 100;
        this.vid = undefined;
    }
    MetadataFullSys.prototype.SetVideoPlayer = function (player) {
        this.videoPlayer = player;
    };
    MetadataFullSys.prototype.Data = function (msgName) { return null; };
    MetadataFullSys.prototype.SetVideoStream = function () {
        var thePlayer = this.videoPlayer;
        if (thePlayer == undefined)
            return false;
        var bridge = thePlayer._bridge;
        if (bridge == undefined)
            return false;
        var iframe = bridge._iframe;
        if (iframe == undefined)
            return false;
        var doc = iframe.contentWindow.document;
        if (doc == undefined)
            return false;
        var elements = doc.getElementsByClassName("player-video");
        if (elements == undefined)
            return false;
        for (var j = 0; j < elements.length; j++) {
            var player = elements[j];
            if (player != undefined && player.children != null && player.children.length > 0) {
                for (var k = 0; k < player.children.length; k++) {
                    var inner = player.children[k];
                    if (inner.className == "js-ima-ads-container ima-ads-container")
                        continue;
                    this.vid = inner;
                }
            }
        }
        return true;
    };
    MetadataFullSys.prototype.Update = function () {
        if (this.vid == undefined) {
            this.SetVideoStream();
        }
        if (this.vid != undefined) {
            this.canvas.getContext('2d').drawImage(this.vid, 0, 0, this.canvas.width, this.canvas.height, 0, 0, 100, 100);
            var bx = 16, by = 12, sx = 18, sy = 18;
            var ctx = this.canvas.getContext('2d');
            var frameNumber = 0;
            for (var j = 0; j < 4; j++) {
                for (var k = 0; k < 4; k++) {
                    var pix = ctx.getImageData(bx + sx * j, by + sy * k, 1, 1).data[0];
                    if (pix > 127)
                        frameNumber |= 1 << (j + k * 4);
                }
            }
            console.log("" + frameNumber);
            this.frameNumber = frameNumber;
        }
        if (this.onUpdateFunc != null) {
            this.onUpdateFunc(this);
        }
    };
    return MetadataFullSys;
}());
if (typeof Object.assign != 'function') {
    (function () {
        Object.assign = function (target) {
            'use strict';
            if (target === undefined || target === null) {
                throw new TypeError('Cannot convert undefined or null to object');
            }
            var output = Object(target);
            for (var index = 1; index < arguments.length; index++) {
                var source = arguments[index];
                if (source !== undefined && source !== null)
                    for (var nextKey in source)
                        if (source.hasOwnProperty(nextKey))
                            output[nextKey] = source[nextKey];
            }
            return output;
        };
    })();
}
var ent = (function (_super) {
    __extends(ent, _super);
    function ent(t, x, y, key, fields) {
        var _this = _super.call(this, t.game, x, y, key) || this;
        _this.upd = null;
        if (fields)
            Object.assign(_this, fields);
        _this.exists = true;
        _this.visible = true;
        _this.alive = true;
        _this.z = t.children.length;
        t.addChild(_this);
        if (t.enableBody) {
            t.game.physics.enable(_this, t.physicsBodyType, t.enableBodyDebug);
        }
        if (t.cursor === null) {
            t.cursor = _this;
        }
        return _this;
    }
    ent.prototype.update = function () { if (this.upd != null)
        this.upd(this); };
    Object.defineProperty(ent.prototype, "scalex", {
        set: function (value) { this.scale.x = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ent.prototype, "scaley", {
        set: function (value) { this.scale.y = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ent.prototype, "anchorx", {
        set: function (value) { this.anchor.x = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ent.prototype, "anchory", {
        set: function (value) { this.anchor.y = value; },
        enumerable: true,
        configurable: true
    });
    ent.prototype.ix = function (value, speed) { this.x = this.x * (1 - speed) + speed * value; return this; };
    ent.prototype.iy = function (value, speed) { this.y = this.y * (1 - speed) + speed * value; return this; };
    ent.prototype.ixy = function (x, y, speed) { this.x = this.x * (1 - speed) + speed * x; this.y = this.y * (1 - speed) + speed * y; return this; };
    ent.prototype.iscaley = function (value, speed) { this.scale.y = this.scale.y * (1 - speed) + speed * value; return this; };
    ent.prototype.ialpha = function (value, speed) { this.alpha = this.alpha * (1 - speed) + speed * value; return this; };
    ent.prototype.irotation = function (value, speed) { this.rotation = this.rotation * (1 - speed) + speed * value; return this; };
    Object.defineProperty(ent.prototype, "tex", {
        set: function (value) { this.loadTexture(value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ent.prototype, "src", {
        set: function (value) { value.addChild(this); },
        enumerable: true,
        configurable: true
    });
    return ent;
}(Phaser.Sprite));
var enttx = (function (_super) {
    __extends(enttx, _super);
    function enttx(t, x, y, text, style, fields) {
        var _this = _super.call(this, t.game, x, y, text, style) || this;
        _this.upd = null;
        if (fields)
            Object.assign(_this, fields);
        _this.exists = true;
        _this.visible = true;
        _this.alive = true;
        _this.z = t.children.length;
        t.addChild(_this);
        if (t.enableBody) {
            t.game.physics.enable(_this, t.physicsBodyType, t.enableBodyDebug);
        }
        if (t.cursor === null) {
            t.cursor = _this;
        }
        return _this;
    }
    enttx.prototype.update = function () { if (this.upd != null)
        this.upd(this); };
    Object.defineProperty(enttx.prototype, "scx", {
        set: function (value) { this.scale.x = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(enttx.prototype, "scy", {
        set: function (value) { this.scale.y = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(enttx.prototype, "anchorx", {
        set: function (value) { this.anchor.x = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(enttx.prototype, "anchory", {
        set: function (value) { this.anchor.y = value; },
        enumerable: true,
        configurable: true
    });
    enttx.prototype.ix = function (value, speed) { this.x = this.x * (1 - speed) + speed * value; return this; };
    enttx.prototype.iy = function (value, speed) { this.y = this.y * (1 - speed) + speed * value; return this; };
    enttx.prototype.ixy = function (x, y, speed) { this.x = this.x * (1 - speed) + speed * x; this.y = this.y * (1 - speed) + speed * y; return this; };
    enttx.prototype.iscx = function (value, speed) { this.scale.x = this.scale.x * (1 - speed) + speed * value; return this; };
    enttx.prototype.iscy = function (value, speed) { this.scale.y = this.scale.y * (1 - speed) + speed * value; return this; };
    enttx.prototype.ial = function (value, speed) { this.alpha = this.alpha * (1 - speed) + speed * value; return this; };
    enttx.prototype.irot = function (value, speed) { this.rotation = this.rotation * (1 - speed) + speed * value; return this; };
    Object.defineProperty(enttx.prototype, "src", {
        set: function (value) { value.addChild(this); },
        enumerable: true,
        configurable: true
    });
    return enttx;
}(Phaser.Text));
var carParts;
function CacheRacingGame(c) {
    c.assets(function (l) {
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
var RacingGame = (function () {
    function RacingGame(apg) {
        var _this = this;
        this.myPart = null;
        this.pitstopID = 0;
        this.timer = 0;
        this.choices = [1, 1, 1, 1, 1, 1];
        this.roundNumber = 1;
        this.myPitstop = { pitStopID: 0, part1: "", part2: "", part3: "" };
        this.haveJoined = false;
        this.tryingToJoin = false;
        this.haveStarted = false;
        this.curPlayerChoice = 1;
        this.mySpot = -1;
        var PlayerChoice;
        (function (PlayerChoice) {
            PlayerChoice[PlayerChoice["bodyHood"] = 0] = "bodyHood";
            PlayerChoice[PlayerChoice["bodySide"] = 1] = "bodySide";
            PlayerChoice[PlayerChoice["bodyTrunk"] = 2] = "bodyTrunk";
            PlayerChoice[PlayerChoice["defense"] = 3] = "defense";
            PlayerChoice[PlayerChoice["nitro"] = 4] = "nitro";
            PlayerChoice[PlayerChoice["offense"] = 5] = "offense";
            PlayerChoice[PlayerChoice["case"] = 6] = "case";
            PlayerChoice[PlayerChoice["pistons"] = 7] = "pistons";
            PlayerChoice[PlayerChoice["plugs"] = 8] = "plugs";
            PlayerChoice[PlayerChoice["airfreshner"] = 9] = "airfreshner";
            PlayerChoice[PlayerChoice["seat"] = 10] = "seat";
            PlayerChoice[PlayerChoice["steering"] = 11] = "steering";
            PlayerChoice[PlayerChoice["tireBolts"] = 12] = "tireBolts";
            PlayerChoice[PlayerChoice["tireBrand"] = 13] = "tireBrand";
            PlayerChoice[PlayerChoice["tire"] = 14] = "tire";
        })(PlayerChoice || (PlayerChoice = {}));
        var endOfRoundSound = apg.g.add.audio('cartoongame/snds/fx/strokeup4.mp3', 1, false);
        this.warningSound = apg.g.add.audio('cartoongame/snds/fx/strokeup.mp3', 1, false);
        var tick = 0, choiceLeft = 50, choiceUp = 118;
        var lastRoundUpdate = 0;
        this.makeHandlers(apg);
        var sc = 1.5;
        var inputUsed = false;
        var joinTimer = 0;
        var tc = 0;
        var bkg = new ent(apg.g.world, 0, 0, 'racinggame/audienceInterfaceBG.png', {
            scalex: sc, scaley: sc,
            upd: function (e) {
                if (!_this.haveJoined) {
                    if (!_this.tryingToJoin) {
                        if (apg.g.input.activePointer.isDown == true) {
                            _this.tryingToJoin = true;
                            _this.joinText.text = "Asking to join Streamer's game - wait for a resposne";
                            apg.WriteToServer("join", {});
                        }
                    }
                    else {
                        joinTimer++;
                        if (joinTimer > 60 * 5 * 4) {
                            _this.tryingToJoin = false;
                            _this.joinText.text = "Trouble joining Streamer's game.  Tap to try again.";
                        }
                        else if (joinTimer % (60 * 5) == 0) {
                            apg.WriteToServer("join", {});
                        }
                    }
                    return;
                }
                if (apg.g.input.activePointer.isDown == false)
                    inputUsed = false;
                if (apg.g.input.activePointer.isDown == true) {
                    if (!inputUsed) {
                        if (apg.g.input.x > 237 && apg.g.input.x < 285 && apg.g.input.y > 54 && apg.g.input.y < 103) {
                            if (_this.curPlayerChoice != 1)
                                apg.WriteToServer("select", { pitstopID: _this.pitstopID, partID: _this.mySpot, currentPart: 0 });
                            _this.myPart.loadTexture(carParts[_this.pitstopID][_this.mySpot][0]);
                            _this.curPlayerChoice = 1;
                            _this.select1.alpha = 1;
                            _this.select2.alpha = .5;
                            _this.select3.alpha = .5;
                        }
                        if (apg.g.input.x > 237 && apg.g.input.x < 285 && apg.g.input.y > 138 && apg.g.input.y < 187) {
                            if (_this.curPlayerChoice != 2)
                                apg.WriteToServer("select", { pitstopID: _this.pitstopID, partID: _this.mySpot, currentPart: 1 });
                            _this.myPart.loadTexture(carParts[_this.pitstopID][_this.mySpot][1]);
                            _this.curPlayerChoice = 2;
                            _this.select1.alpha = .5;
                            _this.select2.alpha = 1;
                            _this.select3.alpha = .5;
                        }
                        if (apg.g.input.x > 237 && apg.g.input.x < 285 && apg.g.input.y > 225 && apg.g.input.y < 276) {
                            if (_this.curPlayerChoice != 3)
                                apg.WriteToServer("select", { pitstopID: _this.pitstopID, partID: _this.mySpot, currentPart: 2 });
                            _this.myPart.loadTexture(carParts[_this.pitstopID][_this.mySpot][2]);
                            _this.curPlayerChoice = 3;
                            _this.select1.alpha = .5;
                            _this.select2.alpha = .5;
                            _this.select3.alpha = 1;
                        }
                    }
                    inputUsed = true;
                }
            }
        });
        this.addArt(apg, sc);
    }
    RacingGame.prototype.addArt = function (apg, sc) {
        var statNames = ["Fuel Cap", "Speed Cap", "Weight", "Suaveness", "Power"];
        function fnt(sz) {
            sz *= sc;
            return '' + sz + 'px Anton';
        }
        var w = apg.g.world;
        new enttx(w, sc * 10, sc * 10, "CAR PERFORMANCE", { font: fnt(20), fill: '#fff' });
        for (var k = 0; k < 5; k++) {
            new enttx(w, sc * 10, sc * (48 + (72 - 48) * k), statNames[k] + ":", { font: fnt(16), fill: '#fff' });
        }
        this.categoryLabel1 = new enttx(w, sc * 12, sc * 228, "CASING TECH", { font: fnt(18), fill: '#fff' });
        this.categoryLabel2 = new enttx(w, sc * 15, sc * 250, "Piston Tech:", { font: fnt(14), fill: '#fff' });
        this.categoryLabel3 = new enttx(w, sc * 15, sc * 265, "Sparkplug Tech:", { font: fnt(14), fill: '#fff' });
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
    };
    RacingGame.prototype.makeHandlers = function (apg) {
        var that = this;
        function JoinAcknowledge(joinInfo) {
            if (joinInfo.user == apg.playerName) {
                if (that.haveJoined == false) {
                    that.joinText.text = "Joined Streamer's game!  Waiting for game to start...";
                    that.haveJoined = true;
                }
            }
        }
        function Team(teamInfo) {
            if (that.mySpot != -1)
                return;
            if (teamInfo.part1 == apg.playerName)
                that.mySpot = 0;
            if (teamInfo.part2 == apg.playerName)
                that.mySpot = 1;
            if (teamInfo.part3 == apg.playerName)
                that.mySpot = 2;
            if (that.mySpot == -1)
                return;
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
        function PlayerChoice(user, partInfo) {
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
        apg.Register("joinawk", JoinAcknowledge);
        apg.Register("team", Team);
        apg.RegisterPeer("select", PlayerChoice);
    };
    return RacingGame;
}());
function RacingInput(apg) {
    new RacingGame(apg);
}
//# sourceMappingURL=RacingGame.js.map