import { TypeOfPatientInterface } from "../../../interfaces/psychologist/ITypeOfPatient";

const apiUrl = "http://localhost:8080";

async function ListTypeOfPatient(id:number) {
    const requestOptions = {
        method:"GET",
        header:{
            "Content-Type": "application/json",
        },
    };

    let res = await fetch(`${apiUrl}/typeOfPatients/${id}`, requestOptions)
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

async function ListConnectedPatientByType(id:number) {
  const requestOptions = {
      method:"GET",
      header:{
          "Content-Type": "application/json",
      },
  };

  let res = await fetch(`${apiUrl}/typeOfpatient/listPats/${id}`, requestOptions)
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


async function CreateTypeOfPatient(data: TypeOfPatientInterface) {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };
  
    let res = await fetch(`${apiUrl}/typeOfPatient`, requestOptions)
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

async function UpdateTypeOfPatient(data: TypeOfPatientInterface) {
    const requestOptions = {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    };

    let res = await fetch(`${apiUrl}/typeOfPatient`, requestOptions)
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

async function DeleteTypeOfPatient(id:number) {
    const requestOptions = {
        method: "DELETE",
    };
    
    let res = await fetch(`${apiUrl}/typeOfPatient/${id}`, requestOptions)
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

export{
    ListTypeOfPatient,
    ListConnectedPatientByType,
    CreateTypeOfPatient,
    UpdateTypeOfPatient,
    DeleteTypeOfPatient,
}