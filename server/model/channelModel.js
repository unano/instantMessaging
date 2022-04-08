const mongoose = require("mongoose");

const channelSchema = new mongoose.Schema({
    channel:{
        type:Number,
        required: true,
        unique: true,
    },
});

module.exports = mongoose.model("Channel", channelSchema);