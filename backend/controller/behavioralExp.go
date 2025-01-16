package controller

import (
	"fmt"
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
		Preload("Diary").              // Preload ข้อมูลจากตาราง Diary
		Preload("Diary.Patient").      // Preload ข้อมูลจาก Patient ที่เกี่ยวข้องกับ Diary
		Preload("Diary.WorksheetType"). // Preload ข้อมูลจาก WorksheetType ที่เกี่ยวข้องกับ Diary
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


func GetDateEmotionsBehavioralExpByDiaryID(c *gin.Context) {
	// รับ DiaryID จาก Query
	diaryID := c.Query("id")

	// ตรวจสอบว่า id มีการส่งมาหรือไม่
	if diaryID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "DiaryID is required"})
		return
	}

	var emotions []struct {
		EmotionID   uint   `json:"EmotionID"`
		Name        string `json:"Name"`
		ColorCode   string `json:"ColorCode"`
		Emoticon    string `json:"Emoticon"`
		Date        string `json:"Date"` // เปลี่ยนประเภทเป็น string
	}
	
	// Query เพื่อดึงข้อมูลพร้อมแสดง emotion_id
	err := entity.DB().Model(&entity.CrossSectional{}).
		Select("emotions.id as EmotionID, emotions.name as Name, emotions.color_code as ColorCode, emotions.emoticon as Emoticon, behavioral_exps.date as Date").
		Joins("JOIN behavioral_exp_emotions ON behavioral_exps.id = behavioral_exp_emotions.cross_sectional_id").
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


func GetWeekEmotionsBehavioralExpByDiaryID(c *gin.Context) {
	// รับ DiaryID จาก Query
	diaryID := c.DefaultQuery("id", "")
	// รับ Date จาก Query
	dateParam := c.DefaultQuery("date", "")

	// ตรวจสอบว่า id มีการส่งมาหรือไม่
	if diaryID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "DiaryID is required"})
		return
	}

	// ตรวจสอบว่า date มีการส่งมาหรือไม่ (ถ้าไม่ส่งมาจะใช้วันที่ปัจจุบัน)
	var date time.Time
	var err error

	if dateParam != "" {
		// ถ้ามีการส่ง date เข้ามา, แปลงเป็น time
		date, err = time.Parse("02-01-2006", dateParam)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid date format, expected dd-mm-yyyy"})
			return
		}
	} else {
		// ถ้าไม่มีการส่ง date จะใช้วันที่ปัจจุบัน
		date = time.Now()
	}

	// Query เพื่อดึงข้อมูลอารมณ์จากฐานข้อมูล
	var emotions []struct {
		EmotionID   uint   `json:"EmotionID"`
		Name        string `json:"Name"`
		ColorCode   string `json:"ColorCode"`
		Emoticon    string `json:"Emoticon"`
		Date        string `json:"Date"`
		Count       int    `json:"Count"`
	}

	err = entity.DB().Model(&entity.CrossSectional{}).
		Select("emotions.id as EmotionID, emotions.name as Name, emotions.color_code as ColorCode, emotions.emoticon as Emoticon, behavioral_exps.date as Date").
		Joins("JOIN behavioral_exp_emotions ON behavioral_exps.id = behavioral_exp_emotions.cross_sectional_id").
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

	// Group emotions by week
	weeklyEmotions := make(map[string][]struct {
		EmotionID   uint   `json:"EmotionID"`
		Name        string `json:"Name"`
		ColorCode   string `json:"ColorCode"`
		Emoticon    string `json:"Emoticon"`
		Date        string `json:"Date"`
		Count       int    `json:"Count"`
	})

	// ดึงปีและสัปดาห์จากวันที่ที่ได้รับจาก Query หรือปัจจุบัน
	year, week := date.ISOWeek()
	weekKey := fmt.Sprintf("%d-W%02d", year, week)

	// Loop ผ่าน emotions และจัดกลุ่มตามสัปดาห์
	for _, emotion := range emotions {
		// Parse the date to time.Time
		emotionDate, err := time.Parse("02-01-2006", emotion.Date)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse emotion date", "details": err.Error()})
			return
		}

		// ตรวจสอบว่าอารมณ์นั้นอยู่ในสัปดาห์เดียวกันกับวันที่ที่ได้รับหรือไม่
		emotionYear, emotionWeek := emotionDate.ISOWeek()

		// ถ้าอารมณ์นั้นตรงกับสัปดาห์ที่ต้องการ
		if emotionYear == year && emotionWeek == week {
			// ตรวจสอบว่าในแผนที่ weeklyEmotions มี key สำหรับสัปดาห์นี้แล้วหรือยัง
			if _, exists := weeklyEmotions[weekKey]; !exists {
				weeklyEmotions[weekKey] = []struct {
					EmotionID   uint   `json:"EmotionID"`
					Name        string `json:"Name"`
					ColorCode   string `json:"ColorCode"`
					Emoticon    string `json:"Emoticon"`
					Date        string `json:"Date"`
					Count       int    `json:"Count"`
				}{}
			}

			// หาว่าอารมณ์นี้เคยปรากฏในสัปดาห์นี้แล้วหรือยัง
			found := false
			for i, e := range weeklyEmotions[weekKey] {
				if e.Emoticon == emotion.Emoticon {
					// หากพบอารมณ์ที่เหมือนกัน, เพิ่ม Count
					weeklyEmotions[weekKey][i].Count++
					found = true
					break
				}
			}

			// ถ้าไม่พบอารมณ์ที่เหมือนกัน, เพิ่มอารมณ์ใหม่
			if !found {
				weeklyEmotions[weekKey] = append(weeklyEmotions[weekKey], struct {
					EmotionID   uint   `json:"EmotionID"`
					Name        string `json:"Name"`
					ColorCode   string `json:"ColorCode"`
					Emoticon    string `json:"Emoticon"`
					Date        string `json:"Date"`
					Count       int    `json:"Count"`
				}{
					EmotionID: emotion.EmotionID,
					Name:      emotion.Name,
					ColorCode: emotion.ColorCode,
					Emoticon:  emotion.Emoticon,
					Date:      emotion.Date,
					Count:     1, // เริ่มนับที่ 1
				})
			}
		}
	}

	// ส่งข้อมูลกลับในรูป JSON
	c.JSON(http.StatusOK, gin.H{"data": weeklyEmotions})
}

func GetMonthEmotionsBehavioralExpByDiaryID(c *gin.Context) {
	// รับ DiaryID จาก Query
	diaryID := c.DefaultQuery("id", "")
	// รับ Date จาก Query
	dateParam := c.DefaultQuery("date", "")

	// ตรวจสอบว่า id มีการส่งมาหรือไม่
	if diaryID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "DiaryID is required"})
		return
	}

	// ตรวจสอบว่า date มีการส่งมาหรือไม่ (ถ้าไม่ส่งมาจะใช้วันที่ปัจจุบัน)
	var date time.Time
	var err error

	if dateParam != "" {
		// ถ้ามีการส่ง date เข้ามา, แปลงเป็น time
		date, err = time.Parse("02-01-2006", dateParam)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid date format, expected dd-mm-yyyy"})
			return
		}
	} else {
		// ถ้าไม่มีการส่ง date จะใช้วันที่ปัจจุบัน
		date = time.Now()
	}

	// Query เพื่อดึงข้อมูลอารมณ์จากฐานข้อมูล
	var emotions []struct {
		EmotionID   uint   `json:"EmotionID"`
		Name        string `json:"Name"`
		ColorCode   string `json:"ColorCode"`
		Emoticon    string `json:"Emoticon"`
		Date        string `json:"Date"`
		Count       int    `json:"Count"`
	}

	err = entity.DB().Model(&entity.CrossSectional{}).
		Select("emotions.id as EmotionID, emotions.name as Name, emotions.color_code as ColorCode, emotions.emoticon as Emoticon, behavioral_exps.date as Date").
		Joins("JOIN behavioral_exp_emotions ON behavioral_exps.id = behavioral_exp_emotions.cross_sectional_id").
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

	// Group emotions by month
	monthlyEmotions := make(map[string][]struct {
		EmotionID   uint   `json:"EmotionID"`
		Name        string `json:"Name"`
		ColorCode   string `json:"ColorCode"`
		Emoticon    string `json:"Emoticon"`
		Date        string `json:"Date"`
		Count       int    `json:"Count"`
	})

	// ดึงปีและเดือนจากวันที่ที่ได้รับจาก Query หรือปัจจุบัน
	year, month, _ := date.Date()
	monthKey := fmt.Sprintf("%d-%02d", year, month)

	// Loop ผ่าน emotions และจัดกลุ่มตามเดือน
	for _, emotion := range emotions {
		// Parse the date to time.Time
		emotionDate, err := time.Parse("02-01-2006", emotion.Date)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse emotion date", "details": err.Error()})
			return
		}

		// ตรวจสอบว่าอารมณ์นั้นอยู่ในเดือนเดียวกันกับวันที่ที่ได้รับหรือไม่
		emotionYear, emotionMonth, _ := emotionDate.Date()

		// ถ้าอารมณ์นั้นตรงกับเดือนที่ต้องการ
		if emotionYear == year && emotionMonth == month {
			// ตรวจสอบว่าในแผนที่ monthlyEmotions มี key สำหรับเดือนนี้แล้วหรือยัง
			if _, exists := monthlyEmotions[monthKey]; !exists {
				monthlyEmotions[monthKey] = []struct {
					EmotionID   uint   `json:"EmotionID"`
					Name        string `json:"Name"`
					ColorCode   string `json:"ColorCode"`
					Emoticon    string `json:"Emoticon"`
					Date        string `json:"Date"`
					Count       int    `json:"Count"`
				}{}
			}

			// หาว่าอารมณ์นี้เคยปรากฏในเดือนนี้แล้วหรือยัง
			found := false
			for i, e := range monthlyEmotions[monthKey] {
				if e.Emoticon == emotion.Emoticon {
					// หากพบอารมณ์ที่เหมือนกัน, เพิ่ม Count
					monthlyEmotions[monthKey][i].Count++
					found = true
					break
				}
			}

			// ถ้าไม่พบอารมณ์ที่เหมือนกัน, เพิ่มอารมณ์ใหม่
			if !found {
				monthlyEmotions[monthKey] = append(monthlyEmotions[monthKey], struct {
					EmotionID   uint   `json:"EmotionID"`
					Name        string `json:"Name"`
					ColorCode   string `json:"ColorCode"`
					Emoticon    string `json:"Emoticon"`
					Date        string `json:"Date"`
					Count       int    `json:"Count"`
				}{
					EmotionID: emotion.EmotionID,
					Name:      emotion.Name,
					ColorCode: emotion.ColorCode,
					Emoticon:  emotion.Emoticon,
					Date:      emotion.Date,
					Count:     1, // เริ่มนับที่ 1
				})
			}
		}
	}

	// ส่งข้อมูลกลับในรูป JSON
	c.JSON(http.StatusOK, gin.H{"data": monthlyEmotions})
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