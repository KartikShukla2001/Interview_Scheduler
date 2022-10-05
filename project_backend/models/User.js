const mongoose=require("mongoose");

const userSchema=new mongoose.Schema({
     name :{
        type:String
     },
     isAdmin: {type: Boolean, default: false},
     email:{
        type:String
     }
})

const user = mongoose.model("user", userSchema);
module.exports = user;