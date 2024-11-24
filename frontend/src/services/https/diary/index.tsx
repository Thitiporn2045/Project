import { DiaryPatInterface } from "../../../interfaces/diary/IDiary";

const apiUrl = "http://localhost:8080";

export async function ListPublicDiariesByPatientType(id:number) {
    const requestOptions = {
        method:"GET",
        header:{
            "Content-Type": "application/json",
        },
    };
  
    let res = await fetch(`${apiUrl}/diaries/psy/${id}`, requestOptions)
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


export async function CreateDiaryPat(data: DiaryPatInterface) {
  const requestOptions = {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data),
  };

  let res = await fetch(`${apiUrl}/pat/creatDiary`, requestOptions)
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

export async function GetDiaryByPatientID(id: Number | undefined) {
  const requestOptions = {
  method: "GET",
  };

  let res = await fetch(`${apiUrl}/pat/getDiary/${id}`, requestOptions)
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

export async function UpdateDiaryPat(data: DiaryPatInterface) {
  const requestOptions = {
  method: "PATCH",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data),
  };

  let res = await fetch(`${apiUrl}/pat/update/DiaryPat`, requestOptions)
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

export async function ToggleDiaryIsPublic(id: number) {
  const requestOptions = {
    method: "PATCH", // ใช้ PATCH เพราะเป็นการแก้ไขบางส่วนของ resource
    headers: { "Content-Type": "application/json" },
  };

  let res = await fetch(`${apiUrl}/diaries/${id}/toggle-public`, requestOptions)
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
