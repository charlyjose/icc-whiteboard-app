module.exports = (sequelize, Sequelize) => {
    const Category = sequelize.define("category", {
        username: {
            type: Sequelize.STRING
        },
        categoryName: {
            type: Sequelize.STRING
        },
        categoryColor: {
            type: Sequelize.STRING
        }
    })
    return Category
}