﻿using System;

[Serializable]
public class EntLink {
	public ent e = null;
	public EntLink prev = null;
	public EntLink next = null;
	public EntLink(ent src) { e = src; }
	public void Link(EntLink head) {
		if(next != null || prev != null) Unlink();
		if(head.next != null) head.next.prev = this;
		next = head.next;
		head.next = this;
		prev = head;
	}
	public void Unlink() {
		if(next != null) next.prev = prev;
		if(prev != null) prev.next = next;
		prev = next = null;
	}
}