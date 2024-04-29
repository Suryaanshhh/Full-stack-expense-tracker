const express=require('express');
const Router =express.Router()
const UserControll=require('../controller/User-controller');
const userAuthenticator=require('../middleware/auth');
const Premium=require('../controller/premium-controller');
const ForgetPassword=require('../controller/passController');

Router.post('/register-user',UserControll.register);

Router.post('/login-user/:email',UserControll.Login);

Router.post('/add-expense',userAuthenticator.authenticator,UserControll.AddExpense);

Router.get('/get-expense' ,userAuthenticator.authenticator , UserControll.ShowExpense);

Router.delete('/delete-expense/:id',UserControll.DeleteExpense);

Router.use('/Premium-Membership',userAuthenticator.authenticator,UserControll.PurchasePremium);

Router.post('/Transaction-Status',userAuthenticator.authenticator,UserControll.UpdateTransactionStatus);

Router.get('/showLeaderBoard',userAuthenticator.authenticator,Premium.ShowLeaderBoard);

Router.post('/forget-password',userAuthenticator.authenticator,ForgetPassword.forgetPassword);

Router.get('/reset-password/:uid',ForgetPassword.resetpassword);

Router.get('/updatepassword/:resetpasswordid',ForgetPassword.updatepassword);

Router.get('/download-expense',userAuthenticator.authenticator,UserControll.downloadExpense)

module.exports=Router;