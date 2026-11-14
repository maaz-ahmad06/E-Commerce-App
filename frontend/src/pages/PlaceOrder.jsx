import React, { useContext, useState } from 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { assets } from '../assets/assets'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const Placeorder = () => {

  const [method, setMethod] = useState('cod');
  const [transactionId, setTransactionId] = useState('');
  const {navigate, backendUrl, token, cartItems, setCartItems, getCartAmount, delivery_fee, products} = useContext(ShopContext);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: ''
  })
  const onChangeHandler = (event) => {
    const name = event.target.name
    const value = event.target.value
    setFormData(data => ({...data,[name]: value}))
  }
  const onSubmitHandler = async (event) => {
    event.preventDefault()
    try {
      let orderItems = []

      for(const items in cartItems){
        for(const item in cartItems[items]){
          if(cartItems[items][item] > 0){
            const itemInfo = structuredClone(products.find(product => product._id === items));
            if(itemInfo){
              itemInfo.size = item
              itemInfo.quantity = cartItems[items][item]
              orderItems.push(itemInfo)
            }
          }
        }
      } 

      if(orderItems.length === 0){
        toast.error('Your cart is empty');
        return;
      }

      let orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee
      }
      switch(method){
        // api calls for COD
        case 'cod':
          const response = await axios.post(backendUrl + '/api/order/place', orderData,{headers:{token}})
          if(response.data.success){
            setCartItems({})
            navigate('/orders')
          }else{
            toast.error(response.data.message)
          }
          break;

        case 'stripe':
          const responseStripe = await axios.post(backendUrl + '/api/order/stripe', orderData,{headers:{token}})
          if(responseStripe.data.success){
            const {sessionUrl} = responseStripe.data;
            window.location.replace(sessionUrl)
          }else{
            toast.error(responseStripe.data.message)
          }
          break;
        
        case 'jazzcash':
        case 'easypaisa':
        case 'bank':
          if (!transactionId.trim()) {
            toast.error('Please enter your Transaction ID (TID) / Reference number.');
            return;
          }
          const responsePak = await axios.post(
            backendUrl + '/api/order/pakistani-pay',
            {
              ...orderData,
              paymentMethod: method === 'jazzcash' ? 'JazzCash' : method === 'easypaisa' ? 'EasyPaisa' : 'Bank Transfer',
              transactionId
            },
            { headers: { token } }
          );
          if (responsePak.data.success) {
            toast.success(responsePak.data.message);
            setCartItems({});
            navigate('/orders');
          } else {
            toast.error(responsePak.data.message);
          }
          break;

        default:
          break;
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t'>
      {/* left side */}
      <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>
        <div className='text-xl sm:text-2xl py-3'>
        <Title text1={'DELIVERY'} text2={'INFORMATION'}/>
        </div>
      
      <div className='flex gap-3'>
        <input required onChange={onChangeHandler} name='firstName' value={formData.firstName} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='First name' />
        <input required onChange={onChangeHandler} name='lastName' value={formData.lastName} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Last name' />
      </div>
        <input required onChange={onChangeHandler} name='email' value={formData.email} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="email" placeholder='Email address' />
        <input required onChange={onChangeHandler} name='street' value={formData.street} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Street' />
        <div className='flex gap-3'>  
            <input required onChange={onChangeHandler} name='city' value={formData.city} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='City' />
            <input required onChange={onChangeHandler} name='state' value={formData.state} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='State' />
        </div>
        <div className='flex gap-3'>  
            <input required onChange={onChangeHandler} name='zipcode' value={formData.zipcode} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="number" placeholder='Postal code' />
            <input required onChange={onChangeHandler} name='country' value={formData.country} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Country' />
        </div>
            <input required onChange={onChangeHandler} name='phone' value={formData.phone} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="number" placeholder='Phone number' />
      </div>
      {/* right side */}
      <div className='mt-8'>
        <div className='mt-8 min-w-80'>
          <CartTotal/>
        </div>
        <div className='mt-12'>
          <Title text1={'PAYMENT'} text2={'METHOD'}/>
          {/* payment method selection */}
          <div className='flex flex-col gap-3'>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
              <div onClick={()=>setMethod('cod')} className='flex items-center gap-3 border border-gray-300 p-2.5 px-3 cursor-pointer hover:border-black transition'>
                <p className={`min-w-3.5 h-3.5 border border-gray-300 rounded-full ${method === 'cod' ? 'bg-green-500' : ''}`}></p>
                <p className='text-gray-700 text-xs sm:text-sm font-medium'>CASH ON DELIVERY (COD)</p>
              </div>
              <div onClick={()=>setMethod('jazzcash')} className='flex items-center gap-3 border border-gray-300 p-2.5 px-3 cursor-pointer hover:border-black transition'>
                <p className={`min-w-3.5 h-3.5 border border-gray-300 rounded-full ${method === 'jazzcash' ? 'bg-green-500' : ''}`}></p>
                <span className='font-bold text-red-600 text-sm'>JazzCash</span>
              </div>
              <div onClick={()=>setMethod('easypaisa')} className='flex items-center gap-3 border border-gray-300 p-2.5 px-3 cursor-pointer hover:border-black transition'>
                <p className={`min-w-3.5 h-3.5 border border-gray-300 rounded-full ${method === 'easypaisa' ? 'bg-green-500' : ''}`}></p>
                <span className='font-bold text-green-600 text-sm'>EasyPaisa</span>
              </div>
              <div onClick={()=>setMethod('stripe')} className='flex items-center gap-3 border border-gray-300 p-2.5 px-3 cursor-pointer hover:border-black transition'>
                <p className={`min-w-3.5 h-3.5 border border-gray-300 rounded-full ${method === 'stripe' ? 'bg-green-500' : ''}`}></p>
                <img className='h-5' src={assets.stripe_logo} alt="Stripe" />
              </div>
            </div>

            {/* Pakistani Mobile Wallet Instructions */}
            {(method === 'jazzcash' || method === 'easypaisa') && (
              <div className='mt-3 p-4 bg-gray-50 border border-gray-300 rounded text-xs sm:text-sm text-gray-700 leading-relaxed'>
                <p className='font-semibold text-black mb-1'>
                  Send Total Payment via {method === 'jazzcash' ? 'JazzCash' : 'EasyPaisa'}:
                </p>
                <p>• Account Number: <span className='font-bold text-black'>0300-1234567</span></p>
                <p>• Account Title: <span className='font-bold text-black'>Muhammad Maaz</span></p>
                <p className='text-gray-500 mt-1 mb-2'>After sending payment, enter your Transaction ID (TID) below:</p>
                <input
                  type="text"
                  required
                  placeholder="Enter Transaction ID (TID) / Sender Number"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-black"
                />
              </div>
            )}
          </div>
          <div className='w-full text-end mt-8'>
            <button type='submit' className='bg-black text-white px-16 py-3 text-sm'>PLACE ORDER</button>
          </div>
        </div>
      </div>
    </form>
  )
}

export default Placeorder
