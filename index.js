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
const Emitter= require('events');


//flash middleware for cookie
//connect-mongo id used to store the sessions in database
app.use(flash())


//Database connection code
// const url= 'mongodb://localhost/pizza';
mongoose.connect(process.env.MONGO_CONNECTION_URL);


 

//Assets
app.use(express.static('public'))
app.use(express.urlencoded({extended: true}));
app.use(bodyParser.urlencoded({extended:false}));
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

// Event EMitter for socket.io code

const eventEmitter= new Emitter()
app.set('eventEmitter',eventEmitter)




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
app.use((req,res)=>{
    res.status(404).render('errors/404')
})


//connecting to mongo

connection.on('error', console.error.bind(console, "Error connecting to MongoDB"));


connection.once('open',()=>{
    console.log('MongoDB database connected...')
})


const server = app.listen(port,(err)=>{
    if(err){ console.log(err); }

    console.log("The server listening on port:",port);
})


// Socket IO Code
const io= require('socket.io')(server);

io.on('connection',(socket)=>{
    // Join
    // socket will give diff id for every connection
    // console.log(socket.id)
    // will receive the emmit of jin from client side (app.js)
    socket.on('join',(orderId)=>{
        // socket.join is event menthod and it will create room for our orderId
        socket.join(orderId)
    })
})


eventEmitter.on('orderUpadated',(data)=>{
    io.to(`order_${data.id}`).emit('OrderUpdated',data)
})


eventEmitter.on('orderPlaced',(data)=>{
    io.to('adminRoom').emit('OrderPlaced',data)
})
