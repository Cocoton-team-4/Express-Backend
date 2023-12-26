const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');   
const http = require('http');         
const MySQLStore = require('express-mysql-session')(session);
dotenv.config();

const {sequelize} = require('./models');

const env = process.env.DATA_ENV || 'development';
const config = require('./config/config.js')[env];

const app = express();

const indexRouter = require('./src/routes/');
const userRouter = require('./src/routes/user');
const postRouter = require('./src/routes/post');
const noteRouter = require('./src/routes/note');

const sessionMiddleware = session({
    key : 'login',
    secret:process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: true,
    rolling : true,
    store: new MySQLStore({
        host : config.host,
        port : 3306,
        user : config.user,
        clearExpired: true,
        checkExpirationInterval: 30000,
        password : config.password,
        database: config.database,
    }),
    cookie: {
        maxAge : 0,
        expires : new Date(Date.now() + 36000000000)
    }
});

app.set('port', 8000);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(sessionMiddleware);
app.use(cors());

app.set('trust proxy',1);

app.use("/", indexRouter);
app.use("/user", userRouter);
app.use("/posting", postRouter);
app.use("/note", noteRouter);

app.post("/test", async (req, res) => {
    const Space = require('./models/space.js');
    const User = require('./models/user.js');

    const tmp = await Space.create();
    const user = await User.findOne({
        where : {
            id : 1
        }
    });

    await tmp.addUser(user);

    res.status(200).json({msg: 'Non User'});
});

const httpserver = http.createServer(app);

httpserver.listen(app.get('port'), async() => {
    console.log(app.get('port'), '번 포트에서 대기중');
    await sequelize
        .sync({ force: false })
        .then(async () => {
            console.log("데이터베이스 연결 됨");
        })
        .catch((error) => {
            console.log(error);
        });
});