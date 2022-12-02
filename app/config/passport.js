const LocalStrategy= require('passport-local').Strategy;
const User = require('../models/user')
const bcrypt = require('bcrypt');
const { deserializeUser } = require('passport');
function init(passport){
    //In LocalStrategy the first param is the usernamefeild it may be email, phone etc and the second param is arrow function
    //which u will get in below the email , password when logged in
    passport.use(new LocalStrategy({usernameField:'email'},async (email,password,done)=>{
        //Login Logic
        //check if email exists in DB
        const user= await User.findOne({email:email})
        if(!user){
            return done(null, false, {message: 'No user with this email'})
        }

        bcrypt.compare(password,user.password).then(match=>{
            if(match){
                return done(null, user, {message: 'Logged in successfully'})
            }

            return done(null, false, {message: 'Incorrect username or password'})
        }).catch(err=>{
            return done(null, false, {message: 'Something went wrong'})
        })

    }))

    //serializeUser :- the id will be stored in session when user logged in.
    //From this we can get know that the user is still logged in if id present in the session
    passport.serializeUser((user,done)=>{
            done(null,user._id)
    })

    passport.deserializeUser((id,done)=>{

            User.findOne({_id: id},(err,user)=>{
                done(err,user)
            })
        })

    //We can use below as well for deserialize
    //User.findById(id,(err,user)=>{
    //          done(err,user)
    //      })
    // 

    // We will use deserializeUser bacause of we can get the req.user
    // So in future we can use the (req.user) which will be current logged in user data

}


module.exports = init