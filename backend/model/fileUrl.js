

const { default: mongoose } = require("mongoose");
const Mongoose=require("mongoose");

const Schema=Mongoose.Schema;


const fileSchema=new Schema({
    Link:String,
    userId:Schema.Types.ObjectId
})

module.exports=mongoose.model("FileUrl",fileSchema);