const { Sequelize } = require("sequelize");

const sq = require("../util/database");

const User = sq.define("User", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  premium: {
    type: Sequelize.BOOLEAN,
  },
  total: {
    type: Sequelize.INTEGER,
  },
});

module.exports = User;
