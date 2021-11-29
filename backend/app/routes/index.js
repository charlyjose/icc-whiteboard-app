module.exports = app => {
    // const elementRouter = require("./element.routes")
    const todoRouter = require("./todo.routes")
    // const authRouter = require("./auth.routes")//(app)
    // const userRouter = require("./user.routes")//(app)

    // app.use("/api/element", elementRouter)
    app.use("/api/todo", todoRouter)
    // app.use("/api/auth", authRouter)
    // app.use("/api/user", userRouter)
}