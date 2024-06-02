import { FC, useContext, useState } from 'react';
import { Box, Container, Grid, Typography, TextField, Button, InputLabel, Snackbar, Alert } from '@mui/material';
import { LoginContext } from './LoginContext';
import { jwtDecode } from 'jwt-decode';
import { createNote, updateNote } from '../services/noteService';
import { useLoaderData, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { INote } from '../interfaces/INote';
import * as yup from "yup";

type decoded = {
    _id: string,
}


let _ownerId: string | undefined;

interface NoteFormData {
    _ownerId?: string;
    title?: string;
    content?: string;
}

const schema = yup.object().shape({
    title: yup.string().required('Title is required.'),
    content: yup.string().required('Content is required.')
});

const CreateEditNote: FC = () => {
    const loaderData = useLoaderData();
    const note = Array.isArray(loaderData) && loaderData.length > 0 ? loaderData[0] : undefined;

    const [errorApi, setErrorApi] = useState<string>();
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

    const { token } = useContext(LoginContext);

    const { noteId } = useParams();

    const navigate = useNavigate();

    const accessToken = token ? token : localStorage.getItem('accessToken') ? localStorage.getItem('accessToken') : undefined

    if (accessToken) {
        const decoded: decoded = jwtDecode(accessToken);
        _ownerId = decoded._id;

    }


  

    const { register, handleSubmit, formState: { errors, isDirty }, watch } = useForm<NoteFormData>({
        values: { title: note?.title || '', content: note?.content || '' } || {}
    });


    const onSubmit = async (formData: NoteFormData) => {
        try {
            if (_ownerId && accessToken && formData) {
                formData.title = formData.title?.trim()
                formData.content = formData.content?.trim()
                await schema.validate(formData, { abortEarly: false });
                if (noteId) {

                    updateNote(formData, noteId, _ownerId, accessToken).then((data: INote) => {

                        if (data) {
                            navigate('/');
                        }

                    }).catch((err) => {
                        setErrorApi(err.message);
                        console.log(err.message);
                    });
                } else {

                    formData._ownerId = _ownerId

                    await createNote(formData, accessToken).then((data: INote) => {

                        if (data) {
                            navigate('/');
                        }

                    }).catch((err: Error) => {
                        setErrorApi(err.message);
                        console.log(err.message);
                    });
                }
            }
        } catch (error) {
            const validationErrors = (error as yup.ValidationError).inner.reduce((errors: Record<string, string>, err: yup.ValidationError) => {
                const key = err.path ?? err.message;
                return { ...errors, [key]: err.message };
            }, {});
            console.log(validationErrors);
            setValidationErrors(validationErrors);

        }
    };
    const goBack = () => {
        navigate(-1)
    }

    const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setErrorApi(undefined);
    };



    return (
        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
            <Container sx={{ minHeight: '100vh', padding: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'left' }} open={errorApi ? true : false} autoHideDuration={5000} onClose={handleClose} >
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
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <Typography gutterBottom sx={{ margin: '10px auto' }} variant="h5">{noteId ? 'Edit note' : 'Create note'}</Typography>
                    <Box >
                        <InputLabel sx={{ marginLeft: '8px' }}>Title</InputLabel>
                        <TextField
                            {...register('title', { required: 'Title is required.' })}
                            error={!!validationErrors.title || !!errors.title}
                            helperText={errors.title ? errors.title.message : validationErrors.title ? validationErrors.title : ''}

                        />
                    </Box>
                    <Box>
                        <InputLabel sx={{ marginLeft: '8px' }}>Content</InputLabel>
                        <TextField
                            multiline
                            rows={10}
                            {...register('content', { required: 'Content is required.' })}
                            error={!!validationErrors.content || !!errors.content}
                            helperText={errors.content ? errors.content.message : validationErrors.content ? validationErrors.content : ''}
                        />
                    </Box>
                    <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-around', marginLeft: '8px' }}>
                        <Button variant="contained"
                            disabled={(noteId && !isDirty) || !isDirty ||
                                (noteId && (!watch('title') || !watch('content'))) ? true : false} type="submit">{noteId ? 'Edit' : 'Save'}</Button>
                        <Button variant="contained" onClick={goBack}>Back</Button>
                    </Box>
                </Box>
            </Container>
        </Grid>
    );
};

export default CreateEditNote;
