import { PatientInterface } from "../patient/IPatient";
import { WorksheetTypeInterface } from "../worksheetType/IWorksheetType";

export interface DiaryInterface{//Psy only
    ID?: number,
    IsPublic?: boolean,
    Name?: string,
    WorksheetType?: string
    Picture?: string,
}

export interface patientDiaryInterface{//Psy only
    ID?: number,
    IdNumber?: string,
    FirstName?: string,
    LastName?: string,
    TypeID?: number,
    TypeOfPatient?: string,

}

export interface DiaryPatInterface{ //Pat only
    ID?: number,
    IsPublic?: boolean,
    Name?: string,
    Picture?: string,
	Start?: string,
	End?: string,

    PatID?: number;
	Patient?: PatientInterface;

    WorksheetTypeID?: number;
    WorksheetType?: WorksheetTypeInterface;
}