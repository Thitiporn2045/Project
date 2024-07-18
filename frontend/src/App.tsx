import { BrowserRouter as Router, Route, Routes, BrowserRouter } from 'react-router-dom';
import './App.css';

import Login from './page/login/loginPatient';
import Psy from './page/psychologist/psy';
import Worksheets from './page/psychologist/worksheet/worksheet';
import Summary from './page/psychologist/summary/summary';
import Profile from './page/psychologist/profile/profile';

export default function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login/>}/>
        <Route path="/Psy" element={<Psy />} />
        <Route path="/Worksheets" element={<Worksheets />} />
        <Route path="/Summary" element={<Summary />} />
        <Route path="/Profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}