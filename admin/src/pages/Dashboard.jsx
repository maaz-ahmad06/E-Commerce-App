import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'

const Dashboard = ({ token }) => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSales: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    recentOrders: []
  })
  const [productCount, setProductCount] = useState(0)
  const [loading, setLoading] = useState(true)

  const fetchStats = async () => {
    if (!token) return
    try {
      setLoading(true)
      const [statsRes, productsRes] = await Promise.all([
        axios.get(`${backendUrl}/api/order/dashboard-stats`, { headers: { token } }),
        axios.get(`${backendUrl}/api/product/list`)
      ])

      if (statsRes.data.success) {
        setStats(statsRes.data.stats)
      }
      if (productsRes.data.success) {
        setProductCount(productsRes.data.products.length)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [token])

  if (loading) {
    return (
      <div className='min-h-[50vh] flex items-center justify-center'>
        <div className='w-10 h-10 border-4 border-gray-300 border-t-black rounded-full animate-spin'></div>
      </div>
    )
  }

  return (
    <div className='flex flex-col gap-8'>
      {/* Page Header */}
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4'>
        <div>
          <h1 className='text-2xl font-bold text-gray-800'>Admin Overview</h1>
          <p className='text-sm text-gray-500'>Welcome back! Here is what is happening across your store today.</p>
        </div>
        <div className='flex gap-3'>
          <Link
            to='/add'
            className='bg-black hover:bg-gray-800 text-white text-xs sm:text-sm px-4 py-2 rounded transition'
          >
            + Add Product
          </Link>
          <button
            onClick={fetchStats}
            className='border border-gray-300 hover:border-black text-gray-700 text-xs sm:text-sm px-4 py-2 rounded transition'
          >
            Refresh Data
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
        {/* Card 1: Total Revenue */}
        <div className='bg-white border border-gray-200 rounded-lg p-5 shadow-sm'>
          <p className='text-xs font-medium text-gray-400 uppercase tracking-wider'>Total Revenue</p>
          <p className='text-2xl font-bold text-gray-900 mt-2'>
            {currency}{stats.totalSales.toLocaleString()}
          </p>
          <p className='text-xs text-green-600 font-medium mt-1'>From verified paid orders</p>
        </div>

        {/* Card 2: Total Orders */}
        <div className='bg-white border border-gray-200 rounded-lg p-5 shadow-sm'>
          <p className='text-xs font-medium text-gray-400 uppercase tracking-wider'>Total Orders</p>
          <p className='text-2xl font-bold text-gray-900 mt-2'>{stats.totalOrders}</p>
          <p className='text-xs text-gray-500 mt-1'>{stats.deliveredOrders} orders delivered</p>
        </div>

        {/* Card 3: Pending Shipments */}
        <div className='bg-white border border-gray-200 rounded-lg p-5 shadow-sm'>
          <p className='text-xs font-medium text-gray-400 uppercase tracking-wider'>Pending Orders</p>
          <p className='text-2xl font-bold text-amber-600 mt-2'>{stats.pendingOrders}</p>
          <p className='text-xs text-amber-600 font-medium mt-1'>Requires fulfillment</p>
        </div>

        {/* Card 4: Catalog Products */}
        <div className='bg-white border border-gray-200 rounded-lg p-5 shadow-sm'>
          <p className='text-xs font-medium text-gray-400 uppercase tracking-wider'>Active Catalog</p>
          <p className='text-2xl font-bold text-gray-900 mt-2'>{productCount}</p>
          <p className='text-xs text-blue-600 font-medium mt-1'>Listed products in stock</p>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className='bg-white border border-gray-200 rounded-lg p-5 shadow-sm'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-base font-bold text-gray-800'>Recent Customer Orders</h2>
          <Link to='/orders' className='text-xs font-medium text-blue-600 hover:underline'>
            View all orders →
          </Link>
        </div>

        {stats.recentOrders.length === 0 ? (
          <p className='text-sm text-gray-400 py-6 text-center'>No orders placed yet.</p>
        ) : (
          <div className='overflow-x-auto'>
            <table className='w-full text-left text-xs sm:text-sm text-gray-600'>
              <thead className='bg-gray-50 text-gray-500 uppercase text-[11px] border-b'>
                <tr>
                  <th className='py-2 px-3'>Customer</th>
                  <th className='py-2 px-3'>Items</th>
                  <th className='py-2 px-3'>Amount</th>
                  <th className='py-2 px-3'>Method</th>
                  <th className='py-2 px-3'>Payment</th>
                  <th className='py-2 px-3'>Status</th>
                  <th className='py-2 px-3'>Date</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-100'>
                {stats.recentOrders.map((order, idx) => (
                  <tr key={idx} className='hover:bg-gray-50 transition'>
                    <td className='py-3 px-3 font-medium text-gray-900'>
                      {order.address?.firstName} {order.address?.lastName}
                    </td>
                    <td className='py-3 px-3'>{order.items?.length || 0} items</td>
                    <td className='py-3 px-3 font-semibold text-gray-800'>
                      {currency}{order.amount}
                    </td>
                    <td className='py-3 px-3'>
                      <span className='font-medium'>{order.paymentMethod}</span>
                      {order.transactionId && (
                        <span className='block text-[10px] text-blue-600 font-mono'>
                          TID: {order.transactionId}
                        </span>
                      )}
                    </td>
                    <td className='py-3 px-3'>
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                          order.payment
                            ? 'bg-green-100 text-green-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {order.payment ? 'Paid' : 'Pending'}
                      </span>
                    </td>
                    <td className='py-3 px-3'>
                      <span className='px-2 py-0.5 rounded bg-gray-100 text-gray-800 font-medium text-[11px]'>
                        {order.status}
                      </span>
                    </td>
                    <td className='py-3 px-3 text-gray-400 text-xs'>
                      {new Date(order.date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard

