const Account = require("../../models/account");
const cryptoModule = require("../util/crypto");
const crypto = require('crypto');
const User = require('../../models/user');

class LoginSystem{
    constructor(id, pass){
        this._id = id;
        this._password = pass;
    }

    async Register(name, phoneNumber){
        const cryptedId = await cryptoModule.cipher(this._id);
        if(name == null) name = "끼얏호우";
        if(phoneNumber == null) phoneNumber = "끼얏호우";
        
        const exist = await Account.findOne({
            where:{
                id : cryptedId,
            },
        },);


        if (exist == null) {
            let reg = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,15}$/

            if (reg.test(this._password) == false) return 0;

            const hash = await cryptoModule.createHash(this._password);
            const cryptedPW = hash.hashed;
            const salt = hash.salt;

            //DB에 계정 정보 등록
            const account = await Account.create({id: cryptedId, password: cryptedPW, salt: salt});
            const user = await User.create({name:name, phonenumber : phoneNumber});
            await account.setUser(user);

            console.log("회원가입 성공");
            return 1;
        }
        else{
            console.log("회원가입 실패");
            return 2;
        }
    }

    async Login(){
        const id = await cryptoModule.cipher(this._id);
        let bool = -1
        const comparePW = await new Promise(async (resolve, reject) =>{
            const salt = await Account.findOne({
                attributes: ['salt'],
                raw: true,
                where:{
                    id,
                },
            },);

            if(salt != null){
                crypto.pbkdf2(this._password, salt.salt, 104906, 64, 'sha512', (err, key) => {
                    if(err) reject(err);
                    else resolve({hashed : key.toString('base64'), salt});
                });    
            }
            else{
                reject('Nan');
            }
            },)
            .then(async (result) => {
            let realPW;
            if(result != null){
                realPW = await Account.findOne({
                    attributes: ['password', 'UserId'],
                    raw: true,
                    where:{
                        id,
                    },
                },);
            }   
            if(realPW.password == result.hashed){
                console.log("로그인 성공!");
                bool = realPW.UserId;
            }
            else{
                console.log("로그인 실패!");
                bool = -1;
            }
        });
        return bool; 
    }

    async GetInformation(userId){
        const user = await User.findOne({
            attributes : ['name', 'phonenumber'],
            where : {
                id : userId
            }
        });

        console.log(user.name);

        return user.name;
    }
}

module.exports = LoginSystem;