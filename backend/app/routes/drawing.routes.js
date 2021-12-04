const { authJwt } = require("../middlewares")
const drawing = require("../controllers/drawing.controller")

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next()
    })

    app.post("/api/whiteboard/drawing/create", [authJwt.verifyToken], drawing.create)
    app.get("/api/whiteboard/drawing/load", [authJwt.verifyToken], drawing.load)

}