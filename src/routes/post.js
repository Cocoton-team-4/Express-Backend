const express = require('express');
const validCheck = require('../util/validCheck');
const Post = require('../../models/post');
const Space = require('../../models/space');
const User = require('../../models/user');
const filter = require("../util/filtering");
const router = express.Router();

//유저 아이디로 세부적인 정보 받아오기
router.get('/:id', async (req, res) => {
    try{
        const handle = req.params.id;
        const userId = req.session.userId;

        if(validCheck.validCheck(handle, userId) == false){
            res.status(403).json({msg: 'Permission Not Allowed'});
            return;
        }

        const postList = [];

        const postings = await Post.findAll({
            where : {
                spaceId : handle
            }
        });
        
        for(let i = 0; i<postings.length; i++){
            const id = postings[i].id;
            const plot = postings[i].plot;
            const picture = postings[i].picture;
            const author = await 
            postList.push({
                id : id,
                plot : plot,
                picture : picture
            });
        }

        res.status(200).json({postList : postList});
    }
    catch(e){
        res.status(500).json({msg : "Bad"});
    }
});

router.post('/:id', async (req, res) => {
    try{
        const handle = req.params.id;
        const userId = req.session.userId;
        const {plot, picture, date} = req.body;

        if(validCheck.validCheck(handle, userId) == false){
            res.status(403).json({msg: 'Permission Not Allowed'});
            return;
        }

        if(plot == null || plot.length < 20 || plot.length >= 1000){
            res.status(400).json({msg: 'Plot is too short or long'});
            return;
        }

        if(filter.checkAbuse(plot)){
            res.status(402).json({msg: 'Plot has an abuse word'});
            return;
        }

        if(picture == null || date == null){
            res.status(401).json({msg: 'Picture or date is essential'});
            return;
        }

        const cur = await Post.create({
            plot: plot,
            picture : picture,
            author : userId,
            date : date
        });

        const tmp = await Space.findOne({
            where : {
                id : handle
            }
        });

        await tmp.addPost(cur);

        res.status(200).json({
            msg: 'successful Posted'
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({msg: 'Internal Server Error' });
    }
});

router.put('/:id/:num', async (req, res) => {
    try{
        const handle = req.params.id;
        const num = req.params.num;
        const userId = req.session.userId;
        const {plot, picture, date} = req.body;
    
        if(validCheck.validCheck(handle, userId) == false){
            res.status(403).json({msg: 'Permission Not Allowed'});
            return;
        }

        const posting = await Post.findOne({
            where : {
                id : num,
                author : userId,
                spaceId : handle,
            }
        });
        
        if(posting == null){
            res.status(403).json({msg: 'Permission Not Allowed'});
            return;
        }

        if(plot == null || plot.length < 20 || plot.length >= 1000){
            res.status(400).json({msg: 'Plot is too short or long'});
            return;
        }

        if(filter.checkAbuse(plot)){
            res.status(402).json({msg: 'Plot has an abuse word'});
            return;
        }

        if(picture == null){
            res.status(401).json({msg: 'Picture is essential'});
            return;
        }

        await Post.update({
            plot: plot,
            picture : picture,
            author : userId,
            data : date
        });

        res.status(200).json({
            msg: 'successful Posted'
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({msg: 'Internal Server Error' });
    }
});

router.delete('/:id/:num', async (req, res) => {
    try{
        const handle = req.params.id;
        const num = req.params.num;
        const userId = req.session.userId;
    
        if(validCheck.validCheck(handle, userId) == false){
            console.log("1번 조건 걸림");
            res.status(403).json({msg: 'Permission Not Allowed'});
            return;
        }

        const posting = await Post.findOne({
            where : {
                id : num,
                author : userId,
                spaceId : handle
            }
        });
        
        if(posting == null){
            console.log("2번 조건 걸림");
            res.status(403).json({msg: 'Permission Not Allowed'});
            return;
        }

        await posting.destroy();

        res.status(200).json({
            msg: 'successful Deleted'
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: 'Internal Server Error'});
    }
});

module.exports = router;