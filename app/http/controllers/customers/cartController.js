const { update } = require("../../../models/menu")

function cartController(){
    return{
        cart(req,res){
            res.render('customers/cart')
        },

        update(request,response){
            //Below is schema of storing the info in cart database
            // let cart ={
            //     items : {
            //         pizzaId:{item: pizzaObject, qty:0},
            //     },
            //     totalQty:0,
            //     totalPrice:0
            // }

        
            //for the first time creating the cart and adding basic obj structure
            if(!request.session.cart){
                request.session.cart = {
                    items :{},
                    totalQty : 0,
                    totalPrice: 0
                }
              
            }

            let cart= request.session.cart
            
            // console.log(request.body)

            
            //check if item does not exist in cart
            if(!cart.items[request.body._id]){
                cart.items[request.body._id]={
                    item: request.body,
                    qty: 1
                }
                cart.totalQty+=1
                cart.totalPrice+=request.body.price
            }else{
                cart.items[request.body._id].qty+=1
                cart.totalQty+=1
                cart.totalPrice+=request.body.price
            }
            
            return response.json({totalQty: request.session.cart.totalQty})
        }
    }
}

module.exports=cartController