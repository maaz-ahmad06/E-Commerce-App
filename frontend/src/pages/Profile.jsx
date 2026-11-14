import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title'
import axios from 'axios'
import { toast } from 'react-toastify'

const Profile = () => {
  const { backendUrl, token, navigate } = useContext(ShopContext)

  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)

  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipcode: '',
      country: ''
    }
  })

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: ''
  })

  const fetchUserProfile = async () => {
    if (!token) {
      navigate('/login')
      return
    }

    try {
      setLoading(true)
      const response = await axios.post(
        `${backendUrl}/api/user/profile`,
        {},
        { headers: { token } }
      )
      if (response.data.success) {
        const user = response.data.user
        setUserData(user)
        setFormData({
          name: user.name || '',
          phone: user.phone || '',
          street: user.address?.street || '',
          city: user.address?.city || '',
          state: user.address?.state || '',
          zipcode: user.address?.zipcode || '',
          country: user.address?.country || ''
        })
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUserProfile()
  }, [token])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = async (e) => {
    e.preventDefault()
    try {
      setSaving(true)
      const payload = {
        name: formData.name,
        phone: formData.phone,
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipcode: formData.zipcode,
          country: formData.country
        }
      }

      const response = await axios.post(
        `${backendUrl}/api/user/update-profile`,
        payload,
        { headers: { token } }
      )

      if (response.data.success) {
        toast.success('Profile updated successfully!')
        setUserData(response.data.user)
        setIsEditing(false)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className='min-h-[50vh] flex items-center justify-center'>
        <div className='w-10 h-10 border-4 border-gray-300 border-t-black rounded-full animate-spin'></div>
      </div>
    )
  }

  return (
    <div className='border-t pt-14 max-w-3xl mx-auto'>
      <div className='text-2xl mb-6'>
        <Title text1={'MY'} text2={'PROFILE'} />
      </div>

      <div className='bg-white border border-gray-200 rounded-lg p-6 sm:p-10 shadow-sm'>
        {/* Header with avatar initial */}
        <div className='flex items-center justify-between border-b pb-6 mb-6'>
          <div className='flex items-center gap-4'>
            <div className='w-16 h-16 bg-black text-white text-2xl font-semibold flex items-center justify-center rounded-full'>
              {userData.name ? userData.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <h2 className='text-xl font-medium text-gray-800'>{userData.name}</h2>
              <p className='text-sm text-gray-500'>{userData.email}</p>
            </div>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className='border border-gray-800 text-gray-800 px-5 py-2 text-sm hover:bg-black hover:text-white transition'
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {isEditing ? (
          <form onSubmit={handleSave} className='flex flex-col gap-5'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Full Name</label>
              <input
                type='text'
                name='name'
                value={formData.name}
                onChange={handleInputChange}
                required
                className='w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-black'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Phone Number</label>
              <input
                type='text'
                name='phone'
                value={formData.phone}
                onChange={handleInputChange}
                placeholder='+1 (555) 000-0000'
                className='w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-black'
              />
            </div>

            <div className='pt-2'>
              <h3 className='text-base font-medium text-gray-800 mb-3'>Default Shipping Address</h3>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div className='sm:col-span-2'>
                  <label className='block text-xs text-gray-600 mb-1'>Street Address</label>
                  <input
                    type='text'
                    name='street'
                    value={formData.street}
                    onChange={handleInputChange}
                    placeholder='123 Main St, Apt 4B'
                    className='w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-black'
                  />
                </div>
                <div>
                  <label className='block text-xs text-gray-600 mb-1'>City</label>
                  <input
                    type='text'
                    name='city'
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder='New York'
                    className='w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-black'
                  />
                </div>
                <div>
                  <label className='block text-xs text-gray-600 mb-1'>State / Province</label>
                  <input
                    type='text'
                    name='state'
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder='NY'
                    className='w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-black'
                  />
                </div>
                <div>
                  <label className='block text-xs text-gray-600 mb-1'>Postal / Zip Code</label>
                  <input
                    type='text'
                    name='zipcode'
                    value={formData.zipcode}
                    onChange={handleInputChange}
                    placeholder='10001'
                    className='w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-black'
                  />
                </div>
                <div>
                  <label className='block text-xs text-gray-600 mb-1'>Country</label>
                  <input
                    type='text'
                    name='country'
                    value={formData.country}
                    onChange={handleInputChange}
                    placeholder='United States'
                    className='w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-black'
                  />
                </div>
              </div>
            </div>

            <div className='flex justify-end gap-3 mt-4'>
              <button
                type='button'
                onClick={() => setIsEditing(false)}
                className='px-6 py-2 border border-gray-300 text-sm rounded hover:bg-gray-50'
              >
                Cancel
              </button>
              <button
                type='submit'
                disabled={saving}
                className='px-6 py-2 bg-black text-white text-sm rounded hover:bg-gray-800 disabled:opacity-50'
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        ) : (
          <div className='flex flex-col gap-6 text-sm text-gray-700'>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-gray-100'>
              <div>
                <p className='text-xs text-gray-400 uppercase tracking-wider mb-1'>Email Address</p>
                <p className='font-medium text-gray-800'>{userData.email}</p>
              </div>
              <div>
                <p className='text-xs text-gray-400 uppercase tracking-wider mb-1'>Phone Number</p>
                <p className='font-medium text-gray-800'>{userData.phone || 'Not set'}</p>
              </div>
            </div>

            <div>
              <p className='text-xs text-gray-400 uppercase tracking-wider mb-2'>Shipping Address</p>
              {userData.address && (userData.address.street || userData.address.city) ? (
                <div className='bg-gray-50 p-4 rounded border border-gray-200 leading-relaxed'>
                  {userData.address.street && <p>{userData.address.street}</p>}
                  <p>
                    {[userData.address.city, userData.address.state, userData.address.zipcode]
                      .filter(Boolean)
                      .join(', ')}
                  </p>
                  {userData.address.country && <p>{userData.address.country}</p>}
                </div>
              ) : (
                <p className='text-gray-400 italic'>No shipping address saved yet.</p>
              )}
            </div>

            <div className='mt-4 pt-4 border-t flex flex-wrap gap-4 items-center justify-between'>
              <p className='text-xs text-gray-500'>Account secured with JWT session authentication.</p>
              <button
                onClick={() => navigate('/orders')}
                className='text-sm font-medium text-black underline underline-offset-4 hover:text-gray-600'
              >
                View My Orders →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile
