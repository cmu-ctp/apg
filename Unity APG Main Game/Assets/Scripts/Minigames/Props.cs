using UnityEngine;
using System.Collections.Generic;
using V3 = UnityEngine.Vector3;

public class Props:MonoBehaviour {
}

public class PropSys {
	GameSys gameSys;
	Props theProps;
	public PropSys(Props props, GameSys theGameSys) {
		gameSys = theGameSys;
		theProps = props;
	}
}