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