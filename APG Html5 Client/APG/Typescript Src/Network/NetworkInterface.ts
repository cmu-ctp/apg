interface tmiClient {
	// These functions are actually returning promises.  Not sure how to express that in TS's type system.
	connect(): any;
	say(channel: string, message: string): any;
	on(evt: string, exec: Function): any;
}
interface tmiIFace { client(options: Object): void; }
declare var tmi: tmiIFace;

interface NetworkInterface {

	join(): void;

	update(): void;

	debugChat(s: string): void;
}