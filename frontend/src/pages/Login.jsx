import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {

  const [currentState, setCurrentState] = useState('Login');
  const {token, setToken, navigate, backendUrl} = useContext(ShopContext)

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      if(currentState === 'Sign Up'){
        const response = await axios.post(backendUrl + '/api/user/register', {name, email, password});
        if(response.data.success){
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
          toast.success('Account created successfully!');
        }else{
          toast.error(response.data.message)
        }
      } else if(currentState === 'Login'){
        const response = await axios.post(backendUrl + '/api/user/login', {email, password});
        if(response.data.success){
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
          toast.success('Signed in successfully!');
        }else{
          toast.error(response.data.message);
        }
      } else if(currentState === 'Reset Password'){
        if(password !== confirmPassword){
          toast.error('Passwords do not match');
          setLoading(false);
          return;
        }
        const response = await axios.post(backendUrl + '/api/user/reset-password', {email, newPassword: password});
        if(response.data.success){
          toast.success(response.data.message);
          setCurrentState('Login');
          setPassword('');
          setConfirmPassword('');
        }else{
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if(token){
      navigate('/')
    }
  }, [token])

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'>
      <div className='inline-flex items-center gap-2 mb-2 mt-10'>
        <p className='prata-regular text-3xl'>{currentState}</p>
        <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
      </div>

      {currentState === 'Sign Up' && (
        <input
          onChange={(e)=>setName(e.target.value)}
          value={name}
          type="text"
          className='w-full px-3 py-2 border border-gray-800'
          placeholder='Full Name'
          required
        />
      )}

      <input
        onChange={(e)=>setEmail(e.target.value)}
        value={email}
        type="email"
        className='w-full px-3 py-2 border border-gray-800'
        placeholder='Email address'
        required
      />

      <input
        onChange={(e)=>setPassword(e.target.value)}
        value={password}
        type="password"
        className='w-full px-3 py-2 border border-gray-800'
        placeholder={currentState === 'Reset Password' ? 'New Password (min 8 chars)' : 'Password'}
        required
      />

      {currentState === 'Reset Password' && (
        <input
          onChange={(e)=>setConfirmPassword(e.target.value)}
          value={confirmPassword}
          type="password"
          className='w-full px-3 py-2 border border-gray-800'
          placeholder='Confirm New Password'
          required
        />
      )}

      <div className='w-full flex justify-between text-sm mt-[-8px]'>
        {currentState === 'Login' && (
          <p onClick={()=>setCurrentState('Reset Password')} className='cursor-pointer text-gray-600 hover:text-black'>
            Forgot Password?
          </p>
        )}
        {currentState === 'Reset Password' && (
          <p onClick={()=>setCurrentState('Login')} className='cursor-pointer text-gray-600 hover:text-black'>
            Remember password? Login Here
          </p>
        )}
        {currentState === 'Login' && (
          <p onClick={()=>setCurrentState('Sign Up')} className='cursor-pointer text-gray-600 hover:text-black'>
            Create Account
          </p>
        )}
        {currentState === 'Sign Up' && (
          <p onClick={()=>setCurrentState('Login')} className='cursor-pointer text-gray-600 hover:text-black'>
            Already have an account? Login Here
          </p>
        )}
      </div>

      <button
        type='submit'
        disabled={loading}
        className='bg-black text-white font-light px-8 py-2 mt-4 hover:bg-gray-800 transition disabled:opacity-50'
      >
        {loading
          ? 'Please wait...'
          : currentState === 'Login'
          ? 'Sign In'
          : currentState === 'Sign Up'
          ? 'Sign Up'
          : 'Reset Password'}
      </button>
    </form>
  )
}

export default Login
