const express=require('express');
const User=require('../model/user');
const app=express();

  const register=app.post('/register-user',(req,res,next)=>{
    const name=req.body.name;
    const email=req.body.email;
    const password=req.body.password;
    User.create({
        name:name,
        email:email,
        password:password
    }).then((data)=>{
        console.log(data)
        res.status(201).json({User:data})
    }).catch(err=>console.log(err))
})

module.exports=register