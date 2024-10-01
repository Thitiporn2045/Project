import { PsychologistInterface } from "../psychologist/IPsychologist";
import { GenderInterface } from "./IGender";
import { TypeOfPatientInterface } from "./ITypeOfPatient";

export interface PatientInterface{
    ID?: string;
    Firstname?: string;
	Lastname?: string;
	Dob?: string; 
	Tel?: string;
	Email?: string;
	Password?: string;
	Picture?: string;
	Symtoms?: string;

	GenderID?: number;
	Gender?: GenderInterface;

	PsyID?: number;
	Psychologist?: PsychologistInterface;

	TypeID?: number;
	TypeOfPatient?: TypeOfPatientInterface;
	
}
