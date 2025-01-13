import { CrossSectionalInterface } from "../../../../interfaces/crossSectional/ICrossSectional";

const apiUrl = "http://localhost:8080";

export async function CreateCrossSectional(data: CrossSectionalInterface) {
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    };

    try {
        const response = await fetch(`${apiUrl}/pat/creat/CrossSectional`, requestOptions);

        // ตรวจสอบสถานะ HTTP
        if (!response.ok) {
            const error = await response.json();
            return { status: false, message: error.error || "Failed to create CrossSectional" };
        }

        // ดึงข้อมูล JSON
        const res = await response.json();
        return { status: true, message: res.data };
    } catch (error) {
        // จัดการข้อผิดพลาดที่เกิดจาก fetch
        return { status: false, message: "Network error or server is unavailable" };
    }
}

export async function GetCrossSectionalByDiaryID(id: Number | undefined) {
    const requestOptions = {
    method: "GET",
    };

    let res = await fetch(`${apiUrl}/pat/get/CrossSectional/ByDiary?id=${id}`, requestOptions)
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

export async function GetDateEmotionsByDiaryID(id: Number | undefined) {
    const requestOptions = {
    method: "GET",
    };

    let res = await fetch(`${apiUrl}/pat/get/CrossSectional/Emotion/Date/ByDiary?id=${id}`, requestOptions)
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


export async function GetEmotionsByDiaryID(id: Number | undefined) {
    const requestOptions = {
    method: "GET",
    };

    let res = await fetch(`${apiUrl}/pat/get/CrossSectional/Emotion/ByDiary?id=${id}`, requestOptions)
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

export async function GetWeekEmotionsByDiaryID(id: number | undefined, date: string | undefined) {
    const requestOptions = {
        method: "GET",
    };

    // เช็คว่า id หรือ date เป็น undefined หรือไม่
    if (id === undefined || date === undefined) {
        return false;
    }

    // สร้าง URL ที่รวม id และ date
    const url = `${apiUrl}/pat/get/CrossSectional/Emotion/Week/ByDiary?id=${id}&date=${date}`;

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


export async function GetMonthEmotionsByDiaryID(id: number | undefined, date: string | undefined) {
    const requestOptions = {
        method: "GET",
    };

    // เช็คว่า id หรือ date เป็น undefined หรือไม่
    if (id === undefined || date === undefined) {
        return false;
    }

    // สร้าง URL ที่รวม id และ date
    const url = `${apiUrl}/pat/get/CrossSectional/Emotion/Month/ByDiary?id=${id}&date=${date}`;

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


export async function GetEmotionsHaveDateByDiaryID(id: number | undefined, date: string | undefined) {
    const requestOptions = {
        method: "GET",
    };

    // เช็คว่า id หรือ date เป็น undefined หรือไม่
    if (id === undefined || date === undefined) {
        return false;
    }

    // สร้าง URL ที่รวม id และ date
    const url = `${apiUrl}/pat/get/CrossSectional/Date/Emotion/ByDiary?id=${id}&date=${date}`;

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


export async function UpdateCrossSectional(data: CrossSectionalInterface) {
    const requestOptions = {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    };

    try {
        const response = await fetch(`${apiUrl}/pat/update/CrossSectional`, requestOptions);

        // ตรวจสอบว่า response สำเร็จหรือไม่
        if (!response.ok) {
            const error = await response.json();
            return { status: false, message: error.error || "Failed to update CrossSectional" };
        }

        const result = await response.json();
        return { status: true, message: result.data };
    } catch (error) {
        // จัดการข้อผิดพลาดที่อาจเกิดขึ้น เช่น network error
        console.error("Error updating CrossSectional:", error);
        return { status: false, message: "Network error or server unavailable" };
    }
}


//=============================== Psychologist ========================================================================

export async function GetCrossSectionalByDiaryIdForPsy(id: Number | undefined) {
    const requestOptions = {
      method: "GET",
    };
  
    let res = await fetch(`${apiUrl}/crossSectional/psy/${id}`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if (res.data) {
          return res.data;
        } 
        else {
          return false;
        }
      });
  
    return res;
}
export async function GetDiaryWritingDates(id: number | undefined) {
    console.log("Fetching Writing Dates for DiaryID:", id);
    
    const requestOptions = {
        method: "GET",
    };

    if (id === undefined) return false;

    const url = `${apiUrl}/pat/get/CrossSectional/WritingDates?id=${id}`;
    try {
        const response = await fetch(url, requestOptions);
        const res = await response.json();
        return res.data || [];
    } catch (error) {
        console.error('Error fetching writing dates:', error);
        return [];
    }
}
