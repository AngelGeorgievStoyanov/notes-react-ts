import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { TextField, Button, Box } from '@mui/material';

export interface NoteFormData {
    _ownerId?: string;
    title: string;
    content: string;
}

interface FormProps {
    onSubmit: SubmitHandler<NoteFormData>;
    defaultValues?: NoteFormData;
}

const NoteForm: React.FC<FormProps> = ({ onSubmit, defaultValues }) => {
    const { register, handleSubmit, formState: { errors } } = useForm<NoteFormData>({
        defaultValues: defaultValues || {}
    });

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
                <TextField
                    label="Title"
                    {...register('title', { required: 'Title is required.' })}
                    error={!!errors.title}
                    helperText={errors.title ? errors.title.message : ''}
                />
            </Box>
            <Box>
                <TextField
                    label="Content"
                    multiline
                    rows={10}
                    {...register('content', { required: 'Content is required.' })}
                    error={!!errors.content}
                    helperText={errors.content ? errors.content.message : ''}
                />
            </Box>
            <Button variant="contained" type="submit">Save</Button>
        </Box>
    );
};

export default NoteForm;
