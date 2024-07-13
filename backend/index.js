const express = require("express");
const mainRouter=require('./routes/index');
const cors=require('cors');
const port =3000;

const app=express();
// /api/vi will be the substring fro every route we will be hitting on 

//connect backend and frontend , cors is a middleware to implememt the connection
app.use(cors());
app.use(express.json());

app.use('/api/v1', mainRouter);

app.listen(port, ()=>{
    console.log(`server running on port ${port}`)
})


