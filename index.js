require('dotenv').config();
const express = require('express');
const port= 8000;
const bodyParser= require('body-parser')
const app= express();
const ejs= require('ejs');
const expressLayout= require('express-ejs-layouts')
const path= require('path')
const mongoose= require('mongoose');
const session = require('express-session')
const MongoStore = require('connect-mongo')(session);
const flash= require('express-flash')
const connection= mongoose.connection;
const passport = require('passport')


//flash middleware for cookie
//connect-mongo id used to store the sessions in database
app.use(flash())


//Database connection code
const url= 'mongodb://localhost/pizza';
mongoose.connect(url);


 

//Assets
app.use(express.static('public'))
app.use(express.urlencoded());
app.use(bodyParser.urlencoded());
app.use(express.json())




//connect-mongo session store
let mongoStore=new MongoStore({
    mongooseConnection: connection,
    collection: 'sessions'  //it will create db table name as session in db
})



//Session config is works as middelware
app.use(session({
    secret : process.env.COOKIE_SECRET,
    resave: false,
    store: mongoStore,
    saveUninitialized: true,
    cookie: {maxAge: 1000*60*60*24}// 24 hours
    // cookie: {maxAge: 1000*15} 
}))

//Passport config
const passportInit= require('./app/config/passport')
passportInit(passport)
app.use(passport.initialize())
app.use(passport.session())

//Global middleware
app.use((req, res, next)=>{
    res.locals.session=req.session
    res.locals.user= req.user
    next()
})




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

