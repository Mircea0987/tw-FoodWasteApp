//The main router

const express = require("express");
const userRouter = require("../routing/user");
const tagRouter = require("../routing/tag");
const categoryRouter = require("../routing/category");
const groupRouter = require("../routing/group");
const productRouter = require("../routing/product");
const productListRouter = require("../routing/productList");
const auth = require("../routing/auth");
const login = require("../routing/login");

const mainRouter = express.Router();


mainRouter.use("/user",userRouter);
mainRouter.use("/tag",tagRouter);
mainRouter.use("/product",productRouter);
mainRouter.use("/group",groupRouter);
mainRouter.use("/category",categoryRouter);
mainRouter.use("/productList",productListRouter);
mainRouter.use("/register",auth);
mainRouter.use("/login",login);



module.exports = mainRouter;