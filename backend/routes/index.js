const express=require('express');
const routers=express.Router();

const userRouter=require('./user');
const accountRouter=require('./accounts');

routers.use('/user', userRouter);
routers.use('/accounts', accountRouter);

module.exports=routers;