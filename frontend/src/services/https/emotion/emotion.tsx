import { EmtionInterface } from "../../../interfaces/emotion/IEmotion";

const apiUrl = "http://localhost:8080";

export async function CreateDiaryPat(data: EmtionInterface) {
const requestOptions = {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify(data),
};

let res = await fetch(`${apiUrl}/pat/creat/Emotion`, requestOptions)
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

export async function GetEmotionByPatientID(id: Number | undefined) {
const requestOptions = {
method: "GET",
};

let res = await fetch(`${apiUrl}/pat/get/Emotion/${id}`, requestOptions)
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

export async function UpdateEmotionByID(data: EmtionInterface) {
    const requestOptions = {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        };

        let res = await fetch(`${apiUrl}/pat/update/Emotion`, requestOptions)
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


export async function DeleteEmtionByID(id: Number | undefined) {
    const requestOptions = {
    method: "DELETE",
    };

    let res = await fetch(`${apiUrl}/pat/del/Emotion/${id}`, requestOptions)
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