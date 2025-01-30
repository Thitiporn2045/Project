import React, { useEffect, useRef, useState } from 'react'; 
import NavbarPat from '../../../component/navbarPat/navbarPat'; 
import './stylePsy.css';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { GetDiaryByDiaryID } from '../../../services/https/diary';
import { DiaryPatInterface } from '../../../interfaces/diary/IDiary';
import dayjs from 'dayjs';
import { CrossSectionalInterface } from '../../../interfaces/crossSectional/ICrossSectional';
import { CommentInterface } from '../../../interfaces/psychologist/IComment';
import { ListCommentByDiaryId } from '../../../services/https/psychologist/comment';
import DateEmotionBarPlanning from '../../../component/summaryPlanning/dateEmotionBarPlanning';
import FilterEmotionsPlanning from '../../../component/summaryPlanning/filterEmotionsPlanning';
import { GetActivityPlanningByDiaryID } from '../../../services/https/cbt/activityPlanning/activityPlanning';
import MostCommonPlanning from '../../../component/summaryPlanning/mostCommonPlanning';



function PsySummaryDiaryAP() {

  const diaryID = localStorage.getItem('diaryID');
   const numericDiaryID = diaryID ? Number(diaryID) : undefined;
      const [diary, setDiary] = useState<DiaryPatInterface | null>(null);
  
      const [dateRange, setDateRange] = useState<Date[]>([]);
      const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
      const [numberOfDays, setNumberOfDays] = useState<number | null>(null);  // Add this state for numberOfDays
      const [crossSectional, setCrossSectional] = useState<CrossSectionalInterface[]>([]); // ใช้ array ว่างแทน null
      const [datesWithData, setDatesWithData] = useState<string[]>([]); // สถานะเก็บวันที่ที่ไม่มีข้อมูล
      const [comments, setComments] = useState<CommentInterface[]>([]); // ตั้งค่าประเภทของ emotionPatients เป็น EmtionInterface[]
      
      const bookRef = useRef<HTMLDivElement>(null);
      const [prev, setPrev] = useState(0);
      const [isDragging, setIsDragging] = useState(false);  // State สำหรับตรวจสอบการลาก
      const navigate = useNavigate();
      
      const fetchDiaryByDiary = async () => {
          if (!diaryID) return;
      
          try {
              const res = await GetDiaryByDiaryID(Number(diaryID));
              setDiary(res || null);
              console.log('Diary:', res);
          } catch (error) {
              console.error('Error fetching diary:', error);
              // Add UI feedback here for the user
          }
      };    
  
      const fetchCrossSectionalByDiary = async () => {
          if (diaryID) {
              try {
                  const res = await GetActivityPlanningByDiaryID(Number(diaryID)); // เรียกใช้ API โดยส่งค่า id
                  if (res) {
                      setCrossSectional(res); // เก็บข้อมูลที่ได้จาก API ลงในสถานะ
                  }
                  console.log('Cross Sectional:', res); // แสดงข้อมูลที่ได้รับในคอนโซล
              } catch (error) {
                  console.error('Error fetching cross-sectional data:', error); // แสดงข้อผิดพลาด
              }
          }
      };
  
      const fetchCommentsByDiaryID = async () => {
          if (diaryID) {
              try {
                  const res = await ListCommentByDiaryId(Number(diaryID)); // เรียกใช้ API โดยส่งค่า id
                  if (res) {
                      setComments(res); // เก็บข้อมูลที่ได้จาก API ลงในสถานะ
                  }
                  console.log('comments:', res); // แสดงข้อมูลที่ได้รับในคอนโซล
              } catch (error) {
                  console.error('Error fetching diary:', error); // แสดงข้อผิดพลาด
              }
          }
      };
          
  
      useEffect(() => {
          fetchDiaryByDiary();
          fetchCrossSectionalByDiary();
          fetchCommentsByDiaryID();
      }, []);
  
      useEffect(() => {
          if (diary && diary.Start && diary.End) {
              const start = dayjs(diary.Start, 'DD-MM-YYYY');
              const end = dayjs(diary.End, 'DD-MM-YYYY');
              const range: Date[] = [];
  
              // คำนวณช่วงวันที่ตั้งแต่เริ่มจนถึงจบ
              for (let date = start; date.isBefore(end) || date.isSame(end, 'day'); date = date.add(1, 'day')) {
                  range.push(date.toDate());
              }
              console.log('Date Range:', range);
              setDateRange(range);
  
              // คำนวณจำนวนวันทั้งหมด
              const totalDays = end.diff(start, 'day') + 1; // +1 เพื่อรวมวันเริ่มและวันสิ้นสุด
              console.log('Number of days:', totalDays);
              setNumberOfDays(totalDays);
  
              // สร้าง Set เพื่อเก็บวันที่ที่มีข้อมูลจาก CrossSectional (ฟอร์แมตเป็น 'DD-MM-YYYY')
          const existingDates = new Set(crossSectional.map((entry: any) => dayjs(entry.Date, 'DD-MM-YYYY').format('DD-MM-YYYY')));
  
          // ตรวจสอบวันที่ที่มีข้อมูล
          const datesWithData: string[] = [];
          for (let date = start; date.isBefore(end) || date.isSame(end, 'day'); date = date.add(1, 'day')) {
              const formattedDate = date.format('DD-MM-YYYY'); // ฟอร์แมตวันที่เป็น 'DD-MM-YYYY'
              if (existingDates.has(formattedDate)) {
                  datesWithData.push(formattedDate); // วันที่ที่มีข้อมูล (ในรูปแบบ 'DD-MM-YYYY')
              }
          }
  
          setDatesWithData(datesWithData); // เก็บวันที่ที่มีข้อมูล
          }
      }, [diary, crossSectional]); // เพิ่ม crossSectional ใน dependencies เพื่อให้การคำนวณวันที่ไม่ถูกบันทึกทำงานทุกครั้งที่ข้อมูลเปลี่ยน
  
      
      const formatDate = (date: Date) => {
          return `${date.getDate()} ${date.toLocaleString('default', { weekday: 'short' })}`;
      };
  
      const onDateClick = (date: any) => {
          setSelectedDate(date);
          handleDateChange(date);
  
          const element = document.getElementById(`day-${date.toDateString()}`);
          if (element) {
              element.scrollIntoView({
                  behavior: 'smooth',
                  block: 'nearest',
                  inline: 'center',
              });
          }
      };
  
      const handleDateChange = (date: Date) => {
          console.log('Selected Date:', date);
          setSelectedDate(date);
      };
  
      const rotateBookAutomatically = () => {
          let currentRotation = prev;
          const rotate = () => {
              if (!isDragging) {
                  currentRotation += 0.2; // หมุนทีละ 0.2 องศา
                  if (bookRef.current) {
                      bookRef.current.style.transform = `rotateY(${currentRotation}deg)`;
                  }
                  requestAnimationFrame(rotate); // เรียกฟังก์ชันนี้ซ้ำเพื่อหมุนต่อไป
              }
          };
          requestAnimationFrame(rotate); // เริ่มหมุนเมื่อคอมโพเนนต์ mount
      };
      
      useEffect(() => {
          rotateBookAutomatically();
      }, [isDragging]); // หมุนต่อเนื่องจนกว่าผู้ใช้จะหยุดลาก
      
      const handleImageClick = () => {
          // นำทางไปยังหน้าอื่น
          navigate('/Profile'); // เปลี่ยน '/target-page' เป็นเส้นทางที่คุณต้องการ
      };

      return (
        <div className='summary-psy'>
            <div className="befor-main">
                <div className='main-body'>
                    <div className='sidebar'>
                        <NavbarPat />
                    </div>

                    <div className="main-background">
                        <div className="main-content">
                            <div className='contentMain'>
                                <header>
                                    <div className="boxContent1">
                                        <div className='titleName'>{diary?.Name}</div>
                                        <div className="typeBook">{diary?.WorksheetType?.Name}</div>
                                    </div>
                                    <div className="boxContent2">
                                        {/* <div className="picture">
                                            <div className="bdImg">
                                                <img 
                                                    onClick={handleImageClick}
                                                    style={{ cursor: 'pointer' }}
                                                    src={diary?.Patient?.Picture} 
                                                    alt="" 
                                                />
                                            </div>
                                        </div> */}
                                    </div>
                                </header>
                                <div className="showBook">
                                    <section className="book-showcase">
                                        <div className="wrapper">
                                            <div 
                                                ref={bookRef}
                                                className="book"
                                                style={{
                                                    width: '27.0625em',
                                                    height: '40.5em',
                                                    transformOrigin: '13.53125em 4.375em',
                                                    position: 'relative',
                                            }}
                                            >
                                                <div className="front" style={{ backgroundImage: `url(${diary?.Picture})`, backgroundPosition: 'center', backgroundSize: 'cover' }}></div>
                                                <div className="side" style={{ backgroundImage: `url(${diary?.Picture})` }}>
                                                    <div className="book-title">{diary?.Name}</div>
                                                </div>
                                                <div className="back" style={{ backgroundImage: `url(${diary?.Picture})`, backgroundPosition: 'center', backgroundSize: 'cover' }}></div>
                                                <div className="pages"></div>
                                                <div className="shadow"></div>
                                            </div>
                                        </div>
                                    </section>
                                    
                                    <div className='cardEmotion'>
                                        <FilterEmotionsPlanning diaryID={numericDiaryID} date={selectedDate ? dayjs(selectedDate).format('DD-MM-YYYY') : ''} />
                                    </div>
                                </div>
                                    <DateEmotionBarPlanning diaryID={numericDiaryID} date={selectedDate ? dayjs(selectedDate).format('DD-MM-YYYY') : ''} />
                                    {/* <OverallMoodActivity diaryID={numericDiaryID} /> */}
                            </div>
                        </div>
                    </div>

                    <div className="main-bg-right">
                        <div className="main-content">
                            <div className='content1'>
                                <div className='mainBox'>
                                    <div className="box1">
                                        <div className="shoedate">
                                            <p>เลือกวันที่</p>
                                        </div>
                                        <div className="date-range">
                                            {dateRange.map((date, index) => (
                                                <div
                                                    key={index}
                                                    id={`day-${date.toDateString()}`}
                                                    className={`day ${selectedDate && date.toDateString() === selectedDate.toDateString() ? 'selected' : ''}`}
                                                    onClick={() => onDateClick(date)}
                                                >
                                                    {formatDate(date)}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                            
                                    <div className='box2'>
                                        <div className="boxContent1">
                                            <div className="container">
                                                {/* <div className="numberDay">
                                                    {numberOfDays && <p>{numberOfDays}</p>}
                                                    <small className="text-muted">วันทั้งหมด</small>
                                                </div> */}
                                                {/* วงกลมแสดง % ของวันที่เข้าทำบันทึก */}
                                                <div
                                                    className="circular_progress"
                                                    style={
                                                        {
                                                            '--clr': '#9BA5F6',
                                                            '--value': numberOfDays ? (datesWithData.length / numberOfDays) * 100 : 0
                                                        } as React.CSSProperties
                                                    }
                                                >
                                                    <div className="totalDay">
                                                        <p>{datesWithData.length} วัน</p>
                                                        <span>{numberOfDays ? Math.round((datesWithData.length / numberOfDays) * 100) : 0}%</span>
                                                    </div>
                                                </div>
                                                <div className="labelDay">
                                                    <small className="text-muted">วันเข้าบันทึก</small>
                                                </div>

                                            </div>
                                            <div className="container">
                                                {/* วงกลมแสดง % ของวันที่ไม่ได้เข้าทำบันทึก */}
                                                <div
                                                    className="circular_progress no"
                                                    style={
                                                        {
                                                            '--clr': '#2c9f99',
                                                            '--value': numberOfDays ? ((numberOfDays - datesWithData.length) / numberOfDays) * 100 : 0
                                                        } as React.CSSProperties
                                                    }
                                                >
                                                    <div className="totalDay">
                                                        {numberOfDays && <p>{numberOfDays - datesWithData.length} วัน</p>}
                                                        <span>{numberOfDays ? Math.round(((numberOfDays - datesWithData.length) / numberOfDays) * 100) : 0}%</span>
                                                    </div>
                                                </div>
                                                <div className="labelDay">
                                                    <small className="text-muted">วันไม่ได้เข้าบันทึก</small>
                                                </div>
                                            </div>
                                        </div>

                                        <div className='boxContent2'>
                                            <div className="contentComment">
                                                <div className="day-comments">
                                                {comments && comments.length > 0 ? (
                                                    comments.map((comment, index) => (
                                                        <div key={index} className="comment-box">
                                                        <div className="comment-content">
                                                            <div className="comment-user">
                                                            <strong>
                                                                {comment.Psychologist?.FirstName} {comment.Psychologist?.LastName}
                                                            </strong>
                                                            <span className="comment-date">นักจิตวิทยา</span>
                                                            </div>
                                                            <div className="comment-text">{comment.Comment}</div>
                                                        </div>
                                                        {/* Avatar at the bottom */}
                                                        <div className="comment-avatar">
                                                            <img src={comment.Psychologist?.Picture} alt="Avatar" />
                                                        </div>
                                                        </div>
                                                    ))
                                                    ) : (
                                                    <div
                                                        style={{
                                                            width: '100%',
                                                            height: '100%',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            flexDirection: 'column',
                                                        }}
                                                    >
                                                        <div className="Loading-Data-Self-Summary"></div>
                                                        <div className="textNoDataGraph">ยังไม่มีคำแนะนำ</div>
                                                    </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="boxContent3">
                                            <div className='titleEmoticon'>
                                                อารมณ์ที่พบบ่อย
                                            </div>
                                            <MostCommonPlanning diaryID={numericDiaryID}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PsySummaryDiaryAP