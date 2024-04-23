const { response } = require('express');
const Sib=require('sib-api-v3-sdk');
require('dotenv').config()

exports.forgetPassword=(req,res)=>{
    const mail=req.body.email
    const client=Sib.ApiClient.instance;

const apiKey=client.authentications['api-key'];

apiKey.apiKey="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"

const TranEmailApi=new Sib.TransactionalEmailsApi()

const sender={
    email:'suryanshdwivedi615@gmail.com'
}
const recievers=[
    {
        email:'suryanshdwivedi58@gmail.com'
    },
]
TranEmailApi.sendTransacEmail({
    sender,
    to:recievers,
    subject:"testMail",
    textContent:"Successfull"
}).then((response)=>{
   // console.log(response)
}).catch(err=>{
    console.log(err)
})
res.status(201).json(response)
}