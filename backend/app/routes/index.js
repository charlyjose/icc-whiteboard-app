module.exports = app => {
    const elementRouter = require("./element.routes")
    const todoRouter = require("./todo.routes")
    app.use("/api/element", elementRouter)
    app.use("/api/todo", todoRouter)
}