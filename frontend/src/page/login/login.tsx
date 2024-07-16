import React,{useEffect,useState} from "react";
import { Link, useNavigate } from 'react-router-dom';
import './login.css'

const userLogin ={
    email:"test1@gmail.com",
    password:"12345678Sp"
}

const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

registerBtn?.addEventListener('click',()=>{
    container?.classList.add("active")
});

loginBtn?.addEventListener('click',()=>{
    container?.classList.remove("active")
});

export default function Login(){
    return(
        <div className="container" id="container">
            <div className="form-container register">
                <h1>สร้างบัญชีผู้ใช้</h1>
                <form className="form-register">
                    
                    <div className="firstName-reg"><input id="firstName" type="text" placeholder="ชื่อ"/></div>
                    <div className="lastName-reg"><input id="lastName" type="text" placeholder="นามสกุล"/></div>
                    <div className="date-reg">  <input id="date" type="date" placeholder="วว/ดด/ปปปป เกิด" onFocus={(e) => (e.target.type = 'date')} onBlur={(e) => (e.target.type = 'text')} />
                    </div>
                    <div className="gender-reg"><select id="gender">
                        <option value="">เพศ</option>
                        <option value="ชาย">ชาย</option>
                        <option value="หญิง">หญิง</option>
                        <option value="lgbtq+">LGBTQ+</option>
                        <option value="ไม่ระบุ">ไม่ระบุ</option>
                    </select></div>
                    <div className="tel-reg"><input type="tel" id="phone" placeholder="เบอร์โทรศัพท์"/></div>
                    <div className="email-reg"><input type="email" id="email" placeholder="อีเมล"/></div>
                    <div className="password-reg"><input type="password" id="password" placeholder="รหัสผ่าน"/></div>
                    <div className="confirm-password-reg"><input type="password" id="password" placeholder="ยืนยันรหัสผ่าน"/></div>
                    <div className="btn-reg"><button type="submit">สร้างบัญชีผู้ใช้</button></div>
                </form>
            </div>
            <div className="form-container login">
                <form className="form-login">
                    <h1>เข้าสู่ระบบ</h1>
                    <input type="email" id="email" placeholder="อีเมล"/>
                    <input type="password" id="password" placeholder="รหัสผ่าน"/>
                    <button type="submit">เข้าสู่ระบบ</button>
                </form>
                </div>
                <div className="toggle-container">
                    <div className="toggle">
                        <div className="toggle-panel toggle-left">
                            <h1>ยินดีต้อนรับเข้าสู่ CBT Buddies</h1>
                            <p>มีบัญชีผู้ใช้งานแล้ว?</p>
                            <button className="hidden" id="login">เข้าสู่ระบบ</button>
                        </div>
                        <div className="toggle-panel toggle-right">
                            <h1>ยินดีต้อนรับเข้าสู่ CBT Buddies</h1>
                            <p>ยังไม่มีบัญชีผู้ใช้งาน?</p>
                            <button className="hidden" id="register">สร้างบัญชีผู้ใช้</button>
                        </div>
                    </div>
                </div>





        </div>
    );


}