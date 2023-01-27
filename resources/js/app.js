import axios from 'axios';
import Noty from 'noty';
// import { initAdmin } from './admin'
// const initAdmin = require('./admin')
import { initAdmin } from './admin'



let addToCart = document.querySelectorAll('.add-to-cart');
let cartCounter = document.querySelector('#cartCounter')
// let orderTableBody = document.querySelector('#orderTable')

function updateCart(pizza){
        
        axios.post('/update-cart',pizza).then(res=>{
            new Noty({
                type: "success",
                timeout: 1000,
                text: "Iteam added to Cart",
                progressBar: false
              }).show();
            console.log(res)
            cartCounter.innerText= res.data.totalQty;
        }).catch(err => {
            new Noty({
                type: "error",
                timeout: 1000,
                text: "Something went wrong",
                progressBar: false
              }).show();
        })
}


addToCart.forEach((btn)=>{

    btn.addEventListener('click',(e)=>{
        console.log(btn.dataset.pizza)
        let pizza= JSON.parse(btn.dataset.pizza);
        console.log(pizza)
        updateCart(pizza);

        
    })
})


// Remove alert message after X seconds
const alertMsg= document.querySelector('#success-alert')
if(alertMsg){
    setTimeout(()=>{
        alertMsg.remove();
    },2000)
}

initAdmin()