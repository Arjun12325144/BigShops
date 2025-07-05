import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { updateProduct } from "../../redux/slices/productSlice";
import axios from "axios"
const EditProductPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const { id } = useParams();
    const { selectedProduct, loading, error } = useSelector((state) => state.products)
    const [productData, setProductData] = useState({
        name: "",
        description: "",
        price: 0,
        countInStock: 0,
        sku: "",
        category: "",
        brand: "",
        sizes: [],
        colors: [],
        collections: "",
        material: "",
        gender: "",
        images: [],
    })
    const [uploading, setUploading] = useState(false);//image upload state
    useEffect(() => {
        if (selectedProduct) {
            setProductData(selectedProduct)
        }
    }, [selectedProduct])
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductData((prevData) => ({ ...prevData, [name]: value }))
    }
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append("image", file);
        try {
            setUploading(true);
            const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/upload`,
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" }
                }
            );
            setProductData((prevData) => ({
                ...prevData,
                images: [...prevData.images, { url: data.imageUrl, altText: "" }],
            }));
            setUploading(false);
        }
        catch (err) {
            console.error(err);
            setUploading(false)
        }
        // console.log(file)
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        // console.log(productData)
        dispatch(updateProduct({ id, productData }));
        navigate("/admin/products")

    }
    if (loading) return <p>Loading...</p>
    if (error) return <p>Error: {error}</p>
    return (
        <div className='max-w-5xl mx-auto p-6 shadow-md rounded-md'>
            <h2 className='text-3xl font-bold mb-6'>Edit Product</h2>
            <form onSubmit={handleSubmit}>
                {/* Name */}
                <div className='mb-6'>
                    <label className='block font-semibold mb-2'>Product Name</label>
                    <input required className='w-full border border-gray-300 rounded-md p-2' type='text' name='name' value={productData.name} onChange={handleChange} ></input>
                </div>
                {/* description */}
                <div className='mb-6'>
                    <label className='block font-semibold mb-2'>Description</label>
                    <textarea onChange={handleChange} name='description' value={productData.description} className='w-full border border-gray-300 rounded-md p-2' rows={4} required></textarea>

                </div>

                {/* price */}
                <div className='mb-6'>
                    <label className='block font-semibold mb-2'>Price</label>
                    <input type="number" name='price' className='w-full border border-gray-300 rounded-md p-2' value={productData.price} onChange={handleChange}></input>
                </div>

                {/* countin stock */}
                <div className='mb-6'>
                    <label className='block font-semibold mb-2'>Count in Stock</label>
                    <input type="number" name='countInStock' className='w-full border border-gray-300 rounded-md p-2' value={productData.countInStock} onChange={handleChange}></input>
                </div>

                {/* sku */}
                <div className='mb-6'>
                    <label className='block font-semibold mb-2'>SKU</label>
                    <input type="text" name='sku' className='w-full border border-gray-300 rounded-md p-2' value={productData.sku} onChange={handleChange}></input>
                </div>

                {/* sizes */}
                <div className='mb-6'>
                    <label className='block font-semibold mb-2'>Sizes (comma-separated) </label>
                    <input type="text" name='sizes' className='w-full border border-gray-300 rounded-md p-2' value={productData.sizes.join(", ")}
                        onChange={(e) => setProductData({
                            ...productData,
                            sizes: e.target.value.split(",").map((size) => size.trim()),
                        })}></input>
                </div>

                {/* colors */}
                <div className='mb-6'>
                    <label className='block font-semibold mb-2'>Colors (comma-separated) </label>
                    <input type="text" name='color' className='w-full border border-gray-300 rounded-md p-2' value={productData.colors.join(", ")}
                        onChange={(e) => setProductData({
                            ...productData,
                            colors: e.target.value.split(",").map((color) => color.trim()),
                        })}></input>
                </div>


                {/* image upload */}
                <div className='mb-6'>
                    <label className='block font-medium mb-2'>Upload Image</label>
                    <input type='file' onChange={handleImageUpload}></input>
                    {uploading && <p>Uploading Image...</p>}
                    <div className='flex gap-4 mt-4'>
                        {productData.images.map((image, index) => (
                            <div key={index}>
                                <img src={image.url} alt={image.altText || "Product Image"} className='w-20 h-20 object-cover rounded-md shadow-md' />
                            </div>
                        ))}
                    </div>
                </div>

                <button type="submit" className='text-white py-2 hover:bg-green-600 transition-colors  w-full bg-green-500'>Update Product</button>
            </form>
        </div>
    );
};
export default EditProductPage;
