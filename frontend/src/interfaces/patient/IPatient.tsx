import { GenderInterface } from "./IGender";
import { TypeOfPatientInterface } from "../psychologist/ITypeOfPatient";
import { DiaryInterface } from "../diary/IDiary";

export interface PatientInterface{
    ID?: number;
    Firstname?: string;
	Lastname?: string;
	Dob?: string; 
	Tel?: string;
	Email?: string;
	Password?: string;
	Picture?: string;
	Symtoms?: string;
	IsTakeMedicine?: boolean;
	IdNumber?: string;


	GenderID?: number;
	Gender?: GenderInterface;

	TypeID?: number;
	TypeOfPatient?: TypeOfPatientInterface;
	
}

export interface PatienForDashboardInterface{
	ID?: number;
	IdNumber?: string;
	Firstname?: string;
	Lastname?: string;
	Picture?: string;
	Symtoms?: string;
	Diary_Status?: string;

}
