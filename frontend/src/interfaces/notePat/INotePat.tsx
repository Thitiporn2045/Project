import { PatientInterface } from "../patient/IPatient";

export interface NotePatInterface{
    ID?: number;
    Title?: string;
	Content?: string;

	PatID?: number;
	Patient?: PatientInterface;

}
