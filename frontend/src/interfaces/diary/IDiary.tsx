import { PatientInterface } from "../patient/IPatient";
import { WorksheetTypeInterface } from "../worksheetType/IWorksheetType";

export interface DiaryInterface{
    ID?: number,
    IsPublic?: boolean,

    PatID?: number,
    Patient?: PatientInterface

    WorksheetTypeID?: number,
    WorksheetType?: WorksheetTypeInterface
}