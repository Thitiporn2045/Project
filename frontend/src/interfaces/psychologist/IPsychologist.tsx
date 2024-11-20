import React, { useEffect } from 'react';

export interface PsychologistInterface{
    ID?: number;
    FirstName?: string;
    LastName?: string;
    Tel?: string;
    Email?: string;
    Password?: string;
    Picture?: string;
    WorkingNumber?: string;
    CertificateFile?: string;
    IsApproved?: boolean;
    WorkPlace?: string;
}