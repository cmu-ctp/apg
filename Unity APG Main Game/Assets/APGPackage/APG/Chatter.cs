using System.Text;

namespace APG {
	public class Chatter {
		static readonly int maxIRCMsgLength = 512;
		public string name;
		public StringBuilder msg = new StringBuilder( maxIRCMsgLength + 1 );
		public int time;
		public Chatter( string _name, string _msg, int _time ) {
			name = _name;
			msg.Append(_msg );
			time = _time;
		}
	}
}
