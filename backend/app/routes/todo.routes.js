const todo = require("../controllers/todo.controller")
var router = require("express").Router()

router.post("/", todo.create)
router.get("/", todo.findAll)
router.get("/:id", todo.findOne)
router.put("/:id", todo.update)
router.delete("/:id", todo.delete)
router.delete("/", todo.deleteAll)

module.exports = router