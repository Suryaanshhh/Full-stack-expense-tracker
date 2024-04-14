const { response } = require("express");
const User = require("../model/user");
const Expense = require("../model/expense");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { where } = require("sequelize");
const RazorPay = require("razorpay");
const Order = require("../model/orders");

exports.register = (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  bcrypt.hash(password, 10, async (err, hash) => {
    console.log(err);
    await User.create({
      name: name,
      email: email,
      password: hash,
    })
      .then((data) => {
        //console.log(data);
        res.status(201).json({ User: data });
      })
      .catch((err) => console.log(err));
  });
};

function generateAccessToken(id) {
  return jwt.sign({ userId: id }, "magical-key-for-userAuthentication");
}

exports.Login = (req, res, next) => {
  const email = req.params.email;
  const password = req.body.password;
  // console.log(`firts pass is ${password}`);
  User.findAll({ where: { email: email } })
    .then((user) => {
      if (user.length > 0) {
        bcrypt.compare(password, user[0].password, (err, result) => {
          if (err) {
            res
              .status(500)
              .json({ success: false, message: "Something went wrong" });
          }
          if (result == true) {
            //console.log(`second pass is ${user[0].password}`);
            res.status(201).json({
              message: "Login Successfull",
              token: generateAccessToken(user[0].id),
            });
          } else {
            res.status(401).json({ message: "Incorrect Password" });
          }
        });
      } else {
        res.status(404).json({ message: "user not found" });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.AddExpense = (req, res, next) => {
  const money = req.body.money;
  const description = req.body.description;
  const category = req.body.category;
  const uId = req.user.id;
  Expense.create({
    money: money,
    description: description,
    category: category,
    UserId: uId,
  })
    .then((data) => {
      //console.log(data);
      res.status(201).json({ Expense: data });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.ShowExpense = (req, res, next) => {
  Expense.findAll({ where: { userId: req.user.id } })
    .then((expenses) => {
      //console.log(expenses);
      res.status(201).json({ expenses });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.DeleteExpense = (req, res, next) => {
  const uId = req.params.id;
  //console.log(uId);
  Expense.destroy({ where: { id: uId } })
    .then((result) => {
      //console.log(result);
      res.status(201).json({ message: "Successfull" });
    })
    .catch((err) => console.log(err));
};

exports.PurchasePremium = (req, res, next) => {
  const uId = req.user.id;
  try {
    var rzp = new RazorPay({
      key_id: "rzp_test_nCkCg1Y7qkqxCd",
      key_secret: "c6ij1T3cfBBejHRgAYLU2x8d",
    });
    const amount = 6900;
    rzp.orders.create({ amount, currency: "INR" }, (err, order) => {
      if(err){
        throw new Error(JSON.stringify(err))
      }
      console.log(`premium purchse==${order}`)
      Order.create({ orderId: order.id, status: "PENDING" ,UserId:uId})
        .then(() => {
          console.log(`chal le bsdk ${order,rzp.key_id}`)
          return res.status(201).json({ order, key_id: rzp.key_id });
        })
        .catch((err) => {
          throw new Error(err);
        });
    });
  } catch (err) {
    console.log(err);
    res.status(403).json({message:"Something went wrong",error:err})
  }
};

exports.UpdateTransactionStatus = (req, res) => {
  const { payment_id, order_id } = req.body;
  Order.findOne({ where: { orderId: order_id } }).then((order) => {
    order.update({ paymentId: payment_id, status: "Successfull" }).then(() => {
      req.User.update({ premium: true })
        .then(() => {
          res
            .status(202)
            .json({ success: true, message: "Transaction Completed" });
        })
        .catch((err) => {
          console.log(err);
        });
    });
  });
};
