const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    username: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: false},
    otp:{
        type:String,
        require:true,
    },
    timeExpire:{
        type:Date,
        require:true
    },
    profilePicture: {type: String, required: false},
    id: {type: String}
})

module.exports = mongoose.model("User", userSchema)