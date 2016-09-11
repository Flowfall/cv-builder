var mongoose = require('mongoose');

var experienceSchema = mongoose.Schema({
  owner: String,
  title: String,
  content: String,
  cvid: String,
  dateStart: Date,
  dateEnd: Date,
  voluntary: String,
  created_at: { type: Date, default: Date.now() },
  updated_at: { type: Date, default: Date.now() },
});

module.exports = mongoose.model('Experience', experienceSchema);