import { PatientInterface } from "../patient/IPatient";
import { WorksheetTypeInterface } from "../worksheetType/IWorksheetType";

export interface DiaryInterface{//Psy only
    ID?: number,
    IsPublic?: boolean,
    Name?: string,
    WorksheetType?: string
}

export interface patientDiaryInterface{//Psy only
    ID?: number,
    FirstName?: string,
    LastName?: string,
    TypeID?: number,
    TypeOfPatient?: string,

}