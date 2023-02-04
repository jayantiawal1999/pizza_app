const Order= require('../../../models/order')

function orderController() {
    return {
        index(req, res) {
            
            Order.find({ status: { $ne: 'completed' } }, null, { sort: { 'createdAt': -1 }}).populate('customer', '-password').exec((err, orders) => {
                if(req.xhr) {
                    // console.log(orders)
                    return res.json(orders)
                } else {
                    // console.log(orders)
                 return res.render('admin/orders')
                }
            })
         }
    }
}

module.exports = orderController

