const express = require('express');
const port= 8000;
const app= express();
const ejs= require('ejs');
const expressLayout= require('express-ejs-layouts')
const path= require('path')

//Assets
app.use(express.static('public'))


//Set template engine
app.use(expressLayout);
app.set('view engine', 'ejs')
app.set('views','./resources/views');


// const PORT= process.env.PORT || 8000
app.get('/',(req,res)=>{
    res.render('home')
})

//Auth routes

app.get('/login',(req,res)=>{
    res.render('auth/login')
})

app.get('/register',(req,res)=>{
    res.render('auth/register')
})

//Customers routes
app.get('/cart',(req,res)=>{
    res.render('customers/cart')
})


app.listen(port,(err)=>{
    if(err){ console.log(err); }

    console.log("The server listening on port:",port);
})

