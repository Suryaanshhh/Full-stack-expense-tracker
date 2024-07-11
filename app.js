const express = require("express");
const fs = require("fs");
const app = express();
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const Mongoose = require("mongoose");
// const User = require("./backend/model/user");
// const Expense = require("./backend/model/expense");
// const Order = require("./backend/model/orders");
// const Request = require("./backend/model/ForgotPasswordRequests");
// const FileUrl = require("./backend/model/fileUrl");
const UserRoute = require("./backend/routes/user-routes");
// const premiumRoute = require("./backend/routes/premium-routes");
// const forgetPass = require("./backend/routes/forget-pass-route");
// const expenseRoute = require("./backend/routes/expense-Routes");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
app.use(bodyParser.json({ extended: false }));

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  {
    flags: "a",
  }
);

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(compression());
app.use(morgan("combined", { stream: accessLogStream }));
//Route Configuration

app.use(UserRoute);
// app.use(forgetPass);
// app.use(expenseRoute);
// app.use(premiumRoute);

app.use((req, res) => {
  console.log(`url is ${req.url}`);
  res.sendFile(path.join(__dirname, `frontend${req.url}`));
});

// User.hasMany(Expense);
// Expense.belongsTo(User);
// User.hasMany(Order);
// Order.belongsTo(User);
// User.hasMany(Request);
// Request.belongsTo(User);
// User.hasMany(FileUrl);
// FileUrl.belongsTo(User)


Mongoose.connect(
  "mongodb+srv://suryanshdwivedi615:GT7J8FxgWGXDnwDq@cluster0.q8wfrdt.mongodb.net/expenseTracker?retryWrites=true&w=majority&appName=Cluster0"
).then(() => {
  app.listen(3000);
  console.log("connect");
});
