import React, { useEffect, useRef, useState } from 'react'
import { FaFilter } from 'react-icons/fa';
import FilterSidebar from '../Components/Product/FilterSidebar';
import SortProducts from '../Components/Product/SortProducts';
import ProductGrid from '../Components/Product/ProductGrid';
import  { useParams,  useSearchParams} from "react-router-dom";
import { useDispatch ,useSelector} from "react-redux";
import { fetchProductByFilters } from "../redux/slices/productSlice";
const CollectionPage = () => {
    const {collection} = useParams();
    const [searchParams] = useSearchParams();
    const dispatch = useDispatch()
    const {products, loading, error} = useSelector((state)=> state.products)
    // const [products,setProducts] = useState([]);
    const queryParams = Object.fromEntries([...searchParams]);

    const [isSidebaropen,setIsSidebarOpen] = useState(false);
    const sidebarRef = useRef(null);

    useEffect(()=>{
        dispatch(fetchProductByFilters({ collection, ...queryParams }))
    },[dispatch, collection, searchParams])


    const toggleSidebar  = ()=>{
        setIsSidebarOpen(!isSidebaropen);
    }
    const handleClickOutside = (e)=>{
        if(sidebarRef.current && !sidebarRef.current.contains(e.target)){
            setIsSidebarOpen(false);
        }

    }
    useEffect((e)=>{
        // add addEventListener for click
        document.addEventListener("mousedown",handleClickOutside)
        // removeEventListener
        return ()=>{

            document.removeEventListener("mousedown",handleClickOutside);
        }
    },[])
    // useEffect(()=>{
    //     setTimeout(()=>{
    //         const fetchProducts = [
    //             {
    //                 _id:1,
    //                 name:"Product 1",
    //                 price:100,
    //                 images:[{url:"https://picsum.photos/500/500?random=1"}]
    //             },
    //             {
    //                 _id:2,
    //                 name:"Product 2",
    //                 price:100,
    //                 images:[{url:"https://picsum.photos/500/500?random=2"}]
    //             },
    //             {
    //                 _id:3,
    //                 name:"Product 3",
    //                 price:100,
    //                 images:[{url:"https://picsum.photos/500/500?random=3"}]
    //             },
    //             {
    //                 _id:4,
    //                 name:"Product 4",
    //                 price:100,
    //                 images:[{url:"https://picsum.photos/500/500?random=4"}]
    //             },
    //             {
    //               _id:5,
    //               name:"Product 5",
    //               price:100,
    //               images:[{url:"https://picsum.photos/500/500?random=5"}]
    //             },
    //             {
    //               _id:6,
    //               name:"Product 6",
    //               price:100,
    //               images:[{url:"https://picsum.photos/500/500?random=6"}]
    //             },
    //             {
    //               _id:7,
    //               name:"Product 7",
    //               price:100,
    //               images:[{url:"https://picsum.photos/500/500?random=7"}]
    //             },
    //             {
    //               _id:8,
    //               name:"Product 8",
    //               price:100,
    //               images:[{url:"https://picsum.photos/500/500?random=8"}]
    //             },
    //         ];
    //         setProducts(fetchProducts);
    //     },1000)
    // }, [])
  return(
    <div className='flex flex-col lg:flex-row'>
                    {/* mobile filter button */}
                <button onClick={toggleSidebar} 
                className='border flex items-center justify-center lg:hidden p-2'>
                    <FaFilter className='mr-2'/>
                </button>
                {/* filter sidebar */}
                <div ref={sidebarRef} className={`${isSidebaropen ? "translate-x-0" :"-translate-x-full"} fixed inset-y-0 z-50 left-0 w-64 overflow-y-auto bg-white transition-transform duration-300 lg:static lg:translate-x-0`}>
                    <FilterSidebar/>
                </div>
                <div className='flex-grow p-4'>
                    <h2 className='text-2xl uppercase mb-4'>All Collections</h2>
                    {/* sort options */}
                    <SortProducts/>
                    {/* product grid */}
                    <ProductGrid products={products} loading={loading} error={error} />

                </div>

            </div>
  );
}

export default CollectionPage
