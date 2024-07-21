import { BrowserRouter as Router, Route, Routes, BrowserRouter } from 'react-router-dom';
import './App.css';

import Login from './page/login/loginPatient';
import Pat from './page/patient/pat';
import Worksheets from './page/patient/worksheet/worksheet';
import Summary from './page/patient/summary/summary';
import Profile from './page/patient/profile/profile';

export default function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login/>}/>
        <Route path="/Pat" element={<Pat />} />
        <Route path="/Worksheets" element={<Worksheets />} />
        <Route path="/Summary" element={<Summary />} />
        <Route path="/Profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}