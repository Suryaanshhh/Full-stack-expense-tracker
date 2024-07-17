const { default: mongoose } = require("mongoose");
const Mongoose=require("mongoose");

const Schema=Mongoose.Schema;

const forgetPassSchema=new Schema({
    id:String,
    active:Boolean,
    userId:Schema.Types.ObjectId
})





// const { Sequelize } = require("sequelize");

// const sq = require("../util/database");

// const passRequest=sq.define("requests",{
//     id:{
//         type:Sequelize.STRING,
//         allowNull:false,
//         unique:true ,
//         primaryKey:true
//     },
//     active:{
//         type:Sequelize.BOOLEAN
//     }
// })
 module.exports=mongoose.model("PassReq",forgetPassSchema);