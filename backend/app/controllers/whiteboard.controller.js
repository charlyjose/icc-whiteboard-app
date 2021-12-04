var hri = require('human-readable-ids').hri
const db = require("../models")
const Whiteboard = db.whiteboard
const User = db.user

module.exports = {
    create: async (req, res) => {
        // create a new boardId and check if that same id exists in db
        var tempJoinCode = null
        var doesIdExists = true
        while (doesIdExists) {
            tempJoinCode = hri.random()
            doesIdExists = await Whiteboard.exists({ joinCode: tempJoinCode })
        }

        var joinCode = tempJoinCode
        var userId = req.res.req.userId
        const whiteboard = new Whiteboard({
            joinCode: joinCode,
            creatorId: userId,
            authorised: [],
            data: []
        })

        whiteboard.save(whiteboard)
            .then(data => {
                if (!data) {
                    res.status(404).send({ message: "Error while creating the Whitboard" })
                }
                else {
                    var resp = {
                        boardId: data._id,
                        joinCode: data.joinCode,
                        message: "Whiteboard created successfully"
                    }
                    res.status(200).send(resp)
                }
            })
            .catch(error => {
                res.status(500).send({
                    message: error.message || "Some error occurred while creating the Whitboard"
                })
            })
    },

    findBoardId: async (req, res) => {
        const joinCode = req.body.joinCode
        var userId = req.res.req.userId

        var condition = joinCode ? { joinCode: { $regex: new RegExp(joinCode), $options: "i" } } : {};

        Whiteboard.findOne(condition)
            .then(data => {
                console.log(data)
                if (!data) {
                    res.status(404).send({ message: "Could not find whiteboard with code " + joinCode })
                }
                else {
                    var authorised = (userId == data.creatorId) ? true : data['authorised'].includes(userId)
                    var resp = {
                        boardId: data._id,
                        ownership: (userId == data.creatorId),
                        authorised: authorised,
                        message: authorised ? "Authorised" : "Not authorised" 
                    }
                    res.status(200).send(resp)
                }
            })
            .catch(error => {
                res.status(500).send({
                    message: error.message || "Cannot retrieve whiteboard with code " + joinCode
                })
            })
    },


    authorizeAccess: async (req, res) => {
        var boardId = req.body.boardId
        var username = req.body.username
        var userId = req.res.req.userId

        await User.exists({ username: username }) ?
            (
                User.findOne({ username: username })
                    .then(data1 => {
                        if (!data1) {
                            res.status(404).send({ message: `User ${username} not found in database` })
                        }
                        else {
                            (userId == data1._id) ? (
                                res.status(200).send({ message: "Action not necessary" })
                            ) : (
                                Whiteboard.updateOne(
                                    { _id: boardId, creatorId: userId },
                                    { $addToSet: { authorised: data1._id } })
                                    .then(data => {
                                        var resp = {
                                            boardId: data._id,
                                            message: data.modifiedCount ? "User authorised" : "Could not find whiteboard with Id " + boardId
                                        }
                                        res.status(200).send(resp)
                                    })
                                    .catch(error => {
                                        res.status(500).send({
                                            message: error.message || "Cannot retrieve whiteboard with Id " + boardId
                                        })
                                    })
                            )
                        }
                    })
                    .catch(error => {
                        res.status(500).send({
                            message: error.message || "Cannot retrieve user details"
                        })
                    })
            ) : (
                res.status(404).send({ message: `User ${username} not found in database` })
            )
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