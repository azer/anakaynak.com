var debug    = require("./debug")('mongo'),
    config   = require('../config'),
    mongoose = require("mongoose");

mongoose.connect('mongodb://' + config.mongo);

module.exports = mongoose;
