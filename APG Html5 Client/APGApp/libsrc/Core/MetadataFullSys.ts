// This system gets data whenever and however it does.
// During Update, it possibly advances the frame number.
// Add an onUpdate callback.
// And then there needs to be a way to get specific data.
// 

class MetadataFullSys {

	currentFrame: number = 0;



	onUpdateFunc: (metadataSys: MetadataFullSys) => void = null;

	constructor(url: string, onConnectionComplete: () => void, onConnectionFail: (string) => void) {

		onConnectionComplete();

	}

	public Data<T>(msgName: string): T { return null; }

	public Update(): void {
		if (this.onUpdateFunc != null) {
			this.onUpdateFunc(this);
		}
	}
}