function CacheGameAssets(c) {
    c.images('assets', ['night.jpg', 'firework.png']);
    c.sounds('assets', ['boom.mp3']);
    c.googleWebFonts(['Anton']);
}
var BasicGame = (function () {
    function BasicGame(apg) {
        var _this = this;
        this.fireworkPic = null;
        this.boomSound = null;
        this.registerServerMessages(apg);
        if (apg.networkTestSequence) {
            this.runTestSequence(apg);
        }
        this.boomSound = apg.g.add.audio('assets/boom.mp3', 1, false);
        var lastClickDelay = 0;
        var background = new Phaser.Sprite(apg.g, 0, 0, 'assets/night.jpg');
        background.update = function () {
            lastClickDelay--;
            if (apg.g.input.activePointer.isDown && lastClickDelay <= 0) {
                lastClickDelay = 120;
                var data = { x: apg.g.input.activePointer.x, y: apg.g.input.activePointer.y };
                apg.WriteToServer("clientFirework", data);
                console.log("Writing client firework message at point " + data.x + " " + data.y);
            }
        };
        apg.g.world.addChild(background);
        this.fireworkPic = new Phaser.Sprite(apg.g, 0, 0, 'assets/firework.png');
        this.fireworkPic.blendMode = PIXI.blendModes.ADD;
        this.fireworkPic.anchor = new Phaser.Point(.5, .5);
        this.fireworkPic.scale = new Phaser.Point(1, 1);
        this.fireworkPic.update = function () {
            _this.fireworkPic.scale.x *= .7;
            _this.fireworkPic.scale.y *= .7;
        };
        apg.g.world.addChild(this.fireworkPic);
    }
    BasicGame.prototype.runTestSequence = function (apg) {
        apg.ClearLocalMessages();
        for (var k = 2; k < 60; k += 3) {
            apg.WriteLocalAsServer(k, "serverFirework", { x: Math.floor(50 + Math.random() * 750), y: Math.floor(50 + Math.random() * 350) });
        }
    };
    BasicGame.prototype.registerServerMessages = function (apg) {
        var that = this;
        function ServerFirework(data) {
            console.log("Got  Server Firework Message at point " + data.x + " " + data.y);
            that.fireworkPic.x = data.x;
            that.fireworkPic.y = data.y;
            that.fireworkPic.scale = new Phaser.Point(1, 1);
            that.boomSound.play();
        }
        apg.ResetServerMessageRegistry();
        apg.Register("serverFirework", ServerFirework);
    };
    return BasicGame;
}());
function InitializeGame(apg) {
    new BasicGame(apg);
}
//# sourceMappingURL=GameLogic.js.map