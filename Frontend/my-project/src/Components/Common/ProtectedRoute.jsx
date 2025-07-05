import {useSelector} from "react-redux";
import {Navigate} from "react-router-dom";
const ProtectedRoute = ({children, role}) =>{
    const {user} = useSelector((state)=>state.auth);
    if(!user || (role && user.role !== role)){
        return <Navigate to="/login" replace/>
    }
    return children


}

export default ProtectedRoute