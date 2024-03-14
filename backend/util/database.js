const {Sequelize} =require('sequelize');
const sq=new Sequelize('new-db','root','suryansh',{ dialect:'mysql',host:"localhost"});

module.exports=sq;