const mongoose = require("mongoose")

const FollowersSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    img: {
        type: String,
        required: true
    },
    study: {
        type: String,
        required: true
    }
}, {
    versionKey: false
});

const followModel = mongoose.model('Followers', FollowersSchema);

module.exports = {
    followModel
};