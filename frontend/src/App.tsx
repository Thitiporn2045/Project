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
import PsyCommentAP from './page/psychologist/psyComment/PsyCommentAP';
import PsyCommentAD from './page/psychologist/psyComment/PsyCommentAD';
import PsyCommentBE from './page/psychologist/psyComment/PsyCommentBE';
import PsyCommentCS from './page/psychologist/psyComment/PsyCommentCS';
import ListPsycho from './page/admin/listPsycho/listPsycho';
import ListPat from './page/admin/listPat/listPat';
import SheetBehav from './page/patient/worksheet/totalSheet/SheetBehav';
import SummaryBehav from './page/patient/summary/summaryBehav';
import SummaryActivity from './page/patient/summary/summaryActivity';
import SummaryPlanning from './page/patient/summary/summaryPlanning';
import PsySummaryDiary from './page/psychologist/psySummaryDiary/PsySummaryDiaryAD';
import PsySummaryDiaryAD from './page/psychologist/psySummaryDiary/PsySummaryDiaryAD';
import PsySummaryDiaryAP from './page/psychologist/psySummaryDiary/PsySummaryDiaryAP';
import PsySummaryDiaryBE from './page/psychologist/psySummaryDiary/PsySummaryDiaryBE';
import PsySummaryDiaryCS from './page/psychologist/psySummaryDiary/PsySummaryDiaryCS';

export default function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='admin' element={<Admin/>}/>
        <Route path='/ListPsycho' element={<ListPsycho/>}/>
        <Route path='/ListPat' element={<ListPat/>}/>
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
        <Route path='/PsyWorksheet/PsyCommentActivitiesDiaries' element={<PsyCommentAD/>}/>
        <Route path='/PsyWorksheet/PsyCommentActivitiesPlanning' element={<PsyCommentAP/>}/>
        <Route path='/PsyWorksheet/PsyCommentBehavioralExperiment' element={<PsyCommentBE/>}/>
        <Route path='/PsyWorksheet/PsyCommentCrossSectional' element={<PsyCommentCS/>}/>
        <Route path='/PsyWorksheet/DashboardSummaryAD' element={<PsySummaryDiaryAD/>}/>
        <Route path='/PsyWorksheet/DashboardSummaryAP' element={<PsySummaryDiaryAP/>}/>
        <Route path='/PsyWorksheet/DashboardSummaryBE' element={<PsySummaryDiaryBE/>}/>
        <Route path='/PsyWorksheet/DashboardSummaryCS' element={<PsySummaryDiaryCS/>}/>
        
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
        <Route path='/SheetBehav' element={<SheetBehav/>} />
        <Route path='/SummaryBehav' element={<SummaryBehav/>} />
        <Route path='/SummaryActivity' element={<SummaryActivity/>} />
        <Route path='/SummaryPlanning' element={<SummaryPlanning/>} />

      </Routes>
    </BrowserRouter>
  );
}