const express = require('express');
const info = require('../util/info.js');
const LoginSystem = require("../login/loginSystem.js");
const router = express.Router();

router.post("/signin", async (req, res)=>{
    try{
        const {id, password} = req.body;

        console.log(id + " " + password);

        const module = new LoginSystem(id, password);
        const execute = await module.Login();

        console.log(req.session);
        console.log(execute);
        if (req.session.isLogined == false || req.session.isLogined == null) {
             if(execute != -1){
                    console.log(id + "님이 로그인하셨습니다.");
                    const nickname = await info.getNickname(execute);
                    const accountId = await info.getAccount(execute);

                    req.session.userId = execute;
                    req.session.isLogined = true;
                    req.session.cookie.maxAge = 3600000; //기본 세션 만료 시간은 1시간
                    req.session.save((error) => {
                        if (error) {
                            console.log(error);
                        }
                        else {
                            res.status(200).json({
                                msg: 'successful login',
                                accountId : accountId,
                                nickname : nickname
                            });
                            return;
                        }
                    });
                }
                else{
                    console.log(id + "님은 등록되지 않은 회원이거나 아이디/비밀번호가 잘못되었습니다.");
                    return res.status(400).json({msg:'failed username : ' + id,userId : execute});
                }        
        }
        else {
            res.status(401).send("이미 로그인중이십니다.");
            return;
        }
    }
    catch (err){
        console.log(err);
        if(err == 'Nan') res.status(400).json({msg:'Non Account'});
        else res.status(500).json({msg:'Format Error'});
    }},
);

router.post('/signout', function(req, res){
    if(req.session.userId){
        req.session.destroy(function(err){ 
            if(err){
                console.log(err);
            }else{
                res.clearCookie('login');
                res.status(200).send("logout");
            }
        })
    }else{
        res.status(400).send("logout failed");
    }
});

//회원가입
router.post("/signup", async (req, res)=>{
        try{
            const {id, password, name, phonenumber} = req.body;

            console.log("가즈나~");

            const module = new LoginSystem(id, password);
            const execute = await module.Register(name, phonenumber);

            console.log(id + " " + password);

            if(execute == 1){
                console.log(id + "님이 회원가입 하셨습니다.");
                res.status(200).send('success register');
            }
            else if(execute == 2){
                console.log(id + "님은 이미 등록된 회원입니다.");
                res.status(400).send('duplicate username : ' + id);
            }
            else {
                console.log("비밀번호 형식이 틀렸습니다.");
                res.status(401).send('password pattern is not correct');
            }
        }
        catch (err){
            console.log(err);
            res.status(500).send('Unexpected Error');
        }
    },
);

module.exports = router;