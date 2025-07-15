import React from 'react'
import { Link } from 'react-router-dom'

const ProductGrid = ({products, loading, error}) => {
    if(loading){
        return <p>Loading...</p>;
    }
    if(error){
        return <p>Error: {error}</p>
    }
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2'>
        {products.map((product,index) => (
            <Link key={index} to={`/product/${product._id}`} className='block'>
                <div className='bg-white p-4 rounded-lg'>

                    <div className='w-full h-96 mb-4'>
                        <img src={product.images[0].url} alt={product.name}  className='h-full w-full rounded-lg object-cover'/>
                    </div>
                    <h3 className='text-sm mb-2'>{product.name}</h3>
                    <p className='text-gray-500 tracking-tighter text-sm font-medium'>$ {product.price}</p>
                </div>
            </Link>
        ))}
      
    </div>
  )
}

export default ProductGrid
