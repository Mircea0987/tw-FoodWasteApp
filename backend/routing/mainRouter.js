//The main router

const express = require("express");
const userRouter = require("../routing/user");
const tagRouter = require("../routing/tag");
const categoryRouter = require("../routing/category");
const groupRouter = require("../routing/group");
const productRouter = require("../routing/product");
const productListRouter = require("../routing/productList");

const mainRouter = express.Router();


mainRouter.use("/user",userRouter);
mainRouter.use("/tag",tagRouter);
mainRouter.use("/product",productRouter);
mainRouter.use("/group",groupRouter);
mainRouter.use("/category",categoryRouter);
mainRouter.use("/productList",productListRouter);



module.exports = mainRouter;