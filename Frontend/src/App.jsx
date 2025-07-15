import React from 'react'
import { BrowserRouter, Route, Routes } from "react-router-dom"
import UserLayout from './Components/Layout/UserLayout';
import Home from './Pages/Home';
import {Toaster} from "sonner"
import Login from './Pages/Login';
import Register from './Pages/Register';
import Profile from './Pages/Profile';
import CollectionPage from './Pages/CollectionPage';
import ProductDetails from './Components/Product/ProductDetails';
import Checkout from './Components/Cart/Checkout';
import OrderConfirmationPage from './Pages/OrderConfirmationPage';
import OrderDetailsPage from './Pages/OrderDetailsPage';
 
import MyOrdersPage from './Pages/MyOrdersPage';
import AdminLayout from './Components/Admin/AdminLayout';
import AdminHomePage from './Pages/AdminHomePage';
import UserManagement from './Components/Admin/UserManagement'
import ProductManagement from './Components/Admin/ProductManagement';
import EditProductPage from './Components/Admin/EditProductPage';
import OrderManagement from './Components/Admin/OrderManagement';
import { Provider } from "react-redux";
import store from "./redux/store";
import ProtectedRoute from './Components/Common/ProtectedRoute';
const App = () => {
  return (
    <Provider store={store}>
     <BrowserRouter future={{ v7_startTransition: true , v7_relativeSplatPath: true}}>
     <Toaster position="top-right"/> 
        <Routes>
          <Route path="/" element={ <UserLayout />} >
              <Route index element={<Home/>}/>
              <Route path="login" element={<Login/>}/>
              <Route path="register" element={<Register/>}/>
              <Route path="profile" element={<Profile/>}/>
              <Route path='collections/:collection' element={<CollectionPage/>}/>
              <Route path='product/:id' element={<ProductDetails/>}/>   
              <Route path='checkout' element={<Checkout/>}/> 
              <Route path='order-confirmation' element={<OrderConfirmationPage/>}/>
              <Route path='order/:id' element={<OrderDetailsPage/>}/>
              <Route path='my-orders' element={<MyOrdersPage/>}/>
          {/*user layout */ }
          </Route>
          <Route path="/admin" element={
            <ProtectedRoute>
            <AdminLayout/> </ProtectedRoute>  }
          
          >
                <Route index element={<AdminHomePage/>} />
                <Route path='users' element={<UserManagement/>} />
                <Route path='products' element={<ProductManagement/>}/>
                <Route path='products/:id/edit' element={<EditProductPage/>}/>
                <Route path='orders' element={<OrderManagement/>}/>
            { /*admin layout */}
          </Route>
        </Routes>
     </BrowserRouter>
     </Provider>
  );
};

export default App
