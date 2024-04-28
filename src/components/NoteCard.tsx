import { Box, Button, Card, CardActions, CardContent, Collapse, Typography } from "@mui/material";
import { FC, ReactElement, useState } from "react";
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { styled } from '@mui/material/styles';
import { INote } from "../interfaces/INote";
import { sliceContent } from "../shared/common-types";

interface NoteCardProps {
    note: INote;
    onEdit: () => void;
    onComplete: () => void;
}

interface ExpandMoreProps extends IconButtonProps {
    expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
    const { expand, ...other } = props;
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

const NoteCard: FC<NoteCardProps> = ({ note }): ReactElement => {


    const [expanded, setExpanded] = useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    return (
        <Card sx={{ width: '400px', margin: '30px' }}>
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
                    <Button variant="contained" href={`/edit/${note._id}`} sx={{ ':hover': { color: 'rgb(248 245 245)' }, margin: '5px', width: '100%', background: 'rgb(194 194 224)', color: 'black' }}>Edit</Button>
                    <Button variant="contained" sx={{ ':hover': { color: 'rgb(248 245 245)' }, margin: '5px', width: '100%', background: 'rgb(194 194 224)', color: 'black' }}>Delete</Button>
                    <Button variant="contained" sx={{ ':hover': { color: 'rgb(248 245 245)' }, margin: '5px', width: '100%', background: 'rgb(194 194 224)', color: 'black' }}>Complited</Button>
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
    )
}

export default NoteCard;
