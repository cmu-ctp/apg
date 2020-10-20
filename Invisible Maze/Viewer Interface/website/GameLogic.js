var APGHelper = (function () {
    function APGHelper() {
    }
    APGHelper.ScreenX = function (val) { return val / 10000 * 1024; };
    APGHelper.ScreenY = function (val) { return (1 - val / 10000) * (768 - 96 - 96); };
    return APGHelper;
}());
function CacheGameAssets(c) {
    c.images('assets', ['hudselect.png', 'blueorb.png', 'background.png']);
    c.sounds('assets', ['click.mp3']);
}
function InitializeGame(apg) {
    var phaserGameWorld = apg.w;
    var metadataForFrame = null;
    var lastClickDelay = 0;
    var fireflyID = 0;
    var clickSound = apg.g.add.audio('assets/click.mp3', .4, false);
    apg.ResetServerMessageRegistry();
    apg.Register("fireflies", function (updatedMetadataForNewFrame) {
        metadataForFrame = updatedMetadataForNewFrame;
    });
    var fireflyMouseHighlight = new Phaser.Sprite(apg.g, 0, 0, 'assets/blueorb.png');
    fireflyMouseHighlight.blendMode = PIXI.blendModes.ADD;
    fireflyMouseHighlight.anchor = new Phaser.Point(.5, .5);
    fireflyMouseHighlight.scale = new Phaser.Point(1, 1);
    fireflyMouseHighlight.update = function () {
        lastClickDelay--;
        if (metadataForFrame != null) {
            var overAFirefly = false;
            var fireflyIndex = -1;
            for (var k = 0; k < metadataForFrame.items.length; k++) {
                var x = APGHelper.ScreenX(metadataForFrame.items[k].x);
                var y = APGHelper.ScreenY(metadataForFrame.items[k].y);
                if (Math.abs(apg.g.input.activePointer.x - x) < 48 && Math.abs(apg.g.input.activePointer.y - y) < 48) {
                    fireflyIndex = k;
                    overAFirefly = true;
                    fireflyMouseHighlight.x = x;
                    fireflyMouseHighlight.y = y;
                    fireflyMouseHighlight.visible = true;
                }
            }
            if (!overAFirefly) {
                fireflyMouseHighlight.visible = false;
                if (apg.g.input.activePointer.isDown && lastClickDelay <= 0) {
                    fireflyID = -1;
                    lastClickDelay = 20;
                }
            }
            else {
                if (apg.g.input.activePointer.isDown && lastClickDelay <= 0) {
                    fireflyID = fireflyIndex;
                    clickSound.play();
                    lastClickDelay = 20;
                }
            }
        }
    };
    phaserGameWorld.addChild(fireflyMouseHighlight);
    var fireflyTargetGraphic = new Phaser.Sprite(apg.g, 0, 0, 'assets/hudselect.png');
    fireflyTargetGraphic.blendMode = PIXI.blendModes.ADD;
    fireflyTargetGraphic.anchor = new Phaser.Point(.5, .5);
    fireflyTargetGraphic.scale = new Phaser.Point(1, 1);
    fireflyTargetGraphic.update = function () {
        if (fireflyID != -1 && metadataForFrame != null && metadataForFrame != undefined) {
            fireflyTargetGraphic.visible = true;
            fireflyTargetGraphic.x = APGHelper.ScreenX(metadataForFrame.items[fireflyID].x);
            fireflyTargetGraphic.y = APGHelper.ScreenY(metadataForFrame.items[fireflyID].y);
        }
        else
            fireflyTargetGraphic.visible = false;
    };
    phaserGameWorld.addChild(fireflyTargetGraphic);
    var backgroundCoveringBinaryEncoding = new Phaser.Sprite(apg.g, -640, -320, 'assets/background.png');
    phaserGameWorld.addChild(backgroundCoveringBinaryEncoding);
    var fireflyStatsText = new Phaser.Text(apg.g, 20, 10, "", { font: '16px Caveat Brush', fill: '#112' });
    fireflyStatsText.update = function () {
        if (fireflyID != -1 && metadataForFrame != null && metadataForFrame != undefined) {
            fireflyStatsText.visible = true;
            fireflyStatsText.text = "ID: " + fireflyID + "\nScale " + Math.floor(metadataForFrame.items[fireflyID].scale / 10000 * 48);
        }
        else
            fireflyStatsText.visible = false;
    };
    phaserGameWorld.addChild(fireflyStatsText);
}
//# sourceMappingURL=GameLogic.js.map