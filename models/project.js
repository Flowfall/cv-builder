var mongoose = require('mongoose');

var projectSchema = mongoose.Schema({
  owner: String,
  cvid: String,
  title: String,
  description: String,
  file: {type: String, default: "" },
  thumbnail: {type: String, default: "" },
  date: Date,
  created_at: { type: Date, default: Date.now() },
  updated_at: { type: Date, default: Date.now() },
});

module.exports = mongoose.model('Project', projectSchema);