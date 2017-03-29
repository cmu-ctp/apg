using System;

namespace APG {

	public interface ChatterInterface {

		int Count();

		string GetName( int id );

		string GetMessage( int id );

		void Clear();

		void ClearOlderThan( int maxLifeTime );

		void SetMessageEventFunction( Action<string,string> messageFunction );

		/*assets.gameLogicChat.GetAudienceSys().Chatters().SetMessageEventFunction( 
			(name, msg) => {
				if( name == "twitchnotify" ) {
					// do something here.
				}
			}
		);*/

		void OnSubscribe( Action<string>);

		void OnDonate( Action<string, int>);

		// if a moderator speaks up in chat - how can we tell who is a moderator?

		// if someone speaks up (?)

	}
}