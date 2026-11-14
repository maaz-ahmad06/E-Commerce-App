import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
        <div>
            <img src={assets.logo} className='mb-5 w-32' alt="" />
            <p className='w-full md:w-2/3 text-gray-600'>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptates, tempora molestiae. Explicabo nulla alias fuga possimus magnam nisi ipsum illo.</p>
        </div>

        <div>
            <p className='text-xl font-medium mb-5'>COMPANY</p>
            <ul className='flex flex-col gap-1 text-gray-600'>
                <li>Home</li>
                <li>About us</li>
                <li>Delivery</li>
                <li>Privacy Policy</li>
                <li><a href='http://localhost:5174' target='_blank' rel='noopener noreferrer' className='text-black font-medium hover:underline'>Admin Portal ↗</a></li>
            </ul>
        </div>

        <div>
            <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
            <ul className='flex flex-col gap-1 text-gray-600'>
                <li>+92 234 2333332</li>
                <li>Example@gmail.com</li>
            </ul>
        </div>

      </div>

        <div>
            <hr className='border-gray-300'/>
            <p className='py-5 text-sm text-center'>©Copyright 2026 forever.com - All right reserved.</p>
        </div>

    </div>
  )
}

export default Footer
