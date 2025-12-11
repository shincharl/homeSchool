import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContextType";

interface PrivateRouteProps {
    children: JSX.Element;
}

const PrivateRoute = ({children}: PrivateRouteProps) => {
    const {isLoggedIn} = useAuth();

    if(!isLoggedIn){
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default PrivateRoute;