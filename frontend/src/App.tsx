import { BrowserRouter as Router, Route, Routes, BrowserRouter } from 'react-router-dom';
import './App.css';

import PsyHomePage from './page/psychologist/psyHome/psyHomePage';
import Pat from './page/patient/pat';
import Worksheets from './page/patient/worksheet/worksheet';
import Summary from './page/patient/summary/summary';
import Profile from './page/patient/profile/profile';
import PsyPatient from './page/psychologist/psyPatient/psyPatient';
import PsyWorksheet from './page/psychologist/psyWorksheet/psyWorksheet';
import PsyAccount from './page/psychologist/psyAccount/psyAccount';
import PsyShowWSh from './page/psychologist/psyWorksheet/psyShowWSh';
import RegisterPatient from './page/login/registerPatient';
import LoginPatient from './page/login/loginPatient';
import LoginPsychologist from './page/login/LoginPsychologist';
import RegisterPsychologist from './page/login/RegisterPsychologist';
import HomePage from './page/login/HomePage';
import Admin from './page/admin/Admin'
export default function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='admin' element={<Admin/>}/>
        {/* ========================================================================= */}
        <Route path='/' element={<HomePage/>}/>
        <Route path='/login/psychologist' element={<LoginPsychologist/>}/>
        <Route path='/reg/psychologist' element={<RegisterPsychologist/>}/>
        <Route path='/login/patient' element={<LoginPatient/>}/>
        <Route path='/reg/patient' element={<RegisterPatient/>}/>
        <Route path='/PsyHomePage' element={<PsyHomePage/>}/>
        <Route path='/PsyPatient' element={<PsyPatient/>}/>
        <Route path='/PsyWorksheet' element={<PsyWorksheet/>}/>
        <Route path='/PsyWorksheet/ShowWorksheet' element={<PsyShowWSh/>}/>
        <Route path='/PsyAccount' element={<PsyAccount/>}/>
        {/* ========================================================================= */}
        <Route path="/Pat" element={<Pat />} />
        <Route path="/Worksheets" element={<Worksheets />} />
        <Route path="/Summary" element={<Summary />} />
        <Route path="/Profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}