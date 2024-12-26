import { ActivityDiaryInterface } from "../../../../interfaces/activityDiary/IActivityDiary";

const apiUrl = "http://localhost:8080";

export async function CreateActivityDiary(data: ActivityDiaryInterface) {
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    };

    try {
        const response = await fetch(`${apiUrl}/pat/creat/ActivityDiary`, requestOptions);

        // ตรวจสอบสถานะ HTTP
        if (!response.ok) {
            const error = await response.json();
            return { status: false, message: error.error || "Failed to create ActivityDiary" };
        }

        // ดึงข้อมูล JSON
        const res = await response.json();
        return { status: true, message: res.data };
    } catch (error) {
        // จัดการข้อผิดพลาดที่เกิดจาก fetch
        return { status: false, message: "Network error or server is unavailable" };
    }
}

export async function GetActivityDiaryByDiaryID(id: Number | undefined) {
    const requestOptions = {
    method: "GET",
    };

    let res = await fetch(`${apiUrl}/pat/get/ActivityDiary/ByDiary?id=${id}`, requestOptions)
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

export async function UpdateActivityDiary(data: ActivityDiaryInterface) {
    const requestOptions = {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    };

    try {
        const response = await fetch(`${apiUrl}/pat/update/ActivityDiary`, requestOptions);

        // ตรวจสอบว่า response สำเร็จหรือไม่
        if (response.status >= 400) {
            const error = await response.json();
            return { status: false, message: error.error || "Failed to update ActivityDiary" };
        }

        const result = await response.json();
        if (result.status === "error") {
            return { status: false, message: result.message || "Failed to update ActivityDiary" };
        }

        return { status: true, message: result.data };
    } catch (error) {
        // จัดการข้อผิดพลาดที่อาจเกิดขึ้น เช่น network error
        console.error("Error updating ActivityDiary:", error);
        return { status: false, message: "Network error or server unavailable" };
    }
}
