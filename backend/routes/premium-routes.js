const express=require('express');
const Router =express.Router();
const userAuthenticator=require('../middleware/auth');
const Premium=require('../controller/premium-controller');

Router.use('/Premium-Membership',userAuthenticator.authenticator,Premium.PurchasePremium);

Router.post('/Transaction-Status',userAuthenticator.authenticator,Premium.UpdateTransactionStatus);

Router.get('/showLeaderBoard',userAuthenticator.authenticator,Premium.ShowLeaderBoard);

module.exports=Router;