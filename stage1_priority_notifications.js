const WEIGHT = {
  placement: 3,
  result: 2,
  event: 1,
};

function getPriorityScore(notification) {
  const weight = WEIGHT[notification.category] ?? 0;
  const timestamp = new Date(notification.createdAt).getTime();
  return weight * 1e12 + timestamp;
}

class MinHeap {
  constructor(compare) {
    this.compare = compare;
    this.items = [];
  }

  size() {
    return this.items.length;
  }

  push(value) {
    this.items.push(value);
    this.bubbleUp(this.items.length - 1);
  }

  pop() {
    if (this.items.length === 0) return null;
    const top = this.items[0];
    const end = this.items.pop();
    if (this.items.length > 0) {
      this.items[0] = end;
      this.bubbleDown(0);
    }
    return top;
  }

  bubbleUp(index) {
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      if (this.compare(this.items[index], this.items[parentIndex]) >= 0) break;
      [this.items[index], this.items[parentIndex]] = [this.items[parentIndex], this.items[index]];
      index = parentIndex;
    }
  }

  bubbleDown(index) {
    const length = this.items.length;
    while (true) {
      let left = 2 * index + 1;
      let right = 2 * index + 2;
      let smallest = index;
      if (left < length && this.compare(this.items[left], this.items[smallest]) < 0) smallest = left;
      if (right < length && this.compare(this.items[right], this.items[smallest]) < 0) smallest = right;
      if (smallest === index) break;
      [this.items[index], this.items[smallest]] = [this.items[smallest], this.items[index]];
      index = smallest;
    }
  }
}

function topPriorityNotifications(notifications, topN = 10) {
  const heap = new MinHeap((a, b) => a.score - b.score);

  for (const notification of notifications) {
    if (notification.isRead) continue;
    const score = getPriorityScore(notification);
    const entry = { notification, score };

    if (heap.size() < topN) {
      heap.push(entry);
    } else if (score > heap.items[0].score) {
      heap.items[0] = entry;
      heap.bubbleDown(0);
    }
  }

  const result = [];
  while (heap.size() > 0) {
    result.push(heap.pop().notification);
  }

  return result.reverse();
}

const sampleNotifications = [
  { id: "n1", category: "event", title: "Cultural Fest tomorrow", isRead: false, createdAt: "2026-06-05T08:00:00Z" },
  { id: "n2", category: "placement", title: "TCS drive opening slots", isRead: false, createdAt: "2026-06-05T09:30:00Z" },
  { id: "n3", category: "result", title: "Semester 4 results released", isRead: false, createdAt: "2026-06-04T20:20:00Z" },
  { id: "n4", category: "placement", title: "Infosys tech test tomorrow", isRead: false, createdAt: "2026-06-05T10:15:00Z" },
  { id: "n5", category: "event", title: "Guest lecture on AI", isRead: true, createdAt: "2026-06-05T07:45:00Z" },
  { id: "n6", category: "result", title: "Sports quota result declared", isRead: false, createdAt: "2026-06-05T06:00:00Z" },
  { id: "n7", category: "placement", title: "Amazon coding challenge result", isRead: false, createdAt: "2026-06-03T18:00:00Z" },
  { id: "n8", category: "event", title: "Hackathon registration closes", isRead: false, createdAt: "2026-06-05T11:00:00Z" },
  { id: "n9", category: "result", title: "Midterm make-up exam scores", isRead: false, createdAt: "2026-06-05T10:00:00Z" },
  { id: "n10", category: "placement", title: "Workday hiring update", isRead: false, createdAt: "2026-06-05T11:30:00Z" },
  { id: "n11", category: "event", title: "Blood donation camp", isRead: false, createdAt: "2026-06-05T05:30:00Z" },
  { id: "n12", category: "result", title: "Project evaluation feedback", isRead: false, createdAt: "2026-06-05T11:10:00Z" },
  { id: "n13", category: "placement", title: "Capgemini interview slot", isRead: false, createdAt: "2026-06-05T11:45:00Z" },
  { id: "n14", category: "event", title: "Alumni meetup details", isRead: false, createdAt: "2026-06-04T16:00:00Z" },
  { id: "n15", category: "result", title: "CGPA improvement notification", isRead: false, createdAt: "2026-06-05T12:00:00Z" },
];

const topNotifications = topPriorityNotifications(sampleNotifications, 10);
console.log("Top 10 priority unread notifications:");
console.table(topNotifications.map((notif) => ({
  id: notif.id,
  category: notif.category,
  title: notif.title,
  createdAt: notif.createdAt,
  isRead: notif.isRead,
})));
