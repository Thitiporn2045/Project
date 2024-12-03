import React, { useEffect, useState } from 'react';
import { Modal, Button, message, ConfigProvider } from 'antd';
import thTH from 'antd/lib/locale/th_TH';
import './admin.css';
import Navbar from '../../component/admin/navbar/navbar';
import { FaUserDoctor } from "react-icons/fa6";
import DonutGraph from '../../component/admin/Graph/donutGraph';
import BarChart from '../../component/admin/Graph/barChart';

function Admin() {
  const user = 102496;
  const psychologists = 47403;
  const patients = 55093;

  const cbtData = [
    { name: 'Activity Planning', value: 10 },
    { name: 'Activity Diary', value: 20 },
    { name: 'Behavioral Experiment', value: 30 },
    { name: 'Cross Sectional', value: 10 },
    { name: 'Dairy', value: 5 },
  ];

  return (
    <ConfigProvider
      locale={thTH}
      theme={{
        token: {
          colorText: '#585858',
          fontFamily: 'Noto Sans Thai, sans-serif',
          colorPrimary: '#24252C'
        }
      }}
    >
      <div className='Admin'>
        <div className='bg-main'>
          <div className='left'>
            <Navbar></Navbar>
          </div>
          <div className='middle'>
            <div className="box-content">
              <div className="card">
                <div className="card-header">
                  <div className="card-header-icon I">
                    <i><FaUserDoctor /></i>
                  </div>
                  <h3 className='I'>จำนวนผู้ใช้ระบบ</h3>
                </div>
                <div className="card-body">
                  <p className="card-value I">$11.67M</p>
                  <p className="card-percentage I">+33.40%</p>
                </div>
              </div>
              <div className="card">
                <div className="card-header">
                  <div className="card-header-icon II">
                    <i><FaUserDoctor /></i>
                  </div>
                  <h3 className='II'>จำนวนนักจิตวิทยา</h3>
                </div>
                <div className="card-body">
                  <p className="card-value II">47,403</p>
                  <p className="card-percentage II">-12.4%</p>
                </div>
              </div>
              <div className="card">
                <div className="card-header">
                  <div className="card-header-icon III">
                    <i><FaUserDoctor /></i>
                  </div>
                  <h3 className='III'>จำนวนผู้ป่วย</h3>
                </div>
                <div className="card-body">
                  <p className="card-value III">55,093</p>
                  <p className="card-percentage III">+40%</p>
                </div>
              </div>
              <div className="card">
                <div className="card-header">
                  <div className="card-header-icon IV">
                    <i><FaUserDoctor /></i>
                  </div>
                  <h3 className='IV'>เปอร์เซ็นต์รวม</h3>
                </div>
                <div className="card-body">
                  <p className="card-value IV">$12.33B</p>
                  <p className="card-percentage IV">+4.46%</p>
                </div>
              </div>
            </div>
            <div className='graph'>
              <BarChart data={cbtData} />
              <DonutGraph users={user} psychologists={psychologists} patients={patients} />
            </div>
            <div className="list">
              
            </div>
          </div>
          {/* <div className='right'>
          </div> */}
        </div>
      </div>
    </ConfigProvider>
  );
}

export default Admin;