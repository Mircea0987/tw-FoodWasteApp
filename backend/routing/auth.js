const bodyParser = require('body-parser')
const express = require("express");
const app = express();
const bcrypt = require("bcryptjs");
const User = require('../models/User');
const ProductList = require("../models/ProductList");

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const router = express.Router();


router.post("/", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(req.body.password, salt);

    const newUser = await User.create({
      FirstName: req.body.firstName,
      LastName: req.body.lastName,
      Mail: req.body.email,
      PasswordHash: hashPass,
      AvatarPhoto: null
    });

    const newFridge = await ProductList.create({
      ListName: `Frigider - ${newUser.FirstName}`,
      UserID: newUser.UserID
    });

      await User.update(
        { ListID: newFridge.ListID }, 
        { where: { UserID: newUser.UserID } }
      );

    res.status(201).json({ message: "Cont creat și frigider alocat!" });

  } catch (err) {
    console.error("Eroare Register:", err);

    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: "Acest email este deja folosit!" });
    }

    res.status(500).json({ error: err.message });
  }
});


module.exports = router;