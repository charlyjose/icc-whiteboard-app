const dbConfig = require("../config/db.config")
const Sequelize = require("sequelize")
const seqelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorsAliases: false,
    
    pool: {
        min: dbConfig.pool.min,
        max: dbConfig.pool.max,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
})

const db = {}
db.Sequelize = Sequelize
db.seqelize = seqelize
db.todo = require("./todo.model")(seqelize, Sequelize)
db.category = require("./category.model")(seqelize, Sequelize)

module.exports = db