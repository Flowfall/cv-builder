var mongoose = require('mongoose');

var referenceSchema = mongoose.Schema({
    cvid: String,
    firstName: String,
    firstPhone: String,
    firstContact: String,
    firstWait: { type: String, default: "no" },
    secondName: String,
    secondPhone: String,
    secondContact: String,
    secondWait: { type: String, default: "no" },
    owner: String,
    created_at: { type: Date, default: Date.now() },
    updated_at: { type: Date, default: Date.now() },
});

module.exports = mongoose.model('Reference', referenceSchema);