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

router.post("", async (req, res) => {
    try {
        const user = await User.findOne({
            where: {
                Mail: req.body.email 
            }
        });

        if (!user) {
            return res.status(404).json({ msg: "User not found!" });
        }

       
        const getHashPass = await bcrypt.compare(req.body.password, user.PasswordHash);

        if (getHashPass) {
            
            // [MODIFICARE COSTIN]: Am extras datele userului pentru a le trimite inapoi.
            const userData = {
                id: user.UserID,
                FirstName: user.FirstName,
                LastName: user.LastName,
                Mail: user.Mail
            };

            const token = jwtToker.sign(userData, process.env.JWT_PASS, { expiresIn: "1h" });

            // [MODIFICARE COSTIN]: Trimitem si obiectul 'user' pe langa token.
            // Motiv: Frontend-ul are nevoie de 'FirstName' ca sa afiseze "Salut, Nume" in Navbar.
            // Inainte se trimitea doar token-ul si nu puteam extrage numele.
            return res.status(200).json({
                msg: "Succes",
                token: token,
                user: userData  // Frontend-ul va citi asta
            });

        } else {
            return res.status(401).json({ msg: "Parola incorecta!" });
        }
    } catch (err) {
        console.error("Login Error:", err);
        return res.status(500).json({ msg: "Server error" });
    }
})

module.exports = router;