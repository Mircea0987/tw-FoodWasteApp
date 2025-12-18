const bodyParser = require('body-parser')
const express = require("express");
const app = express();
const bcrypt = require("bcryptjs");
const User = require('../models/User');

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const router = express.Router();


router.post("/",async(req,res)=>{

    if(!req.body && Object.keys(req.body).length === 0){
        return res.status(404).json();
    }

    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(req.body.password,salt);

   await User.create({
            FirstName: req.body.firstName, 
            LastName: req.body.lastName,    
            Mail: req.body.email,           
            PasswordHash: hashPass,        
            AvatarPhoto: null              
        });
    return res.status(200).json({msg:"User created!"});

})


module.exports = router;