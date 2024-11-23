package entity

import (
	"golang.org/x/crypto/bcrypt"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var db *gorm.DB

func DB() *gorm.DB {
	return db
}

func SetupDatabase() (*gorm.DB, error) {
	var err error
	var database *gorm.DB
	database, err = gorm.Open(sqlite.Open("Project.db"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}

	database.AutoMigrate(
		&Gender{},
		&Patient{},
		&Psychologist{},
		&ActivityDiary{},
		&ActivityPlanning{},
		&BehavioralExp{},
		&CrossSectional{},
		&Comment{},
		&ConnectionRequest{},
		&Diary{},
		&Emotion{},
		// &FeelGoodType{},
		&TypeOfPatient{},
		&TimeOfDay{},
		&WorkSchedule{},
		&WorksheetType{},	
		&NotePat{},
	)
//=========================================================
	db = database

	male := Gender{
		Gender: "ชาย",
	}
	female := Gender{
		Gender: "หญิง",
	}
	lgbtq := Gender{
		Gender: "LGBTQ+",
	}
	other := Gender{
		Gender: "ไม่ระบุ",
	}
	db.Model(&Gender{}).Create(&male)
	db.Model(&Gender{}).Create(&female)
	db.Model(&Gender{}).Create(&lgbtq)
	db.Model(&Gender{}).Create(&other)
//======================================================================
	timeOfDat := []TimeOfDay{
		{Name: "ช่วงเช้า",},
		{Name: "ช่วงกลางวัน"},
		{Name: "ช่วงเย็น"},
	}
	for _, tmd := range timeOfDat {
		db.Create(&tmd) 
	}
//======================================================================
	worksheetType := []WorksheetType{
		{	
			NumberType: 1,
			Name: "Activity Planning",
			Description: "การกำหนดกรอบความคิดกระบวนการ (สูตร) ช่วยให้นักบำบัดและลูกค้ามีความเข้าใจร่วมกันเกี่ยวกับปัญหา สูตรแบบตัดขวางนี้จะสำรวจปฏิสัมพันธ์ระหว่างสถานการณ์ ความคิด อารมณ์ ความรู้สึกของร่างกาย และพฤติกรรม",
			Picture: "https://i.pinimg.com/564x/8f/1a/b1/8f1ab1e2ef48c2a26de7df6e977930bd.jpg",
		},
		{	
			NumberType: 2,
			Name: "Activity Diary",
			Description: "การกำหนดกรอบความคิดกระบวนการ (สูตร) ช่วยให้นักบำบัดและลูกค้ามีความเข้าใจร่วมกันเกี่ยวกับปัญหา สูตรแบบตัดขวางนี้จะสำรวจปฏิสัมพันธ์ระหว่างสถานการณ์ ความคิด อารมณ์ ความรู้สึกของร่างกาย และพฤติกรรม",
			Picture: "https://i.pinimg.com/564x/8f/1a/b1/8f1ab1e2ef48c2a26de7df6e977930bd.jpg",
		},
		{	
			NumberType: 3,
			Name: "Behavioral Experiment",
			Description: "การกำหนดกรอบความคิดกระบวนการ (สูตร) ช่วยให้นักบำบัดและลูกค้ามีความเข้าใจร่วมกันเกี่ยวกับปัญหา สูตรแบบตัดขวางนี้จะสำรวจปฏิสัมพันธ์ระหว่างสถานการณ์ ความคิด อารมณ์ ความรู้สึกของร่างกาย และพฤติกรรม",
			Picture: "https://i.pinimg.com/564x/8f/1a/b1/8f1ab1e2ef48c2a26de7df6e977930bd.jpg",
		},
		{	
			NumberType: 4,
			Name: "Cross Sectional",
			Description: "การกำหนดกรอบความคิดกระบวนการ (สูตร) ช่วยให้นักบำบัดและลูกค้ามีความเข้าใจร่วมกันเกี่ยวกับปัญหา สูตรแบบตัดขวางนี้จะสำรวจปฏิสัมพันธ์ระหว่างสถานการณ์ ความคิด อารมณ์ ความรู้สึกของร่างกาย และพฤติกรรม",
			Picture: "https://i.pinimg.com/564x/8f/1a/b1/8f1ab1e2ef48c2a26de7df6e977930bd.jpg",
		},	
	}

	for _, wst := range worksheetType {
		db.Where("number_type = ?", wst.NumberType).FirstOrCreate(&wst)
	}

//======================================================================

	// funny := FeelGoodType{
	// 	Name: "มีความสุข/สนุก",
	// }
	// succeed := FeelGoodType{
	// 	Name: "ประสบความสำเร็จ",
	// }
	// db.Model(&FeelGoodType{}).Create(&funny)
	// db.Model(&FeelGoodType{}).Create(&succeed)
//======================================================================
	all := TypeOfPatient{
		Name: "ทั้งหมด",
	}
	notSpecified := TypeOfPatient{
		Name: "ที่ยังไม่ระบุ",
	}
	db.Model(&TypeOfPatient{}).Create(&all)
	db.Model(&TypeOfPatient{}).Create(&notSpecified)
//======================================================================
	// psyID := uint(1)
	patientPassword := "pat1234"
	hashedPassword1, err := bcrypt.GenerateFromPassword([]byte(patientPassword), bcrypt.DefaultCost)
	hashedPassword2, err := bcrypt.GenerateFromPassword([]byte(patientPassword), bcrypt.DefaultCost)
	hashedPassword3, err := bcrypt.GenerateFromPassword([]byte(patientPassword), bcrypt.DefaultCost)
	hashedPassword4, err := bcrypt.GenerateFromPassword([]byte(patientPassword), bcrypt.DefaultCost)
	hashedPassword5, err := bcrypt.GenerateFromPassword([]byte(patientPassword), bcrypt.DefaultCost)

	Patients := []Patient{
		{	
			Firstname: "ฐิติพร",
			Lastname: "เทียมจันทร์",
			Dob: "01-01-2003",
			GenderID: &female.ID,
			Tel: "0812345678",
			Email: "pat@gmail.com",
			Password: string(hashedPassword1),
			Picture: "",
			Symtoms: "",
			IdNumber: "1309801416574",

		},
		{
			Firstname: "อนันต์",
			Lastname: "ชัยสิทธิ์",
			Dob: "15-03-2000",
			GenderID: &male.ID,
			Tel: "0823456789",
			Email: "anan@gmail.com",
			Password: string(hashedPassword2),
			Picture: "",
			Symtoms: "",
			IdNumber: "8657411918573",
		},
		{
			Firstname: "วรัญญา",
			Lastname: "ศิริพงษ์",
			Dob: "23-07-1998",
			GenderID: &female.ID,
			Tel: "0834567890",
			Email: "waranya@gmail.com",
			Password: string(hashedPassword3),
			Picture: "",
			Symtoms: "",
			IdNumber: "1756430584726",
		},
		{
			Firstname: "ธนา",
			Lastname: "ธรรมรักษ์",
			Dob: "02-09-1995",
			GenderID: &male.ID,
			Tel: "0845678901",
			Email: "thana@gmail.com",
			Password: string(hashedPassword4),
			Picture: "",
			Symtoms: "",
			IdNumber: "1609804532765",
		},
		{
			Firstname: "พิมพ์ลดา",
			Lastname: "อัครกุล",
			Dob: "11-12-2001",
			GenderID: &lgbtq.ID,
			Tel: "0856789012",
			Email: "pimlada@gmail.com",
			Password: string(hashedPassword5),
			Picture: "",
			Symtoms: "",
			IdNumber: "1048703254873",
		},
	}
	for _, patient := range Patients {
		db.Create(&patient) 
	} 
//======================================================================
	psychologistPassword := "psy1234"
	hashedPassword6, err := bcrypt.GenerateFromPassword([]byte(psychologistPassword), bcrypt.DefaultCost)
	hashedPassword7, err := bcrypt.GenerateFromPassword([]byte(psychologistPassword), bcrypt.DefaultCost)


	Psychologists := []Psychologist{
		{	
			FirstName: "ศุภชลิตา",
			LastName: "พลนงค์",
			Tel: "0637719837",
			Email: "psy@gmail.com",
			Password: string(hashedPassword6) ,
			WorkingNumber: "1234567890123",
			IsApproved: true,
		},
		{	
			FirstName: "หมอ",
			LastName: "ปลา",
			Tel: "0638834653",
			Email: "mhopla@gmail.com",
			Password: string(hashedPassword7) ,
			WorkingNumber: "1234567890123",
			IsApproved: false,
		},
	}
	for _, psychologists := range Psychologists {
		db.Create(&psychologists) 
	} 
	
	return database, nil
	
}