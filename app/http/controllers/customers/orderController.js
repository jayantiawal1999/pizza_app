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
            // this is implemented bcz when user once plcaed the order after that 
            // if user clickd back button then its again showing the flash message
            // to avaid that we adding below code
            res.header('Cache-Control','no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0')
            res.render('customers/orders',{orders: orders, moment: moment})
        }
    }
}

module.exports = orderController