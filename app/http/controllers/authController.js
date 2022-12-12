const User= require('../../models/user')
const bcrypt= require('bcrypt')
const passport = require('passport')

function authController(){
    return{

        login(req,res){
            res.render('auth/login')
        },
        //It will work like middleware
        postLogin(req,res,next){

            const {email, password} = req.body;
            //Validate the all fields
            if(!email || !password){
                req.flash('error','All fields are required!');
                return res.redirect('/login');
            } 



            //In this auth func the 1st param is info
            //2nd param is user which is came from passport js when it successfull
            //3rd param is message of flash which we given in passport js
            passport.authenticate('local',(err,user,info)=>{
                if(err){
                    // info.message in this the message is came from passport js
                    req.flash('error',info.message)
                    return next(err)
                }

                if(!user){
                    // info.message in this the message is came from passport js
                    req.flash('error',info.message)
                    return res.redirect('/login')
                }

                req.logIn(user, (err)=>{
                    if(err){
                        req.flash('error',info.message)
                        return next(err)
                    }

                    return res.redirect('/')
                })
            })(req,res,next); // we need to call the passport authenticate it will not called aautomatically.
            //the passport authenticate will return function
        },

        register(req,res){
            res.render('auth/register')
        },

        async postRegister(req,res){
            const {name, email, password} = req.body;
            console.log(req.body)
            //Validate the all fields
            if(!name || !email || !password){
                req.flash('error','All fields are required!');
                req.flash('name',name);
                req.flash('email',email)
                return res.redirect('/register');
            } 

            //Check id emails exists

            User.exists({email:email},(err, result)=>{
                if(result){
                    req.flash('error','All fields are required!');
                    req.flash('name',name);
                    req.flash('email',email)
                    return res.redirect('/register');
                }
            })
            // Hash password
            const hashedPassword = await bcrypt.hash(password,10);

            //Create user in DB

            const user= new User({
                name,
                email,
                password: hashedPassword
            })

            user.save().then((user)=>{

                return res.redirect('/login')

            }).catch(err=>{
                req.flash('error','Something went wrong');
            })
        },

        logout(req,res,next){
            req.logout(err=>{
                if(err){
                    return next();
                }
            });

            return res.redirect('/login')
        }
    }
}

module.exports= authController