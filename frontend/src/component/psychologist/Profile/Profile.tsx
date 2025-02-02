import React, { useEffect, useState } from 'react';
import './Profile.css'; // Assuming you have a separate CSS file for styling
import { PsychologistInterface } from '../../../interfaces/psychologist/IPsychologist';
import { GetPsychologistById } from '../../../services/https/psychologist/psy';
import { Avatar } from 'antd';
import userEmpty from '../../../assets/userEmty.jpg'
import { useNavigate } from 'react-router-dom';


function Profile() {
  const [psychologist, setPsychologist] = useState<PsychologistInterface>();
  const psyID = localStorage.getItem('psychologistID') 

  const navigate = useNavigate();

  const handleProfileClick = () =>{
    navigate('/PsyAccount')
  }
  


  const getPsychologist = async () => {
    let res = await GetPsychologistById(Number(psyID));
    if(res){
      setPsychologist(res);
      
    }
  }

   useEffect(() => {
      getPsychologist();
    }, []);
  
  return (
    <div 
      style={{
        width:'95%',
        display:'flex',
        flexGrow:1,
        alignItems:'center',
        justifyContent:'end'
      }}
    >
      <div 
        onClick={handleProfileClick} 
        style={{width:'60%',
          height:'80%',
          display:'flex',
          flexDirection:'row',
          justifyContent:'space-between',
          cursor: 'pointer',
          gap:'0.5rem',
        }}
      >
        <div 
          style={{
            width:'76%',
            display:'flex',
            flexDirection:'column',
            justifyContent:'center',
            alignItems:'end',
            fontSize:16,
            color:'#585858',
          }}
        >
          {psychologist?.FirstName} {psychologist?.LastName}
          <span style={{color:'#c0c0c0',fontSize:12}}>นักจิตวิทยา</span>
        </div>

        <div style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
          <Avatar size={48} src={psychologist?.Picture ? psychologist?.Picture : userEmpty}/> 
        </div>
      </div>
    </div>
  )
}

export default Profile
