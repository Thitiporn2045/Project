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
import MainSheet from './page/patient/worksheet/totalSheet/mainSheet';
import SheetCross from './page/patient/worksheet/totalSheet/sheetCross';
import Planning from './page/patient/worksheet/cbt/planning';
import CrossSectional from './page/patient/worksheet/cbt/crossSectional';
import Activity from './page/patient/worksheet/cbt/activity';
import Behavioural from './page/patient/worksheet/cbt/behavioural';
import Connection from './page/Connection';
import Emotional from './component/emotional/emotional';

export default function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='admin' element={<Admin/>}/>
        {/* ========================================================================= */}
        <Route path='connection' element={<Connection/>}/>
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
        <Route path='/MainSheet' element={<MainSheet/>} />
        <Route path='/SheetCross' element={<SheetCross/>} />
        <Route path='/Planning' element={<Planning/>} />
        <Route path='/CrossSectional' element={<CrossSectional/>} />
        <Route path='/Activity' element={<Activity/>} />
        <Route path='/Behavioural' element={<Behavioural/>} />
        <Route path='/Emotional' element={<Emotional/>} />
      </Routes>
    </BrowserRouter>
  );
}