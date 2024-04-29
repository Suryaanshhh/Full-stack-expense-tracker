const { response } = require("express");
const User = require("../model/user");
const Expense = require("../model/expense");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { where, Sequelize } = require("sequelize");
const RazorPay = require("razorpay");
const Order = require("../model/orders");
const sequelize = require("../util/database");
const { Body } = require("sib-api-v3-sdk");
const S3Service = require("../service/s3");

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
      total: 0,
    })
      .then((data) => {
        //console.log(data);
        res.status(201).json({ User: data });
      })
      .catch((err) => console.log(err));
  });
};

function generateAccessToken(id, premium) {
  return jwt.sign(
    { userId: id, premium },
    "magical-key-for-userAuthentication"
  );
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
              token: generateAccessToken(user[0].id, user[0].premium),
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

exports.AddExpense = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const money = req.body.money;
    const description = req.body.description;
    const category = req.body.category;
    const uId = req.user.id;
    const data = await Expense.create(
      {
        money: money,
        description: description,
        category: category,
        UserId: uId,
      },
      { transaction: t }
    );
    const existingUser = await User.findOne({
      where: { id: uId },
    });
    if (existingUser) {
      existingUser.total = existingUser.total + parseInt(money);
      await User.update(
        { total: existingUser.total },
        { where: { id: uId }, transaction: t }
      );
      await t.commit();
    }

    res.status(201).json({ Expense: data });
  } catch (err) {
    await t.rollback();
    console.log(err);
  }
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

exports.DeleteExpense = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const uId = req.params.id;

    const expense = await Expense.findOne({ where: { id: uId } });
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    const expenseAmount = expense.money;

    const user = await User.findOne({ where: { id: expense.UserId } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatedTotal = user.total - expenseAmount;

    await User.update(
      { total: updatedTotal },
      { where: { id: user.id }, transaction: t }
    );

    await Expense.destroy({ where: { id: uId }, transaction: t });
    await t.commit();

    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (err) {
    await t.rollback();
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
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
      if (err) {
        throw new Error(JSON.stringify(err));
      }
      //console.log(`premium purchse==${order}`)
      Order.create({ orderId: order.id, status: "PENDING", UserId: uId })
        .then(() => {
          //console.log(`chal le bewkoof code ${order,rzp.key_id}`)
          return res.status(201).json({ order, key_id: rzp.key_id });
        })
        .catch((err) => {
          throw new Error(err);
        });
    });
  } catch (err) {
    console.log(err);
    res.status(403).json({ message: "Something went wrong", error: err });
  }
};

exports.UpdateTransactionStatus = (req, res) => {
  try {
    const uId = req.user.id;
    const { payment_id, order_id } = req.body;
    Order.findOne({ where: { orderId: order_id } })
      .then((order) => {
        order
          .update({ paymentId: payment_id, status: "SUCCESSFULL" })
          .then(() => {
            User.update({ premium: true }, { where: { id: uId } })
              .then(() => {
                return res.status(202).json({
                  success: true,
                  message: "Transaction completed",
                  token: generateAccessToken(uId, true),
                });
              })
              .catch((err) => {
                console.log(err);
              });
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (err) {
    console.log(err);
  }
};

exports.downloadExpense = async (req, res) => {
  try {
    const expenses = await req.user.getExpenses();
    console.log(expenses);
    const stringifyExpenses = JSON.stringify(expenses);
    const userID = req.user.id;
    const filename = `Expenses${userID}/${new Date()}.txt`;
    const fileURl = await S3Service.uploadtoS3(stringifyExpenses, filename);
    res.status(200).json({ fileURl });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: err });
  }
};
