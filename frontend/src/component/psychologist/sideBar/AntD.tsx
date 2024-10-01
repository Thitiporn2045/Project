import React, { useState } from 'react';
import { FaFileLines, FaUsers, FaHouse, FaUserDoctor } from "react-icons/fa6";
import { FaBars, FaSignOutAlt } from 'react-icons/fa';
import type { MenuProps } from 'antd';
import { Button, Menu } from 'antd';
import { ConfigProvider} from 'antd';
import { Link, useLocation } from 'react-router-dom';
import './Ant.css';
import SearchAntD from '../search/SearchAntD';


type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] =[
    {key: '/PsyHomePage',icon:<FaHouse/>, label: <Link to="/PsyHomePage">หน้าแรก</Link>,},
    {key: '/PsyPatient',icon:<FaUsers/>, label: <Link to="/PsyPatient">ผู้ป่วยของฉัน</Link>},
    {key: '/PsyWorksheet',icon:<FaFileLines/>, label: <Link to="/PsyWorksheet">Worksheets</Link>},
    {key: '/PsyAccount',icon:<FaUserDoctor/>, label: <Link to="/PsyAccount">บัญชีของฉัน</Link>}
]

function AntD() {
    const [collapsed, setCollapsed] = useState(true);
    const location = useLocation();


    const toggleCollapsed = () =>{
        setCollapsed(!collapsed);
    };

  return (
    <ConfigProvider
        theme={{
            components:{
               Menu: {
                itemColor: '#ffffff',
                itemHoverBg	:'#BFE5D2',
                itemHoverColor:'#3b7758',
                itemSelectedColor:'#3b7758',
                itemSelectedBg:'#BFE5D2',
                iconMarginInlineEnd:10,
                iconSize:25,
                itemPaddingInline:30,
                itemBorderRadius: 14,
                popupBg:'#3b7758',
                itemHeight:54,
                itemMarginBlock:25,
                collapsedWidth:95

                },
                Button:{
                  

                }
            },

            token:{
                colorPrimary: '#63C592',
                fontSize:19,
            }
        }}>

        <div style={{  width: collapsed ? '95px' : '256px',
            position:'absolute',
            left:'0%',
            height:'100%',
            display:'flex',
            transition: 'width 0.3s ease-in-out', // ทำให้เปลี่ยนความกว้างสมูทขึ้น
            }}>
                
                <Menu
                    selectedKeys={[location.pathname]}
                    defaultOpenKeys={['4']}
                    mode="inline"
                    inlineCollapsed={collapsed}
                    items={items}
                    style={{height:'97%',
                        top:'1.5%',
                        left:'3%',
                        background:'#63C592',
                        borderRadius:'15px',
                        paddingTop:'100px',
                        position:'relative',
                    }}
                /> 
            
            <Button type="primary" onClick={toggleCollapsed} style={{position:'relative',top:'3%',right:'26%',background:'none'}}>
                {collapsed ? <FaBars style={{right:'135%',position:'absolute'}}/> : <FaBars />}
            </Button>
            {collapsed? <Button type='text' icon={<FaSignOutAlt/>} style={{position:'absolute',top:'93%',left:'35%',fontSize:'24px',color:'white',background:'none' }} ></Button>   
                        :<Button type='text' icon={<FaSignOutAlt/>} style={{position:'absolute',top:'93%',left:'13%',fontSize:'24px',color:'white',background:'none' }}><p style={{position:'absolute',fontSize:'18px',left:'80%',}}>ออกจากระบบ</p></Button>}
        </div>
    </ConfigProvider>
  )
}

export default AntD