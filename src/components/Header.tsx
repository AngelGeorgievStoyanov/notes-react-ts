import { Link, useNavigate } from "react-router-dom";
import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import { jwtDecode } from "jwt-decode";
import { FC, useContext } from "react";
import { LoginContext } from "./LoginContext";


type decode = {
    email: string,
    _id: string
}


let email: string | undefined;
let userId: string | undefined;

const Header: FC = () => {

    const { token } = useContext(LoginContext);

    const navigate = useNavigate();
    const loginContext = useContext(LoginContext);

    const accessToken = token ? token : localStorage.getItem('accessToken') ? localStorage.getItem('accessToken') : undefined

    if (accessToken) {
        const decode: decode = jwtDecode(accessToken);
        email = decode.email;
        userId = decode._id
    }

    
    const logout = () => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            loginContext?.logoutUser();
            navigate('/login');
        }
    }

    return (

        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar sx={{
                    display: 'flex', justifyContent: 'space-between', paddingBottom: '20px', '@media(max-width: 760px)': {
                        display: 'flex', flexDirection: 'row', flexWrap: 'wrap'
                    }
                }}>
                    {accessToken !== undefined && userId  ?
                        <>
                            <Typography variant="h6" component="div" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                {accessToken !== undefined ?
                                    <Button component={Link} to={'/'} color="inherit"  >Welcome   {email}</Button> : 'Welcome'

                                }
                            </Typography>
                            <Button component={Link} sx={{ margin: '2px', padding: '2px', boxSizing: 'content-box' }} to={'/'} color="inherit"  >HOME</Button>
                            <Button component={Link} sx={{ margin: '2px', padding: '2px', boxSizing: 'content-box' }} to={'/create-note'} color="inherit" >CREATE NOTE</Button>
                            <Button onClick={logout} sx={{ margin: '2px', padding: '2px', boxSizing: 'content-box' }} color="inherit" >LOGOUT</Button>
                        </>
                        :
                        <>
                            <Button component={Link} sx={{ margin: '2px', padding: '2px', boxSizing: 'content-box' }} to={'/login'} color="inherit" >LOGIN</Button>
                            <Button component={Link} sx={{ margin: '2px', padding: '2px', boxSizing: 'content-box' }} to={'/register'} color="inherit" >REGISTER</Button>
                        </>}

                </Toolbar>
            </AppBar>
        </Box >

    )
}

export default Header;