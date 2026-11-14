import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import axios from 'axios'
import {backendUrl, currency} from '../App'
import {toast} from 'react-toastify'
import { assets } from '../assets/assets';

const Orders = ({token}) => {

  const [orders, setOrders] = useState([]);

  const fatchAllOrders = async () => {
    if(!token) {
      return null;
    }
    try {
      const response = await axios.post(backendUrl + '/api/order/list', {}, {headers: {token}})
      if(response.data.success){
        setOrders(response.data.orders.reverse())
      }else{
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(backendUrl + '/api/order/status', {orderId, status:event.target.value}, {headers:{token}})
      if(response.data.success){
        await fatchAllOrders();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const paymentHandler = async (orderId, paymentStatus) => {
    try {
      const response = await axios.post(backendUrl + '/api/order/payment-status', {orderId, payment: paymentStatus}, {headers:{token}})
      if(response.data.success){
        toast.success(response.data.message);
        await fatchAllOrders();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  useEffect(() => {
    fatchAllOrders();
  }, [token])

  return (
    <div>
      <h3>Order Page</h3>
      <div>
        {
          orders.map((order, index) => (
            <div className='grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 border-gray-200 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700' key={index}>
              <img className='w-12' src={assets.parcel_icon} alt="" />
              <div>
                <div>
                  {
                    order.items && order.items.map((item, index) => {
                      if(index === order.items.length - 1){
                        return <p className='py-0.5' key={index}> {item.name} x {item.quantity} <span> {item.size} </span></p>
                      }
                      else{
                        return <p className='py-0.5' key={index}> {item.name} x {item.quantity} <span> {item.size} </span> ,</p>
                      }
                    })
                  }
                </div>
                {order.address && (
                  <>
                    <p className='mt-3 mb-2 font-medium'>{order.address.firstName + " " + order.address.lastName}</p>
                    <div>
                      <p>{order.address.street + ", "}</p>
                      <p>{order.address.city + ", " + order.address.state + ", " + order.address.country + ", " + (order.address.zipcode || order.address.zipCode || '')}</p>
                    </div>
                    <p>{order.address.phone}</p>
                  </>
                )}
              </div>
              <div>
                <p className='text-sm sm:text-[15px]'>Items : {order.items.length}</p>
                <p className='mt-2'>Method : <span className='font-semibold'>{order.paymentMethod}</span></p>
                {order.transactionId && <p className='text-xs text-blue-600 font-mono font-medium'>TID: {order.transactionId}</p>}
                <div className='flex items-center gap-2 mt-2'>
                  <p className='text-xs'>Payment:</p>
                  <select
                    value={order.payment ? 'true' : 'false'}
                    onChange={(e) => paymentHandler(order._id, e.target.value === 'true')}
                    className={`text-xs px-2 py-0.5 font-semibold rounded border cursor-pointer ${order.payment ? 'bg-green-100 text-green-700 border-green-300' : 'bg-amber-100 text-amber-700 border-amber-300'}`}
                  >
                    <option value="false">Pending</option>
                    <option value="true">Done</option>
                  </select>
                </div>
                <p className='mt-2 text-xs text-gray-500'>Date : {new Date(order.date).toLocaleDateString()}</p>
              </div>
              <p className='text-sm sm:text-[15px]'>{currency}{order.amount}</p>
              <select onChange={(event)=>statusHandler(event,order._id)} value={order.status} className='p-2 font-semibold'>
                <option value="Order Placed">Order Placed</option>
                <option value="Packing">Packing</option>
                <option value="Shipped">Shipped</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Delivered">Delivered</option>
              </select>

            </div>
          ))
        }
      </div>
    </div>
  )
}

export default Orders
