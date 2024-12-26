package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/n6teen/Project-Thesis/entity"
)

func CreateActivityPlanning(c *gin.Context) {
    var input struct {
        Date      		string 		`json:"Date"`
        Time      		string 		`json:"Time"`
        Activity  		string 		`json:"Activity"`
        TimeOfDayID 	uint 		`json:"TimeOfDayID"`
        DiaryID   		uint   		`json:"DiaryID"`
        EmotionID 		uint   		`json:"EmotionID"`
    }

    // ตรวจสอบว่า JSON ถูกต้องหรือไม่
    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    var timeOfDay entity.TimeOfDay
    if err := entity.DB().First(&timeOfDay, input.TimeOfDayID).Error; err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "TimeOfDay not found"}) // แก้ไขตรงนี้
        return
    }

    // สร้าง ActivityPlanning
    planning := entity.ActivityPlanning{
        Date:      input.Date,
        Time:      input.Time,
        Activity:  input.Activity,
        TimeOfDayID: &input.TimeOfDayID,  
        DiaryID:   &input.DiaryID,        
        EmotionID: &input.EmotionID,   
    }

    // บันทึกข้อมูลในฐานข้อมูล
    if err := entity.DB().Create(&planning).Error; err != nil { // ใช้ planning แทน activity
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    // ตอบกลับผลลัพธ์
    c.JSON(http.StatusOK, gin.H{"data": planning})
}


func GetActivityPlanningByDiaryID(c *gin.Context) {
    var planning []entity.ActivityPlanning // เก็บข้อมูล CrossSectional หลายแถว

    // ดึงค่า DiaryID จาก Query Parameter
    diaryID := c.Query("id")
    if diaryID == "" {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Diary ID is required"})
        return
    }

    // ดึงข้อมูลทั้งหมดในตาราง CrossSectional ที่มี diary_id ตรงกัน
    if err := entity.DB().
		Preload("TimeOfDay").
        Preload("Emotion").
        Where("diary_id = ?", diaryID).
        Find(&planning).Error; err != nil { // Find ใช้สำหรับดึงข้อมูลหลายแถว
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve data"})
        return
    }

    // ส่งข้อมูลกลับในรูปแบบ JSON
    c.JSON(http.StatusOK, gin.H{"data": planning})
}

// ฟังก์ชันแก้ไขข้อมูล ActivityDiary
func UpdateActivityPlanning(c *gin.Context) {
    var input struct {
        ID        uint   `json:"ID"`        // ID ของ ActivityDiary ที่ต้องการแก้ไข
        Date      		string 		`json:"Date"`
        Time      		string 		`json:"Time"`
        Activity  		string 		`json:"Activity"`
        TimeOfDayID 	uint 		`json:"TimeOfDayID"`
        DiaryID   		uint   		`json:"DiaryID"`
        EmotionID 		uint   		`json:"EmotionID"`
    }

    // ตรวจสอบว่า JSON ถูกต้องหรือไม่
    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    // ค้นหากิจกรรมที่ต้องการแก้ไขจากฐานข้อมูล
    var planning entity.ActivityPlanning // เก็บข้อมูล CrossSectional หลายแถว
    if err := entity.DB().First(&planning, input.ID).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "ActivityDiary not found"})
        return
    }

    var timeOfDay entity.TimeOfDay
    if err := entity.DB().First(&timeOfDay, input.TimeOfDayID).Error; err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "TimeOfDay not found"}) // แก้ไขตรงนี้
        return
    }

    // อัปเดตข้อมูล ActivityDiary ด้วยข้อมูลใหม่
    planning.Date = input.Date
    planning.Time = input.Time
    planning.Activity = input.Activity
    planning.EmotionID = &input.EmotionID
    planning.TimeOfDayID = &input.TimeOfDayID
	

    // บันทึกการอัปเดตในฐานข้อมูล
    if err := entity.DB().Save(&planning).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    // ตอบกลับผลลัพธ์
    c.JSON(http.StatusOK, gin.H{"data": planning})
}
