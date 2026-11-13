import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'
import {toast} from 'react-toastify'

const Verify = () => {
    const {navigate, token, setCartItems, backendUrl} = useContext(ShopContext)
    const [searchParams] = useSearchParams()

    const success = searchParams.get("success")
    const orderId = searchParams.get("orderId")
    const sessionId = searchParams.get("session_id")
    const [verifying, setVerifying] = useState(true)

    const verifyPayment = async () => {
        try {
            if(!token){
                return null
            }

            const response = await axios.post(backendUrl + '/api/order/verifyStripe', {success, orderId, sessionId}, {headers: {token}})
            if(response.data.success){
                setCartItems({})
                navigate('/orders')
            } else {
                setVerifying(false)
                toast.error(response.data.message || "Payment verification failed")
                setTimeout(() => navigate('/cart'), 3000)
            }
        } catch (error) {
            setVerifying(false)
            toast.error(error.message)
            setTimeout(() => navigate('/cart'), 3000)
        }
    }

    useEffect(() => {
        verifyPayment()
    },[token])

  return (
    <div className='min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center'>
      {verifying ? (
        <>
          <div className='w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin'></div>
          <p className='text-gray-600 font-medium'>Verifying your payment, please wait...</p>
        </>
      ) : (
        <div className='flex flex-col items-center gap-3'>
          <p className='text-red-500 font-medium'>Payment could not be completed.</p>
          <button onClick={() => navigate('/cart')} className='bg-black text-white px-6 py-2 text-sm rounded'>
            Return to Cart
          </button>
        </div>
      )}
    </div>
  )
}

export default Verify
