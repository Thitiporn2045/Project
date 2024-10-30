import dayjs from 'dayjs';

export function calculateAge(birthdate: string): number {
  // แปลง birthdate จากรูปแบบ "DD-MM-YYYY" เป็นวัตถุ dayjs
  const birthDateObj = dayjs(birthdate, 'DD-MM-YYYY');
  
  // คำนวณอายุจากความแตกต่างของปี
  return dayjs().diff(birthDateObj, 'year');
}
