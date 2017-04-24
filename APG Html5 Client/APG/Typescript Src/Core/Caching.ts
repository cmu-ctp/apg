/*______________________________________________________________________________________________

															Asset Caching

______________________________________________________________________________________________*/

declare var WebFontConfig: Object;

var phaserAssetCacheList: { (loader: Phaser.Loader): void; }[];
var phaserImageList: string[];
var phaserSoundList: string[];

function cachePhaserAssets(cacheFunction: (loader: Phaser.Loader) => void): void {

	if (phaserAssetCacheList == undefined) {
		phaserAssetCacheList = [];
	}

	phaserAssetCacheList.push(cacheFunction);
}

function cacheImages(dir: string, imageList: string[]): void {
	if (phaserImageList == undefined) {
		phaserImageList = [];
	}

	for (var k = 0; k < imageList.length; k++) {
		phaserImageList.push(dir + "/" + imageList[k]);
	}
}

function cacheSounds( dir:string, soundList: string[]): void {
	if (phaserSoundList == undefined) {
		phaserSoundList = [];
	}

	for (var k = 0; k < soundList.length; k++) {
		phaserSoundList.push(dir+"/"+soundList[k]);
	}
}

// Phaser supports a number of font styles with different performance and ease-of-use characteristics.
// At present, for our prototypes, I am relying exclusively on google's own web fonts, which can be found here: https://fonts.google.com/
// 
var phaserGoogleWebFontList: string[];

function cacheGoogleWebFonts(googleWebFontNames: string[]): void {
	if (phaserGoogleWebFontList == undefined) {
		phaserGoogleWebFontList = [];
	}

	for (var k = 0; k < googleWebFontNames.length; k++) {
		phaserGoogleWebFontList.push(googleWebFontNames[k]);
	}
}

var jsonAssetCacheNameList: string[];

function cacheJSONs(fileNames:string[]): void {

	if (jsonAssetCacheNameList == undefined) {
		jsonAssetCacheNameList = [];
	}

	for (var k = 0; k < fileNames.length; k++) {
		jsonAssetCacheNameList.push(fileNames[k]);
	}
}