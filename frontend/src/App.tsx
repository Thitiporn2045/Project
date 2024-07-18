import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './page/login/loginPatient';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/login' element={<Login/>}/>


      </Routes>
    </Router>
  );
}

export default App;
