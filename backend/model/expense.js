const Mongoose=require("mongoose");

const Schema=Mongoose.Schema;


const expenseSchema=new Schema({
  money:Number,
  description:String,
  category:String,
  userId:Schema.Types.ObjectId
});

module.exports=Mongoose.model("Expense",expenseSchema);


// const expenses = sq.define("expenses", {
//   id: {
//     type: Sequelize.INTEGER,
//     autoIncrement: true,
//     allowNull: false,
//     primaryKey: true,
//   },
//   money: {
//     type: Sequelize.INTEGER,
//     allowNull: false,
//   },
//   description: {
//     type: Sequelize.STRING,
//     allowNull: false,
//   },
//   category: {
//     type: Sequelize.STRING,
//     allowNull: false,
//   },
// });

// module.exports = expenses;
