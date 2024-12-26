import { BehavioralExpInterface } from "../../../../interfaces/behavioralExp/IBehavioralExp";

const apiUrl = "http://localhost:8080";

export async function CreateBehavioralExp(data: BehavioralExpInterface) {
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    };

    try {
        const response = await fetch(`${apiUrl}/pat/creat/Behavioral`, requestOptions);

        // ตรวจสอบสถานะ HTTP
        if (!response.ok) {
            const error = await response.json();
            return { status: false, message: error.error || "Failed to create Behavioral" };
        }

        // ดึงข้อมูล JSON
        const res = await response.json();
        return { status: true, message: res.data };
    } catch (error) {
        // จัดการข้อผิดพลาดที่เกิดจาก fetch
        return { status: false, message: "Network error or server is unavailable" };
    }
}

export async function GetBehavioralExpByDiaryID(id: Number | undefined) {
    const requestOptions = {
    method: "GET",
    };

    let res = await fetch(`${apiUrl}/pat/get/Behavioral/ByDiary?id=${id}`, requestOptions)
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

// export async function GetEmotionsByDiaryID(id: Number | undefined) {
//     const requestOptions = {
//     method: "GET",
//     };

//     let res = await fetch(`${apiUrl}/pat/get/CrossSectional/Emotion/ByDiary?id=${id}`, requestOptions)
//     .then((response) => response.json())
//     .then((res) => {
//         if (res.data) {
//         return res.data;
//         } else {
//         return false;
//         }
//     });

//     return res;
// }

export async function GetEmotionsBehavioralExpHaveDateByDiaryID(id: number | undefined, date: string | undefined) {
    const requestOptions = {
        method: "GET",
    };

    // เช็คว่า id หรือ date เป็น undefined หรือไม่
    if (id === undefined || date === undefined) {
        return false;
    }

    // สร้าง URL ที่รวม id และ date
    const url = `${apiUrl}/pat/get/Behavioral/Date/Emotion/ByDiary?id=${id}&date=${date}`;

    // เรียก API
    let res = await fetch(url, requestOptions)
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


export async function UpdateBehavioralExp(data: BehavioralExpInterface) {
    const requestOptions = {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    };

    try {
        const response = await fetch(`${apiUrl}/pat/update/Behavioral`, requestOptions);

        // ตรวจสอบว่า response สำเร็จหรือไม่
        if (!response.ok) {
            const error = await response.json();
            return { status: false, message: error.error || "Failed to update Behavioral" };
        }

        const result = await response.json();
        return { status: true, message: result.data };
    } catch (error) {
        // จัดการข้อผิดพลาดที่อาจเกิดขึ้น เช่น network error
        console.error("Error updating Behavioral:", error);
        return { status: false, message: "Network error or server unavailable" };
    }
}
