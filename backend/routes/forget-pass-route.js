const express=require('express');
const Router =express.Router();
const userAuthenticator=require('../middleware/auth');
const ForgetPassword=require('../controller/passController');

Router.post('/forget-password',ForgetPassword.forgetPassword);

Router.get('/updatepassword/:resetpasswordid',ForgetPassword.updatepassword);

Router.get('/reset-password/:uid',ForgetPassword.resetpassword);

module.exports=Router;
