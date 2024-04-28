import { FC, useContext, useEffect, useState } from "react";
import { LoginContext } from "./LoginContext";
import { jwtDecode } from "jwt-decode";
import { INote } from "../interfaces/INote";
import NoteCard from "./NoteCard";
import { complitedNote, deleteNoteById, getNotesByOwnerId } from "../services/noteService";
import { Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";


type decode = {
    _id: string,
}
let userId: string | undefined;

const Home: FC = () => {


    const [notes, setNotes] = useState<INote[]>()

    const navigate = useNavigate()

    const { token } = useContext(LoginContext);
    const accessToken = token ? token : localStorage.getItem('accessToken') ? localStorage.getItem('accessToken') : undefined

    if (accessToken) {
        const decode: decode = jwtDecode(accessToken);
        userId = decode._id;
    }

    useEffect(() => {
        if (userId) {

            getNotesByOwnerId(userId).then((data: INote[]) => {
                setNotes(data)
            }).catch((err: Error) => {

                console.log(err.message);

            });
        }
    }, [])

    const handleDelete = async (noteId: string) => {
        if (noteId) {
            await deleteNoteById(noteId).then((data) => {
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
    const handleComplited = async (noteId: string) => {
        const note = notes?.find(x => x._id === noteId)
        console.log(note)
        console.log(note?.complited)
        if (note) {

            await complitedNote(note, noteId).then((data) => {
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


    return (
        <>
            <Grid container spacing={2} sx={{ alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
                {notes && notes.length > 0 ?
                    notes.map(x => <NoteCard key={x._id} note={x} onDelete={() => x._id && handleDelete(x._id)} onEdit={() => x._id && handleEdit(x._id)} onComplited={() => x._id && handleComplited(x._id)} />)
                    : ''}
            </Grid>
        </>
    )
}

export default Home;
