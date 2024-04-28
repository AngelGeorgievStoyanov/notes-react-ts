import React, { useContext, useEffect, useState } from 'react';
import NoteForm, { NoteFormData } from './NoteForm';
import { Box, Container, Grid, Typography } from '@mui/material';
import { LoginContext } from './LoginContext';
import { jwtDecode } from "jwt-decode";
import { getNoteById, updateNote } from '../services/noteService';
import { useNavigate, useParams } from 'react-router-dom';
import { INote } from '../interfaces/INote';


type decoded = {
    _id: string,
}

let _ownerId: string | undefined;

const EditNote: React.FC = () => {
    const [note, setNote] = useState<{ title: string, content: string } | undefined>(undefined);
    const navigate = useNavigate();
    const { token } = useContext(LoginContext);
    const { noteId } = useParams();
    const accessToken = token ? token : localStorage.getItem('accessToken') ? localStorage.getItem('accessToken') : undefined

    if (accessToken) {
        const decoded: decoded = jwtDecode(accessToken);
        _ownerId = decoded._id;

    }

    useEffect(() => {
        if (_ownerId && noteId) {
            getNoteById(noteId).then((data) => {
                setNote(data[0])
            }).catch((err) => {
                console.log(err.message)
            })
        }
    }, [])

    const onSubmit = (formData: NoteFormData) => {
      
        if (note && _ownerId && noteId) {

            updateNote(formData, noteId, _ownerId).then((data: INote) => {
                if (data) {
                    navigate('/')
                }
            }).catch((err) => {
                console.log(err.message);
            });
        }
    };
    return (
        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
            <Container sx={{ minHeight: '100vh', padding: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', }}>

                <Box component="div" sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    maxWidth: '100%',
                    padding: '15px',
                    backgroundColor: '#e5e3e3d9',
                    boxShadow: '3px 2px 5px black',
                    border: 'solid 1px',
                    borderRadius: '0px',
                }}
                >
                    <Typography gutterBottom sx={{ margin: '10px auto' }} variant="h5">Edit note</Typography>
                    <NoteForm onSubmit={onSubmit} defaultValues={{ title: note?.title || '', content: note?.content || '' }} />
                </Box>
            </Container>
        </Grid>
    );
};

export default EditNote;
