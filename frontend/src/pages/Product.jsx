import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import RelatedProducts from '../components/RelatedProducts';
import axios from 'axios';
import { toast } from 'react-toastify';

const Product = () => {

  const {productId} = useParams();
  const {products, currency, addToCart, backendUrl, token, navigate} = useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState('');
  const [size, setSize] = useState('');

  const [activeTab, setActiveTab] = useState('description');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchProductData = async () => {
    const item = products.find((item) => item._id === productId);
    if (item) {
      setProductData(item);
      setImage(item.image?.[0] || '');
    }
  }

  useEffect(() =>{
    fetchProductData();
  },[productId, products])

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.info('Please log in to submit a review');
      navigate('/login');
      return;
    }
    if (!reviewComment.trim()) {
      toast.error('Please enter your review comment');
      return;
    }
    try {
      setSubmittingReview(true);
      const res = await axios.post(
        `${backendUrl}/api/product/review`,
        {
          productId: productData._id,
          rating: reviewRating,
          comment: reviewComment
        },
        { headers: { token } }
      );
      if (res.data.success) {
        toast.success('Review submitted successfully!');
        setProductData(res.data.product);
        setReviewComment('');
        setReviewRating(5);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmittingReview(false);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const rounded = Math.round(rating || 0);
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <img
          key={i}
          src={i <= rounded ? assets.star_icon : assets.star_dull_icon}
          alt=""
          className='w-3.5 inline-block'
        />
      );
    }
    return stars;
  };

  const reviewCount = productData?.reviews?.length || 0;
  const avgRating = productData?.averageRating || 0;

  return productData ? (
    <div className='border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100'>
      {/* product details */}
      <div className='flex flex-col gap-12 sm:gap-12 sm:flex-row'>
        {/* product image */}
        <div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row'>
          <div className='flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal w-full sm:w-[18.7%]'>
            {
              productData.image.map((item,index) => (
                <img onClick={()=>setImage(item)} src={item} key={index} className='w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer' alt="" />
              ))
            }
          </div>
          <div className='w-full sm:w-[80%]'>
            <img className='w-full h-auto' src={image} alt="" />
          </div>
        </div>
        {/* product info */}
        <div className='flex-1'>
          <h1 className='font-medium text-2xl mt-2'>{productData.name}</h1>
          <div className='flex items-center gap-1 mt-2'>
            {renderStars(avgRating || 5)}
            <p className='pl-2 text-sm text-gray-500'>
              {avgRating > 0 ? `${avgRating} / 5` : '5.0'} ({reviewCount} reviews)
            </p>
          </div>
          <p className='mt-5 text-3xl font-medium'>{currency}{productData.price}</p>
          <p className='mt-5 text-gray-500 md:w-4/5'>{productData.description}</p>
          <div className='flex flex-col gap-4 my-8'>
            <p>Select Size</p>
            <div className='flex gap-2'>
              {
                productData.sizes && productData.sizes.map((item, index) => (
                  <button onClick={()=>setSize(item)} className={`border py-2 px-4 bg-gray-100 ${item === size ? 'border-orange-500' : ''}`} key={index}>{item}</button>
                ))
              }
            </div>
          </div>
          <button onClick={()=>addToCart(productData._id,size)} className='bg-black text-white px-8 py-3 text-sm active:bg-gray-700'>ADD TO CART</button>
          <hr className='mt-8 sm:w-4/5' />
          <div className='flex flex-col gap-1 text-sm text-gray-500'>
            <p>100% Original product.</p>
            <p>Cash on delivery & Mobile Wallets available.</p>
            <p>Easy return and exchange policy within 7 days.</p>
          </div>
        </div>
      </div>

      {/* Description and Reviews Section */}
      <div className='mt-20'>
        <div className='flex cursor-pointer'>
          <button
            onClick={() => setActiveTab('description')}
            className={`px-5 py-3 text-sm font-medium border ${activeTab === 'description' ? 'border-b-white bg-white font-bold' : 'bg-gray-50 text-gray-500'}`}
          >
            Description
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-5 py-3 text-sm font-medium border border-l-0 ${activeTab === 'reviews' ? 'border-b-white bg-white font-bold' : 'bg-gray-50 text-gray-500'}`}
          >
            Customer Reviews ({reviewCount})
          </button>
        </div>

        <div className='border px-6 py-6 text-sm text-gray-600 bg-white'>
          {activeTab === 'description' ? (
            <div className='flex flex-col gap-4 leading-relaxed'>
              <p>{productData.description}</p>
              <p>Designed with premium quality fabric tailored for ultimate comfort, durability, and daily elegance. Each piece undergoes quality inspection before shipping.</p>
              <div className='mt-2'>
                <p className='font-semibold text-gray-800'>Product Highlights:</p>
                <ul className='list-disc list-inside mt-1 text-gray-500 text-xs sm:text-sm space-y-1'>
                  <li>Category: {productData.category} / {productData.subCategory}</li>
                  <li>Available Sizes: {productData.sizes ? productData.sizes.join(', ') : 'Standard'}</li>
                  <li>100% Genuine Quality guaranteed</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className='flex flex-col gap-6'>
              {/* Existing Reviews List */}
              <div className='flex flex-col gap-4'>
                {reviewCount === 0 ? (
                  <p className='text-gray-400 italic py-2'>No customer reviews yet. Be the first to review this product!</p>
                ) : (
                  productData.reviews.map((rev, idx) => (
                    <div key={idx} className='border-b pb-4'>
                      <div className='flex items-center justify-between mb-1'>
                        <span className='font-semibold text-gray-800'>{rev.userName}</span>
                        <span className='text-xs text-gray-400'>{new Date(rev.date).toLocaleDateString()}</span>
                      </div>
                      <div className='flex gap-1 mb-2'>
                        {renderStars(rev.rating)}
                      </div>
                      <p className='text-gray-600 text-xs sm:text-sm'>{rev.comment}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Add a Review Form */}
              <div className='mt-4 pt-6 border-t'>
                <h3 className='font-bold text-gray-800 mb-2'>Write a Customer Review</h3>
                {token ? (
                  <form onSubmit={handleReviewSubmit} className='flex flex-col gap-3 max-w-lg'>
                    <div>
                      <label className='block text-xs text-gray-500 mb-1'>Rating (Stars)</label>
                      <select
                        value={reviewRating}
                        onChange={(e) => setReviewRating(Number(e.target.value))}
                        className='border border-gray-300 rounded px-3 py-1.5 text-sm bg-white'
                      >
                        <option value={5}>⭐⭐⭐⭐⭐ (5 - Excellent)</option>
                        <option value={4}>⭐⭐⭐⭐ (4 - Good)</option>
                        <option value={3}>⭐⭐⭐ (3 - Average)</option>
                        <option value={2}>⭐⭐ (2 - Below Average)</option>
                        <option value={1}>⭐ (1 - Poor)</option>
                      </select>
                    </div>

                    <div>
                      <label className='block text-xs text-gray-500 mb-1'>Your Review</label>
                      <textarea
                        required
                        rows={3}
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder='Share your honest feedback about fabric, fitting, and overall quality...'
                        className='w-full border border-gray-300 rounded p-2.5 text-sm focus:outline-none focus:border-black'
                      />
                    </div>

                    <button
                      type='submit'
                      disabled={submittingReview}
                      className='bg-black text-white px-6 py-2 text-xs sm:text-sm rounded hover:bg-gray-800 self-start disabled:opacity-50'
                    >
                      {submittingReview ? 'Submitting...' : 'Post Review'}
                    </button>
                  </form>
                ) : (
                  <div className='p-3 bg-gray-50 border rounded text-xs text-gray-600'>
                    <span>Please </span>
                    <button onClick={() => navigate('/login')} className='text-black font-semibold underline'>
                      Sign In
                    </button>
                    <span> to submit a rating and review for this product.</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Display Related Products */}
      <RelatedProducts category={productData.category} subCategory={productData.subCategory} />
    </div>
  ) : <div className='opacity-0'></div>
}

export default Product
