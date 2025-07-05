import React from 'react'
import {useEffect, useState } from 'react'
import Hero from '../Components/Layout/Hero'
import GenderCollection from '../Components/Product/GenderCollection'
import NewArrivals from '../Components/Product/NewArrivals'
import ProductDetails from '../Components/Product/ProductDetails'
import ProductGrid from '../Components/Product/ProductGrid'
import FeaturedCollection from '../Components/Product/FeaturedCollection'
import FeaturesSection from '../Components/Product/FeaturesSection'
import { useDispatch , useSelector} from "react-redux";
import { fetchProductByFilters } from "../redux/slices/productSlice";
import axios from "axios";
// const placeholderProducts = [
//       {
//         _id:1,
//         name:"Product 1",
//         price:100,
//         images:[{url:"https://picsum.photos/500/500?random=1"}]
//     },
//     {
//         _id:2,
//         name:"Product 2",
//         price:100,
//         images:[{url:"https://picsum.photos/500/500?random=2"}]
//     },
//     {
//         _id:3,
//         name:"Product 3",
//         price:100,
//         images:[{url:"https://picsum.photos/500/500?random=3"}]
//     },
//     {
//         _id:4,
//         name:"Product 4",
//         price:100,
//         images:[{url:"https://picsum.photos/500/500?random=4"}]
//     },
//     {
//       _id:5,
//       name:"Product 5",
//       price:100,
//       images:[{url:"https://picsum.photos/500/500?random=5"}]
//     },
//     {
//       _id:6,
//       name:"Product 6",
//       price:100,
//       images:[{url:"https://picsum.photos/500/500?random=6"}]
//     },
//     {
//       _id:7,
//       name:"Product 7",
//       price:100,
//       images:[{url:"https://picsum.photos/500/500?random=7"}]
//     },
//     {
//       _id:8,
//       name:"Product 8",
//       price:100,
//       images:[{url:"https://picsum.photos/500/500?random=8"}]
//     },
// ]
const Home = () => {
  const dispatch = useDispatch();
  const {products, loading, error} = useSelector((state)=>state.products);
  const [bestSellerProduct, setBestSellerProduct] = useState(null);
  useEffect(()=>{
    // fetch product for a specific collection
    dispatch(
      fetchProductByFilters({
        gender:"Women",
        category:"Bottom Wear",
        limit:8,
      })
    )
    // fetch best seller product
    const fetchBestSeller = async ()=>{
      try{
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/best-seller`)
        setBestSellerProduct(response.data);
      }
      catch(err){
        console.error(err);
      }
    };
    fetchBestSeller();
  },[dispatch])
  return (
    <div>
      <Hero/>
      <GenderCollection/>
      <NewArrivals/>
      <h2 className='text-3xl text-center font-bold mb-4 mt-8'>Best Seller </h2>
        {bestSellerProduct ? (
          <ProductDetails productId = {bestSellerProduct._id}/>
        ):(
          <p className='text-center'>Loading best seller product</p>
        )}
       
      {/* <ProductDetails/> */}
      <div className='mx-auto'>
        <h2 className='text-2xl font-bold text-center mb-4 '>
            Top Wears for Women
        </h2>
          <ProductGrid products={products} loading={loading} error={error}  />
      </div>
      <FeaturedCollection/>
      <FeaturesSection/>
    </div>
  )
}

export default Home
