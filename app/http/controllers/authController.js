const User= require('../../models/user')
const bcrypt= require('bcrypt')

function authController(){
    return{

        login(req,res){
            res.render('auth/login')
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

                return res.redirect('/')

            }).catch(err=>{
                req.flash('error','Something went wrong');
            })
        }
    }
}

module.exports= authController