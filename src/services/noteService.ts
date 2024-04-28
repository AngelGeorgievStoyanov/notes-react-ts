import { INote } from "../interfaces/INote";
import { API_URL } from "../utils/baseUrl";


export async function createNote(data:INote) {
    const response = await fetch(`${API_URL}/note/create`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (response.ok) {
        return response.json();
    } else {
        const result = await response.json();
        throw new Error(result.message ? result.message : result);
    }

}


export async function getNotesByOwnerId(ownerId:string) {

    const response = await fetch(`${API_URL}/note/getNotesByOwnerId/${ownerId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (response.ok) {
        return response.json();
    } else {
        const result = await response.json();
        throw new Error(result.message ? result.message : result);
    }

}