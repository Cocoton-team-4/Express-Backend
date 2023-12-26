const Sequelize = require('sequelize');

module.exports = class Space extends Sequelize.Model{
    static init(sequelize) {
        return super.init({
        },
            {
                sequelize,
                modelName: 'Space',
                tableName: 'spaces',
                charset: 'utf8',
                collate: 'utf8_general_ci',
            });
    }

    static associate(db) {
        db.Space.hasMany(db.Post, { foreignKey: 'spaceId' });
        db.Space.hasMany(db.Note, { foreignKey: 'spaceId' });
        db.Space.belongsToMany(db.User, {through: 'UserSpaceMapping'});
    }
}