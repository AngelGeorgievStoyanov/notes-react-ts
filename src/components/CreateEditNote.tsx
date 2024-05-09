import { FC, useContext, useEffect, useState } from 'react';
import { Box, Container, Grid, Typography, TextField, Button, InputLabel } from '@mui/material';
import { LoginContext } from './LoginContext';
import { jwtDecode } from 'jwt-decode';
import { createNote, getNoteById, updateNote } from '../services/noteService';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { INote } from '../interfaces/INote';

type decoded = {
    _id: string,
}


let _ownerId: string | undefined;

interface NoteFormData {
    _ownerId?: string;
    title?: string;
    content?: string;
}

const CreateEditNote: FC = () => {

    const [note, setNote] = useState<{ title: string, content: string } | undefined>(undefined);

    const { token } = useContext(LoginContext);

    const { noteId } = useParams();

    const navigate = useNavigate();

    const accessToken = token ? token : localStorage.getItem('accessToken') ? localStorage.getItem('accessToken') : undefined

    if (accessToken) {
        const decoded: decoded = jwtDecode(accessToken);
        _ownerId = decoded._id;

    }



    useEffect(() => {
        if (noteId && accessToken) {
            getNoteById(noteId, accessToken).then((data) => {
                setNote(data[0])
            }).catch((err) => {
                console.log(err.message)
            })

        } else {
            setNote(undefined)
        }

    }, [noteId, accessToken]);


    const { register, handleSubmit, formState: { errors } } = useForm<NoteFormData>({
        values: { title: note?.title || '', content: note?.content || '' } || {}
    });


    const onSubmit = async (formData: NoteFormData) => {

        if (_ownerId && accessToken) {

            if (noteId) {
           
                updateNote(formData, noteId, _ownerId, accessToken).then((data: INote) => {
                   
                    if (data) {
                        navigate('/');
                    }
               
                }).catch((err) => {
                    console.log(err.message);
                });
            } else {

                formData._ownerId = _ownerId
               
                await createNote(formData, accessToken).then((data:INote) => {

                    if (data) {
                        navigate('/');
                    }
               
                }).catch((err: Error) => {
                    console.log(err.message);

                });
            }
        }
    };

    return (
        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
            <Container sx={{ minHeight: '100vh', padding: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <Box component="div" sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', maxWidth: '100%', padding: '15px', backgroundColor: '#e5e3e3d9', boxShadow: '3px 2px 5px black', border: 'solid 1px', borderRadius: '0px' }}>
                    <Typography gutterBottom sx={{ margin: '10px auto' }} variant="h5">{noteId ? 'Edit note' : 'Create note'}</Typography>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Box>
                            <InputLabel>Title</InputLabel>
                            <TextField
                                {...register('title', { required: 'Title is required.' })}
                                error={!!errors.title}
                                helperText={errors.title ? errors.title.message : ''}
                            />
                        </Box>
                        <Box>
                            <InputLabel>Content</InputLabel>
                            <TextField
                                multiline
                                rows={10}
                                {...register('content', { required: 'Content is required.' })}
                                error={!!errors.content}
                                helperText={errors.content ? errors.content.message : ''}
                            />
                        </Box>
                        <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-around' }}>
                            <Button variant="contained" type="submit">{noteId ? 'Edit' : 'Save'}</Button>
                            <Button variant="contained" onClick={() => navigate('/')}>Back</Button>
                        </Box>
                    </form>
                </Box>
            </Container>
        </Grid>
    );
};

export default CreateEditNote;
