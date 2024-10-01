import { LoginPayloadInterface } from "../../../interfaces/login/ILogin";

const apiUrl = "http://localhost:8080";

async function LoginPat(data: LoginPayloadInterface) {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
    console.log(requestOptions)
    let res = await fetch(`${apiUrl}/loginPatient`, requestOptions)
    
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

export {LoginPat};