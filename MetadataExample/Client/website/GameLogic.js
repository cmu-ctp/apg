function CacheGameAssets(c) {
    c.images('assets', ['hudselect.png', 'blueorb.png', 'background.png']);
    c.sounds('assets', ['click.mp3']);
}
function InitializeGame(apg) {
    var metadataInfo = null;
    apg.ResetServerMessageRegistry();
    apg.Register("firework", function (p) {
        metadataInfo = p;
    });
    var lastClickDelay = 0;
    var ID = 0;
    var clickSound = apg.g.add.audio('assets/click.mp3', .4, false);
    var background = new Phaser.Sprite(apg.g, -640, -320, 'assets/background.png');
    apg.g.world.addChild(background);
    var highlighter = new Phaser.Sprite(apg.g, 0, 0, 'assets/blueorb.png');
    highlighter.blendMode = PIXI.blendModes.ADD;
    highlighter.anchor = new Phaser.Point(.5, .5);
    highlighter.scale = new Phaser.Point(1, 1);
    highlighter.update = function () {
        lastClickDelay--;
        if (metadataInfo != null) {
            var selected = false;
            var curSelected = -1;
            for (var k = 0; k < metadataInfo.items.length; k++) {
                var x = metadataInfo.items[k].x * 1024 / 10000;
                var y = (1 - metadataInfo.items[k].y / 10000) * (768 - 96 - 96);
                if (Math.abs(apg.g.input.activePointer.x - x) < 48 && Math.abs(apg.g.input.activePointer.y - y) < 48) {
                    curSelected = k;
                    highlighter.x = x;
                    highlighter.y = y;
                    highlighter.visible = true;
                    selected = true;
                }
            }
            if (!selected) {
                highlighter.visible = false;
                if (apg.g.input.activePointer.isDown && lastClickDelay <= 0) {
                    ID = -1;
                    lastClickDelay = 20;
                }
            }
            else {
                if (apg.g.input.activePointer.isDown && lastClickDelay <= 0) {
                    ID = curSelected;
                    clickSound.play();
                    lastClickDelay = 20;
                }
            }
        }
    };
    apg.g.world.addChild(highlighter);
    var selector = new Phaser.Sprite(apg.g, 0, 0, 'assets/hudselect.png');
    selector.blendMode = PIXI.blendModes.ADD;
    selector.anchor = new Phaser.Point(.5, .5);
    selector.scale = new Phaser.Point(1, 1);
    selector.update = function () {
        if (ID == -1) {
            selector.visible = false;
        }
        else if (metadataInfo != null && metadataInfo != undefined) {
            selector.visible = true;
            selector.x = metadataInfo.items[ID].x * 1024 / 10000;
            selector.y = (1 - metadataInfo.items[ID].y / 10000) * (768 - 96 - 96);
        }
        else {
            selector.visible = false;
        }
    };
    apg.g.world.addChild(selector);
    var label = new Phaser.Text(apg.g, 20, 20, "", { font: '16px Caveat Brush', fill: '#112' });
    label.update = function () {
        if (ID == -1) {
            label.visible = false;
        }
        else if (metadataInfo != null && metadataInfo != undefined) {
            label.visible = true;
            label.text = "ID: " + ID + "\nScale " + Math.floor(metadataInfo.items[ID].scale / 10000 * 48);
        }
        else {
            label.visible = false;
        }
    };
    apg.g.world.addChild(label);
}
//# sourceMappingURL=GameLogic.js.map