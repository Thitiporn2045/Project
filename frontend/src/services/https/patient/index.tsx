import { PatientInterface } from "../../../interfaces/patient/IPatient";

const apiUrl = "http://localhost:8080";

async function ListPatients() {
    const requestOptions = {
        method:"GET",
        header:{
            "Content-Type": "application/json",
        },
    };

    let res = await fetch(`${apiUrl}/patients`,requestOptions)
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

async function GetPatientById(id: Number | undefined) {
    const requestOptions = {
      method: "GET",
    };
  
    let res = await fetch(`${apiUrl}/patient/${id}`, requestOptions)
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

async function CreatePatient(data: PatientInterface) {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };
  
    let res = await fetch(`${apiUrl}/patients`, requestOptions)
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

async function UpdatePatient(data: PatientInterface) {
    const requestOptions = {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };
  
    let res = await fetch(`${apiUrl}/patients`, requestOptions)
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

async function DeletePatientByID(id: Number | undefined) {
    const requestOptions = {
      method: "DELETE",
    };
  
    let res = await fetch(`${apiUrl}/patients/${id}`, requestOptions)
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


//============================== Gender =====================================
async function ListGender() {
  const requestOptions = {
      method:"GET",
      header:{
          "Content-Type": "application/json",
      },
  };

  let res = await fetch(`${apiUrl}/gender`,requestOptions)
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

export{
    ListPatients,
    GetPatientById,
    CreatePatient,
    UpdatePatient,
    DeletePatientByID,
    ListGender
}