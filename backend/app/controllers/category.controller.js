const db = require("../models")
const Category = db.category
const Op = db.Sequelize.Op

exports.create = (req, res) => {
    // if (!req.body.categoryName) {
    //     res.status(400).send({
    //         message: "Category cannot be empty"
    //     })
    //     return
    // }

    // const category = {
    //     userId: '1',
    //     categoryName: req.body.categoryName,
    //     categoryColor: req.body.categoryColor
    // }

    // Category.create(category)
    //     .then(data => {
    //         res.status(200).send(data)
    //     })
    //     .catch(error => {
    //         res.status(500).send({
    //             message: error.message || "Some error occurred while creating the Category"
    //         })
    //     })

    console.log('\nELEMENT: ', req.body.elements)
    return
}

exports.findAll = (req, res) => {
    const searchTerm = req.query.searchTerm

    var condition = searchTerm ? { categoryName: { [Op.iLike]: `%${searchTerm}%` } } : null;

    Category.findAll({ where: condition })
        .then(data => {
            res.status(200).send(data)
        })
        .catch(error => {
            res.status(500).send({
                message: error.message || "Some error occurred while retrieving categories"
            })
        })
}

exports.findOne = (req, res) => {
    const id = req.params.id

    Category.findByPk(id)
        .then(data => {
            res.status(200).send(data)
        })
        .catch(error => {
            res.status(500).send({
                message: error.message || "Cannot retrieve Category with ID = " + id
            })
        })
}


exports.update = (req, res) => {
    const id = req.params.id

    Category.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.status(200).send({
                    message: "Category updated successfully"
                })
            }
            else {
                res.status(404).send({
                    message: `Cannot update Category with ID = ${id}. Maybe Category was not found or req.body was empty.`
                })
            }
        })
        .catch(error => {
            res.status(500).send({
                message: "Error updating Category with ID = " + id
            })
        })
}


exports.delete = (req, res) => {
    const id = req.params.id

    Category.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.status(200).send({
                    message: "Category deleted successfully"
                })
            }
            else {
                res.status(404).send({
                    message: `Cannot delete Category with ID = ${id}. Maybe Category was not found or req.body was empty.`
                })
            }
        })
        .catch(error => {
            res.status(500).send({
                message: "Could not delete Category with id=" + id
            })
        })
}

exports.deleteAll = (req, res) => {
    Category.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.status(200).send({
                message: `${nums} Category(s) deleted successfully`
            })
        })
        .catch(error => {
            res.status(500).send({
                message: error.message || "Some error occurred while removing category(s)"
            })
        })
}