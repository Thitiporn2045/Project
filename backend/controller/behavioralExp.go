package controller

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/n6teen/Project-Thesis/entity"
)


func CreateBehavioralExp(c *gin.Context) {
    // var behavioral entity.BehavioralExp
    var input struct {
        ThoughtToTest       string   `json:"ThoughtToTest"`
        Experiment          string   `json:"Experiment"`
        Outcome        	    string   `json:"Outcome"`
        NewThought          string   `json:"NewThought"`
        Date                string   `json:"Date"`
        DiaryID             uint     `json:"DiaryID"`
        EmotionIDs          []uint   `json:"EmotionID"` 
    }

    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    var emotions []entity.Emotion
    if err := entity.DB().Where("id IN ?", input.EmotionIDs).Find(&emotions).Error; err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Some emotions not found"})
        return
    }

    behavioral := entity.BehavioralExp{
        ThoughtToTest:       input.ThoughtToTest,
        Experiment:          input.Experiment,
        Outcome:             input.Outcome,
        NewThought:          input.NewThought,
        Date:                input.Date,
        DiaryID:             &input.DiaryID,
        Emotion:             emotions, 
    }

    if err := entity.DB().Create(&behavioral).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{"data": behavioral})
}

func GetBehavioralExpByDiaryID(c *gin.Context) {
    var behavioral []entity.BehavioralExp // เก็บข้อมูล BehavioralExp หลายแถว

    // ดึงค่า DiaryID จาก Query Parameter
    diaryID := c.Query("id")
    if diaryID == "" {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Diary ID is required"})
        return
    }

    // ดึงข้อมูลทั้งหมดในตาราง BehavioralExp ที่มี diary_id ตรงกัน
    if err := entity.DB().
        Where("diary_id = ?", diaryID).
        Find(&behavioral).Error; err != nil { // Find ใช้สำหรับดึงข้อมูลหลายแถว
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve data"})
        return
    }

    // ส่งข้อมูลกลับในรูปแบบ JSON
    c.JSON(http.StatusOK, gin.H{"data": behavioral})
}

func GetEmotionsBehavioralExpByDiaryID(c *gin.Context) {
	// รับ DiaryID จาก Query
	diaryID := c.Query("id")

	// ตรวจสอบว่า id มีการส่งมาหรือไม่
	if diaryID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "DiaryID is required"})
		return
	}

	var emotions []struct {
		EmotionID   uint   `json:"emotion_id"`
		EmotionName string `json:"emotion_name"`
		ColorCode   string `json:"color_code"`
	}

	// Query เพื่อดึงข้อมูล
	err := entity.DB().Model(&entity.BehavioralExp{}).
	Select("emotions.id as emotion_id, emotions.name as emotion_name, emotions.color_code").
	Joins("JOIN behavioral_exp_emotions ON behavioral_exps.id = behavioral_exp_emotions.behavioral_exps_id").
	Joins("JOIN emotions ON emotions.id = behavioral_exp_emotions.emotion_id").
	Where("behavioral_exps.diary_id = ?", diaryID).
	Scan(&emotions).Error


	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch data", "details": err.Error()})
		return
	}

	// หากไม่พบข้อมูล
	if len(emotions) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"message": "No emotions found for the given DiaryID"})
		return
	}

	// ส่งข้อมูลกลับในรูป JSON
	c.JSON(http.StatusOK, gin.H{"data": emotions})
}

func GetEmotionsBehavioralExpHaveDateByDiaryID(c *gin.Context) {
	diaryID := c.DefaultQuery("id", "")
	date := c.DefaultQuery("date", "")

	if diaryID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "DiaryID is required"})
		return
	}

	if date == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Date is required"})
		return
	}

	var emotions []struct {
		EmotionID   uint   `json:"emotion_id"`
		EmotionName string `json:"emotion_name"`
		ColorCode   string `json:"color_code"`
		Emoticon    string `json:"emoticon"`
		Date        string `json:"date"`
	}

	err := entity.DB().Model(&entity.BehavioralExp{}).
		Select("emotions.id as emotion_id, emotions.name as emotion_name, emotions.color_code, emotions.emoticon, behavioral_exps.date as date").
		Joins("JOIN behavioral_exp_emotions ON behavioral_exps.id = behavioral_exp_emotions.behavioral_exp_id").
		Joins("JOIN emotions ON emotions.id = behavioral_exp_emotions.emotion_id").
		Where("behavioral_exps.diary_id = ?", diaryID).
		Where("behavioral_exps.date = ?", date).
    Scan(&emotions).Error

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch data", "details": err.Error()})
		return
	}

	if len(emotions) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"message": "No emotions found for the given DiaryID and Date"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": emotions})
}

func UpdateBehavioralExp(c *gin.Context) {
	var input struct {
		ID                  uint     `json:"id"`
		ThoughtToTest       string   `json:"ThoughtToTest"`
        Experiment          string   `json:"Experiment"`
        Outcome        	    string   `json:"Outcome"`
        NewThought          string   `json:"NewThought"`
        EmotionIDs          []uint   `json:"EmotionIDs"` 
	}

	// รับ JSON จากผู้ใช้
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// ดึงข้อมูล BehavioralExp จากฐานข้อมูล
	var behavioral entity.BehavioralExp
	if err := entity.DB().Preload("Emotion").First(&behavioral, input.ID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "BehavioralExp not found"})
		return
	}

	// ตรวจสอบว่าสามารถอัปเดตได้เฉพาะในวันที่เขียนไดอารี่
	currentDate := time.Now().Format("02-01-2006") // วันที่ปัจจุบันในฟอร์แมตเดียวกับฟิลด์ Date
	if behavioral.Date != currentDate {
		c.JSON(http.StatusForbidden, gin.H{"error": "You can only edit entries on the same day as the diary entry"})
		return
	}

	// เริ่มต้น Transaction
	tx := entity.DB().Begin()

	// อัปเดตฟิลด์ข้อมูลใน BehavioralExp
	behavioral.ThoughtToTest = input.ThoughtToTest
	behavioral.Experiment = input.Experiment
	behavioral.Outcome = input.Outcome
	behavioral.NewThought = input.NewThought

	// ดึงข้อมูล Emotion ที่เกี่ยวข้องกับ EmotionIDs
	var emotions []entity.Emotion
	if err := tx.Where("id IN ?", input.EmotionIDs).Find(&emotions).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to find emotions", "details": err.Error()})
		return
	}

	// ลบความสัมพันธ์เดิมในตารางกลาง
	if err := tx.Model(&behavioral).Association("Emotion").Clear(); err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to clear old relationships", "details": err.Error()})
		return
	}

	// เพิ่มความสัมพันธ์ใหม่ในตารางกลาง
	if err := tx.Model(&behavioral).Association("Emotion").Append(emotions); err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to append new relationships", "details": err.Error()})
		return
	}

	// บันทึกการเปลี่ยนแปลงใน BehavioralExp
	if err := tx.Save(&behavioral).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save behavioral-sectional data", "details": err.Error()})
		return
	}

	// ยืนยัน Transaction
	tx.Commit()

	// ดึงข้อมูลใหม่เพื่อตรวจสอบผลลัพธ์
	if err := entity.DB().Preload("Emotion").First(&behavioral, input.ID).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to reload data", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": behavioral})
}