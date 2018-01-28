using System;
using v3 = UnityEngine.Vector3;

public class CollisionGrid {
	EntLink[] grid;
	int gridx, gridy;
	int GridForXY(int x, int y) { return (y + gridy) * 2 * gridx + (x + gridx); }
	int GridID(v3 pos) {
		int idx = nm.Between(-gridx, (int)pos.x, gridx-1);
		int idy = nm.Between(-gridy, (int)pos.y, gridy-1);
		return GridForXY(idx, idy);
	}
	public CollisionGrid(int x, int y) {
		gridx = x; gridy = y;
		grid = new EntLink[(x*2)*(y*2)];
		for(var k = 0; k < (x*2)*(y*2); k++) grid[k] = new EntLink(null);
	}
	public EntLink GetGrid(v3 pos) { return grid[GridID(pos)]; }
	public void Find(v3 pos, float radius, ent src, Action<ent, ent> onFind) {
		int x1 = nm.Between(-gridx, (int)(pos.x-radius-1), gridx-1);
		int x2 = nm.Between(-gridx, (int)(pos.x+radius-1), gridx-1);
		int y1 = nm.Between(-gridy, (int)(pos.y-radius+1), gridy-1);
		int y2 = nm.Between(-gridy, (int)(pos.y+radius+1), gridy-1);
		for(var x = x1; x <= x2; x++) {
			for(var y = y1; y <= y2; y++) {
				var head = grid[GridForXY(x, y)].next;
				while(head != null) {
					if(head.e != null) {
						var dif = head.e.pos - pos;
						dif.z = 0;
						if(dif.sqrMagnitude < radius * radius) {
							onFind(src, head.e);
						}
					}
					head = head.next;
				}
			}
		}
	}
}