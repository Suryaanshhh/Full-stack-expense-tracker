const { response } = require("express");
const User = require("../model/user");
const Expense = require("../model/expense");
const bcrypt = require("bcrypt");
const expenses = require("../model/expense");

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
        console.log(data);
        res.status(201).json({ User: data });
      })
      .catch((err) => console.log(err));
  });
};

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
            res.status(201).json({ message: "Login Successfull" });
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
  Expense.create({
    money: money,
    description: description,
    category: category,
  })
    .then((data) => {
      console.log(data);
      res.status(201).json({ Expense: data });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.ShowExpense = (req, res, next) => {
  Expense.findAll()
    .then((expenses) => {
      console.log(expenses);
      res.status(201).json({ expenses });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.DeleteExpense = (req, res, next) => {
  const uId = req.params.id;
  console.log(uId);
  Expense.destroy({ where: { id: uId } })
    .then((result) => {
      console.log(result);
      res.status(201).json({ message: "Successfull" });
    })
    .catch((err) => console.log(err));
};
