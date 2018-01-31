class AssetCacher implements Cacher {
	phaserAssetCacheList: { (loader: Phaser.Loader): void; }[] = [];
	phaserImageList: string[] = [];
	phaserSoundList: string[] = [];
	phaserGoogleWebFontList: string[] = [];
	jsonAssetCacheNameList: string[] = [];

    assets(cacheFunction: (loader: Phaser.Loader) => void): void {
        if (cacheFunction == null) {
            ConsoleOutput.debugWarn("AssetCacher.assets : bad caching function", "sys");
            return;
        }

		this.phaserAssetCacheList.push(cacheFunction);
	}

    images(dir: string, imageList: string[]): void {
        if (imageList == null || imageList.length < 1 ) {
            ConsoleOutput.debugWarn("AssetCacher.images : bad image list", "sys");
            return;
        }

		for (var k = 0; k < imageList.length; k++) {
			this.phaserImageList.push(dir + "/" + imageList[k]);
		}
	}

    sounds(dir: string, soundList: string[]): void {
        if ( soundList == null || soundList.length < 1 ) {
            ConsoleOutput.debugWarn("AssetCacher.sounds : bad sound list", "sys");
            return;
        }

		for (var k = 0; k < soundList.length; k++) {
			this.phaserSoundList.push(dir + "/" + soundList[k]);
		}
	}

	googleWebFonts(googleWebFontNames: string[]): void {

        if (googleWebFontNames == null || googleWebFontNames.length < 1 ) {
            ConsoleOutput.debugWarn("AssetCacher.googleWebFonts : bad font list", "sys");
            return;
        }

		for (var k = 0; k < googleWebFontNames.length; k++) {
			this.phaserGoogleWebFontList.push(googleWebFontNames[k]);
		}
	}

    json(fileNames: string[]): void {

        if (fileNames == null || fileNames.length < 1 ) {
            ConsoleOutput.debugWarn("AssetCacher.json : bad json asset list", "sys");
            return;
        }

		for (var k = 0; k < fileNames.length; k++) {
			this.jsonAssetCacheNameList.push(fileNames[k]);
		}
	}

	curJSONAsset = 0;
	JSONAssets = {};

	LoadJSONAsset( onLoadEnd:()=>void ) {
		if (this.curJSONAsset >= this.jsonAssetCacheNameList.length) {
			onLoadEnd();
			return;
		}
		$.getJSON(this.jsonAssetCacheNameList[this.curJSONAsset], data => {
			this.JSONAssets[this.jsonAssetCacheNameList[this.curJSONAsset]] = data.all;

			ConsoleOutput.logAsset(this.jsonAssetCacheNameList[this.curJSONAsset]);

			this.curJSONAsset++;

			this.LoadJSONAsset( onLoadEnd );
		});
	}

	Run(game: Phaser.Game ): void {
		if (this.phaserAssetCacheList.length == 0) {
			ConsoleOutput.debugWarn("ApgSetup: phaserAssetCacheList.length is 0, so no assets are being cached.  This is probably an error.", "sys");
		}

		for (var k = 0; k < this.phaserAssetCacheList.length; k++) {
			this.phaserAssetCacheList[k](game.load);
		}

		for (var k = 0; k < this.phaserImageList.length; k++) {
			game.load.image(this.phaserImageList[k], this.phaserImageList[k]);
		}

		for (var k = 0; k < this.phaserSoundList.length; k++) {
			game.load.audio(this.phaserSoundList[k], this.phaserSoundList[k]);
		}

		if (this.phaserGoogleWebFontList != undefined && this.phaserGoogleWebFontList.length > 0) {
			game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
		}

	}
}