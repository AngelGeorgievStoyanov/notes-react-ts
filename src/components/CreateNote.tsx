import React, { useContext } from 'react';
import NoteForm, { NoteFormData } from './NoteForm';
import { Box, Container, Grid, Typography } from '@mui/material';
import { LoginContext } from './LoginContext';
import { jwtDecode } from "jwt-decode";
import { createNote } from '../services/noteService';
import { useNavigate } from 'react-router-dom';


type decoded = {
    _id: string,
}

let _ownerId: string | undefined;

const CreateNote: React.FC = () => {

    const navigate = useNavigate();

    const { token } = useContext(LoginContext);

    const accessToken = token ? token : localStorage.getItem('accessToken') ? localStorage.getItem('accessToken') : undefined

    if (accessToken) {
        const decoded: decoded = jwtDecode(accessToken);
        _ownerId = decoded._id;

    }

    const handleCreateSubmit = async (data: NoteFormData) => {
        if (_ownerId && accessToken) {
            data._ownerId = _ownerId

            await createNote(data, accessToken).then((note) => {

                if (note) {
                    navigate('/');
                }
            }).catch((err: Error) => {
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
                    <Typography gutterBottom sx={{ margin: '10px auto' }} variant="h5">Create note</Typography>
                    <NoteForm onSubmit={handleCreateSubmit} />
                </Box>
            </Container>
        </Grid>
    );
};

export default CreateNote;
