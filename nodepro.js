const express=require('express');
const app=express();
app.use((req,res,next)=>{
    console.log("middleware1");
    next();
})
app.use((req,res,next)=>{
    console.log("middleware2");
    res.send('<h1> hello to node js </h1>') 
})
app.listen(4000);