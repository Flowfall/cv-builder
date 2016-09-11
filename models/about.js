var mongoose = require('mongoose');

var aboutSchema = mongoose.Schema({
  owner: String,
  cvid: String,
  aboutContent: String, // about content
  driversLicense: String,
  workLicense: String,
  created_at: { type: Date, default: Date.now() },
  updated_at: { type: Date, default: Date.now() },
});

module.exports = mongoose.model('About', aboutSchema);