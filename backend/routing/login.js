const bodyParser = require('body-parser')
const express = require("express");
const app = express();
const bcrypt = require("bcryptjs");
const jwtToker = require("jsonwebtoken");

const User = require('../models/User');

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const router = express.Router();


router.post("",async(req,res)=>{

    const user = await User.findOne({where:{
        Mail: req.body.email
    }});

    if(!user){
        return res.send(404).json({msg:"User not found!"});
    }

    const getHashPass = await bcrypt.compare(req.body.password,user.PasswordHash);

    if(getHashPass){
        
        const payload = {
            id: user.Id,
            FirstName: user.firstName, 
            LastName: user.lastName,    
            Mail: user.email,   
        }

        const token = jwtToker.sign(payload,process.env.JWT_PASS, {expiresIn :"1h"});

        return res.status(200).json({msg:"Succes",token:token});
    }else{
        return res.status(404).json({msg:"Error!"});
    }

})


module.exports = router;