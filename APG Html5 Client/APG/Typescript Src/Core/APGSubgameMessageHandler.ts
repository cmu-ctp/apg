/*
The APGSubgameMessageHandler is a set of functions that the networking system uses.
*/

class APGSubgameMessageHandler {

	onJoin: () => boolean;

	timeUpdate: (round: number, time: number) => void;

	startSubmitInput: () => void;
	getParmCount: () => number;
	getParm: (id: number) => number;

	inputs: any;

	constructor(fields?: { onJoin?: () => boolean, timeUpdate?: (round: number, time: number) => void, startSubmitInput?: () => void, getParmCount?: () => void, getParm?: (id: number) => void; }, inputs?:any ) {
		this.onJoin = () => false;

		this.timeUpdate = (round: number, time: number) => { };

		this.startSubmitInput = () => { };
		this.getParmCount = () => 0;
		this.getParm = (id: number) => 0;

		this.inputs = {};

		if (fields) Object.assign(this, fields);
	}
}