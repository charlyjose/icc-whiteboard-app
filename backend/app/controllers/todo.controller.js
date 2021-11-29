const db = require("../models")
const Todo = db.todo

exports.create = (req, res) => {
    if (!req.body.title) {
        return res.status(400).send({
            message: "Title cannot be empty"
        })
    }

    const todo = new Todo({
        title: req.body.title,
        description: req.body.description,
        category: req.body.category
    })

    todo.save(todo)
        .then(data => {
            res.status(200).send(data)
        })
        .catch(error => {
            res.status(500).send({
                message: error.message || "Some error occurred while creating the Todo"
            })
        })
}

exports.findAll = (req, res) => {
    const title = req.query.title;
    var condition = title ? { title: { $regex: new RegExp(title), $options: "i" } } : {};

    Todo.find(condition)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving tutorials."
            })
        })
}

exports.findOne = (req, res) => {
    const id = req.params.id

    Todo.findById(id)
        .then(data => {
            if (!data) {
                res.status(404).send({ message: "Not found Tutorial with id" + id })
            }
            else
                res.status(200).send(data)
        })
        .catch(error => {
            res.status(500).send({
                message: error.message || "Cannot retrieve Todo with ID = " + id
            })
        })
}

exports.update = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Data to update can not be empty!"
        })
    }

    const id = req.params.id

    Todo.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot update Tutorial with id=${id}. Maybe Tutorial was not found!`
                })
            }
            else res.send({ message: "Tutorial was updated successfully." })
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Tutorial with id=" + id
            })
        })
}

exports.delete = (req, res) => {
    const id = req.params.id

    Todo.findByIdAndRemove(id)
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete Tutorial with id=${id}. Maybe Tutorial was not found!`
                })
            } else {
                res.send({
                    message: "Tutorial was deleted successfully!"
                })
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Tutorial with id=" + id
            })
        })
}

exports.deleteAll = (req, res) => {
    Todo.deleteMany({})
        .then(data => {
            res.send({
                message: `${data.deletedCount} Tutorials were deleted successfully!`
            })
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all tutorials."
            })
        })
}