import React, {useEffect} from 'react'
import { useDispatch,  useSelector} from "react-redux"
import {useNavigate, useLocation} from "react-router-dom"
import {clearCart} from "../redux/slices/cartSlice"
import { useRef } from "react";

function OrderConfirmationPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
  //  const { checkout } = useSelector((state) => state.checkout); 

  const checkoutFromStore = useSelector((state) => state.checkout.checkout);
  const checkout = location.state?.checkout || checkoutFromStore;
   //clear the cart when order is confirmed
   console.log("CHECKOUT STATE:", checkout);
   useEffect(()=>{
    if (checkout) {
    console.log("🛒 Finalized Checkout Object:", checkout);
    console.log("🕒 Order createdAt:", checkout?.createdAt);
    console.log("📦 First checkout item:", checkout.orderItems);
  }

    if(checkout && checkout._id){

      dispatch(clearCart());
      localStorage.removeItem("cart");
      // hasClearedRef.current = true;
    }else if (!checkout || !checkout._id) {
      navigate("/my-orders")
    }
   }, [checkout, dispatch, navigate])

  const calculatedEstimatedDelivery = (createdAt) =>{
    const orderDate = new Date(createdAt);
    orderDate.setDate(orderDate.getDate() + 10);
    return orderDate.toLocaleDateString();
  }
  

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
        <h1 className="text-4xl font-bold text-center text-emerald-700 mb-8">
        Thank You for Your Order!
        </h1>
        {checkout && (
          <div className="p-6 rounded-lg border">
              <div className="flex justify-between mb-20" >
                {/* order id and date */}
                <div>
                  <h2 className="text-xl font-semibold">
                    Order ID: {checkout._id}
                  </h2>
                  <p className="text-gray-500"> 
                    Order date: {new Date(checkout.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-emerald-700 text-sm">

                     Estimated Deliver: {calculatedEstimatedDelivery(checkout.createdAt)}
                     
                    {/* Estimated Deliver: {""}
                    {calculatedEstimatedDelivery(checkout.createdAt)} */}

                    </p> 
                </div>
              </div>
              {/* orderedItems */}
              <div className="mb-20">
                {checkout?.orderItems?.map((item) =>(
                  
                  <div key={item.productId} className="flex items-center mb-4" >
                    <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-md mr-4"
                      />
                    <div>
                        <h4 className ="text-md font-semibold">{item.name}</h4>
                        <p className="text-sm text-gray-500">
                          
                          {item.color} | {item.size}
                        </p>
                    </div>
                    <div className="ml-auto text-right">
                        <p className="text-md">${item.price}</p>
                        <p className="text-sm text-gray-500"> Qty: {item.quantity}  </p>
                    </div>
                  </div>
                ))}
              </div>
              {/* payment and delivery info */}
              <div className="grid grid-cols-2 gap-8">
                {/* payment info */}
                <div>
                  <h4 className="text-lg font-semibold mb-2">Payment</h4>
                  <p className="text-gray-600">Paypal</p>
                </div>

                {/* delivey */}
                <div>
                  <h4 className="text-lg font-semibold mb-2">Delivery</h4>
                  <p className="text-gray-600">
                     {checkout?.shippingAddress?.city || "N/A"},{" "}
                      {checkout?.shippingAddress?.country || "N/A"}
                  </p>
                </div>
              </div>
          </div>
          )}
    </div>
  )
}

export default OrderConfirmationPage
