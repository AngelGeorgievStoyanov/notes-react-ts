import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { TextField, Button, Box, InputLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export interface NoteFormData {
    _ownerId?: string;
    title?: string;
    content?: string;
}

interface FormProps {
    onSubmit: SubmitHandler<NoteFormData>;
    defaultValues?: NoteFormData;
}

const NoteForm: React.FC<FormProps> = ({ onSubmit, defaultValues }) => {

    const navigate = useNavigate()
    const { register, handleSubmit, formState: { errors } } = useForm<NoteFormData>({
        values: { title: defaultValues?.title, content: defaultValues?.content } || {}
    });

    const goBack = () => {
        navigate(-1);

    }

    return (

        <Box component="form" sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            maxWidth: '100%',
            padding: '25px',
            alignItems: 'center',

            '& .MuiFormControl-root': { m: 1, width: '100%' }
        }}
            noValidate
            autoComplete='off'
            onSubmit={handleSubmit(onSubmit)}
        >
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
                <Button variant="contained" type="submit">{!defaultValues?.title || !defaultValues?.content ? 'Save' : 'Edit'}</Button>
                <Button variant="contained" onClick={goBack} sx={{ ':hover': { color: 'rgb(248 245 245)' }, background: 'rgb(194 194 224)', color: 'black' }}  >BACK</Button>
            </Box>

        </Box>
    );
};

export default NoteForm;
