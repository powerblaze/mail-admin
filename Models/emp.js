const mongoose = require('mongoose');
const CentralMail = new mongoose.Schema({
    from: String,
        subject: String,
        body: String,
        timestamp: String,
    
  })
  module.exports = mongoose.model('Central Mail',CentralMail)