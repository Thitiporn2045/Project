import { Avatar, Badge, ConfigProvider } from 'antd'
import React from 'react'
import { BsPersonFillAdd } from "react-icons/bs";

function Noti() {
  return (
    <ConfigProvider
        theme={{
            components:{
                Badge:{
                    indicatorHeight:18

                }
            },

            token:{
                borderRadius:15
                
            }
        }}>
            <div> 
                <Badge count={5}>
                    <Avatar shape="square" icon={<BsPersonFillAdd/>} size={56} style={{color:'#63C592',background:'#ffffff',fontSize:'32px',width:75}}/>
                </Badge>
            </div>
    
    </ConfigProvider>
    
  )
}

export default Noti