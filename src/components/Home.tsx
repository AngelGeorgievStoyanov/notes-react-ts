import { FC, useContext, useEffect, useState } from "react";
import { LoginContext } from "./LoginContext";
import { jwtDecode } from "jwt-decode";
import { INote } from "../interfaces/INote";
import NoteCard from "./NoteCard";
import { getNotesByOwnerId } from "../services/noteService";
import { Grid } from "@mui/material";


type decode = {
    _id: string,
}
let userId: string | undefined;

const Home: FC = () => {


    const [notes, setNotes] = useState<INote[]>()


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

    return (
        <>
            <Grid container spacing={2} sx={{ alignItems: 'center', justifyContent: 'center' , minHeight:'100vh'}}>
                {notes && notes.length > 0 ?
                    notes.map(x => <NoteCard key={x._id} note={x} onEdit={function (): void {
                        throw new Error("Function not implemented.");
                    }} onComplete={function (): void {
                        throw new Error("Function not implemented.");
                    }} />)
                    : ''}
            </Grid>
        </>
    )
}

export default Home;
