import { INote } from "../interfaces/INote";
import { API_URL } from "../utils/baseUrl";

export async function createNote(data: INote) {
  const response = await fetch(`${API_URL}/note/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
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

export async function getNotesByOwnerId(ownerId: string) {
  const response = await fetch(`${API_URL}/note/getNotesByOwnerId/${ownerId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    return response.json();
  } else {
    const result = await response.json();
    throw new Error(result.message ? result.message : result);
  }
}

export async function getNoteById(noteId: string) {
  const response = await fetch(`${API_URL}/note/getNoteById/${noteId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    return response.json();
  } else {
    const result = await response.json();
    throw new Error(result.message ? result.message : result);
  }
}

export async function updateNote(
  data: INote,
  noteId: string,
  _ownerId: string
) {
  const response = await fetch(`${API_URL}/note/update/${noteId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data, _ownerId }),
  });

  if (response.ok) {
    return response.json();
  } else {
    const result = await response.json();
    throw new Error(result.message ? result.message : result);
  }
}

export async function deleteNoteById(noteId: string) {
  const response = await fetch(`${API_URL}/note/delete/${noteId}`, {
    method: "DELETE",
  });
  console.log(response);
  console.log(response.ok);
  if (response.ok) {
    return response.json();
  } else {
    const result = await response.json();
    throw new Error(result.message ? result.message : result);
  }
}

export async function complitedNote(data: INote, noteId: string) {
  const response = await fetch(`${API_URL}/note/complited/${noteId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
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
