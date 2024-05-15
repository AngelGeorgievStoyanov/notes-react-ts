import { FC, useContext, useEffect, useState } from "react";
import { LoginContext } from "./LoginContext";
import { jwtDecode } from "jwt-decode";
import { INote } from "../interfaces/INote";
import NoteCard from "./NoteCard";
import { completedNote, deleteNoteById, getNotesByOwnerId } from "../services/noteService";
import { Box, MenuItem, Select, TablePagination } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { pageSize } from "../shared/common-types";


type decode = {
    _id: string,
}
let userId: string | undefined;

const Home: FC = () => {


    const [notes, setNotes] = useState<INote[]>()
    const [paginationAndSorting, setPaginationAndSorting] = useState({ page: 0, pageSize: 5, sortOrder: 'created_asc' });
    const [totalNotes, setTotalNotes] = useState<number>(0)

    const navigate = useNavigate()

    const { token } = useContext(LoginContext);
    const accessToken = token ? token : localStorage.getItem('accessToken') ? localStorage.getItem('accessToken') : undefined

    if (accessToken) {
        const decode: decode = jwtDecode(accessToken);
        userId = decode._id;
    }

    useEffect(() => {
        if (userId && accessToken) {

            getNotesByOwnerId(userId, accessToken, paginationAndSorting).then((data: { totalCount: number; notes: INote[] }) => {
                setNotes(data.notes)
                setTotalNotes(data.totalCount)
            }).catch((err: Error) => {

                console.log(err.message);

            });
        }
    }, [paginationAndSorting])

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

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number,) => {
        setPaginationAndSorting(prevState => ({
            ...prevState,
            page: newPage

        }));
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,) => {
        setPaginationAndSorting(prevState => ({
            ...prevState,

            pageSize: parseInt(event.target.value, 10)

        }));
    };


    const handleSortOrderChange = (newSortOrder: string) => {

        setPaginationAndSorting(prevState => ({
            ...prevState,
            sortOrder: newSortOrder
        }));
    };


    return (
        <>

                <Select
                    value={paginationAndSorting.sortOrder}
                    onChange={(e) => handleSortOrderChange(e.target.value)}
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
                        notes.map(x => <NoteCard key={x._id} note={x} onDelete={() => x._id && handleDelete(x._id)} onEdit={() => x._id && handleEdit(x._id)} onCompleted={() => x._id && handleCompleted(x._id)} />) : ''}
                </Box>
                <TablePagination
                    component="div"
                    count={totalNotes}
                    page={paginationAndSorting.page}
                    onPageChange={handleChangePage}
                    rowsPerPage={paginationAndSorting.pageSize}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    rowsPerPageOptions={pageSize}
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                />
        </>
    )
}

export default Home;
