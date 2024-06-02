import { FC, useContext, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Footer from './components/Footer';
import Header from './components/Header';
import { LoginContext } from './components/LoginContext';

const App: FC = () => {
    const { loginUser } = useContext(LoginContext);

    useEffect(() => {
        const storedToken = localStorage.getItem('accessToken');
        if (storedToken) {
            loginUser(storedToken);
        }
    }, [loginUser]);

    return (
        <>
            <Header />
            <Outlet />
            <Footer />
        </>
    );
};

export default App;
