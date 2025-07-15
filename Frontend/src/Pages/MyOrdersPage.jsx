import React, { useEffect, useState } from 'react'
import {useNavigate} from "react-router-dom"
import { useDispatch, useSelector} from "react-redux"
import { fetchUserOrders } from "../redux/slices/orderSlice" 
function MyOrdersPage() {
  // const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { orders, loading, error} = useSelector((state)=>state.orders)
  // useEffect(() => {
  //   setTimeout(() => {
  //     const mockOrders = [
  //       {
  //         _id: "12345",
  //         createdAt: new Date(),
  //         shippingAddress: { city: "New York", country: "USA" },
  //         orderItem: [
  //           {
  //             name: "Product 1",
  //             image: "https://picsum.photos/500/500?random=1",
  //           },
  //         ],
  //         totalPrice: 100,
  //         isPaid: true,
  //       },
  //       {
  //         _id: "34567",
  //         createdAt: new Date(),
  //         shippingAddress: { city: "New York", country: "USA" },
  //         orderItem: [
  //           {
  //             name: "Product 2",
  //             image: "https://picsum.photos/500/500?random=2",
  //           },
  //         ],
  //         totalPrice: 100,
  //         isPaid: true,
  //       },
  //     ]
  //     setOrders(mockOrders);
  //   },1000)

  // }, [])
  useEffect(()=>{
    dispatch(fetchUserOrders())
  },[dispatch])
  const handleRowClick = (orderId)=>{
    navigate(`/order/${orderId}`)
  }
  if(loading) return <p>Loading...</p>
  if(error) return <p>Error: {error}</p>
  return (
    <div className='max-w-7xl mx-auto p-4 sm:p-6 '>
      <h2 className='text-xl sm:text-2xl  font-bold mb-6'>My Orders</h2>
      <div className='relative shadow-md sm:rounded-lg  overflow-x-auto' style={{ maxHeight: "80vh", overflowY: "auto" }}>
        <table className=' min-w-full table-fixed  text-left  text-gray-500'>
          <thead className='bg-gray-100 text-xs uppercase text-gray-700'>
            <tr>

            <th className='py-2 px-4 sm:py-3 sticky top-0 bg-gray-100 z-10'>Image</th>
            <th className='py-2 px-4 sm:py-3 sticky top-0 bg-gray-100 z-10'>Order ID</th>
            <th className='py-2 px-4 sm:py-3 sticky top-0 bg-gray-100 z-10'>Created</th>
            <th className='py-2 px-4 sm:py-3 sticky top-0 bg-gray-100 z-10'>Shipping Address</th>
            <th className='py-2 px-4 sm:py-3 sticky top-0 bg-gray-100 z-10'>Items</th>
            <th className='py-2 px-4 sm:py-3 sticky top-0 bg-gray-100 z-10'>Price</th>
            <th className='py-2 px-4 sm:py-3 sticky top-0 bg-gray-100 z-10'>Status</th>
            </tr>

          </thead>
          <tbody>
            { orders.length > 0 ? (
              orders.map((order)=>(
                <tr key={order._id} onClick={()=>handleRowClick(order._id)} className='cursor-pointer border-b hover:border-gray-50'>
                  <td className='py-2 px-2 sm:px-4 sm:py-4'>
                    <img className='h-10 w-10 sm:h-12 sm:w-12 object-cover rounded-lg' src={order.orderItems[0].image} alt={order.orderItems[0].name} />
                  </td>
                  <td className='py-2 px-2 sm:px-4 sm:py-4 font-medium text-gray-900 whitespace-nowrap'>#{order._id}</td>
                  <td className='py-2 px-2 sm:px-4 sm:py-4 '>
                    {new Date(order.createdAt).toLocaleDateString()}{" "}
                    {new Date(order.createdAt).toLocaleTimeString()}
                  </td>
                  <td className='py-2 px-2 sm:px-4 sm:py-4'>
                    {order.shippingAddress ? `${order.shippingAddress.city}, ${order.shippingAddress.country}`:"N/A"}
                  </td>
                  <td className='py-2 px-2 sm:px-4 sm:py-4'>{order.orderItems.length}</td>
                  <td className='py-2 px-2 sm:px-4 sm:py-4'>${order.totalPrice}</td>
                  <td className='py-2 px-2 sm:px-4 sm:py-4'> 
                    <span className={`${order.isPaid?"bg-green-100 text-green-700":"bg-red-100 text-red-700"} px-2 py-1 rounded-full text-xs sm:text-sm`}>{order.isPaid?"Paid":"Pending"}</span>
                  </td>
                </tr>
              ))
            ) : (
              <tr className=' '>
                <td colSpan={7} className='py-4 px-4 text-center text-gray-500'>You have no orders</td>
              </tr>
            )
          }
          </tbody>
        </table>
      </div>

    </div>
  )
}

export default MyOrdersPage
