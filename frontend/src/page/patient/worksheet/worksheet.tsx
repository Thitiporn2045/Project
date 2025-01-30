import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NavbarPat from '../../../component/navbarPat/navbarPat';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import defaultImg from '../../../assets/book cover/cover35.jpg'
import './stylePat.css';
import { WorksheetTypeInterface } from '../../../interfaces/worksheetType/IWorksheetType';
import { ListWorkSheetType } from '../../../services/https/workSheetType/workSheetType';
import { DiaryPatInterface } from '../../../interfaces/diary/IDiary';
import { CreateDiaryPat } from '../../../services/https/diary';
import { Button, Drawer, message } from 'antd';
import dayjs from 'dayjs';
import sheetActivity from '../../../assets/sheet1.png'
import sheetBeHav from  '../../../assets/sheet2.png'
import sheetCross from  '../../../assets/sheet3.png'
import sheetPlanning from '../../../assets/sheet4.png'
import { motion } from "framer-motion";  // Import framer-motion

    // global.d.ts หรือ index.d.ts
    declare var require: {
        context: (directory: string, useSubdirectories: boolean, regExp: RegExp) => {
            keys: () => string[];
            (id: string): any;
        };
    };

function Worksheets() {
    const [messageApi, contextHolder] = message.useMessage();
    const [diaryName, setDiaryName] = useState('');
    const [diaryPicture, setDiaryPicture] = useState('');
    const [diaryStart, setDiaryStart] = useState(new Date());
    const [diaryEnd, setDiaryEnd] = useState(new Date());
    const [diaryIsPublic, setDiaryIsPublic] = useState(false);
    const patID = localStorage.getItem('patientID');

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [duration, setDuration] = useState(0);
    const [selectedBook, setSelectedBook] = useState<number | null>(null);
    const [worksheets, setWorksheets] = useState<WorksheetTypeInterface[]>([]);
    const [selectedWorksheet, setSelectedWorksheet] = useState<WorksheetTypeInterface | null>(null);
    const isFormValid = diaryName && selectedBook && diaryStart && diaryEnd;
    const navigate = useNavigate();

    // ใช้ require.context เพื่อดึงไฟล์รูปจากโฟลเดอร์
    const imageContext = require.context('../../../assets/book cover', false, /\.(jpg|jpeg|png)$/);
    const imageFiles = imageContext.keys().map(imageContext);

    const handleImageClick = (image: any) => {
        setDiaryPicture(image);
        setOpen(false); // Close the popup after selecting an image
        setShowDatePicker(true);
    };

    const [open, setOpen] = useState(false);

    const showDrawer = () => {
        setOpen(true);
    };
    
    const onClose = () => {
        setOpen(false);
    };

    const fetchWorksheetData = async () => {
        const res = await ListWorkSheetType();
        if (res) {
            setWorksheets(res);
            setSelectedWorksheet(res[0] || null); // Set the first item as default
        }
    };

    useEffect(() => {
        fetchWorksheetData();
    }, []);

    const convertImageToBase64 = (imageUrl: string): Promise<string> => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "Anonymous"; // ถ้ารูปภาพเป็น cross-origin
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img, 0, 0);
                    const base64Image = canvas.toDataURL();
                    resolve(base64Image);
                } else {
                    reject('Canvas context is null');
                }
            };
            img.onerror = (error) => reject(error);
            img.src = imageUrl;
        });
    };
    
    const handleSaveNote = async () => {
        if (!diaryPicture) {
            messageApi.error("กรุณาเลือกภาพ");
            return;
        }
        

        // แปลงภาพที่เลือกให้เป็น Base64
        const base64Image = await convertImageToBase64(diaryPicture);

        const diaryData: DiaryPatInterface = {
            Name: diaryName,
            Picture: base64Image as string,  // แปลง Picture เป็น string
            Start: dayjs(diaryStart).format('DD-MM-YYYY'),
            End: dayjs(diaryEnd).format('DD-MM-YYYY'),
            IsPublic: diaryIsPublic,
            WorksheetTypeID: selectedBook || 0,
            PatID: Number(patID),
        };

        const res = await CreateDiaryPat(diaryData);
        if (res) {
            messageApi.success("สร้างแล้ว");
            setTimeout(() => {
                navigate('/mainSheet');
            }, 1000);
            resetForm();
        } else {
            messageApi.error("เกิดข้อผิดพลาดในการสร้าง");
        }
    };

    const resetForm = () => {
        setDiaryName('');
        setDiaryStart(new Date());
        setDiaryEnd(new Date());
        setDiaryIsPublic(false);
        setDiaryPicture('');
        setSelectedBook(null);
    };

    const calculateDuration = (start: Date, end: Date) => {
        const diffTime = Math.abs(end.getTime() - start.getTime());
        setDuration(Math.ceil(diffTime / (1000 * 60 * 60 * 24)+1));
    };

    const handleThumbnailClick = (worksheet: WorksheetTypeInterface) => {
        setSelectedWorksheet(worksheet);
    };

    const handleClickOutside = (event: any) => {
        if (showDatePicker && !event.target.closest('.date-picker-popup')) {
            setShowDatePicker(false);
        }
    };

    useEffect(() => {
        if (showDatePicker) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showDatePicker]);

    const getWorksheetContent = () => {
        switch (selectedWorksheet?.ID) {
            case 1:
                return (
                    <div className='index1'>
                            <p>Activities Planning เป็นแบบฝึกหัดที่มักใช้ในกระบวนการบำบัดโดยเฉพาะใน Cognitive Behavioral Therapy (CBT) เพื่อช่วยให้ผู้ป่วยสามารถวางแผนและจัดการกิจกรรมในแต่ละวัน โดยการแบ่งกิจกรรมออกเป็นช่วงเวลาเช้า กลางวัน และเย็น เพื่อให้ผู้ป่วยสามารถติดตามและจัดการกิจกรรมที่ทำได้อย่างมีประสิทธิภาพมากขึ้น</p>
                    <ul>
                        <li>ช่วยให้ผู้ป่วยสามารถวางแผนการทำกิจกรรมในแต่ละวันได้ดีขึ้น และสามารถจัดการกับกิจกรรมต่างๆ ได้อย่างมีระบบ</li>
                        <li>การวางแผนกิจกรรมให้มีความชัดเจนช่วยเพิ่มความรู้สึกมีเป้าหมายในชีวิต และทำให้รู้สึกมีการควบคุมมากขึ้น</li>
                        <li>การบันทึกกิจกรรมและอารมณ์ที่เกิดขึ้นในแต่ละช่วงเวลา ช่วยให้ผู้ป่วยสามารถสังเกตว่าแต่ละกิจกรรมส่งผลต่ออารมณ์อย่างไร ซึ่งช่วยในการปรับปรุงพฤติกรรมในอนาคต</li>
                    </ul>
                    <p>เช้า (Morning)</p>
                    <ul>
                        <li>กิจกรรม: ตื่นนอน ออกกำลังกาย ทานอาหารเช้า</li>
                        <li>ความรู้สึก: รู้สึกสดชื่น</li>
                    </ul>
                    <p>กลางวัน (Afternoon)</p>
                    <ul>
                        <li>กิจกรรม: ทำงานหรือเรียน</li>
                        <li>ความรู้สึก: เครียดจากการทำงาน</li>
                    </ul>
                    <p>เย็น (Evening)</p>
                    <ul>
                        <li>กิจกรรม: ทานอาหารเย็น พักผ่อน ดูหนัง</li>
                        <li>ความรู้สึก: ผ่อนคลาย</li>
                    </ul>
                    <p>การบันทึกข้อมูลในแต่ละส่วนจะช่วยให้คุณมองเห็นภาพรวมของสถานการณ์และพัฒนาวิธีการรับมือกับปัญหาได้ดีขึ้น</p>
                    </div>
                );
            case 2:
                return (
                    <div className='index2'>
                    <p>Activities Diary หรือ บันทึกกิจกรรม เป็นเครื่องมือที่ใช้ในกระบวนการบำบัดทางจิตเวช เช่น CBT (Cognitive Behavioral Therapy) เพื่อช่วยให้ผู้ป่วยสามารถติดตามและบันทึกกิจกรรมที่ทำในแต่ละวัน โดยมักจะบันทึกในรูปแบบรายชั่วโมง เพื่อให้สามารถประเมินได้ว่าแต่ละกิจกรรมที่ทำส่งผลต่ออารมณ์และความรู้สึกอย่างไร และอาจช่วยในการระบุพฤติกรรมหรือกิจกรรมที่มีผลดีหรือผลเสียต่อจิตใจของผู้ป่วย</p>
                    <p>การบันทึกข้อมูลในแต่ละส่วนจะช่วยให้คุณมองเห็นภาพรวมของสถานการณ์และพัฒนาวิธีการรับมือกับปัญหาได้ดีขึ้น</p>
                    <table className="schedule-table">
                        <thead>
                            <tr>
                            <th>เวลา</th>
                            <th>กิจกรรม</th>
                            <th>รู้สึกอย่างไร</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                            <td>8:00-9:00</td>
                            <td>ออกกำลังกาย</td>
                            <td>รู้สึกดี</td>
                            </tr>
                            <tr>
                            <td>9:00-10:00</td>
                            <td>ทำการบ้าน</td>
                            <td>เครียด</td>
                            </tr>
                            <tr>
                            <td>10:00-11:00</td>
                            <td>พักผ่อนดูทีวี</td>
                            <td>ผ่อนคลาย</td>
                            </tr>
                            <tr>
                            <td>11:00-12:00</td>
                            <td>ทานอาหารกลางวัน</td>
                            <td>สนุกสนาน</td>
                            </tr>
                        </tbody>
                        </table>
                    </div>
                );
            case 3:
                return (
                    <div className='index3'>
                        <p>Behavioral Experiment เป็นหนึ่งในเทคนิคที่ใช้ใน Cognitive Behavioral Therapy (CBT) เพื่อช่วยให้ผู้เข้ารับการบำบัดสำรวจและทดสอบความคิดหรือความเชื่อที่ไม่สมเหตุสมผลผ่านการลงมือปฏิบัติจริงในชีวิตประจำวัน โดยเน้นการเปลี่ยนแปลงมุมมองความคิดที่เป็นอุปสรรคต่อการดำเนินชีวิต เช่น ความคิดที่ก่อให้เกิดความวิตกกังวล ความกลัว หรือความซึมเศร้า</p>
                    <ul>
                        <li>ช่วยให้ผู้ป่วยมองเห็นหลักฐานในชีวิตจริง แทนที่จะยึดติดกับความเชื่อหรือความคิดที่ไม่มีเหตุผล</li>
                        <li>เสริมสร้างความมั่นใจผ่านการเผชิญหน้ากับสถานการณ์ที่เคยกลัว</li>
                        <li>ลดการหลีกเลี่ยงและเพิ่มพฤติกรรมเชิงบวกในชีวิต</li>
                    </ul>
                    <p>การบันทึกข้อมูลในแต่ละส่วนจะช่วยให้คุณมองเห็นภาพรวมของสถานการณ์และพัฒนาวิธีการรับมือกับปัญหาได้ดีขึ้น</p>
                    <div className="situation-header">ตัวอย่าง: ทุกคนในที่ทำงานจะมองว่าฉันโง่ถ้าฉันพูดในที่ประชุม</div>
                        <table className="situation-table">
                        <tr>
                            <th>ตั้งสมมติฐาน</th>
                            <td>
                            <ul className="situation-list">
                                <li>ความคิดเชิงลบ: ถ้าฉันพูดในที่ประชุม คนจะหัวเราะหรือวิจารณ์ฉัน</li>
                                <li>ความคิดทางเลือก: อาจไม่มีใครวิจารณ์ฉัน และบางคนอาจเห็นว่าความเห็นของฉันมีค่า</li>
                            </ul>
                            </td>
                        </tr>
                        <tr>
                            <th>การวางแผนและปฏิบัติ</th>
                            <td>
                            <ul className="situation-list">
                                <li>ทดลองพูดในที่ประชุมสั้น ๆ เช่น แสดงความเห็นในหัวข้อที่ตัวเองมั่นใจ และสังเกตปฏิกิริยาของคนรอบตัว</li>
                            </ul>
                            </td>
                        </tr>
                        <tr>
                            <th>การประเมินผล</th>
                            <td>
                            <ul className="situation-list">
                                <li>สอบถามผู้เข้าร่วมประชุมบางคน หรือสังเกตปฏิกิริยา เช่น ไม่มีใครหัวเราะ หรือบางคนอาจพยักหน้าเห็นด้วย</li>
                            </ul>
                            </td>
                        </tr>
                        <tr>
                            <th>บทเรียนที่ได้</th>
                            <td>
                            <ul className="situation-list">
                                <li>ความเชื่อเดิม: “คนจะหัวเราะฉัน”  ซึ่งไม่จริง</li>
                                <li>ความคิดใหม่: "การพูดในที่ประชุมอาจไม่เลวร้ายอย่างที่คิด และบางคนสนใจในสิ่งที่ฉันพูด"</li>
                            </ul>
                            </td>
                        </tr>
                        </table>
                    </div>
                );
            case 4:
                return (
                    <div className='index4'>
                        <p>Cross Sectional Worksheet เป็นแบบฝึกหัดที่ถูกออกแบบมาเพื่อช่วยให้คุณเข้าใจความสัมพันธ์ระหว่างความคิด อารมณ์ พฤติกรรม และความรู้สึกทางร่างกายที่เกิดขึ้นในสถานการณ์ต่าง ๆ</p>
                        <ul>
                            <li>ความคิด (Thoughts): สิ่งที่คุณคิดในขณะนั้น</li>
                            <li>อารมณ์ (Emotions): ความรู้สึกที่เกิดขึ้น เช่น ดีใจ เสียใจ หรือโกรธ</li>
                            <li>พฤติกรรม (Behaviors): การกระทำที่เกิดขึ้นหลังจากที่คุณมีความคิดหรือความรู้สึก</li>
                            <li>ความรู้สึกทางร่างกาย (Bodily Sensations): อาการทางกายที่เกิดขึ้น เช่น ใจสั่น เหงื่อออก หรือปวดหัว</li>
                        </ul>
                        <p>การบันทึกข้อมูลในแต่ละส่วนจะช่วยให้คุณมองเห็นภาพรวมของสถานการณ์และพัฒนาวิธีการรับมือกับปัญหาได้ดีขึ้น</p>
                        <div className="situation-header">ตัวอย่างสถานการณ์: การสอบไม่ผ่าน</div>
                        <table className="situation-table">
                        <tr>
                            <th>ความคิด</th>
                            <td>
                            <ul className="situation-list">
                                <li>ฉันไม่มีความสามารถ</li>
                                <li>อนาคตของฉันต้องล้มเหลวแน่ ๆ</li>
                            </ul>
                            </td>
                        </tr>
                        <tr>
                            <th>พฤติกรรม</th>
                            <td>
                            <ul className="situation-list">
                                <li>เลิกอ่านหนังสือเพราะรู้สึกหมดกำลังใจ</li>
                                <li>หลีกเลี่ยงการเจอเพื่อนเพื่อไม่ให้ใครถามเรื่องผลสอบ</li>
                            </ul>
                            </td>
                        </tr>
                        <tr>
                            <th>ความรู้สึกทางร่างกาย</th>
                            <td>
                            <ul className="situation-list">
                                <li>แน่นหน้าอก</li>
                                <li>ปวดหัว</li>
                                <li>ไม่มีแรง</li>
                            </ul>
                            </td>
                        </tr>
                        <tr>
                            <th>อารมณ์</th>
                            <td>
                            <ul className="situation-list">
                                <li>เสียใจ</li>
                                <li>หวาดกลัว</li>
                                <li>ผิดหวัง</li>
                            </ul>
                            </td>
                        </tr>
                        </table>
                    </div>
                );
            default:
                return null;
        }
    };

    const getWorksheetContentImg = (): string | undefined => {
        switch (selectedWorksheet?.ID) {
            case 1:
                return sheetPlanning;
            case 2:
                return sheetActivity;
            case 3:
                return sheetBeHav;
            case 4:
                return sheetCross;
            default:
                return undefined; // Changed from `null` to `undefined`
        }
    };      

    return (
        <div className={`worksheets ${showDatePicker ? 'show-blur-background' : ''}`}>
            {contextHolder}
            <div className="main-body">
                <div className='sidebar'>
                    <NavbarPat />
                </div>
                <div className="main-background">
                    <div className="bg-content">
                    <motion.div 
                        className="content-img"
                        initial={{ opacity: 0, y: 50 }}  // Start off-screen and transparent
                        animate={{ opacity: 1, y: 0 }}    // Fade in and move to the normal position
                        transition={{ duration: 0.5 }}    // Smooth transition for 0.5s
                    >
                        {selectedWorksheet && (
                            <>
                                {getWorksheetContentImg() ? ( 
                                    <img 
                                        className='ImgSheet'
                                        src={getWorksheetContentImg()} 
                                        alt={selectedWorksheet.Name}
                                        style={{ opacity: 1, transition: 'opacity 0.5s' }}
                                    />
                                ) : (
                                    <p>กำลังโหลดเนื้อหาของแบบฝึกหัด...</p>
                                )}
                            </>
                        )}
                    </motion.div>
                    <motion.div 
                        className="content-text"
                        initial={{ opacity: 0, y: 50 }}  // Start off-screen and transparent
                        animate={{ opacity: 1, y: 0 }}    // Fade in and move to the normal position
                        transition={{ duration: 0.5 }}    // Smooth transition for 0.5s
                    >
                        {selectedWorksheet && (
                            <>
                                {getWorksheetContent() ? ( 
                                    <div>
                                        <h2>{selectedWorksheet.Name}</h2>
                                        <p>{getWorksheetContent()}</p>  {/* แสดงเนื้อหาที่ดึงมา */}
                                        <button className="btn" onClick={() => setShowDatePicker(true)}>
                                            <span>เริ่มสร้าง</span>
                                        </button>
                                    </div>
                                ) : (
                                    <p>กำลังโหลดเนื้อหาของแบบฝึกหัด...</p>
                                )}
                            </>
                        )}
                    </motion.div>
                    </div>
                    <div className="thumbnail">
                        {worksheets.map((item) => (
                            <motion.div 
                                key={item.ID}
                                className={`thumbnail-item ${selectedWorksheet?.ID === item.ID ? 'active' : ''}`}
                                onClick={() => handleThumbnailClick(item)}
                                style={{ cursor: 'pointer' }}
                                initial={{ opacity: 0, y: 50 }}  // Start above and transparent
                                animate={{ opacity: 1, y: 0 }}    // Fade in and move to normal position
                                transition={{ duration: 0.3 }}    // Duration for the animation
                            >
                                {item.NumberType}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
            {showDatePicker && (
                <div className='bg-popup' onClick={handleClickOutside}>
                    <div className="date-picker-popup" onClick={(e) => e.stopPropagation()}>
                        <div className="date-picker-content">
                            <div className="left-column">
                                <div className='book-item'>
                                    <div className="img-book">
                                    {diaryPicture ? (
                                        <img 
                                            src={diaryPicture}
                                            onClick={showDrawer} 
                                            alt="Selected" />
                                    ) : (
                                        <img 
                                            src={defaultImg}
                                            onClick={showDrawer} 
                                            alt="Selected" />
                                    )}
                                    </div>
                                    <p className='text'>สามารถคลิกที่รูปเพื่อเปลี่ยนรูปได้</p>
                                    <div className="head">
                                        <input 
                                            required
                                            className='nameBook' 
                                            type="text" 
                                            placeholder="ชื่อไดอารี่"
                                            value={diaryName}
                                            onChange={(e) => setDiaryName(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="right-column">
                                <div className="input-group">
                                    <label>ยืนยันแบบฟอร์มของคุณ</label>
                                    <select 
                                        className='typeBook'
                                        value={selectedBook ?? ''}
                                        onChange={(e) => setSelectedBook(Number(e.target.value))}
                                    >
                                        <option value="" disabled hidden>เลือกแบบฟอร์ม</option>
                                        {worksheets.map((item) => (
                                            <option value={item.ID} key={item.ID}>
                                                {item.Name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="input-group">
                                    <label>วันเริ่มต้น</label>
                                    <DatePicker
                                        calendarClassName="custom-calendar"
                                        selected={diaryStart}
                                        onChange={(date: Date | null) => {
                                            if (date) setDiaryStart(date);
                                        }}
                                        selectsStart
                                        startDate={diaryStart}
                                        endDate={diaryEnd}
                                        dateFormat="dd/MM/yyyy"
                                        minDate={new Date()} // ไม่อนุญาตให้เลือกวันที่ย้อนหลัง
                                    />
                                </div>
                                <div className="input-group">
                                    <label>วันสิ้นสุด</label>
                                    <DatePicker
                                        calendarClassName="custom-calendar"
                                        selected={diaryEnd}
                                        onChange={(date: Date | null) => {
                                            if (date) {
                                                setDiaryEnd(date);
                                                calculateDuration(diaryStart, date);
                                            }
                                        }}
                                        selectsEnd
                                        startDate={diaryStart}
                                        endDate={diaryEnd}
                                        minDate={diaryStart}
                                        dateFormat="dd/MM/yyyy"
                                    />
                                </div>
                                <div className="input-group">
                                    <label>จำนวนวัน</label>
                                    <input type="text" value={`${duration} วัน`} readOnly />
                                </div>
                            </div>
                        </div>
                        <button className='btn-submit' onClick={handleSaveNote} disabled={!isFormValid}>
                            สร้างโน้ต
                        </button>                 
                    </div>
                </div>
            )}
            <Drawer title="เลือกภาพปก" onClose={onClose} open={open}>
                <div className='bgCover'
                    style={{marginLeft: '70px'}}
                    >
                    {imageFiles.map((image, index) => (
                        <img
                            key={index}
                            src={image}
                            alt={`Cover ${index + 1}`}
                            onClick={() => handleImageClick(image)}
                            style={{ cursor: 'pointer', width: '200px', height: '300px', marginBottom: '40px', boxShadow: 'rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px' }}
                        />
                    ))}
                </div>
            </Drawer>
        </div>
    );
}

export default Worksheets;
