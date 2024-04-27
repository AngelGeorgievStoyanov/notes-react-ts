
import { IUser } from "../interfaces/IUser";
import { API_URL } from "../utils/baseUrl";


export async function register(user:IUser) {


    const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(user)
    });

    if (response.ok) {
        return response.json();
    } else {
        const result = await response.json();
        throw new Error(result.message ? result.message : result);
    }
}

export async function login(user:IUser) {


    const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(user)
    });

    if (response.ok) {
        return response.json();
    } else {
        const result = await response.json();
        throw new Error(result.message ? result.message : result);
    }

}
