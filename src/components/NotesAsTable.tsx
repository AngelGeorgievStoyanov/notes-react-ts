import { Box, Button, MenuItem, Select, Typography } from "@mui/material";
import { FC, useContext, useEffect, useState } from "react";
import { INote } from "../interfaces/INote";
import { completedNote, getNotesByOwnerId, tableCompletedNotes, tableDeleteNotes } from "../services/noteService";
import { LoginContext } from "./LoginContext";
import { jwtDecode } from "jwt-decode";
import { DataGrid, GridColDef, GridPaginationModel, GridRowSelectionModel } from '@mui/x-data-grid';
import { pageSize } from "../shared/common-types";


type decode = {
    _id: string,
}
let userId: string | undefined;

const NotesAsTable: FC = () => {
    const [notes, setNotes] = useState<INote[]>()
    const [selectedRow, setSelectedRow] = useState<GridRowSelectionModel>([]);
    const [totalNotes, setTotalNotes] = useState<number>(0)
    const [paginationAndSorting, setPaginationAndSorting] = useState({ page: 0, pageSize: 5, sortOrder: 'created_asc' });
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


    const columns: GridColDef<INote>[] = [
        {
            field: 'title', headerName: 'Title', width: 230,
            renderCell: (params) => (
                <Typography sx={{ ...(params.row.completed && { opacity: 0.5, pointerEvents: 'none' }) }} variant="body2">
                    {params.value}
                </Typography>
            )
        },
        {
            field: 'content', headerName: 'Content', width: 250,
            renderCell: (params) => (
                <Typography sx={{ ...(params.row.completed && { opacity: 0.5, pointerEvents: 'none' }) }} variant="body2">
                    {params.value}
                </Typography>
            )
        },
        {
            field: 'createdAt',
            headerName: 'Created at',
            width: 200,
            renderCell: (params) => (
                <Typography variant="body2" sx={{ ...(params.row.completed && { opacity: 0.5, pointerEvents: 'none' }) }}>
                    {params.value}
                </Typography>
            ),
        },
        {
            field: 'editedAt',
            headerName: 'Edited at',
            width: 200,
            renderCell: (params) => (
                <Typography sx={{ ...(params.row.completed && { opacity: 0.5, pointerEvents: 'none' }) }} variant="body2">{dateFormat(params.value)}</Typography>
            )
        },
        {
            field: 'completedAt',
            headerName: 'Completed at',
            width: 350,
            renderCell: (params) => (
                <Box >
                    {params.row.completedAt ? (
                        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                            <Typography variant="body2" sx={{ marginRight: '5px' }}>{dateFormat(params.value)}</Typography>
                            <Button variant="outlined" sx={{ ':hover': { background: '#1976d2', color: 'white' }, margin: '5px', background: 'rgb(194 194 224)', color: 'black', zIndex: 1 }} onClick={() => params && handleUnmarkCompleted(params.id.toString())}>Unmark as completed </Button>
                        </Box>
                    ) : ''}
                </Box>
            ),
        },

    ];

    const handleUnmarkCompleted = async (noteId: string) => {
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
    }

    const handleSelectionModelChange = (selectionModel: GridRowSelectionModel) => {

        setSelectedRow(selectionModel);
    };


    const changePage = (newPage: GridPaginationModel) => {
        setPaginationAndSorting(prevState => ({
            ...prevState,
            page: newPage.page,
            pageSize: newPage.pageSize
        }));

    }

    const handeleDeleteRows = () => {
        if (selectedRow && notes && notes?.length > 0 && accessToken) {
            confirmDelete(selectedRow, accessToken)
        }
    }

    const handleSortOrderChange = (newSortOrder: string) => {
        setPaginationAndSorting(prevState => ({
            ...prevState,
            sortOrder: newSortOrder
        }));
    };

    const confirmDelete = async (selectedRow: GridRowSelectionModel, accessToken: string) => {
        const selectedNotes = notes?.filter(note => note._id && selectedRow.includes(note._id));
        if (selectedNotes && selectedNotes.length > 0) {
            const titles = selectedNotes.map((note, i) => i + 1 + '. ' + note.title).join("\n");
            if (window.confirm(`Are you sure you want to delete the following notes: \n${titles}?`)) {
                await tableDeleteNotes(selectedRow, accessToken, paginationAndSorting)
                    .then((data: { totalCount: number; notes: INote[] }) => {
                        setNotes(data.notes)
                        setTotalNotes(data.totalCount)
                    })
                    .catch((err) => {
                        console.log(err.message);
                    });
            }
        }
    };

    const dateFormat = (date: string | undefined) => {
        if (date) {
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
    }


    const handleCompleted = async () => {
        if (selectedRow && notes && notes?.length > 0) {

            const selectedNotes = notes?.filter((x) => x._id && selectedRow.includes(x._id) && !x.completed)
                .map((note) => note._id)
                .filter((id): id is string => id !== undefined);

            if (selectedNotes && selectedNotes.length > 0 && accessToken) {

                tableCompletedNotes(selectedNotes, accessToken, paginationAndSorting).then((data: { totalCount: number; notes: INote[] }) => {
                    setNotes(data.notes)
                    setTotalNotes(data.totalCount)
                }).catch((err) => {
                    console.log(err.message);
                })
            }
        }
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
            <Box sx={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap', justifyContent: 'space-around', minHeight: '100vh' }}>

                {(notes !== undefined && notes.length > 0) ?
                    <>
                        <DataGrid
                            key={paginationAndSorting.page}
                            sx={{ maxWidth: '100%', bgcolor: 'white' }}
                            rows={notes.map((note, index) => ({ id: note._id || index, ...note }))}
                            rowCount={totalNotes}
                            columns={columns}
                            initialState={{
                                pagination: {
                                    paginationModel: { page: paginationAndSorting.page !== undefined ? paginationAndSorting.page : 0, pageSize: paginationAndSorting.pageSize !== undefined ? paginationAndSorting.pageSize : 5 }
                                },
                            }}
                            getRowClassName={(params) => {
                                return params.row.completedAt ? 'completed-row' : '';
                            }}
                            pageSizeOptions={pageSize}
                            checkboxSelection
                            onRowSelectionModelChange={handleSelectionModelChange}
                            onPaginationModelChange={(newPage) => changePage(newPage)}
                            paginationMode="server"
                        />
                        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', flexWrap: 'wrap' }}>
                            <Button variant="contained" onClick={handleCompleted} sx={{ ':hover': { color: 'rgb(248 245 245)' }, margin: '5px', background: 'rgb(194 194 224)', color: 'black' }} disabled={selectedRow.length === 0}>Mark as complete</Button>
                            <Button variant="contained" onClick={handeleDeleteRows} sx={{ ':hover': { background: '#ef0a0a' }, margin: '5px' }} disabled={selectedRow.length === 0}>DELETE ROWS</Button>
                        </Box>
                    </>
                    : ''}
            </Box >
        </>
    )
}

export default NotesAsTable

