const express=require('express');
const app=express();
const bodyParse=require('body-parser');
app.use(bodyParse.urlencoded({extended :false}));
app.use('/add-product',(req,res,next)=>{
    res.send('<form action="/product" method="post"><input type="text" name="title"> <input type="number" name="size"> <button type="submit">Add Product</button></form>');
})
app.use('/product',(req,res,next)=>{
    console.log(req.body);
    res.redirect('/');
})
app.use('/',(req,res,next)=>{
    res.send('<h1>Hello Express js</h1>');
})
app.listen(4000);