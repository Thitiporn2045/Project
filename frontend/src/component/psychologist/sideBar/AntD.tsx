import React, { useState } from 'react';
import { FaFileLines, FaUsers, FaHouse, FaUserDoctor } from "react-icons/fa6";
import { FaBars, FaSignOutAlt } from 'react-icons/fa';
import type { MenuProps } from 'antd';
import { Button, Menu } from 'antd';
import { ConfigProvider} from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Ant.css';

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
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear(); // Clear all localStorage
        navigate('/login/psychologist'); // Navigate to login page
      };


    const toggleCollapsed = () =>{
        setCollapsed(!collapsed);
    };

  return (
    <ConfigProvider
        theme={{
            components:{
               Menu: {
                itemColor: '#ffffff',
                itemHoverBg	:'#2C9F99',
                itemHoverColor:'#ffffff',
                itemSelectedColor:'#ffffff',
                itemSelectedBg:'#2C9F99',
                iconSize:20,
                itemPaddingInline:30,
                itemBorderRadius: 14,
                popupBg:'#3b7758',
                itemHeight:54,
                itemMarginBlock:16,
                collapsedWidth:75

                },
                Button:{
                }
            },

            token:{
                colorPrimary: '#2C9F99',
                fontSize:18,
            }
        }}>

        <div style={{  width: collapsed ? '75px' : '200px',
            position:'absolute',
            left:'0%',
            height:'100%',
            display:'flex',
            justifyItems:'center',
            transition: 'width 0.3s ease-in-out', // ทำให้เปลี่ยนความกว้างสมูทขึ้น
            zIndex:5
            }}>
                
                <Menu
                    selectedKeys={[location.pathname]}
                    defaultOpenKeys={['4']}
                    mode="inline"
                    inlineCollapsed={collapsed}
                    items={items}
                    style={{height:'100%',
                        background:'#20B2AA',
                        borderRadius:'0 20px 20px 0',
                        paddingTop:'120px',
                        position:'relative',
                        display:'flex',
                        flexDirection:'column'
                    }}
                >
                </Menu> 
            
                <Button
                    type="primary"
                    onClick={toggleCollapsed}
                    style={{
                    position: 'absolute',
                    top: '20px',
                    left: collapsed ? '50%' : 'auto', // Center when collapsed
                    right: collapsed ? 'auto' : '20px', // Right when expanded
                    transform: collapsed ? 'translateX(-50%)' : 'none', // Center alignment when collapsed
                    background: 'none',
                    zIndex: 3,
                    }}
                >
                    <FaBars />
                </Button>
                <Button
                    type="primary"
                    // Function to handle logout
                    onClick={handleLogout}
                    style={{
                        position: 'absolute',
                        bottom: '20px',
                        left: '50%',
                        transform: 'translateX(-50%)', // Center alignment
                        background: 'none',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                    }}
                >
                    <FaSignOutAlt />
                    {!collapsed && 'ออกจากระบบ'}
                </Button>
        </div>
    </ConfigProvider>
    )
}

export default AntD