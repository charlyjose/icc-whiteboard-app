const dbConfig = require("../config/db.config")
const mongoose = require("mongoose")
mongoose.Promise = global.Promise

const db =  {}
db.mongoose = mongoose
db.url = dbConfig.url

db.whiteboard = require('./whiteboard.model')(mongoose)
db.drawing = require('./drawing.model')(mongoose)

db.user = require("./user.model")
db.role = require("./role.model")

db.ROLES = ["user", "admin", "moderator"];

module.exports = db