var express = require('express')
var groupMessage = require('../models/GroupMessage')
var routes = express.Router()

// Get messages by group name
routes.route("/messages/:group")
    .get(async (req,res)=>{
        const group = req.params.group
        const messages = await groupMessage.find({room: group})
        res.json(messages)
    })

// Save message for group
routes.route("/messages/:group")
    .post(async (req,res)=>{
        const group = req.params.group
        const message = new groupMessage(req.body)
        message.room = group
        message.date_sent = new Date()
        await message.save()
        res.json({message: 'Message saved'})
    })

routes.route("/joinGroup/:group")
    .post(async (req,res)=>{
        const group = req.params.group
        const username = req.body.username
        const message = new groupMessage({
            from_user: username,
            message: username + ' Joined the group',
            date_sent: new Date(),
            room: group})
        await message.save()
        res.json({message: 'User joined group'})
    }
)

routes.route("/leaveGroup/:group")
    .post(async (req,res)=>{
        const group = req.params.group
        const username = req.body.username
        const message = new groupMessage({
            from_user: username,
            message: username + ' Left the group',
            date_sent: new Date(),
            room: group})
        await message.save()
        res.json({message: 'User left group'})
    }
)

// Global error 
routes.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json('Something Broke On User Routes');
});




module.exports = routes