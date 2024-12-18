const SequelizeAuto = require('sequelize-auto');
const path = require('path');
require('dotenv').config();  
const { DB_HOST, DB_USER, DB_PASS, DB_NAME, DB_DIALECT } = process.env;

const auto = new SequelizeAuto(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  dialect: DB_DIALECT,
  directory: path.join(__dirname, '../models'), 
  additional: {
    timestamps: false, 
    caseModel: 'c', 
    noAlias: false, 
    timestamps: false, 
    caseFile: 'c', 
  }
});


auto.run()