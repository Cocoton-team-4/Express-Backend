const Sequelize = require('sequelize');

module.exports = class UserSpaceMapping extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            role: {
                type: Sequelize.STRING(100),
                defaultValue:0,
                allowNull: false,
            },
        },
            {
                sequelize,
                timestamps: false,
                modelName: 'UserSpaceMapping',
                tableName: 'userspacemappings',
                charset: 'utf8',
                collate: 'utf8_general_ci',
            });
    }
}