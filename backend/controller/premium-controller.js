const User = require("../model/user");
const Expense = require("../model/expense");

exports.ShowLeaderBoard = async (req, res) => {
  try {
    const users = await User.findAll();
    const expenses = await Expense.findAll();
    //console.log(expenses)
    const TotalExpense={}
    expenses.forEach((expense)=>{
       // console.log(expense)
        if(TotalExpense[expense.UserId]){
            
            TotalExpense[expense.UserId]=TotalExpense[expense.UserId]+expense.money;
            console.log(`ex-${expense.UserId}`)
        }
        else{
            TotalExpense[expense.UserId]=expense.money;
        }
    })
    var Leaderboard=[];
users.forEach((user)=>{
    console.log(`us-${TotalExpense[user.id]}`)
    Leaderboard.push({name:user.name,totalCost:TotalExpense[user.id]||0})
})
Leaderboard.sort((a,b)=>{
    a.totalCost-b.totalCost
})
res.status(200).json(Leaderboard)
  } catch (err) {
    console.log(err);
  }
};
