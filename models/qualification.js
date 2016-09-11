var mongoose = require('mongoose');

var qualificationSchema = mongoose.Schema({
  qualifications: String,
  file: {type: String, default: "" },
  cvid: String,
  owner: String,
  created_at: { type: Date, default: Date.now() },
  updated_at: { type: Date, default: Date.now() },
});

module.exports = mongoose.model('Qualification', qualificationSchema);