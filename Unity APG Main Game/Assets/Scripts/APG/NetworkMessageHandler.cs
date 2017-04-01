using UnityEngine;
using System.Collections.Generic;
using System;

namespace APG {

	public class NetworkMessageHandler {
		Dictionary<string, Action<string, string>> commands = new Dictionary<string, Action<string, string>>();

		public NetworkMessageHandler Add<T>(string msgName, Action<string, T> func) {
			commands[msgName] = (string user, string s) => {
				T parms = JsonUtility.FromJson<T>(s);
				func(user, parms);
			};
			return this;
		}

		public void Run(string user, string msgString) {
			var jsonMSG = msgString.Split(new string[] { "###" }, StringSplitOptions.None);

			if(jsonMSG.Length != 2) {
				Debug.Log("Error!  Poorly formed network message from " + user + ": " + msgString);
				return;
			}
			if(!commands.ContainsKey(jsonMSG[0])) {
				Debug.Log("Error!  Unrecognized command in message from " + user + ": " + msgString);
				return;
			}

			commands[jsonMSG[0]](user, jsonMSG[1]);
		}
	}
}
