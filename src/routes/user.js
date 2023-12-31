const express = require('express');
const User = require('../../models/user');
const Account = require('../../models/account');
const crypto = require("../util/crypto");
const filter = require("../util/filtering");
const router = express.Router();

//유저 아이디로 세부적인 정보 받아오기
router.get('/:id', async (req, res) => {
    try{
        const handle = req.params.id;
        // const handle = req.session.userId
        
        //로그인 하지 않았을 경우
        // if(handle == null){
        //     res.status(403).json({msg: 'No Authorization' });
        //     return;
        // }

        const userId = await info.getUserId(handle);
        console.log(userId);

        //없는 계정인 경우
        if(userId == null){
            res.status(400).json({msg: 'Non User'});
            return;
        }

        const nickname = await info.getNickname(userId);

        res.status(200).json({
            msg: 'successful getInformation',
            accountId : handle,
            nickname : nickname
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({msg: 'Internal Server Error' });
    }
});

router.put('/:id', async (req, res) => {
    try{
        const query = req.params.id;
        const handle = req.session.userId;
        
        //로그인 하지 않았을 경우
        if(handle == null){
            res.status(403).json({msg: 'No Authorization' });
            return;
        }

        const {password, nickname} = req.body;

        const user = await User.findOne({
            where : {
                id : handle
            }
        });

        //없는 계정인 경우
        if(user == null){
            res.status(400).json({msg: 'Non User' });
            return;
        }

        //로그인한 유저와 일치하지 않는 경우
        if(query != handle){
            res.status(403).json({msg: 'No Authorization' });
            return;
        }

        let reg = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,15}$/

        if (reg.test(password) == false){
            res.status(400).json({msg: 'Password Pattern is not valid' });
            return;
        }
        if (nickname == null){
            res.status(400).json({msg: 'Nickname is empty' });
            return;
        }
        if (nickname.length < 3){
            res.status(400).json({msg: 'Nickname is too short' });
            return;
        }
        if (filter.checkAbuse(nickname)){
            res.status(400).json({msg: 'Nickname contains an abusive word'});
            return;
        }

        const account = await Account.findOne({
            where : {
                userId : handle
            }
        });

        await user.update({
            nickname : nickname
        });

        const hashedPW = await crypto.createHash(password);
        const salt = hashedPW.salt;

        await account.update({
            salt : salt, password : hashedPW.password
        });

        res.status(200).json({msg: 'Successfully modified' });
    }   
    catch (err){
        console.log(err);
        res.status(500).json({msg: 'Internal Server Error' });
    }
});

module.exports = router;