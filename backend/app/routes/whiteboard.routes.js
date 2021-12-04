const { authJwt } = require("../middlewares")
const whiteboard = require("../controllers/whiteboard.controller")

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next()
    })

    app.post("/api/whiteboard/create", [authJwt.verifyToken], whiteboard.create)
    app.post("/api/whiteboard/get/boardId/", [authJwt.verifyToken], whiteboard.findBoardId)
    app.post("/api/whiteboard/authorize/user/", [authJwt.verifyToken], whiteboard.authorizeAccess)

    // app.get("/api/whiteboard/get/owned/joincode", [authJwt.verifyToken], whiteboard.findAllOwned)
    // app.delete("/api/whiteboard/delete/:id", [authJwt.verifyToken], whiteboard.delete)
    // app.delete("/api/whiteboard/delete/owned", [authJwt.verifyToken], whiteboard.deleteAllOwned)
    // app.put("/api/whiteboard/update/:id", [authJwt.verifyToken], whiteboard.update)
}