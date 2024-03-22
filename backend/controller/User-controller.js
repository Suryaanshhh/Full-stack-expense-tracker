
const { response } = require('express');
const User = require('../model/user');
const bcrypt = require('bcrypt');


exports.register = (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    bcrypt.hash(password, 10, async (err, hash) => {
        console.log(err)
        await User.create({
            name: name,
            email: email,
            password: hash
        }).then((data) => {
            console.log(data)
            res.status(201).json({ User: data })
        }).catch(err => console.log(err))
    })
}

exports.Login = (req, res, next) => {
    const email = req.params.email;
    const password = req.body.password;
    // console.log(`firts pass is ${password}`);
    User.findAll({ where: { email: email } }).then((user) => {
        if (user.length > 0) {
            bcrypt.compare(password, user[0].password, (err, result) => {
                if (err) {
                    res.status(500).json({ success: false, message: 'Something went wrong' });
                }
                if (result == true) {
                    //console.log(`second pass is ${user[0].password}`);
                    res.status(201).json({ message: "Login Successfull" });
                } else {
                    res.status(401).json({ message: "Incorrect Password" });
                }
            });
        } else {
            res.status(404).json({ message: "user not found" });
        }
    }).catch(err => {
        console.log(err);
    });
};