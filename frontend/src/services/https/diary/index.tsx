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

export async function ListPublicDiariesByPatientId(id:Number) {
  const requestOptions = {
      method:"GET",
      header:{
          "Content-Type": "application/json",
      },
  };

  let res = await fetch(`${apiUrl}/diary/psy/${id}`, requestOptions)
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


export async function GetDiaryByDiaryID(id: Number | undefined) {
  const requestOptions = {
  method: "GET",
  };

  let res = await fetch(`${apiUrl}/pat/getDiary/ByDiary?id=${id}`, requestOptions)
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

export async function CountDiariesByWorksheetType() {
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  };

  let res = await fetch(`${apiUrl}/pat/Diary/Count`, requestOptions)
    .then((response) => response.json())
    .then((res) => {
      if (res) {
        return res;
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


export async function DeleteDiary(id: Number | undefined) {
    const requestOptions = {
    method: "DELETE",
    };

    let res = await fetch(`${apiUrl}/pat/del/Diary/${id}`, requestOptions)
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

export async function CountDiariesByWorksheetTypeAndPatID(id: number) {
  const requestOptions = {
      method: "GET",
      headers: {
          "Content-Type": "application/json",
      },
  };

  try {
      const response = await fetch(`${apiUrl}/pat/Diary/Count/ByPat/${id}`, requestOptions);
      const res = await response.json();

      console.log("Raw API Response:", res); // ตรวจสอบค่าที่ API คืนมา

      if (Array.isArray(res)) { // ✅ ตรวจสอบว่า res เป็นอาร์เรย์
          return res;
      } else {
          console.warn("Unexpected API response format:", res);
          return []; // 🔥 ป้องกัน React พัง
      }
  } catch (error) {
      console.error("Error fetching diary count:", error);
      return [];
  }
}


export async function GetNotPrivateDiaryCount(id: number) {
  const requestOptions = {
      method: "GET",
      headers: {
          "Content-Type": "application/json",
      },
  };

  let res = await fetch(`${apiUrl}/pat/Diary/Count/NotPrivate/ByPat/${id}`, requestOptions)
      .then((response) => response.text()) // รับค่าเป็น text เพราะ API ส่งแค่ตัวเลข
      .then((res) => {
          const count = parseInt(res, 10);
          return isNaN(count) ? 0 : count; // ถ้าแปลงไม่ได้ให้ return 0
      })
      .catch(() => 0); // ถ้ามี error ให้ return 0

  return res;
}