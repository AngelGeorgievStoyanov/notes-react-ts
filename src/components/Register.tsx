import { BaseSyntheticEvent, FC, useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import { Alert, Box, Button, Container, Grid, Snackbar, TextField, Typography } from '@mui/material';
import { register } from '../services/userService';
import { LoginContext } from './LoginContext';



type FormData = {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    confirmpass: string;

};


const schema = yup.object({
    email: yup.string().required().email(),
    firstName: yup.string().required().min(2).max(15).matches(/^(?!\s+$).*(\S{2})/, 'First Name cannot be empty string and must contain at least 2 characters .'),
    lastName: yup.string().required().min(2).max(15).matches(/^(?!\s+$).*(\S{2})/, 'Last Name cannot be empty string and must contain at least 2 characters .'),
    password: yup.string().required().matches(/^(?=(.*[a-zA-Z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{8,}$/, 'Password must contain 8 characters, at least one digit, and one character different from letter or digit'),
    confirmpass: yup.string().required().test('passwords-match', 'Passwords must match', function (value) { return this.parent.password === value }),


}).required();




const Register: FC = () => {

    const navigate = useNavigate();
    const loginContext = useContext(LoginContext);

    const [errorApi, setErrorApi] = useState<string>();

    const { control, handleSubmit, formState: { errors, isValid } } = useForm<FormData>({

        defaultValues: { email: '', firstName: '', lastName: '', password: '', confirmpass: '' },

        mode: 'onChange',
        resolver: yupResolver(schema),
    });


    const registerSubmitHandler = async (data: FormData, event: BaseSyntheticEvent<object> | undefined) => {
        event?.preventDefault();





        data.email = data.email?.trim();
        data.firstName = data.firstName?.trim();
        data.lastName = data.lastName?.trim();
        data.password = data.password?.trim();

        const newUser = { ...data };


        await register({ ...newUser }).then((user) => {
            setErrorApi(undefined);
            if (user !== undefined && user.accessToken) {
                loginContext?.loginUser(user.accessToken);
                setErrorApi(undefined);
                navigate('/');
            } else {
                setErrorApi('Register failed. Invalid user or access token.');
            }
        }).catch((err) => {
            if (err.message === 'Failed to fetch') {
                err.message = 'No internet connection with server.Please try again later.';
            }
            setErrorApi(err.message);
            console.log(err.message);

        });

    }






    const handleCloseApi = (_event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setErrorApi(undefined);
    }




    return (
        <>

            <Grid container sx={{
            }} spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>

                <Container sx={{ minHeight: '100vh', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>




                    <Snackbar sx={{ position: 'relative' }} open={errorApi ? true : false} autoHideDuration={5000} onClose={handleCloseApi} >
                        <Alert onClose={handleCloseApi} severity="error">{errorApi}</Alert>
                    </Snackbar>

                    <Box component="form" sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        maxWidth: '600px',
                        height: 'fit-content',
                        padding: '30px',
                        backgroundColor: '#e5e3e3d9',
                        boxShadow: '3px 2px 5px black', border: 'solid 1px', borderRadius: '0px',
                        '& .MuiFormControl-root': { m: 0.5, width: 'calc(100% - 10px)' },
                        '@media(max-width: 600px)': { display: 'flex' },
                        '@media(min-width: 600px)': { '& .MuiButton-root': { m: 1, width: '32ch' } }
                    }}
                        noValidate
                        autoComplete='0ff'
                        onSubmit={handleSubmit(registerSubmitHandler)}
                    >
                        <Typography gutterBottom sx={{ margin: '10px auto' }} variant="h5">
                            REGISTER
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
                            name="firstName"
                            control={control}
                            defaultValue=""
                            rules={{ required: true }}
                            render={({ field }) => (
                                <TextField {...field} name='firstName' label='First Name' error={!!errors.firstName} helperText={errors.firstName?.message}
                                />
                            )}
                        />

                        <Controller
                            name="lastName"
                            control={control}
                            defaultValue=""
                            rules={{ required: true }}
                            render={({ field }) => (
                                <TextField {...field} name='lastName' label='Last Name' error={!!errors.lastName} helperText={errors.lastName?.message}
                                />
                            )}
                        />

                        <Controller
                            name="password"
                            control={control}
                            defaultValue=""
                            rules={{ required: true }}
                            render={({ field }) => (
                                <TextField {...field} type='password' name='password' label='Password' error={!!errors.password} helperText={errors.password?.message}
                                />
                            )}
                        />
                        <Controller
                            name="confirmpass"
                            control={control}
                            defaultValue=""
                            rules={{ required: true }}
                            render={({ field }) => (
                                <TextField {...field} type='password' name='confirmpass' label='Confirm Password' error={!!errors.confirmpass} helperText={errors.confirmpass?.message}
                                />
                            )}
                        />



                        <Box sx={{ '@media(max-width: 520px)': { display: 'flex', flexDirection: 'column' } }}>

                            <Button variant="contained" type='submit' sx={{ ':hover': { background: '#4daf30' }, margin: '5px' }} disabled={!isValid}>Sign Up</Button>
                            <Button component={Link} to={'/login'} variant="contained" sx={{ ':hover': { color: 'rgb(248 245 245)' }, background: 'rgb(194 194 224)', color: 'black', margin: '5px' }}  >Already Have An Account?</Button>
                        </Box >

                    </Box>


                </Container>
            </Grid>
        </>
    )

}

export default Register;