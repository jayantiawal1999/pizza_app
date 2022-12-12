// The guest meddileware is created beacuse of if user logged then user will not allow to redirect
// to the login and register page
function guest(req,res,next){
    if(!req.isAuthenticated()){ // isAuthenticated() will get from passport
        return next()
    }
    return res.redirect('/')
}

module.exports = guest