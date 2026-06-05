const { initLogger, Log } = require("../../logging_middleware/src");
require("dotenv").config();
 
initLogger({
  email:        process.env.EMAIL,
  name:         process.env.NAME,
  rollNo:       process.env.ROLL_NO,
  accessCode:   process.env.ACCESS_CODE,
  clientID:     process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});
 
module.exports = { Log };