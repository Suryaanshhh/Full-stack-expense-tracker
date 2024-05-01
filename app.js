const express = require('express');
const app = express();
const sq = require('./backend/util/database')
const User=require('./backend/model/user')
const Expense=require('./backend/model/expense')
const Order=require('./backend/model/orders')
const Request=require('./backend/model/ForgotPasswordRequests')
const FileUrl=require('./backend/model/fileUrl')
const UserRoute = require('./backend/routes/user-routes');
const premiumRoute=require('./backend/routes/premium-routes');
const forgetPass=require('./backend/routes/forget-pass-route');
const expenseRoute=require('./backend/routes/expense-Routes');
const bodyParser = require('body-parser');
const cors = require('cors');
app.use(bodyParser.json({ extended: false }));
app.use(cors());

//Route Configuration
app.use(UserRoute);
app.use(forgetPass);
app.use(expenseRoute);
app.use(premiumRoute);

//schema Relations
User.hasMany(Expense);
Expense.belongsTo(User)
User.hasMany(Order);
Order.belongsTo(User);
User.hasMany(Request);
Request.belongsTo(User);
User.hasMany(FileUrl);
FileUrl.belongsTo(User);
//schema Relations

sq.sync()

app.listen(3000);
