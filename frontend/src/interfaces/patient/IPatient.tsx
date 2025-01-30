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
	IsTakeMedicine?: string;
	IdNumber?: string;


	GenderID?: number;
	Gender?: GenderInterface;

	gender?: String;

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
