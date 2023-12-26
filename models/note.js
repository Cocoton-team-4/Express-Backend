const Sequelize = require('sequelize');

module.exports = class Note extends Sequelize.Model{
    static init(sequelize) {
        return super.init({
            plot: {
                type: Sequelize.STRING(1000),
                allowNull: false,
            },
            author: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
        },
            {
                sequelize,
                modelName: 'Note',
                tableName: 'notes',
                charset: 'utf8',
                collate: 'utf8_general_ci',
            });
    }

    static associate(db) {
        db.Note.belongsTo(db.Space, { foreignKey: 'spaceId' });
    }
}