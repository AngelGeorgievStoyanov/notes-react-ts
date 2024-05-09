import { Box, Button, Card, CardActions, CardContent, Collapse, Typography } from "@mui/material";
import { FC, ReactElement, useState } from "react";
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { styled } from '@mui/material/styles';
import { INote } from "../interfaces/INote";
import { sliceContent } from "../shared/common-types";

interface NoteCardProps {
    note: INote;
    onDelete: (notedId: string) => void;
    onEdit: (notedId: string) => void;
    onCompleted: (notedId: string) => void;
}

interface ExpandMoreProps extends IconButtonProps {
    expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
    const {  ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));

const dateFormat = (date: string) => {
    const isoDate = new Date(date);
    let timePart = '';
    if (!isNaN(isoDate.getTime())) {
        const hours = isoDate.getHours().toString().padStart(2, '0');
        const minutes = isoDate.getMinutes().toString().padStart(2, '0');
        const seconds = isoDate.getSeconds().toString().padStart(2, '0');
        timePart = `${hours}:${minutes}:${seconds} `;
    }
    const formattedDate = `${timePart}${isoDate.getDate()}-${isoDate.getMonth() + 1}-${isoDate.getFullYear()}`;
    return formattedDate;
}

const NoteCard: FC<NoteCardProps> = ({ note, onDelete, onEdit, onCompleted }): ReactElement => {


    const [expanded, setExpanded] = useState(false);
    const [hideX, setHideX] = useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };




    const confirmDelete = (noteId: string) => {
        if (window.confirm("Are you sure you want to delete this note?")) {
            onDelete(noteId);
        }
    };

    const handleDelete = () => {
        if (note._id) {
            confirmDelete(note._id);
        }
    };

    const handleEdit = () => {
        if (note._id) {

            onEdit(note._id)
        }
    }

    const handleCompleted = () => {
        if (note._id) {
          
            if(expanded){
                setExpanded(false)
            }
            onCompleted(note._id)

            setHideX(note.completed ? note.completed : false)
           
        }
    }


    return (
        <>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                maxWidth: '300px',
                padding: '30px',
                backgroundColor: '#e5e3e3d9',
                boxShadow: '3px 2px 5px black',
                border: 'solid 1px',
                borderRadius: '0px',
                margin: '20px',
                alignItems: 'center',
                height: 'auto',
                '& .MuiFormControl-root': { m: 1, width: '100%' }
            }}>

                {note.completed ?
                    <>
                        <Button variant="contained" onClick={handleCompleted} sx={{ maxWidth: '80%', ':hover': { color: 'rgb(248 245 245)' }, margin: '5px', width: '100%', background: 'rgb(194 194 224)', color: 'black' }}>Unmark as completed</Button>
                        <Typography variant="body2" color="text.secondary">
                            {note.completedAt ? 'Completed : ' + dateFormat(note.completedAt) : ''}
                        </Typography>
                    </>
                    : ''}
                <Card key={note._id} variant="outlined" sx={{ ...(note.completed && { opacity: 0.5, pointerEvents: 'none' }), backgroundColor: '#e5e3e3d9', border: '0px' }}>
                    {note.completed && !hideX ? (
                        <>
                            <div style={{ zIndex: 1, position: 'relative', top: '50%', left: '50%', transform: 'translate(-50%, -50%) rotate(45deg)', width: '100%', height: 2, backgroundColor: 'black', borderRadius: 2, transition: 'width 0.5s ease-in-out', animation: `${note.completed ? 'expandLine 0.5s forwards' : 'none'}` }}></div>
                            <div style={{ zIndex: 1, position: 'relative', top: '50%', left: '50%', transform: 'translate(-50%, -50%) rotate(-45deg)', width: '100%', height: 2, backgroundColor: 'black', borderRadius: 2, transition: 'width 0.5s ease-in-out', transitionDelay: '0.5s', animation: `${note.completed ? 'expandLine 0.5s forwards' : 'none'}` }}></div>
                        </>
                    ) :
                        hideX && (
                            <>
                                <div style={{ zIndex: 1, position: 'relative', top: '50%', left: '50%', transform: 'translate(-50%, -50%) rotate(45deg)', width: '100%', height: 2, backgroundColor: 'black', borderRadius: 2, transition: 'width 0.5s ease-in-out', animation: `${hideX ? 'collapseLine 0.5s forwards' : 'none'}` }}></div>
                                <div style={{ zIndex: 1, position: 'relative', top: '50%', left: '50%', transform: 'translate(-50%, -50%) rotate(-45deg)', width: '100%', height: 2, backgroundColor: 'black', borderRadius: 2, transition: 'width 0.5s ease-in-out', transitionDelay: '0.5s', animation: `${hideX ? 'collapseLine 0.5s forwards' : 'none'}` }}></div>
                            </>
                        )}
                    <CardContent>

                        <Typography variant="h5" component="div">
                            Title:   {note.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Content:    {note.content ? sliceContent(note.content, 150) : ''}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {note.createdAt ? 'Created: ' + dateFormat(note.createdAt) : ''}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {note.editedAt ? 'Edited: ' + dateFormat(note.editedAt) : ''}
                        </Typography>
                        <Box sx={{ display: 'flex' }}>
                            <Button variant="contained" onClick={handleEdit} sx={{ ':hover': { color: 'rgb(248 245 245)' }, margin: '5px', width: '100%', background: 'rgb(194 194 224)', color: 'black' }}>Edit</Button>
                            <Button variant="contained" onClick={handleDelete} sx={{ ':hover': { color: 'rgb(248 245 245)' }, margin: '5px', width: '100%', background: 'rgb(194 194 224)', color: 'black' }}>Delete</Button>
                            <Button variant="contained" onClick={handleCompleted} sx={{ ':hover': { color: 'rgb(248 245 245)' }, margin: '5px', width: '100%', background: 'rgb(194 194 224)', color: 'black' }}>Mark as complete</Button>

                        </Box>

                    </CardContent>
                    <CardActions disableSpacing>
                        <ExpandMore
                            expand={expanded}
                            onClick={handleExpandClick}
                            aria-expanded={expanded}
                            aria-label="show more"
                        >
                            {note.content && note.content?.length > 150 ? < ExpandMoreIcon /> : ''}
                        </ExpandMore>
                    </CardActions>
                    <Collapse in={expanded} timeout="auto" unmountOnExit>
                        <CardContent>
                            <Typography paragraph>
                                Content: {note.content}
                            </Typography>
                        </CardContent>
                    </Collapse>
                </Card>
            </Box>
        </>
    )
}

export default NoteCard;



