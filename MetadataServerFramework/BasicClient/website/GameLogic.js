function CacheGameAssets(c) {
    c.images('assets', ['hudselect.png']);
}
var BasicGame = (function () {
    function BasicGame(apg) {
        var _this = this;
        this.highlighter = null;
        this.registerServerMessages(apg);
        if (apg.networkTestSequence) {
            this.runTestSequence(apg);
        }
        var lastClickDelay = 0;
        var ID = 0;
        var currentFrame = 0;
        this.highlighter = new Phaser.Sprite(apg.g, 0, 0, 'assets/hudselect.png');
        this.highlighter.blendMode = PIXI.blendModes.ADD;
        this.highlighter.anchor = new Phaser.Point(.5, .5);
        this.highlighter.scale = new Phaser.Point(1, 1);
        this.highlighter.update = function () {
            currentFrame++;
            _this.highlighter.x = (400 + 300 * Math.cos(currentFrame * .02 - ID * .2)) / 800 * 1024;
            _this.highlighter.y = (225 - 175 * Math.sin(currentFrame * .02 - ID * .2)) / 450 * 768;
            lastClickDelay--;
            if (apg.g.input.activePointer.isDown && lastClickDelay <= 0) {
                ID = (ID + 1) % 8;
                lastClickDelay = 20;
            }
        };
        apg.g.world.addChild(this.highlighter);
    }
    BasicGame.prototype.runTestSequence = function (apg) {
        apg.ClearLocalMessages();
        for (var k = 2; k < 60; k += 3) {
            apg.WriteLocalAsServer(k, "serverFirework", { ID: 0, x: Math.floor(50 + Math.random() * 750), y: Math.floor(50 + Math.random() * 350) });
        }
    };
    BasicGame.prototype.registerServerMessages = function (apg) {
        var that = this;
        function ServerFirework(data) {
            console.log("Got  Server Firework Message at point " + data.x + " " + data.y);
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