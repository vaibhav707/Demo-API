const mongoose = require("mongoose");

// Connection

async function connectDB(url) {
    return mongoose.connect(url);
}

module.exports = {
    connectDB
};