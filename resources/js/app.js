import axios from 'axios';
import moment from 'moment/moment';
import Noty from 'noty';
// import { initAdmin } from './admin'
// const initAdmin = require('./admin')
// import { initAdmin } from './admin'



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

function initAdmin(){
    let orderTable= document.querySelector('#orderTableBody');
    let orders=[]
    let markup;

    axios.get('admin/orders',{
        headers: {
            'X-Requested-With': 'XMLHttpRequest'
        }
    }).then(res=>{
        orders= res.data
        markup= generateMarkup(orders)
        orderTable.innerHTML = markup
    }).catch(err=>{
        console.log(err)
    })

    function renderItems(items) {
        let parsedItems = Object.values(items)
        return parsedItems.map((menuItem) => {
            return `
                <p>${ menuItem.item.name } - ${ menuItem.qty } pcs </p>
            `
        }).join('')
      }

      function generateMarkup(orders){
        return orders.map(order => {
            return `
                <tr>
                <td class="border px-4 py-2 text-green-900">
                    <p>${ order._id }</p>
                    <div>${ renderItems(order.items) }</div>
                </td>
                <td class="border px-4 py-2">${ order.customer.name }</td>
                <td class="border px-4 py-2">${ order.address }</td>
                <td class="border px-4 py-2">
                    <div class="inline-block relative w-64">
                        <form action="/admin/order/status" method="POST">
                            <input type="hidden" name="orderId" value="${ order._id }">
                            <select name="status" onchange="this.form.submit()"
                                class="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
                                <option value="order_placed"
                                    ${ order.status === 'order_placed' ? 'selected' : '' }>
                                    Placed</option>
                                <option value="confirmed" ${ order.status === 'confirmed' ? 'selected' : '' }>
                                    Confirmed</option>
                                <option value="prepared" ${ order.status === 'prepared' ? 'selected' : '' }>
                                    Prepared</option>
                                <option value="delivered" ${ order.status === 'delivered' ? 'selected' : '' }>
                                    Delivered
                                </option>
                                <option value="completed" ${ order.status === 'completed' ? 'selected' : '' }>
                                    Completed
                                </option>
                            </select>
                        </form>
                        <div
                            class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20">
                                <path
                                    d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                        </div>
                    </div>
                </td>
                <td class="border px-4 py-2">
                    ${ moment(order.createdAt).format('hh:mm A') }
                </td>
                <td class="border px-4 py-2">
                    ${ order.paymentStatus ? 'paid' : 'Not paid' }
                </td>
            </tr>
        `
        }).join('')

    }
    let socket= io()

    socket.on('OrderPlaced',(order)=>{
        new Noty({
            type: "success",
            timeout: 1000,
            text: "New Order!!",
            progressBar: false
          }).show();
          orders.unshift(order)
          orderTable.innerHTML=''
          orderTable.innerHTML=generateMarkup(orders)
    })
}
initAdmin()



// Change order status

let statuses= document.querySelectorAll('.status-line')
console.log(statuses)
let hiddenInput = document.querySelector('#hiddenInput');
let order= hiddenInput ? hiddenInput.value : null;
order= JSON.parse(order)
let time= document.createElement('small')
console.log(order)


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
if(order_id){

    socket.emit('join',`order_${order._id}`)
}

// Admin realtime code for not to refresh

let adminAreaPath = window.location.pathname
console.log(adminAreaPath)
if(adminAreaPath.includes('admin')){
    socket.emit('join','adminRoom')
}


//the below is for customer


socket.io('OrderUpdated',(data)=>{
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
    console.log(data)
})


