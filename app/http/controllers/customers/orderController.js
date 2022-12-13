const Order= require('../../../models/order')
const moment=require('moment') // it is used for formatting the time and date

function orderController(){
    return {
        store(req,res){
            console.log(req.body)

            const {address, phone}= req.body
            if(!phone || !address){
                req.flash('error','All fields are required!');
                return res.redirect('/cart')
            }
            const order = new Order({
                // The passport js will provide the req.user details of whoever the logged in user
                customer : req.user._id,

                items: req.session.cart.items,

                phone,

                address
            })
            // For saving in the database
            order.save().then(result=>{
                req.flash('success','Order placed!!')
                delete req.session.cart;
                return res.redirect('/customer/orders')
            }).catch(err=>{
                req.flash('error','Something went wrong')
                console.log(err)
                return res.redirect('/cart')
            })
           
        },
        async index(req,res){
            const orders = await Order.find({customer:req.user._id},
                null,
                {sort: {'createdAt': -1}})
            console.log(orders)
            res.render('customers/orders',{orders: orders, moment: moment})
        }
    }
}

module.exports = orderController