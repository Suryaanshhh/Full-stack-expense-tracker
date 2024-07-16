const User = require("../model/user");
const Expense = require("../model/expense");
const Links = require("../model/fileUrl");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dmk123skn",
  api_key: "436668841279141",
  api_secret: "i0nntY-l35DFnSbNXnTEAPjgIRg",
});

exports.AddExpense = async (req, res, next) => {
  try {
    const money = req.body.money;
    const description = req.body.description;
    const category = req.body.category;
    const uId = req.user;
    const data = await Expense.create({
      money: money,
      description: description,
      category: category,
      userId: uId,
    });
    const existingUser = await User.find({ _id: uId });
    if (existingUser) {
      //console.log(existingUser[0]);
      existingUser[0].total = existingUser[0].total + parseInt(money);
      await User.updateOne({ total: existingUser[0].total });
    }
    res.status(201).json({ Expense: data });
  } catch (err) {
    console.log(err);
  }
};


exports.ShowExpense = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.count) || 2;
    const userId = req.user.id; // Assuming the user ID is stored in req.user.id

    const expenses = await Expense.find({ userId })
      .sort({ createdAt: 1 }) 
      .skip((page - 1) * limit)
      .limit(limit);

    const count = await Expense.countDocuments({ userId });

    const totalPages = Math.ceil(count / limit);

    res.status(200).json({
      currentPage: page,
      hasPreviousPage: page > 1,
      hasNextPage: page < totalPages,
      lastPage: totalPages,
      nextPage: page < totalPages ? page + 1 : null,
      previousPage: page > 1 ? page - 1 : null,
      totalCount: count,
      expenses,
    });
  } catch (err) {
    next(err);
  }
};


exports.DeleteExpense = async (req, res, next) => {
  try {
    const uId = req.params.id;
    console.log(`expense obj id is${uId}`);
    const expense = await Expense.find({ _id: uId });

    console.log(expense);
    // if (!expense) {
    //   return res.status(404).json({ message: "Expense not found" });
    // }

    const expenseAmount = expense[0].money;

    const existingUser = await User.find({ _id: expense[0].userId });
    if (existingUser) {
      console.log(existingUser);
      await Expense.findByIdAndDelete(new mongoose.Types.ObjectId(uId));
      existingUser[0].total = existingUser[0].total - parseInt(expenseAmount);
      await User.updateOne({ total: existingUser[0].total });
    }

    // const user = await User.findOne({ where: { id: expense.UserId } });
    // if (!user) {
    //   return res.status(404).json({ message: "User not found" });
    // }

    // const updatedTotal = user.total - expenseAmount;

    // await User.update(
    //   { total: updatedTotal },
    //   { where: { id: user.id }, transaction: t }
    // );

    // await Expense.destroy({ where: { id: uId }, transaction: t });
    // await t.commit();

    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.downloadExpense = async (req, res) => {
  try {
    const expenses = await Expense.find();
    console.log(expenses);
    const content = JSON.stringify(expenses);
    const userID = req.user.id;
    const dateString = new Date().toISOString().replace(/:/g, "-");
    const filename = `Expenses${userID}-${dateString}.txt`;
    const filePath = path.join(__dirname, filename);
    fs.writeFileSync(filePath, content, "utf8");
    const fileURl = await cloudinary.uploader.upload(
      filePath,
      { resource_type: "raw" },
      function (error, result) {
        if (error) {
          console.error("Error uploading to Cloudinary:", error);
        } else {
          console.log("Upload result:", result);
        }
        // Clean up the temporary file
        fs.unlinkSync(filePath);
      }
    );
    Links.create({
      Link: fileURl.url,
      userId: userID,
    });
    console.log(fileURl);
    res.status(200).json({ fileURl });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: err });
  }
};

exports.getUrl = (req, res) => {
  Links.find({userId:req.user})
    .then((Link) => {
      console.log(`link is ----.>${Link}`);
      res.status(201).json({ Link });
    })
    .catch((err) => {
      console.log(err);
    });
};
