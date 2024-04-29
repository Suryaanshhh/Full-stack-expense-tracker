const express = require('express');
const app = express();
const sq = require('./backend/util/database')
const User=require('./backend/model/user')
const Expense=require('./backend/model/expense')
const Order=require('./backend/model/orders')
const Request=require('./backend/model/ForgotPasswordRequests')
const FileUrl=require('./backend/model/fileUrl')
const Router = require('./backend/routes/router')
const bodyParser = require('body-parser');
const cors = require('cors');
app.use(bodyParser.json({ extended: false }));
app.use(cors());
app.use(Router)
User.hasMany(Expense);
Expense.belongsTo(User)
User.hasMany(Order);
Order.belongsTo(User);
User.hasMany(Request);
Request.belongsTo(User);
User.hasMany(FileUrl);
FileUrl.belongsTo(User)
sq.sync()

app.listen(3000);
