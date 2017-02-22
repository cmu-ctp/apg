using UnityEngine;

[RequireComponent(typeof(TwitchGameLogicChat))]
public class TwitchIRCLogic:TwitchIRC {
	protected override string getOauth() { return logic.GetLogicOauth(); }
	protected override string getChannelName() { return logic.LogicChannelName; }
}