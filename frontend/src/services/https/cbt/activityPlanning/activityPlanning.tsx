import { ActivityPlanningInterface } from "../../../../interfaces/activityPlanning/IActivityPlanning";

const apiUrl = "http://localhost:8080";

export async function CreateActivityPlanning(data: ActivityPlanningInterface) {
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    };

    try {
        const response = await fetch(`${apiUrl}/pat/creat/ActivityPlanning`, requestOptions);

        // ตรวจสอบสถานะ HTTP
        if (!response.ok) {
            const error = await response.json();
            return { status: false, message: error.error || "Failed to create ActivityPlanning" };
        }

        // ดึงข้อมูล JSON
        const res = await response.json();
        return { status: true, message: res.data };
    } catch (error) {
        // จัดการข้อผิดพลาดที่เกิดจาก fetch
        return { status: false, message: "Network error or server is unavailable" };
    }
}

export async function GetActivityPlanningByDiaryID(id: Number | undefined) {
    const requestOptions = {
    method: "GET",
    };

    let res = await fetch(`${apiUrl}/pat/get/ActivityPlanning/ByDiary?id=${id}`, requestOptions)
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

export async function ListTimeOfDays() {
    const requestOptions = {
    method: "GET",
    };

    let res = await fetch(`${apiUrl}/pat/get/TimeOfDay`, requestOptions)
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

export async function UpdateActivityPlanning(data: ActivityPlanningInterface) {
    const requestOptions = {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    };

    try {
        const response = await fetch(`${apiUrl}/pat/update/ActivityPlanning`, requestOptions);

        // ตรวจสอบว่า response สำเร็จหรือไม่
        if (response.status >= 400) {
            const error = await response.json();
            return { status: false, message: error.error || "Failed to update ActivityPlanning" };
        }

        const result = await response.json();
        if (result.status === "error") {
            return { status: false, message: result.message || "Failed to update ActivityPlanning" };
        }

        return { status: true, message: result.data };
    } catch (error) {
        // จัดการข้อผิดพลาดที่อาจเกิดขึ้น เช่น network error
        console.error("Error updating ActivityPlanning:", error);
        return { status: false, message: "Network error or server unavailable" };
    }
}

export async function GetPlanningEmotionsByDateTimeAndDiaryID(id: number | undefined, date: string | undefined) {
    const requestOptions = {
        method: "GET",
    };

    // เช็คว่า id หรือ date เป็น undefined หรือไม่
    if (id === undefined || date === undefined) {
        return false;
    }

    // สร้าง URL ที่รวม id และ date
    const url = `${apiUrl}/pat/get/ActivityPlanning/DateTime/ByDiary?id=${id}&date=${date}`;

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

export async function GetPlanningEmotionsByDateAndDiaryID(id: number | undefined, date: string | undefined) {
    const requestOptions = {
        method: "GET",
    };

    // เช็คว่า id หรือ date เป็น undefined หรือไม่
    if (id === undefined || date === undefined) {
        return false;
    }

    // สร้าง URL ที่รวม id และ date
    const url = `${apiUrl}/pat/get/ActivityPlanning/Date/ByDiary?id=${id}&date=${date}`;

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

export async function GetPlanningEmotionsByWeekAndDiaryID(id: number | undefined, date: string | undefined) {
    const requestOptions = {
        method: "GET",
    };

    // เช็คว่า id หรือ date เป็น undefined หรือไม่
    if (id === undefined || date === undefined) {
        return false;
    }

    // สร้าง URL ที่รวม id และ date
    const url = `${apiUrl}/pat/get/ActivityPlanning/Week/ByDiary?id=${id}&date=${date}`;

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

export async function GetPlanningEmotionsByMonthAndDiaryID(id: number | undefined, date: string | undefined) {
    const requestOptions = {
        method: "GET",
    };

    // เช็คว่า id หรือ date เป็น undefined หรือไม่
    if (id === undefined || date === undefined) {
        return false;
    }

    // สร้าง URL ที่รวม id และ date
    const url = `${apiUrl}/pat/get/ActivityPlanning/Month/ByDiary?id=${id}&date=${date}`;

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


export async function GetAllPlanningEmotionsByDiaryID(id: number | undefined) {
    const requestOptions = {
        method: "GET",
    };

    // สร้าง URL ที่รวม id และ date
    const url = `${apiUrl}/pat/get/ActivityPlanning/All/ByDiary?id=${id}`;

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
//==================== psy ======================================================
export async function GetActivityPlanningByDiaryIDForPsy(id: Number | undefined) {
    const requestOptions = {
    method: "GET",
    };

    let res = await fetch(`${apiUrl}/activity/psy/${id}`, requestOptions)
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
