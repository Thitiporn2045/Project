import { NotePatInterface } from "../../../interfaces/notePat/INotePat";
const apiUrl = "http://localhost:8080";


async function CreateNotePat(data: NotePatInterface) {
    const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    };

    let res = await fetch(`${apiUrl}/pat/note`, requestOptions)
    .then((response) => response.json())
    .then((res) => {
        if (res.data) {
        return { status: true, message: res.data };
        } else {
        return { status: false, message: res.error };
        }
    });

    return res;
}

async function GetNotesByPatientID(id: Number | undefined) {
    const requestOptions = {
    method: "GET",
    };

    let res = await fetch(`${apiUrl}/pat/getNote/${id}`, requestOptions)
    .then((response) => response.json())
    .then((res) => {
        if (res.data) {
        return res.data;
        } else {
        return false;
        }
    });

    return res;
}

async function UpdateNotePatient(data: NotePatInterface) {
    const requestOptions = {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    };

    let res = await fetch(`${apiUrl}/pat/updateNote`, requestOptions)
    .then((response) => response.json())
    .then((res) => {
        if (res.data) {
        return { status: true, message: res.data };
        } else {
        return { status: false, message: res.error };
        }
    });

    return res;
}

async function DeleteNotePatientByID(id: Number | undefined) {
    const requestOptions = {
    method: "DELETE",
    };

    let res = await fetch(`${apiUrl}/pat/delNote/${id}`, requestOptions)
    .then((response) => response.json())
    .then((res) => {
        if (res.data) {
        return { status: true, message: res.data };
        } 
        else {
        return { status: false, message: res.error };
        }
    });

    return res;
}

export{
    CreateNotePat,
    GetNotesByPatientID,
    UpdateNotePatient,
    DeleteNotePatientByID
}