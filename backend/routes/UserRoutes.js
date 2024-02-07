var express = require('express')
var userModel = require('../models/User')
var routes = express.Router()

routes.route("/signup")
    .post(async (req,res)=>{
        const user =  new userModel(req.body);

        try {
        // save user date
            user.createon = new Date();
            await user.save();
        // send created status
             res.status(201).json(user);

        } catch (err) {
            if (err.code === 11000) {
                // Duplicate key error (e.g., unique constraint violation)
                const key = Object.keys(err.keyPattern)[0];
                const value = err.keyValue[key];
                res.status(409).json({ message: `${key} '${value}' is already in use` });
            } else {
                // For other types of errors, send a generic 500 status with the error message
                res.status(500).json({ message: 'Internal server error', error: err.message });
            }
        }
    })


// /user/login
routes.route("/login")
    .post(async (req,res)=>{

        // check if username or email is null
        const username = req.body.username

        if (!username) {
            return res.status(400).json({ status: false, message: "Username is required" });
          }

        // get user from database
        if (req.body.username != null){
            req.body.username = req.body.username.toLowerCase()
        }

        
        const user = await userModel.findOne({
            $or: [{ 'username': req.body.username }, { 'email': req.body.username  }]
          });
        
        // check if user exist
        if(!user){
            response = {
                status: false,
                message: "Invalid Username and Password"
            };

            return res.status(401).json(response)
        }

        // Check if password is correct
        passwordMatch = req.body.password
        if(passwordMatch != user.password){
            response = {
                status: false,
                message: "Invalid Password"
            };

            return res.status(401).json(response)
        }
        
        // If everything fine do this
        response = {
            status: true,
            username: user.username,
            message: "User logged in successfully"
        };

        res.status(200).json(response)


    })
    

// Global error 
routes.use((err, req, res, next) => {
        console.error(err.stack);
        res.status(500).json('Something Broke On User Routes');
    });


module.exports = routes