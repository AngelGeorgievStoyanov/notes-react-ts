import { Box, Button, MenuItem, Select, Typography } from "@mui/material";
import { FC, useContext, useEffect, useState } from "react";
import { INote } from "../interfaces/INote";
import { completedNote, getNotesByOwnerId, tableCompletedNotes, tableDeleteNotes } from "../services/noteService";
import { LoginContext } from "./LoginContext";
import { jwtDecode } from "jwt-decode";
import { DataGrid, GridColDef, GridPaginationModel, GridRowSelectionModel } from '@mui/x-data-grid';


type decode = {
    _id: string,
}
let userId: string | undefined;

const NotesAsTable: FC = () => {
    const [notes, setNotes] = useState<INote[]>()
    const [pageSize, setPageSize] = useState<number>(5);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [selectedRow, setSelectedRow] = useState<GridRowSelectionModel>([]);
    const [sortOrder, setSortOrder] = useState<string>('created_asc');

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
                                <Button variant="outlined" sx={{ ':hover': { background: '#1976d2',color:'white' }, margin: '5px', background: 'rgb(194 194 224)', color: 'black' , zIndex:1}} onClick={() => params && handleUnmarkCompleted(params.id.toString())}>Unmark as completed </Button>
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
        setCurrentPage(newPage.page);
        setPageSize(newPage.pageSize);
    }

    const handeleDeleteRows = () => {
        if (selectedRow && notes && notes?.length > 0 && accessToken) {
            confirmDelete(selectedRow, accessToken)
        }
    }

    const confirmDelete = async (selectedRow: GridRowSelectionModel, accessToken: string) => {
        const selectedNotes = notes?.filter(note => note._id && selectedRow.includes(note._id));
        if (selectedNotes && selectedNotes.length > 0) {
            const titles = selectedNotes.map((note, i) => i + 1 + '. ' + note.title).join("\n");
            if (window.confirm(`Are you sure you want to delete the following notes: \n${titles}?`)) {
                await tableDeleteNotes(selectedRow, accessToken)
                    .then((data) => {
                        setNotes(data);
                    })
                    .catch((err) => {
                        console.log(err.message);
                    });
            }
        }
    };

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


    const handleCompleted = async () => {
        if (selectedRow && notes && notes?.length > 0) {

            const selectedNotes = notes?.filter((x) => x._id && selectedRow.includes(x._id) && !x.completed)
                .map((note) => note._id)
                .filter((id): id is string => id !== undefined);

            if (selectedNotes && selectedNotes.length > 0 && accessToken) {
                tableCompletedNotes(selectedNotes, accessToken).then((data: INote[]) => {
                    setNotes(data)
                }).catch((err) => {
                    console.log(err.message);
                })
            }
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
            <Box sx={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap', justifyContent: 'space-around', minHeight: '100vh' }}>

                {(notes !== undefined && notes.length > 0) ?
                    <>
                        <DataGrid
                            key={currentPage}
                            sx={{ maxWidth: '100%', bgcolor: 'white' }}
                            rows={sortNotes(notes).map((note, index) => ({ id: note._id || index, ...note }))}
                            columns={columns}
                            initialState={{
                                pagination: {
                                    paginationModel: { page: currentPage !== undefined ? currentPage : 0, pageSize: pageSize !== undefined ? pageSize : 5 }
                                },
                            }}
                            getRowClassName={(params) => {
                                return params.row.completedAt ? 'completed-row' : '';
                            }}
                            pageSizeOptions={[5, 10]}
                            checkboxSelection
                            onRowSelectionModelChange={handleSelectionModelChange}
                            onPaginationModelChange={(newPage) => changePage(newPage)}


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

