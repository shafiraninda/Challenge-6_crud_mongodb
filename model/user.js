const { Schema, model } = require('mongoose')
const History = require('./gameHistory')
// modul plugin untuk validasi unique
const uniqueValidator = require('mongoose-unique-validator');

const UserSchema = Schema({
  username: {
    type: String,
    unique: true,
    trim: true,
    required: [true, 'Username Wajib Di Input']
  },
//   age: {
//     type: Number,
//     min: [0, "Anda Terlalu Muda, Belajar Jalan Dulu"],
//     max: [100, 'Anda Ketuaan Untuk Main Disini']
//  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    required: [true, 'Email Wajib Di Input']
  },
  password: {
    type: String,
    unique: true
  },
  history: { type: Schema.Types.ObjectId, ref: 'History' }
})
UserSchema.plugin(uniqueValidator);

const User = model("User", UserSchema)

module.exports = User