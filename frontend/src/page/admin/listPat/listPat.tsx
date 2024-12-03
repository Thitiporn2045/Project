import React, { useEffect, useState } from 'react';
import { Modal, Button, message, ConfigProvider } from 'antd';
import thTH from 'antd/lib/locale/th_TH';
import './admin.css';
import Navbar from '../../../component/admin/navbar/navbar';

function ListPat() {
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
    <div className='listPat'>
    <div className='bg-main'>
        <div className='left'>
        <Navbar></Navbar>
        </div>
        <div className='right'>
        <div className="box-content">
        </div>
        </div>
    </div>
    </div>
    </ConfigProvider>
);

}
export default ListPat;
