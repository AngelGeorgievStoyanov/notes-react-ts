import { Controller, useForm } from 'react-hook-form';
import { Alert, Box, Button, Container, Grid, Snackbar, TextField, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import * as yup from "yup";
import { BaseSyntheticEvent, FC, useContext, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { login } from '../services/userService';
import { LoginContext } from './LoginContext';




type FormData = {
    email: string;
    password: string;

};



const schema = yup.object({
    email: yup.string().required().email(),
    password: yup.string().required().matches(/^(?!\s+$).*/, 'Password cannot be empty string.'),

}).required();


const Login: FC = () => {

    const navigate = useNavigate();

    const loginContext = useContext(LoginContext);
    const [errorApi, setErrorApi] = useState<string>();

    const { control, handleSubmit, formState: { errors, isDirty, isValid } } = useForm<FormData>({

        defaultValues: { email: '', password: '' },
        mode: 'onChange',
        resolver: yupResolver(schema),

    });




    const loginSubmitHandler = async (data: FormData, event: BaseSyntheticEvent<object> | undefined) => {
        event?.preventDefault();
        data.email = data.email.trim();
        data.password = data.password.trim();

        await login(data)
            .then((user) => {
                console.log(user)
                if (user !== undefined && user.accessToken) {
                    loginContext?.loginUser(user.accessToken);
                    setErrorApi(undefined);
                    navigate('/');

                } else {
                    setErrorApi('Login failed. Invalid user or access token.');
                }

            }).catch((err: Error) => {
                if (err.message === 'Failed to fetch') {
                    err.message = 'No internet connection with server.Please try again later.'
                }
                setErrorApi(err.message);
                console.log(err.message);

            });



    }



    const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setErrorApi(undefined);
    };

    return (
        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
            <Container sx={{ minHeight: '100vh', padding: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', }}>
                <Snackbar sx={{ position: 'relative' }} open={errorApi ? true : false} autoHideDuration={5000} onClose={handleClose} >
                    <Alert onClose={handleClose} severity="error">{errorApi}</Alert>
                </Snackbar>
                <Box component="form" sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    maxWidth: '100%',
                    padding: '30px',
                    backgroundColor: '#e5e3e3d9',
                    boxShadow: '3px 2px 5px black',
                    border: 'solid 1px',
                    borderRadius: '0px',
                    '& .MuiFormControl-root': { m: 1, width: '100%' }
                }}
                    noValidate
                    autoComplete='off'
                    onSubmit={handleSubmit(loginSubmitHandler)}
                >
                    <Typography gutterBottom sx={{ margin: '10px auto' }} variant="h5">
                        LOGIN
                    </Typography>
                    <Controller
                        name="email"
                        control={control}
                        defaultValue=""
                        rules={{ required: true }}
                        render={({ field }) => (
                            <TextField {...field} label="Email" error={!!errors.email} helperText={errors.email?.message} />
                        )}
                    />
                    <Controller
                        name="password"
                        control={control}
                        defaultValue=""
                        rules={{ required: true }}
                        render={({ field }) => (
                            <TextField {...field} type="password" label="Password" error={!!errors.password} helperText={errors.password?.message} />
                        )}
                    />   <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Button variant="contained" type='submit' sx={{ ':hover': { background: '#4daf30' }, margin: '5px', width: '100%' }} disabled={!isDirty || !isValid}>Sign Up</Button>
                        <Button variant="contained" component={Link} to={'/register'} sx={{ ':hover': { color: 'rgb(248 245 245)' }, margin: '5px', width: '100%', background: 'rgb(194 194 224)', color: 'black' }}>Don't Have An Account? Sign up!</Button>
                    </Box >
                </Box>
            </Container>
        </Grid>
    );
}

export default Login;