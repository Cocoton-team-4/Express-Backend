const express = require('express');
const validCheck = require('../util/validCheck');
const Note = require('../../models/note');
const Space = require('../../models/space');
const User = require('../../models/user');
const filter = require("../util/filtering");
const router = express.Router();

//유저 아이디로 세부적인 정보 받아오기
router.get('/:id', async (req, res) => {
    try{
        const handle = req.params.id;
        const userId = 1;

        if(validCheck.validCheck(handle, userId) == false){
            res.status(403).json({msg: 'Permission Not Allowed'});
            return;
        }

        const noteList = [];

        const notes = await Note.findAll({
            where : {
                spaceId : handle
            }
        });
        
        for(let i = 0; i<notes.length; i++){
            const id = notes[i].id;
            const plot = notes[i].plot;
            const author = await User.findOne({
                where : {id : notes[i].author}
            });
            noteList.push({
                id : id,
                plot : plot,
                author : author
            });
        }

        res.status(200).json({noteList : noteList});
    }
    catch(e){
        res.status(500).json({msg : "Bad"});
    }
});

router.post('/:id', async (req, res) => {
    try{
        const handle = req.params.id;
        const userId = 1;
        const {plot} = req.body;

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

        const cur = await Note.create({
            plot: plot,
            author : userId,
        });

        const tmp = await Space.findOne({
            where : {
                id : handle
            }
        });

        await tmp.addNote(cur);

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
        const userId = 1;
        const {plot} = req.body;
    
        if(validCheck.validCheck(handle, userId) == false){
            res.status(403).json({msg: 'Permission Not Allowed'});
            return;
        }

        const posting = await Note.findOne({
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

        await Note.update({
            plot: plot,
            author : userId,
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
        const userId = 1;
    
        if(validCheck.validCheck(handle, userId) == false){
            console.log("1번 조건 걸림");
            res.status(403).json({msg: 'Permission Not Allowed'});
            return;
        }

        const posting = await Note.findOne({
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