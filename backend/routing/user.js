const User = require("../models/User");
const express = require("express");

const userRouter = express.Router();

userRouter.route("/users")
.get(async(req,res,next)=>{
    
    try{

        const getAllUsers = await User.findAll();

        if(getAllUsers.length > 0){

            res.status(200).send(getAllUsers).json();

        }else{
            res.status(404).send({msg:"Error! No user has been found!"});
        }

    }catch(err){

        next(err);
    }
})
.post(async(req,res)=>{

    try{
        await User.create(req.body);
        res.status(201).json({msg: "User created!"});
    }catch(err){
        res.status(500).json({ error: err.message });

    }

})

userRouter.route("/users/:userID")
.delete(async(req,res)=>{

    try{

        const findUserById = await User.findByPk(req.params.userID);

        if(findUserById){
            
            await findUserById.destroy();
            res.status(200).send(`User with id ${req.params.userID} is deleted!`);

        }else{
            res.status(404).send(`User with id ${req.params.userID} not found!`);

        }

    }catch(err){
        res.status(500).json({ error: err.message });

    }

})
.put(async(req,res)=>{

    try{

        const findUserById = await User.findByPk(req.params.userID);

        if(findUserById){

            await findUserById.update(req.body);
            res.status(201).send({msg:`User with id ${req.params.userID} has been updated!`})

        }else{
            res.status(404).send({msg:`User with id ${req.params.userID} not found!`})
        }

    }catch(err){
        res.status(500).json({ error: err.message });

    }
})

module.exports = userRouter;

