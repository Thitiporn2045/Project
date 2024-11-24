import { PatientInterface } from "../patient/IPatient";

export interface EmtionInterface{
    ID?: number,
    Name?: string
	Emoticon?: string
	ColorCode?: string

    PatID?: number;
	Patient?: PatientInterface;
}