const express = require('express');
const app = express();
const sq = require('./backend/util/database')
const User=require('./backend/model/user')
const Expense=require('./backend/model/expense')
const Router = require('./backend/routes/router')
const bodyParser = require('body-parser');
const cors = require('cors');
app.use(bodyParser.json({ extended: false }));
app.use(cors());
app.use(Router)


sq.sync()

app.listen(3000);
