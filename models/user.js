const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            name: {
                type: Sequelize.STRING(100),
                allowNull: false,
                primaryKey: false,
            },
            phonenumber : {
                type: Sequelize.STRING(100),
                allowNull: false,
                primaryKey: false,
            }
        },
            {
                sequelize,
                modelName: 'User',
                tableName: 'users',
                charset: 'utf8',
                collate: 'utf8_general_ci',
            });
    }

    static associate(db) {
        db.User.hasOne(db.Account, {foreignKey: 'UserId', sourceKey: 'id'});
        db.User.belongsToMany(db.Space, {through: 'UserSpaceMapping'});
    }
}