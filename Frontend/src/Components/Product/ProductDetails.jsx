import React, { use, useEffect, useState } from 'react'
import {toast} from "sonner"
import ProductGrid from './ProductGrid'
import { useParams } from "react-router-dom";
import { useDispatch , useSelector} from "react-redux";
import { fetchProductDetails, fetchSimilarProducts } from "../../redux/slices/productSlice";
import { addToCart } from "../../redux/slices/cartSlice"; 

const  ProductDetails = ({productId}) => {
    const {id} = useParams();
    const dispatch = useDispatch();
    const { selectedProduct,loading,error,similarProducts } = useSelector((state)=> state.products)
    const {user, guestId} = useSelector((state)=>state.auth)
    const[mainImage, setMainImage] = useState("")
    const [selectedSize,setSelectedSize] = useState("")
    const[selectedColor,setSelectedColor] = useState("")
    const [quantity,setQuantity] = useState(1)
    const [isButtonDisabled,setIsButtonDisabled] = useState(false)

    const productFetchId = productId || id;
    useEffect(()=>{
        if(productFetchId){
            dispatch(fetchProductDetails(productFetchId));
            dispatch(fetchSimilarProducts({id :productFetchId}))
        }
    },[dispatch, productFetchId])


    useEffect(()=>{
        if(selectedProduct?.images?.length > 0){
            setMainImage(selectedProduct.images[0].url)
        }
    },[selectedProduct])


    const handleQuantityChange = (action)=>{
        if(action === "plus") setQuantity((prev) => prev+1);
        if(action==="minus" && quantity>1) setQuantity((prev)=>prev-1);

    }
    const handleCheckout = ()=>{
        if(!selectedColor || !selectedSize){
            toast.error("Please enter a size and color before adding.",{
                duration: 1000,
            });
            return;
            // agar hm return hta da to jb hm bina kuch select kra button pr click kr rha ha to phala error wali statement display hori pr success wali
            // hma asa nhi chaiya 
        }
        setIsButtonDisabled(true);
        dispatch(
            addToCart({
                productId: productFetchId,
                quantity,
                size: selectedSize,
                color:selectedColor,
                guestId,
                userId: user?._id,
            })
        )
        .then(()=>{
            toast.success("Product added to cart!",{
                duration:1000,
            })
        })
        .finally(()=>{
            setIsButtonDisabled(false);
        })
        // setTimeout(() => {
        //     toast.success("Product added to cart.",{
        //         duration: 1000,
        //     });
        //     setIsButtonDisabled(false)
        // },1000);
    }
   

    if(loading){
        return <p>Loading...</p>
    }
    if(error){
        return <p>Error {error}</p>
    }

  return (
    <div className='p-6'>
        {selectedProduct && ( 
        <div className='max-w-6xl bg-white mx-auto p-8 rounded-lg'>
            <div className='flex flex-col md:flex-row'>
                {/* left thumbnail */}
                <div className='hidden md:flex flex-col space-y-4 mr-6'>
                    {selectedProduct.images.map((image,index)=>(
                        <img
                            key={index}
                            src={image.url}
                            alt={image.altText || `Thumbnail ${index}`}
                            className={`h-20 w-20 object-cover rounded-lg cursor-pointer border ${mainImage === image.url ? "border-black" : "border-white"}`}
                            onClick={()=>setMainImage(image.url)}
                        />
                    ))}

                </div>
                {/* main image  */}
                <div className='md:w-1/2 '>
                    <div className='mb-4'>
                        <img
                            src={mainImage}
                            alt='Main Product'
                            className='w-full h-auto rounded-lg object-cover'
                        />
                    </div>
                </div>
                {/* mobile screen thumbnail */}
                <div className='md:hidden overscroll-x-scroll flex space-x-4 mb-4'>
                    {selectedProduct.images.map((image,index)=>(
                            <img
                                key={index}
                                src={image.url}
                                alt={image.altText || `Thumbnail ${index}`}
                                className={`h-20 w-20 object-cover rounded-lg cursor-pointer border ${mainImage === image.url ? "border-black" : "border-white"}`}
                            
                                onClick={()=>setMainImage(image.url)}
                            />
                        ))}

                </div>
                {/* right section  */}

                <div className='md:w-1/2 md:ml-10'>
                        <h1 className='text-2xl md:text-3xl font-semibold mb-2'>{selectedProduct.name}</h1>
                        <p className='text-lg text-gray-600 mb-1 line-through'>
                            {selectedProduct.OriginalPrice && `${selectedProduct.OriginalPrice}`}
                        </p>
                        <p className='text-xl text-gray-500 mb-2'>
                            {selectedProduct.price}
                        </p>
                        <p className='text-xl text-gray-500 mb-4'>
                            {selectedProduct.description}
                        </p>
                        
                        <div className='mb-4'>
                            <p className='text-gray-700'>Color:</p>
                            <div className='flex space-x-1 mt-2'>
                                {selectedProduct.colors.map((color)=>(
                                    <button
                                        key={color}
                                        className={`h-8 w-8 rounded-full border ${selectedColor === color ? "border-4 border-black": "border-gray-300"}`}
                                        style={{
                                            backgroundColor: color.toLocaleLowerCase(),
                                            filter:'brightness(0.5)',
                                        }}
                                        onClick={()=>setSelectedColor(color)}
                                        > 
                                    </button>
                                ))}
                            </div> 
                        </div>

                        <div className='mb-4'>
                            <p className='text-gray-700'>Size:</p>
                            <div className='flex gap-2 mt-2'>
                                {selectedProduct.sizes.map((size)=>(
                                    <button onClick={()=> setSelectedSize(size)} className={`px-4 py-2 rounded border
                                         ${selectedSize === size ?"bg-black text-white ":""}`  }>{size}</button>
                                    
                                ))}
                            </div>

                        </div>

                        <div className='mb-6'>
                            <p className='text-gray-700'>Quantity:</p>
                            <div className='flex items-center space-x-3 mt-2'>
                                <button onClick={()=>handleQuantityChange("minus")} className='px-2 py-1 border bg-gray-200 text-lg'>-</button>
                                <span className='text-lg'>{quantity}</span>
                                <button onClick={()=>handleQuantityChange("plus")} className='px-2 py-1 border bg-gray-200 text-lg'>+</button>
                            </div>
                        </div>
                        <button onClick={handleCheckout}
                             disabled={isButtonDisabled}
                             className={`py-2 px-6 bg-black text-white rounded w-full mb-4 ${isButtonDisabled?"opacity-45 cursor-not-allowed":"hover:bg-grey-900"}`}>
                                {isButtonDisabled?"Adding..." :"ADD TO CART"}</button>
                        <div className='mt-10 text-gray-700'>
                            <h3 className='text-xl font-bold mb-4'>Characterstics:</h3>
                            <table className='w-full text-left text-sm text-gray-600'>
                                <tbody>

                                <tr>
                                    <td className='py-1'>Brand</td>
                                    <td className='py-1'>{selectedProduct.brand}</td>
                                </tr>
                                <tr>
                                    <td className='py-1'>Material</td>
                                    <td className='py-1'>{selectedProduct.material}</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                </div>

                         
            </div>

            <div className='mt-20'>
                <h2 className='text-2xl font-medium text-center mb-4'>You May Also Like</h2>
                <ProductGrid products={similarProducts} loading={loading} error={error} />
            </div>
        </div>
        )}
       
    </div>
  )
}

export default ProductDetails
