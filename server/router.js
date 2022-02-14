const express = require('express')
const app = express()
const router = express.Router()
const client = require('./connection')
const db = client.db('database_game')
const ObjectId =require("mongodb").ObjectId
const bcrypt = require('bcrypt');


router.get('/api/users', async (req,res)=>{
    try{
        await client.connect();
        const users = await db.collection('users').find().toArray()
    if (users.length > 0){
        res.status(200).json({
            message:"Get List Users Successfully",
            status: "success",
            data : users
        })
    }else {
        res.status(200).json({
            message:"No Users List Found",
            status: "success",
            data : users
        })
    } 
    }catch (error){
        res.status(500).json(error)
    } finally {
        await client.close();
    }
})

router.get('/api/user/:username', async (req,res)=>{
    try{
        await client.connect();
        const user = await db.collection('users').findOne({ username: req.params.username })
    if (user){
        res.status(200).json({
            message:"Get User Successfully",
            status: "success",
            data : user
        })
    }else {
        res.status(200).json({
            message:"User Not Found",
            status: "success",
            data : user
        })
    } 
    }catch (error){
        res.status(500).json(error)
    } finally {
        await client.close();
    }
})

router.get('/api/user/:id', async (req,res)=>{
    try{
        await client.connect();
        const user = await db.collection('users').findOne({ _id:ObjectId(req.params.id) })
    if (user){
        res.status(200).json({
            message:"Get User Successfully",
            status: "success",
            data : user
        })
    }else {
        res.status(200).json({
            message:"User Not Found",
            status: "success",
            data : user
        })
    } 
    }catch (error){
        res.status(500).json(error)
    } finally {
        await client.close();
    }
})

router.get('/api/histories', async (req,res)=>{
    try{
        await client.connect();
        const users = await db.collection('game_history').find().toArray()
    if (users.length > 0){
        res.status(200).json({
            message:"Get List Users History Successfully",
            status: "success",
            data : users
        })
    }else {
        res.status(200).json({
            message:"No Users History List Found",
            status: "success",
            data : users
        })
    } 
    }catch (error){
        res.status(500).json(error)
    } finally {
        await client.close();
    }
})

router.get('/api/history/:username', async (req,res)=>{
    try{
        await client.connect();
        const user = await db.collection('game_history').findOne({ username: req.params.username })
    if (user){
        res.status(200).json({
            message:"Get User History Successfully",
            status: "success",
            data : user
        })
    }else {
        res.status(200).json({
            message:"User History Not Found",
            status: "success",
            data : user
        })
    } 
    }catch (error){
        res.status(500).json(error)
    } finally {
        await client.close();
    }
})

router.post('/api/user/add', async (req,res)=>{
    try {
        await client.connect()
        const newUser = {
            username: req.body.username,
            email: req.body.email,
            hashedPassword: bcrypt.hashSync(req.body.password, 10)
        }
        const result = await db.collection('users').insertOne(newUser)
        const newUserHistory = {
            username: req.body.username,
            win : "null",
            draw : "null",
            lose : "null"
        }
        const newHistory = await db.collection('game_history').insertOne(newUserHistory)
        console.log(result)
        console.log(newHistory)
        if(result.acknowledged === true){
            res.status(201).json({
                message: "User created successfully",
                status: "success",
                data: newUser
            })
        } else {
            res.status(500).json({
                message: "User failed to create",
                status: "fail"
            })
        }
    } catch (error){
        res.status(500).json(error)
    } finally {
        await client.close();
    }
})

//put
router.put('/api/user/:id', async(req,res)=>{
    try {
        if(!req.params.id){
            res.status(400).json({
                message: "User failed to update, please insert ID",
                status: "fail"
            })
        } else {
            await client.connect()
            const {name, email, password} =req.body
            const result = await db.collection('users').updateOne({
              _id: ObjectId(req.params.id),
            },
            {
                $set:{
                    name:name,
                    email:email,
                    hashedPassword: bcrypt.hashSync(password, 10)
                }
            })
            if(result.modifiedCount > 0){
                res.status(201).json({
                    message: "User updated successfully",
                    status: "success"
                })
            } else {
                res.status(500).json({
                    message: "User failed to update",
                    status: "fail"
                })
            }
        } 
    }catch (error){
            res.status(500).json(error)
        } finally {
            await client.close();
        }
})

router.put('/api/history/:username', async(req,res)=>{
    try {
        if(!req.params.username){
            res.status(400).json({
                message: "User failed to update, please insert username",
                status: "fail"
            })
        } else {
            await client.connect()
            const {win, draw, lose} =req.body
            const result = await db.collection('game_history').updateOne({
              username: req.params.username,
            },
            {
                $set:{
                    win:win,
                    draw:draw,
                    lose: lose
                }
            })
            if(result.modifiedCount > 0){
                res.status(201).json({
                    message: "User updated successfully",
                    status: "success"
                })
            } else {
                console.log(error)
                res.status(500).json({
                    message: "User failed to update",
                    status: "fail"
                })
            }
        } 
    }catch (error){
            res.status(500).json(error)
        } finally {
            await client.close();
        }
})

router.delete('/api/user', async(req,res)=>{
    try {
        if(!req.query.username){
            res.status(400).json({
                message: "User failed to delete, please insert username",
                status: "fail"
            })
        } else {
            await client.connect()
            const result = await db.collection('users').deleteOne({
              username: req.query.username,
            })
            const history = await db.collection('game_history').deleteOne({
                username: req.query.username,
              })
            console.log(result)
            console.log(history)
            if(result.deletedCount > 0){
                res.status(201).json({
                    message: "User deleted successfully",
                    status: "success",
                })
            } else {
                res.status(500).json({
                    message: "User failed to delete",
                    status: "fail"
                })
            }
        } 
    }catch (error){
      console.log(error.message);
      res.status(500).json({message:error.message})
    } finally {
      await client.close();
    }
})

module.exports = router