const { Sequelize } = require("sequelize");

const sq = require("../util/database");

const passRequest=sq.define("requests",{
    id:{
        type:Sequelize.STRING,
        allowNull:false,
        unique:true ,
        primaryKey:true
    },
    active:{
        type:Sequelize.BOOLEAN
    }
})

module.exports=passRequest