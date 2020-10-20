using UnityEngine;
using System;
using System.IO;
using System.Collections.Generic;

namespace APG {
	public class IRCNetworkRecorder {

		[Serializable]
		struct NetworkMessage{
			public int time;
			public string user;
			public string msg;
		}

		[Serializable]
		class IRCStream{
			public List<NetworkMessage> msgs;
		}

		bool recordingNetwork = false;
		IRCStream messagesFromClients = null;
		IRCStream messagesToClients = null;
		bool playingbackNetwork = false;
		IRCStream playbackMessagesFromClients = null;

		public void WriteFromClientMsg( int time, string user, string msgString ) {
			if( !recordingNetwork ) return;

			messagesToClients.msgs.Add( new NetworkMessage { time = time, user = user, msg = msgString });
		}

		public void WriteToClientMsg( int time, string user, string s ) {
			if( !recordingNetwork )return;

			messagesToClients.msgs.Add( new NetworkMessage { time = time, user = user, msg = s });
		}

		public void StartRecordingNetworking() {
			recordingNetwork = true;
			messagesFromClients = new IRCStream();
			messagesToClients = new IRCStream();
		}

		public void EndRecordingNetworkingAndSave( string messagesToClientsFileName, string messagesFromClientsFileName ) {
			if( recordingNetwork == false ) {
				return;
			}

			if( messagesToClientsFileName == "" && messagesFromClientsFileName == "" ) {
				return;
			}

			if( messagesToClientsFileName != "" ) {
				try {
					using (StreamWriter outputFile = new StreamWriter( messagesToClientsFileName )) {
						outputFile.Write( JsonUtility.ToJson( messagesToClients ) );
					}
				}catch {

				}
			}
			messagesToClients = null;

			if( messagesFromClientsFileName != "" ) {
				try {
					using (StreamWriter outputFile = new StreamWriter( messagesFromClientsFileName )) {
						outputFile.Write( JsonUtility.ToJson( messagesFromClients ) );
					}
				}catch {

				}
			}
			messagesFromClients = null;

			recordingNetwork = false;
		}

		public bool PlaybackNetworking( string messagesFromClientsFileName ) {
			if( messagesFromClientsFileName == "" ) {
				return false;
			}

			try {
				using(StreamReader sr = new StreamReader(messagesFromClientsFileName)) {
					playbackMessagesFromClients = JsonUtility.FromJson<IRCStream>(sr.ReadToEnd());
					playingbackNetwork = true;
				}
			}
			catch {
				playbackMessagesFromClients = null;
				playingbackNetwork = false;
			}

			return playingbackNetwork;
		}
	}
}
