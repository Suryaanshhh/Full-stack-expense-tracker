const { response } = require("express");
const Sib = require("sib-api-v3-sdk");
require("dotenv").config();
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const User = require("../model/user");
const ForgetPassword = require("../model/ForgotPasswordRequests");

exports.forgetPassword = (req, res) => {
  const mail = req.body.mail;
  console.log(mail)
  const client = Sib.ApiClient.instance;

  const apiKey = client.authentications["api-key"];

  apiKey.apiKey =
    "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";

  const TranEmailApi = new Sib.TransactionalEmailsApi();

  const sender = {
    email: "suryanshdwivedi615@gmail.com",
  };
  const recievers = [
    {
      email: mail,
    },
  ];
  const uid = uuidv4();
  const UId = req.user.id;
  ForgetPassword.create({
    id: uid,
    UserId: UId,
    active: true,
  }).then(() => {
    TranEmailApi.sendTransacEmail({
      sender,
      to: recievers,
      subject: "Password Reset Mail",
      textContent: `http://localhost:3000/reset-password/${uid}`,
    })
      .then((response) => {
        console.log(response);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  res.status(201).json(response);
};

exports.resetpassword = (req, res) => {
  const Uid = req.params.uid;
  console.log(`uidis${Uid}`)
  ForgetPassword.findOne({ where: { id:Uid } }).then((forgotpasswordrequest) => {
    if (forgotpasswordrequest) {
      forgotpasswordrequest.update({ active: false });
      res.status(200).send(`<html>
                                    <script>
                                        function formsubmitted(e){
                                            e.preventDefault();
                                            console.log('called')
                                        }
                                    </script>
                                    <form action="/updatepassword/${Uid}" method="get">
                                        <label for="newpassword">Enter New password</label>
                                        <input name="newpassword" type="password" required></input>
                                        <button>reset password</button>
                                    </form>
                                </html>`);
      res.end();
    }
  });
};

exports.updatepassword = (req, res) => {
  try {
    const { newpassword } = req.query;
    console.log(`newpass-${newpassword}`);

    const { resetpasswordid } = req.params;
console.log(`reset id-${resetpasswordid}`)
    ForgetPassword.findOne({ where: { id: resetpasswordid } }).then(
      (resetpasswordrequest) => {
        console.log(resetpasswordrequest)
        User.findOne({ where: { id: resetpasswordrequest.UserId } }).then(
          (user) => {
            if (user) {
              const saltRounds = 10;
              bcrypt.genSalt(saltRounds, function (err, salt) {
                if (err) {
                  console.log(err);
                  throw new Error(err);
                }
                bcrypt.hash(newpassword, salt, function (err, hash) {
                  if (err) {
                    console.log(err);
                    throw new Error(err);
                  }
                  user.update({ password: hash }).then(() => {
                    res
                      .status(201)
                      .json({ message: "Successfuly update the new password" });
                  });
                });
              });
            } else {
              return res
                .status(404)
                .json({ error: "No user Exists", success: false });
            }
          }
        );
      }
    );
  } catch (error) {
    return res.status(403).json({ error, success: false });
  }
};
