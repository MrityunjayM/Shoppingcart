const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required."]
    },
    email: {
        type: String,
        required: [true, "Email is required."]
    },

    username: {
        type: String,
        required: [true, "Username is required."]
    },
    admin: {
        type: Boolean,
        default: false
    }
});
UserSchema.plugin(passportLocalMongoose);
const User = module.exports = mongoose.model('User', UserSchema);
module.exports = User;