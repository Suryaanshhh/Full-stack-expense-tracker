const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const orderSchema=new Schema({
    paymentId:String,
    orderId:String,
    status:String,
    userId:Schema.Types.ObjectId
})








// const { Sequelize } = require("sequelize");

// const sq = require("../util/database");

// const Order=sq.define("order",{
//     id: {
//         type: Sequelize.INTEGER,
//         autoIncrement: true,
//         allowNull: false,
//         primaryKey: true,
//       },
//       paymentId:Sequelize.STRING,
//       orderId:Sequelize.STRING,
//       status:Sequelize.STRING
// })

 module.exports=mongoose.model("Order",orderSchema);