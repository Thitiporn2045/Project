import { WorkScheduleInterface } from "../../../interfaces/psychologist/IWorkSchedule";
const apiUrl = "http://localhost:8080";

export async function ListWorkSchedule(id:number,date: string) {
    const requestOptions = {
        method:"GET",
        header:{
            "Content-Type": "application/json",
        },
    };

    let res = await fetch(`${apiUrl}/workSchedules/${id}?date=${date}`, requestOptions)
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

export async function CreateWorkSchedule(data: WorkScheduleInterface) {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };
  
    let res = await fetch(`${apiUrl}/workSchedule`, requestOptions)
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

export async function DeleteWorkSchedule(id:number) {
    const requestOptions = {
        method: "DELETE",
    };
    
    let res = await fetch(`${apiUrl}/workSchedule/${id}`, requestOptions)
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