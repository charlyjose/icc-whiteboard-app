module.exports = (sequelize, Sequelize) => {
    const Todo = sequelize.define("todo", {
        userId: {
            type: Sequelize.STRING
        },
        title: {
            type: Sequelize.STRING
        },
        description: {
            type: Sequelize.STRING
        },
        category: {
            type: Sequelize.STRING
        },
        schedule: {
            type: Sequelize.STRING
        }
    })
    return Todo
}