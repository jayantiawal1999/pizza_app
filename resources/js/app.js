import axios from 'axios';
import moment from 'moment/moment';
import Noty from 'noty';
import { initAdmin } from './admin'




let addToCart = document.querySelectorAll('.add-to-cart');
let cartCounter = document.querySelector('#cartCounter');
// let orderTableBody = document.querySelector('#orderTable')

function updateCart(pizza){
        
        axios.post('/update-cart',pizza).then(res=>{
            new Noty({
                type: "success",
                timeout: 1000,
                text: "Iteam added to Cart",
                progressBar: false
              }).show();
            // console.log(res)
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
        // console.log(btn.dataset.pizza)
        let pizza= JSON.parse(btn.dataset.pizza);
        // console.log(pizza)
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
// Change order status

let statuses= document.querySelectorAll('.status-line')
// console.log(statuses)
let hiddenInput = document.querySelector('#hiddenInput');
let order= hiddenInput ? hiddenInput.value : null;
order= JSON.parse(order)
let time= document.createElement('small')
// console.log(order)


function updateStatus(order){
    statuses.forEach((status)=>{
        status.classList.remove('step-completed')
        status.classList.remove('current')
    })

    let stepCompleted= true
    statuses.forEach((status)=>{
        let dataProp = status.dataset.status

        if(stepCompleted){
            status.classList.add('step-completed')
        }

        if(dataProp===order.status){
            stepCompleted=false
            time.innerText=moment(order.updatedAt).format('hh:mm A')
            status.appendChild(time)
            if(status.nextElementSibling){
                status.nextElementSibling.classList.add('current')
            }
            
        }
    })

}


updateStatus(order)

// Socket

// the socket var will be available when imprt socket.io.js in layout js of client file
let socket= io()

// Join
if(order){

    socket.emit('join',`order_${order._id}`)
}

// Admin realtime code for not to refresh

let adminAreaPath = window.location.pathname

if(adminAreaPath.includes('admin')){
    console.log(adminAreaPath)
    initAdmin()
    socket.emit('join','adminRoom')
}


//the below is for customer


socket.on('OrderUpdated',(data)=>{
    const updatedOrder = {...order}
    updatedOrder.updatedAt= moment().format();
    updatedOrder.status=data.status
    updateStatus(updatedOrder)
    new Noty({
        type: "success",
        timeout: 1000,
        text: "Order Updated",
        progressBar: false
      }).show();
    // console.log(data)
})


