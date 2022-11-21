const express = require('express');
const port= 8000;
const app= express();
const ejs= require('ejs');
const expressLayout= require('express-ejs-layouts')
const path= require('path')
const mongoose= require('mongoose');
const connection= mongoose.connection;

//Database connection code
const url= 'mongodb://localhost/pizza';
mongoose.connect(url);

 

//Assets
app.use(express.static('public'))


//Set template engine
app.use(expressLayout);
app.set('view engine', 'ejs')
app.set('views','./resources/views');


// const PORT= process.env.PORT || 8000
// app.get('/',(req,res)=>{
//     res.render('home')
// })

require('./routes/web')(app)

app.listen(port,(err)=>{
    if(err){ console.log(err); }

    console.log("The server listening on port:",port);
})

//connecting to mongo

connection.on('error', console.error.bind(console, "Error connecting to MongoDB"));


connection.once('open',()=>{
    console.log('MongoDB database connected...')
})

