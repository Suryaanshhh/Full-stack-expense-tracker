const User = require("../model/user");
const Expense = require("../model/expense");
const sequelize = require("../util/database");
const S3Service = require("../service/s3");
const Links = require("../model/fileUrl");

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

exports.ShowExpense = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.count) || 2;
  console.log(limit);

  const { count, rows: expenses } = await Expense.findAndCountAll({
    where: { userId: req.user.id },
    limit,
    offset: (page - 1) * limit,
    order: [["createdAt"]],
  });

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

exports.downloadExpense = async (req, res) => {
  try {
    const expenses = await req.user.getExpenses();
    console.log(expenses);
    const stringifyExpenses = JSON.stringify(expenses);
    const userID = req.user.id;
    const filename = `Expenses${userID}/${new Date()}.txt`;
    const fileURl = await S3Service.uploadtoS3(stringifyExpenses, filename);
    Links.create({
      Link: fileURl,
      UserId: userID,
    });
    res.status(200).json({ fileURl });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: err });
  }
};

exports.getUrl = (req, res) => {
  Links.findAll({ where: { UserId: req.user.id } })
    .then((Link) => {
      console.log(`link is ----.>${Link}`);
      res.status(201).json({ Link });
    })
    .catch((err) => {
      console.log(err);
    });
};
