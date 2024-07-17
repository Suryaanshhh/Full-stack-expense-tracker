const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const userSchema=new Schema({
  name:String,
  email:String,
  password:String,
  premium:Boolean,
  total:Number
});

module.exports=mongoose.model("User",userSchema);






// const User = sq.define("User", {
//   id: {
//     type: Sequelize.INTEGER,
//     autoIncrement: true,
//     allowNull: false,
//     primaryKey: true,
//   },
//   name: {
//     type: Sequelize.STRING,
//     allowNull: false,
//   },
//   email: {
//     type: Sequelize.STRING,
//     allowNull: false,
//   },
//   password: {
//     type: Sequelize.STRING,
//     allowNull: false,
//   },
//   premium: {
//     type: Sequelize.BOOLEAN,
//   },
//   total: {
//     type: Sequelize.INTEGER,
//   },
// });

//module.exports = User;
