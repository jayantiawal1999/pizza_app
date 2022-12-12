const homeContorller = require('../app/http/controllers/homeController')
const authController= require('../app/http/controllers/authController')
const cartController= require('../app/http/controllers/customers/cartController')   
const guest = require('../app/http/middlewares/guest')
function initRoutes(app){
    app.get('/',homeContorller().index)

    //Auth routes

    app.get('/login',guest,authController().login)
    app.post('/login',authController().postLogin)
    app.get('/register',guest,authController().register)
    app.post('/register',authController().postRegister)

    //Customers routes
    app.get('/cart',cartController().cart)
    app.post('/update-cart',cartController().update)

    app.post('/logout',authController().logout)

}


module.exports =initRoutes;