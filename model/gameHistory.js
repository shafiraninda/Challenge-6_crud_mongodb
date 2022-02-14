const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  username: String,
  win: Number,
  draw: Number,
  lose: Number
  // user: UserSchema
});


const History = mongoose.model('History', historySchema);



module.exports = History