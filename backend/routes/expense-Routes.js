const express=require('express');
const Router =express.Router();
const userAuthenticator=require('../middleware/auth');
const ExpController=require('../controller/expense-controller');

Router.post('/add-expense',userAuthenticator.authenticator,ExpController.AddExpense);

Router.get('/get-expense' ,userAuthenticator.authenticator , ExpController.ShowExpense);

Router.delete('/delete-expense/:id',ExpController.DeleteExpense);

Router.get('/download-expense',userAuthenticator.authenticator,ExpController.downloadExpense);

Router.get('/get-url',userAuthenticator.authenticator,ExpController.getUrl);


module.exports=Router;