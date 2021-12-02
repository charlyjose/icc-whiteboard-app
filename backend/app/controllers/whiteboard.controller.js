var hri = require('human-readable-ids').hri
const db = require("../models")
const Whiteboard = db.whiteboard


module.exports = {
    create: async (req, res) => {
        // create a new boardId and check if that same id exists in db
        var tempId = null
        var doesIdExists = true
        while (doesIdExists) {
            tempId = hri.random()
            doesIdExists = await Whiteboard.exists({ boardId: tempId })
        }

        boardId = tempId
        const createdBy = req.res.req.userId
        const whiteboard = new Whiteboard({
            boardId: boardId,
            createdBy: createdBy,
            accessed: [],
            data: []
        })

        whiteboard.save(whiteboard)
            .then(data => {
                if (!data) {
                    res.status(404).send({ message: "Error while creating the Whitboard" })
                }
                else {
                    res.status(200).send(data._id)
                }
            })
            .catch(error => {
                res.status(500).send({
                    message: error.message || "Some error occurred while creating the Whitboard"
                })
            })
    },

    findAll: async (req, res) => {
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
    },

    findOne: async (req, res) => {
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
    },

    update: async (req, res) => {
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
    },

    delete: async (req, res) => {
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
    },

    deleteAll: async (req, res) => {
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

}