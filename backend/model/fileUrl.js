const { Sequelize, INTEGER } = require("sequelize");

const sq = require("../util/database");

const fileUrl=sq.define("URLS",{
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        allowNull:false,
        autoIncrement:true
    },
    Link:{
        type:Sequelize.STRING
    }
})

module.exports=fileUrl