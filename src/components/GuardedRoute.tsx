import { FC, useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { LoginContext } from './LoginContext';
import { jwtDecode } from 'jwt-decode';

type decode = {
    _id: string;
}

let userId: string | undefined;



const GuardedRoute: FC = () => {


    const { token } = useContext(LoginContext);

    const accessToken = token ? token : localStorage.getItem('accessToken') ? localStorage.getItem('accessToken') : undefined


    if (accessToken) {
        const decode: decode = jwtDecode(accessToken);
        userId = decode._id !== undefined ? decode._id : undefined;
    } 



    return userId !== undefined ? <Outlet /> : <Navigate to="/login" />

}
export default GuardedRoute;