package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/n6teen/Project-Thesis/entity"
)

func CreateActivityDiary(c *gin.Context) {
    var input struct {
        Date      string `json:"Date"`
        Time      string `json:"Time"`
        Activity  string `json:"Activity"`
        DiaryID   uint   `json:"DiaryID"`
        EmotionID uint   `json:"EmotionID"`
    }

    // ตรวจสอบว่า JSON ถูกต้องหรือไม่
    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    // ตรวจสอบว่า EmotionID มีอยู่ในฐานข้อมูลหรือไม่
    var emotion entity.Emotion
    if err := entity.DB().First(&emotion, input.EmotionID).Error; err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Emotion not found"})
        return
    }

    // สร้าง ActivityDiary
    activity := entity.ActivityDiary{
        Date:      input.Date,
        Time:      input.Time,
        Activity:  input.Activity,
        DiaryID:   &input.DiaryID,
        EmotionID: &input.EmotionID,
    }

    // บันทึกข้อมูลในฐานข้อมูล
    if err := entity.DB().Create(&activity).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    // ตอบกลับผลลัพธ์
    c.JSON(http.StatusOK, gin.H{"data": activity})
}


func GetActivityDiaryByDiaryID(c *gin.Context) {
    var activity []entity.ActivityDiary // เก็บข้อมูล CrossSectional หลายแถว

    // ดึงค่า DiaryID จาก Query Parameter
    diaryID := c.Query("id")
    if diaryID == "" {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Diary ID is required"})
        return
    }

    // ดึงข้อมูลทั้งหมดในตาราง CrossSectional ที่มี diary_id ตรงกัน
    if err := entity.DB().
        Preload("Emotion").
        Where("diary_id = ?", diaryID).
        Find(&activity).Error; err != nil { // Find ใช้สำหรับดึงข้อมูลหลายแถว
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve data"})
        return
    }

    // ส่งข้อมูลกลับในรูปแบบ JSON
    c.JSON(http.StatusOK, gin.H{"data": activity})
}

// ฟังก์ชันแก้ไขข้อมูล ActivityDiary
func UpdateActivityDiary(c *gin.Context) {
    var input struct {
        ID        uint   `json:"ID"`        // ID ของ ActivityDiary ที่ต้องการแก้ไข
        Date      string `json:"Date"`
        Time      string `json:"Time"`
        Activity  string `json:"Activity"`
        EmotionID uint   `json:"EmotionID"`
    }

    // ตรวจสอบว่า JSON ถูกต้องหรือไม่
    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    // ค้นหากิจกรรมที่ต้องการแก้ไขจากฐานข้อมูล
    var activity entity.ActivityDiary
    if err := entity.DB().First(&activity, input.ID).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "ActivityDiary not found"})
        return
    }

    // ตรวจสอบว่า EmotionID มีอยู่ในฐานข้อมูลหรือไม่
    var emotion entity.Emotion
    if err := entity.DB().First(&emotion, input.EmotionID).Error; err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Emotion not found"})
        return
    }

    // อัปเดตข้อมูล ActivityDiary ด้วยข้อมูลใหม่
    activity.Date = input.Date
    activity.Time = input.Time
    activity.Activity = input.Activity
    activity.EmotionID = &input.EmotionID

    // บันทึกการอัปเดตในฐานข้อมูล
    if err := entity.DB().Save(&activity).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    // ตอบกลับผลลัพธ์
    c.JSON(http.StatusOK, gin.H{"data": activity})
}

// func GetEmotionsByDiaryID(c *gin.Context) {
// 	// รับ DiaryID จาก Query
// 	diaryID := c.Query("id")

// 	// ตรวจสอบว่า id มีการส่งมาหรือไม่
// 	if diaryID == "" {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "DiaryID is required"})
// 		return
// 	}

// 	var emotions []struct {
// 		EmotionID   uint   `json:"emotion_id"`
// 		EmotionName string `json:"emotion_name"`
// 		ColorCode   string `json:"color_code"`
// 	}

// 	// Query เพื่อดึงข้อมูล
// 	err := entity.DB().Model(&entity.CrossSectional{}).
// 		Select("emotions.id as emotion_id, emotions.name as emotion_name, emotions.color_code").
// 		Joins("JOIN cross_sectional_emotions ON cross_sectionals.id = cross_sectional_emotions.cross_sectional_id").
// 		Joins("JOIN emotions ON emotions.id = cross_sectional_emotions.emotion_id").
// 		Where("cross_sectionals.diary_id = ?", diaryID).
// 		Scan(&emotions).Error

// 	if err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch data", "details": err.Error()})
// 		return
// 	}

// 	// หากไม่พบข้อมูล
// 	if len(emotions) == 0 {
// 		c.JSON(http.StatusNotFound, gin.H{"message": "No emotions found for the given DiaryID"})
// 		return
// 	}

// 	// ส่งข้อมูลกลับในรูป JSON
// 	c.JSON(http.StatusOK, gin.H{"data": emotions})
// }

// func GetEmotionsHaveDateByDiaryID(c *gin.Context) {
// 	// รับ DiaryID และ Date จาก Query
// 	diaryID := c.DefaultQuery("id", "")  // Default เป็น "" หากไม่มีการส่ง id
// 	date := c.DefaultQuery("date", "")   // Default เป็น "" หากไม่มีการส่ง date

// 	// ตรวจสอบว่า diaryID และ date มีการส่งมาหรือไม่
// 	if diaryID == "" {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "DiaryID is required"})
// 		return
// 	}

// 	if date == "" {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "Date is required"})
// 		return
// 	}

// 	var emotions []struct {
// 		EmotionID   uint   `json:"emotion_id"`
// 		EmotionName string `json:"emotion_name"`
// 		ColorCode   string `json:"color_code"`
// 		Emoticon    string `json:"emoticon"` // เพิ่มฟิลด์ Emoticon
// 		Date        string `json:"date"`
// 	}

// 	// Query เพื่อดึงข้อมูลตาม diaryID และ date
//     err := entity.DB().Model(&entity.CrossSectional{}).
//         Select("emotions.id as emotion_id, emotions.name as emotion_name, emotions.color_code, emotions.emoticon, cross_sectionals.date as date").
//         Joins("JOIN cross_sectional_emotions ON cross_sectionals.id = cross_sectional_emotions.cross_sectional_id").
//         Joins("JOIN emotions ON emotions.id = cross_sectional_emotions.emotion_id").
//         Where("cross_sectionals.diary_id = ?", diaryID).
//         Where("cross_sectionals.date = ?", date).
//     Scan(&emotions).Error

// 	if err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch data", "details": err.Error()})
// 		return
// 	}

// 	// หากไม่พบข้อมูล
// 	if len(emotions) == 0 {
// 		c.JSON(http.StatusNotFound, gin.H{"message": "No emotions found for the given DiaryID and Date"})
// 		return
// 	}

// 	// ส่งข้อมูลกลับในรูป JSON
// 	c.JSON(http.StatusOK, gin.H{"data": emotions})
// }

// func UpdateCrossSectional(c *gin.Context) {
// 	var input struct {
// 		ID              uint     `json:"id"`
// 		Situation       string   `json:"Situation"`
// 		Thought         string   `json:"Thought"`
// 		Behavior        string   `json:"Behavior"`
// 		BodilySensation string   `json:"BodilySensation"`
// 		TextEmotions    string   `json:"TextEmotions"`
// 		EmotionIDs      []uint   `json:"EmotionIDs"`
// 	}

// 	// รับ JSON จากผู้ใช้
// 	if err := c.ShouldBindJSON(&input); err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 		return
// 	}

// 	// ดึงข้อมูล CrossSectional จากฐานข้อมูล
// 	var cross entity.CrossSectional
// 	if err := entity.DB().Preload("Emotion").First(&cross, input.ID).Error; err != nil {
// 		c.JSON(http.StatusNotFound, gin.H{"error": "CrossSectional not found"})
// 		return
// 	}

// 	// ตรวจสอบว่าสามารถอัปเดตได้เฉพาะในวันที่เขียนไดอารี่
// 	currentDate := time.Now().Format("02-01-2006") // วันที่ปัจจุบันในฟอร์แมตเดียวกับฟิลด์ Date
// 	if cross.Date != currentDate {
// 		c.JSON(http.StatusForbidden, gin.H{"error": "You can only edit entries on the same day as the diary entry"})
// 		return
// 	}

// 	// เริ่มต้น Transaction
// 	tx := entity.DB().Begin()

// 	// อัปเดตฟิลด์ข้อมูลใน CrossSectional
// 	cross.Situation = input.Situation
// 	cross.Thought = input.Thought
// 	cross.Behavior = input.Behavior
// 	cross.BodilySensation = input.BodilySensation
// 	cross.TextEmotions = input.TextEmotions

// 	// ดึงข้อมูล Emotion ที่เกี่ยวข้องกับ EmotionIDs
// 	var emotions []entity.Emotion
// 	if err := tx.Where("id IN ?", input.EmotionIDs).Find(&emotions).Error; err != nil {
// 		tx.Rollback()
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to find emotions", "details": err.Error()})
// 		return
// 	}

// 	// ลบความสัมพันธ์เดิมในตารางกลาง
// 	if err := tx.Model(&cross).Association("Emotion").Clear(); err != nil {
// 		tx.Rollback()
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to clear old relationships", "details": err.Error()})
// 		return
// 	}

// 	// เพิ่มความสัมพันธ์ใหม่ในตารางกลาง
// 	if err := tx.Model(&cross).Association("Emotion").Append(emotions); err != nil {
// 		tx.Rollback()
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to append new relationships", "details": err.Error()})
// 		return
// 	}

// 	// บันทึกการเปลี่ยนแปลงใน CrossSectional
// 	if err := tx.Save(&cross).Error; err != nil {
// 		tx.Rollback()
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save cross-sectional data", "details": err.Error()})
// 		return
// 	}

// 	// ยืนยัน Transaction
// 	tx.Commit()

// 	// ดึงข้อมูลใหม่เพื่อตรวจสอบผลลัพธ์
// 	if err := entity.DB().Preload("Emotion").First(&cross, input.ID).Error; err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to reload data", "details": err.Error()})
// 		return
// 	}

// 	c.JSON(http.StatusOK, gin.H{"data": cross})
// }