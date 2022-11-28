const homeContorller = require('../app/http/controllers/homeController')
const authController= require('../app/http/controllers/authController')
const cartController= require('../app/http/controllers/customers/cartController')
function initRoutes(app){
    app.get('/',homeContorller().index)

    //Auth routes

    app.get('/login',authController().login)

    app.get('/register',authController().register)

    //Customers routes
    app.get('/cart',cartController().cart)
    app.post('/update-cart',cartController().update)

}


module.exports =initRoutes;