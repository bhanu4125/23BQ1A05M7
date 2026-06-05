# Stage 1

## Problem
Students are losing track of important notifications because the notification stream includes a large volume of updates from Placements, Events, and Results.

## Goal
Introduce a Priority Inbox that always displays the top 10 most important unread notifications first.

## Priority model
Priority is determined by:

- **Category weight**: `placement > result > event`
- **Recency**: newer notifications within the same category appear first

I use the following category weights:

- placement: 3
- result: 2
- event: 1

## Implementation approach

I implemented a streaming-friendly top-10 algorithm in `stage1_priority_notifications.js`.
The algorithm:

1. Ignores notifications already marked `isRead`.
2. Computes a numeric score for each unread notification using:
   - `score = weight * 1e12 + timestamp`
3. Maintains a fixed-size min-heap of up to 10 items.
4. For each new unread notification:
   - if the heap has fewer than 10 items, add it
   - otherwise, replace the heap root if the new notification is higher priority
5. After processing all notifications, the heap contains the top 10 priorities.

## Why this is efficient for new notifications

- The fixed-size heap keeps only the best 10 notifications in memory.
- Each insertion and possible replace costs `O(log k)` where `k = 10`.
- Total cost is `O(n log k)` for `n` notifications, which is effectively linear for a small `k`.
- This is efficient even as new notifications keep arriving.

## File deliverables

- `stage1_priority_notifications.js` — working code to compute the top 10 priority notifications
- `Notification_System_Design.md` — design explanation for Stage 1

## How to run

```bash
node stage1_priority_notifications.js
```

## Notes

This solution focuses on the selection algorithm rather than database query logic, as requested.
The same priority model can be adapted to a database query or service layer if needed later.
