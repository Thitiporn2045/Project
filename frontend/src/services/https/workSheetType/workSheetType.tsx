import { WorksheetTypeInterface } from "../../../interfaces/worksheetType/IWorksheetType";

const apiUrl = "http://localhost:8080";

async function ListWorkSheetType() {
    const requestOptions = {
        method:"GET",
        header:{
            "Content-Type": "application/json",
        },
    };

    let res = await fetch(`${apiUrl}/pat/workSheetType`,requestOptions)
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
    ListWorkSheetType
}