const express=require('express');
const app=express();
const usercontroll=require('./backend/controller/User-controller');
const sq=require('./backend/util/database')
const bodyParser=require('body-parser');
const cors=require('cors')
app.use(bodyParser.json({extended:false}));
app.use(cors());
app.use(usercontroll)
sq.sync().then((response)=>{
    console.log(response)
}).catch(err=>{
    console.log(err)
})

app.listen(3000);
