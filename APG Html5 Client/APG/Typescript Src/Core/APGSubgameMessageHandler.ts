class APGSubgameMessageHandler {

	onJoin: () => boolean;

	timeUpdate: (round: number, time: number) => void;

	clientUpdate: () => void;

	startInputSubmission: () => void;

	getParmCount: () => number;

	getParm: (id: number) => number;

	constructor(fields?: { onJoin?: () => boolean, timeUpdate?: (round: number, time: number) => void, clientUpdate?: () => void, startSubmitInput?: () => void, getParmCount?: () => void, getParm?: (id: number) => void; }) {
		this.onJoin = () => false;
		this.timeUpdate = (round: number, time: number) => { };
		this.clientUpdate = () => { };
		this.startInputSubmission = () => { };
		this.getParmCount = () => 0;
		this.getParm = (id: number) => 0;
		if (fields) Object.assign(this, fields);
	}
}