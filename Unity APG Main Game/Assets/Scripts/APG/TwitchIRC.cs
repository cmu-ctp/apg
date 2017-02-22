using UnityEngine;
using System.Collections.Generic;

[RequireComponent(typeof(TwitchGameLogicChat))]
public class TwitchIRC:MonoBehaviour {
	string server = "irc.twitch.tv";
	int port = 6667;

	public class MsgEvent:UnityEngine.Events.UnityEvent<string> { }
	public MsgEvent messageRecievedEvent = new MsgEvent();

	string buffer = string.Empty;
	bool stopThreads = false;
	Queue<string> commandQueue = new Queue<string>();
	List<string> recievedMsgs = new List<string>();
	System.Threading.Thread inProc, outProc;

	protected TwitchGameLogicChat logic;

	protected virtual string getOauth() { return logic.GetChatOauth(); }
	protected virtual string getChannelName() { return logic.ChatChannelName; }

	void StartIRC() {
		System.Net.Sockets.TcpClient sock = new System.Net.Sockets.TcpClient();
		sock.Connect(server, port);
		if(!sock.Connected) {
			Debug.Log("Failed to connect!");
			return;
		}
		var networkStream = sock.GetStream();
		var input = new System.IO.StreamReader(networkStream);
		var output = new System.IO.StreamWriter(networkStream);
		//Send PASS & NICK.
		logic = this.GetComponent<TwitchGameLogicChat>();
		output.WriteLine("PASS " + getOauth());
		output.WriteLine("NICK " + getChannelName().ToLower());
		output.Flush();
		//output proc
		outProc = new System.Threading.Thread(() => IRCOutputProcedure(output));
		outProc.Start();
		//input proc
		inProc = new System.Threading.Thread(() => IRCInputProcedure(input, networkStream));
		inProc.Start();
	}
	void IRCInputProcedure(System.IO.TextReader input, System.Net.Sockets.NetworkStream networkStream) {
		while(!stopThreads) {
			if(!networkStream.DataAvailable)
				continue;
			buffer = input.ReadLine();
			//was message?
			if(buffer.Contains("PRIVMSG #")) {
				lock(recievedMsgs) {
					recievedMsgs.Add(buffer);
				}
			}
			//Send pong reply to any ping messages
			if(buffer.StartsWith("PING ")) {
				SendCommand(buffer.Replace("PING", "PONG"));
			}
			//After server sends 001 command, we can join a channel
			if(buffer.Split(' ')[1] == "001") {
				SendCommand("JOIN #" + getChannelName());
			}
		}
	}
	void IRCOutputProcedure(System.IO.TextWriter output) {
		System.Diagnostics.Stopwatch stopWatch = new System.Diagnostics.Stopwatch();
		stopWatch.Start();
		while(!stopThreads) {
			lock(commandQueue) {
				if(commandQueue.Count > 0) { //do we have any commands to send?
											 // https://github.com/justintv/Twitch-API/blob/master/IRC.md#command--message-limit 
											 //have enough time passed since we last sent a message/command?
					if(stopWatch.ElapsedMilliseconds > 1750) {
						//send msg.
						output.WriteLine(commandQueue.Peek());
						output.Flush();
						//remove msg from queue.
						commandQueue.Dequeue();
						//restart stopwatch.
						stopWatch.Reset();
						stopWatch.Start();
					}
				}
			}
		}
	}
	public void SendCommand(string cmd) {
		lock(commandQueue) {
			commandQueue.Enqueue(cmd);
		}
	}
	public void SendMsg(string msg) {
		lock(commandQueue) { commandQueue.Enqueue("PRIVMSG #" + getChannelName() + " :" + msg); }
	}
	public void SendWhisper(string user, string msg) {
		SendMsg("/w " + user + " " + msg);
	}
	//MonoBehaviour Events.
	void Start() { }
	void OnEnable() {
		stopThreads = false;
		StartIRC();
	}
	void OnDisable() {
		stopThreads = true;
		//while (inProc.IsAlive || outProc.IsAlive) ;
		//print("inProc:" + inProc.IsAlive.ToString());
		//print("outProc:" + outProc.IsAlive.ToString());
	}
	void OnDestroy() {
		stopThreads = true;
		//while (inProc.IsAlive || outProc.IsAlive) ;
		//print("inProc:" + inProc.IsAlive.ToString());
		//print("outProc:" + outProc.IsAlive.ToString());
	}
	void Update() {
		lock(recievedMsgs) {
			if(recievedMsgs.Count > 0) {
				for(int i = 0; i < recievedMsgs.Count; i++) { messageRecievedEvent.Invoke(recievedMsgs[i]); }
				recievedMsgs.Clear();
			}
		}
	}
}