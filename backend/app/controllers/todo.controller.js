const db = require("../models")
const Todo = db.todo
const Op = db.Sequelize.Op

exports.create = (req, res) => {
    if (!req.body.title) {
        res.status(400).send({
            message: "Title cannot be empty"
        })
        return
    }

    const todo = {
        title: req.body.title,
        userId: '1',
        description: req.body.description,
        category: req.body.category,
        schedule: req.body.schedule
    }

    Todo.create(todo)
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
    const searchTerm = req.query.searchTerm

    var condition = searchTerm ?
        {
            [Op.or]: [
                { title: { [Op.iLike]: `%${searchTerm}%` } },
                { description: { [Op.iLike]: `%${searchTerm}%` } },
                { category: { [Op.iLike]: `%${searchTerm}%` } }
            ]
        } : null;

    Todo.findAll({ where: condition })
        .then(data => {
            res.status(200).send(data)
        })
        .catch(error => {
            res.status(500).send({
                message: error.message || "Some error occurred while retrieving todos"
            })
        })
}

exports.findOne = (req, res) => {
    const id = req.params.id

    Todo.findByPk(id)
        .then(data => {
            res.status(200).send(data)
        })
        .catch(error => {
            res.status(500).send({
                message: error.message || "Cannot retrieve Todo with ID = " + id
            })
        })
}

exports.update = (req, res) => {
    const id = req.params.id

    Todo.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.status(200).send({
                    message: "Todo updated successfully"
                })
            }
            else {
                res.status(404).send({
                    message: `Cannot update Todo with ID = ${id}. Maybe Todo was not found or req.body was empty.`
                })
            }
        })
        .catch(error => {
            res.status(500).send({
                message: "Error updating Todo with ID = " + id
            })
        })
}

exports.delete = (req, res) => {
    const id = req.params.id

    Todo.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.status(200).send({
                    message: "Todo deleted successfully"
                })
            }
            else {
                res.status(404).send({
                    message: `Cannot delete Todo with ID = ${id}. Maybe Todo was not found or req.body was empty.`
                })
            }
        })
        .catch(error => {
            res.status(500).send({
                message: "Could not delete Todo with id=" + id
            })
        })
}

exports.deleteAll = (req, res) => {
    Todo.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.status(200).send({
                message: `${nums} Todo(s) deleted successfully`
            })
        })
        .catch(error => {
            res.status(500).send({
                message: error.message || "Some error occurred while removing todo(s)"
            })
        })
}