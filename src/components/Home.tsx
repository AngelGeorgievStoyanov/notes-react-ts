import { FC, useContext, useEffect, useState } from "react";
import { LoginContext } from "./LoginContext";
import { jwtDecode } from "jwt-decode";
import { INote } from "../interfaces/INote";
import NoteCard from "./NoteCard";
import { completedNote, deleteNoteById, getNotesByOwnerId } from "../services/noteService";
import { Box, MenuItem, Select } from "@mui/material";
import { useNavigate } from "react-router-dom";


type decode = {
    _id: string,
}
let userId: string | undefined;

const Home: FC = () => {


    const [notes, setNotes] = useState<INote[]>()
    const [sortOrder, setSortOrder] = useState<string>('created_asc');
    const navigate = useNavigate()

    const { token } = useContext(LoginContext);
    const accessToken = token ? token : localStorage.getItem('accessToken') ? localStorage.getItem('accessToken') : undefined

    if (accessToken) {
        const decode: decode = jwtDecode(accessToken);
        userId = decode._id;
    }

    useEffect(() => {
        if (userId && accessToken) {

            getNotesByOwnerId(userId, accessToken).then((data: INote[]) => {
                setNotes(data)
            }).catch((err: Error) => {

                console.log(err.message);

            });
        }
    }, [])

    const handleDelete = async (noteId: string) => {
        if (noteId && accessToken) {
            await deleteNoteById(noteId, accessToken).then((data) => {
                if (data) {
                    setNotes(prevNotes => prevNotes?.filter(note => note._id !== noteId));
                    navigate('/')
                }
            }).catch((err) => {
                console.log(err.message)
            })
        }
    }

    const handleEdit = (noteId: string) => {

        navigate(`/edit/${noteId}`);
    };
    const handleCompleted = async (noteId: string) => {
        const note = notes?.find(x => x._id === noteId)

        if (note && accessToken) {

            await completedNote(note, noteId, accessToken).then((data) => {
                const updatedNotesWithNewNote = notes?.map(note => {
                    if (note._id === data._id) {
                        return data;
                    }
                    return note;
                });
                setNotes(updatedNotesWithNewNote)
            }).catch((err) => {
                console.log(err.message)
            })
        }
    };


    const sortNotes = (notes: INote[]): INote[] => {
        return notes.sort((a, b) => {
            const isNull = (date: Date | undefined | null | string) => {
                return date === null || date === undefined || typeof date === 'string';
            };

            if (sortOrder === 'edited_asc' || sortOrder === 'edited_desc' || sortOrder === 'completed_asc' || sortOrder === 'completed_desc') {
                const parseDate = (date: string | undefined) => {
                    return date ? new Date(date) : undefined;
                };

                const aDate = sortOrder.includes('edited') ? parseDate(a.editedAt) : parseDate(a.completedAt);
                const bDate = sortOrder.includes('edited') ? parseDate(b.editedAt) : parseDate(b.completedAt);

                if (isNull(aDate) && isNull(bDate)) {
                    return (b.createdAt ? new Date(b.createdAt).getTime() : Infinity) - (a.createdAt ? new Date(a.createdAt).getTime() : Infinity);
                }
                else if (isNull(aDate)) {
                    return 1;
                }
                else if (isNull(bDate)) {
                    return -1;
                }
                else {
                    return sortOrder.includes('asc') ? (aDate as Date).getTime() - (bDate as Date).getTime() : (bDate as Date).getTime() - (aDate as Date).getTime();
                }
            }
            else {
                switch (sortOrder) {
                    case 'created_asc':
                        return (a.createdAt ? new Date(a.createdAt).getTime() : Infinity) - (b.createdAt ? new Date(b.createdAt).getTime() : Infinity);
                    case 'created_desc':
                        return (b.createdAt ? new Date(b.createdAt).getTime() : Infinity) - (a.createdAt ? new Date(a.createdAt).getTime() : Infinity);
                    default:
                        return 0;
                }
            }
        });
    };


    return (
        <>
            <Select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                sx={{
                    backgroundColor: '#1976d2',
                    color: 'white'
                }}
            >
                <MenuItem value="created_asc">Created Date (Ascending)</MenuItem >
                <MenuItem value="created_desc">Created Date (Descending)</MenuItem >
                <MenuItem value="edited_asc">Edited Date (Ascending)</MenuItem >
                <MenuItem value="edited_desc">Edited Date (Descending)</MenuItem >
                <MenuItem value="completed_asc">Completed Date (Ascending)</MenuItem >
                <MenuItem value="completed_desc">Completed Date (Descending)</MenuItem >
            </Select>
            <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', minHeight: '100vh' }}>

                {notes && notes.length > 0 ?
                    sortNotes(notes).map(x => <NoteCard key={x._id} note={x} onDelete={() => x._id && handleDelete(x._id)} onEdit={() => x._id && handleEdit(x._id)} onCompleted={() => x._id && handleCompleted(x._id)} />) : ''}
            </Box>
        </>
    )
}

export default Home;
