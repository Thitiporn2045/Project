import { PatientInterface } from "../patient/IPatient";
import { PsychologistInterface } from "../psychologist/IPsychologist";

export interface ConnectionRequestInterface{
    ID?: number;
    PatID?: number;
    Patient?: PatientInterface
    
    PsyID?: number;
    Psychologist?: PsychologistInterface;
    
    Status?: string;
}