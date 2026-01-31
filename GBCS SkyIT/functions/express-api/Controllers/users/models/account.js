const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  username: String,
  email: String,

});

const Account = mongoose.model('Account', accountSchema);

module.exports = Account;