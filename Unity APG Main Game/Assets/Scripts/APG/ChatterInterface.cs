using System;

namespace APG {

	public interface ChatterInterface {

		int Count();

		string GetName( int id );

		string GetMessage( int id );

		void Clear();

		void ClearOlderThan( int maxLifeTime );

		void SetMessageEventFunction( Action<string,string> messageFunction );

	}
}