const { authJwt } = require("../middlewares")
const todo = require("../controllers/todo.controller")

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next()
    })

    app.post("/api/todo/", [authJwt.verifyToken], todo.create)
    app.get("/api/todo/", [authJwt.verifyToken], todo.findAll)
    app.get("/api/todo/:id", [authJwt.verifyToken], todo.findOne)
    app.put("/api/todo/:id", [authJwt.verifyToken], todo.update)
    app.delete("/api/todo/:id", [authJwt.verifyToken], todo.delete)
    app.delete("/api/todo/", [authJwt.verifyToken], todo.deleteAll)
}