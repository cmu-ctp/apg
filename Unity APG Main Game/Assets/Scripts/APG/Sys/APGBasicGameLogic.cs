using System;

namespace APG {

	[Serializable]
	public struct RoundUpdate{
		public int round;
		public int time;
	}

	class APGBasicGameLogic {
		int ticksPerSecond = 60;
		float nextAudienceTimer;
		float nextAudiencePlayerChoice;
		int roundNumber = 1;
		int secondsPerChoice = 20;

		public void Start() {
			nextAudiencePlayerChoice = ticksPerSecond * secondsPerChoice;
			nextAudienceTimer = ticksPerSecond * 10;
		}
		void InviteAudience( IRCNetworkingInterface network, AudiencePlayersSys apgSys, int maxPlayers ) {
			nextAudienceTimer--;
			if(apgSys.activePlayers < maxPlayers) {
				if(nextAudienceTimer <= 0) {
					if(apgSys.activePlayers == 0) {
						network.InviteEmptyGame();
					}
					else {
						network.InvitePartiallyFullGame();
					}
					nextAudienceTimer = ticksPerSecond * 30;
				}
			}
			else {
				if(nextAudienceTimer <= 0) {
					network.InviteFullGame();
					nextAudienceTimer = ticksPerSecond * 60;
				}
			}
		}
		void RunPlayerChoice( IRCNetworkingInterface network, AudiencePlayersSys apgSys ) {
			nextAudiencePlayerChoice--;
			if(nextAudiencePlayerChoice <= 0) {
				nextAudiencePlayerChoice = ticksPerSecond * secondsPerChoice;
				// update game state
				network.RequestPlayersUpdate();
				roundNumber++;

				//network.UpdateTime( (int)(nextAudiencePlayerChoice/60), roundNumber);
				network.UpdateMsg( "time", new RoundUpdate {time=(int)(nextAudiencePlayerChoice/60),round= roundNumber});

				foreach(var key in apgSys.playerMap.Keys) {
					network.UpdatePlayer( key, apgSys.GetPlayerEvents( apgSys.playerMap[key] ).updateClient());
				}
				//apgSys.onUpdate()
			}
			else if((nextAudiencePlayerChoice % (ticksPerSecond * 5) == 0) || (nextAudiencePlayerChoice % (ticksPerSecond * 1) == 0 && nextAudiencePlayerChoice < (ticksPerSecond * 5))) {
				//apgSys.onUpdate()

				//network.UpdateTime( (int)(nextAudiencePlayerChoice/60), roundNumber);
				network.UpdateMsg( "time", new RoundUpdate {time=(int)(nextAudiencePlayerChoice/60),round= roundNumber});

			}
		}
		public void Update( IRCNetworkingInterface network, AudiencePlayersSys apgSys, int maxPlayers ) {
			InviteAudience( network, apgSys, maxPlayers );
			RunPlayerChoice( network, apgSys );
		}
	}
}
