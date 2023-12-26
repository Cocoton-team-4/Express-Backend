const Sequelize = require('sequelize');

module.exports = class Post extends Sequelize.Model{
    static init(sequelize) {
        return super.init({
            plot: {
                type: Sequelize.STRING(1000),
                allowNull: false,
            },
            picture: {
                type: Sequelize.STRING(100),
                allowNull: false,
            },
            author: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            date: {
                type: Sequelize.DATE,
                allowNull: false,
            },
        },
            {
                sequelize,
                modelName: 'Post',
                tableName: 'posts',
                charset: 'utf8',
                collate: 'utf8_general_ci',
            });
    }

    static associate(db) {
        db.Post.belongsTo(db.Space, { foreignKey: 'spaceId' });
    }
}