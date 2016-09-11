var mongoose = require('mongoose');

var cvSchema = mongoose.Schema({
  owner         : String,
  step          : Number,
  /*aboutid       : String,
  qualificationid : String,
  experienceid  : String,
  projectid     : String,
  referenceid   : String,*/
  created_at    : { type: Date, default: Date.now() },
  updated_at    : { type: Date, default: Date.now() },
});

module.exports = mongoose.model('Cv', cvSchema);