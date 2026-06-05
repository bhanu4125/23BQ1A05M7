// domain/notification.js
// just the shape of a notification - nothing fancy
 
// type NotificationType = "info" | "success" | "warning" | "error"
 
// a Notification looks like:
// {
//   id:        string  (uuid)
//   title:     string
//   message:   string
//   type:      NotificationType
//   isRead:    boolean
//   createdAt: ISO string
//   userId:    string
// }
 
const VALID_TYPES = ["info", "success", "warning", "error"];
 
function isValidType(t) {
  return VALID_TYPES.includes(t);
}
 
module.exports = { VALID_TYPES, isValidType };