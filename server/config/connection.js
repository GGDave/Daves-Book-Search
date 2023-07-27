const mongoose = require('mongoose');
//updated the connetion to reference my database name
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/daves-books');

module.exports = mongoose.connection;
