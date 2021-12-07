const { authJwt } = require("../middlewares")
const drawing = require("../controllers/drawing.controller")

module.exports = function (app) {
    // app.use(function (req, res, next) {
    //     // res.header(
    //     //     // { "Access-Control-Allow-Headers": "x-access-token, Origin, Content-Type, Accept" },
    //     //     // { Connection: "keep-alive" },
    //     //     // // { setTimeout: 10000 }
    //     // ).setTimeout(10000).Connection('Keep-Alive')

    //     // res.set({
    //     //     'Content-Type': 'text/event-stream',
    //     //     'Connection': 'Keep-Alive',
    //     //     'Timeout': '10000'
    //     //     // 'Content-Length': '123',
    //     //     // 'ETag': '12345'
    //     // })


    //     next()
    // })

    // app.get("/api/whiteboard/drawing/sync", [authJwt.verifyToken], drawing.sync)
    app.get("/api/whiteboard/drawing/sync", drawing.sync)

}