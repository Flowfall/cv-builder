var mongoose = require('mongoose');

var profileSchema = mongoose.Schema({
  owner: String,
  forename: String,
  surname: String,
  email: String,
  phone: String,
  address: {type: String, trim: true},
  country: String,
  created_at: { type: Date, default: Date.now() },
  updated_at: { type: Date, default: Date.now() },
});

module.exports = mongoose.model('Profile', profileSchema);