const Sequelize = require('sequelize');
const Account = require('./account');
const User = require('./user');
const Space = require('./space');
const UserSpaceMapping = require('./userspace');
const Post = require('./post');
const Note = require('./note');

const env = process.env.DATA_ENV || 'development';
const config = require('../config/config')[env];
const db = {};
 
const sequelize = new Sequelize(config.database, config.user, config.password, config);

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.Account = Account;
db.User = User;
db.Space = Space;
db.UserSpaceMapping = UserSpaceMapping;
db.Post = Post;
db.Note = Note;

Account.init(sequelize);
User.init(sequelize);
Space.init(sequelize);
UserSpaceMapping.init(sequelize);
Post.init(sequelize);
Note.init(sequelize);

Account.associate(db);
User.associate(db);
Space.associate(db);
Post.associate(db);
Note.associate(db);

module.exports = db;