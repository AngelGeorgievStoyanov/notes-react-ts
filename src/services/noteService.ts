import { GridRowSelectionModel } from "@mui/x-data-grid";
import { INote } from "../interfaces/INote";
import { API_URL } from "../utils/baseUrl";

export async function createNote(data: INote, token: string) {
  const response = await fetch(`${API_URL}/note/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
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

export async function getNotesByOwnerId(ownerId: string, token: string) {
  const response = await fetch(`${API_URL}/note/getNotesByOwnerId/${ownerId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.ok) {
    return response.json();
  } else {
    const result = await response.json();
    throw new Error(result.message ? result.message : result);
  }
}

export async function getNoteById(noteId: string, token: string) {
  const response = await fetch(`${API_URL}/note/getNoteById/${noteId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
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
  _ownerId: string,
  token: string
) {
  const response = await fetch(`${API_URL}/note/update/${noteId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
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

export async function deleteNoteById(noteId: string, token: string) {
  const response = await fetch(`${API_URL}/note/delete/${noteId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.ok) {
    return response.json();
  } else {
    const result = await response.json();
    throw new Error(result.message ? result.message : result);
  }
}

export async function completedNote(
  data: INote,
  noteId: string,
  token: string
) {
  const response = await fetch(`${API_URL}/note/completed/${noteId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
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

export async function tableCompletedNotes(data: string[], token: string) {
  const response = await fetch(`${API_URL}/note/tableCompleted`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
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

export async function tableDeleteNotes(data: GridRowSelectionModel, token: string) {
  const response = await fetch(`${API_URL}/note/tableDeleteNotes`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
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
