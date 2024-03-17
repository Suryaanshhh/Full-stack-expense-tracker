const express = require('express');
const app = express();
const sq = require('./backend/util/database')
sq.sync()
const Router = require('./backend/routes/router')
const bodyParser = require('body-parser');
const cors = require('cors');
app.use(bodyParser.json({ extended: false }));
app.use(cors());
app.use(Router)


app.listen(3000);
