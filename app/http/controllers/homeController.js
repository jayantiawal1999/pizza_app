const Menu = require('../../models/menu')
function homeController(){
    return{
        async index(req,res){

            const pizza= await Menu.find();

            // Menu.find().then(function(pizza){
            //     console.log(pizza)
            //     res.render('home',{
            //         pizzas: pizza
            //     })
            // })
            res.render('home',{
                pizzas: pizza
            })
        }
    }
}

module.exports = homeController