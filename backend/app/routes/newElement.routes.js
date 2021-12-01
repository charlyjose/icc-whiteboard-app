const { authJwt } = require("../middlewares")
const category = require("../controllers/category.controller")

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next()
    })

    app.post("/api/element/", [authJwt.verifyToken], category.create)

    app.get("/api/element/load", [authJwt.verifyToken], category.load)
}