package controller

import (
	"fmt"
	"net/http"
	"time"

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

// GetEmotionsByDateAndDiaryID แสดงอารมณ์แยกตามวันและนับจำนวนอารมณ์ที่ซ้ำกัน
func GetActivityDiaryEmotionsByDateTimeAndDiaryID(c *gin.Context) {
	// รับ DiaryID จาก Query
	diaryID := c.DefaultQuery("id", "")
	// รับ Date จาก Query
	dateParam := c.DefaultQuery("date", "")

	// ตรวจสอบว่า DiaryID และ Date ถูกส่งมาหรือไม่
	if diaryID == "" || dateParam == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Diary ID and Date are required"})
		return
	}

	// Query เพื่อดึงข้อมูลอารมณ์จากฐานข้อมูลและแบ่งข้อมูลตามช่วงชั่วโมง
	var emotions []struct {
		EmotionID uint   `json:"EmotionID"`
		Name      string `json:"Name"`
		ColorCode string `json:"ColorCode"`
		Emoticon  string `json:"Emoticon"`
		Date      string `json:"Date"`
		TimeRange string `json:"TimeRange"`
		Count     int    `json:"Count"`
	}

	if err := entity.DB().
		Table("activity_diaries").
		Select(`emotions.id as EmotionID, emotions.name as Name, emotions.color_code as ColorCode, emotions.emoticon as Emoticon, 
				activity_diaries.date as Date, 
				CASE 
					WHEN CAST(SUBSTR(activity_diaries.time, 1, 2) AS INT) BETWEEN 0 AND 1 THEN '00:00 - 01:00'
					WHEN CAST(SUBSTR(activity_diaries.time, 1, 2) AS INT) BETWEEN 1 AND 2 THEN '01:00 - 02:00'
					WHEN CAST(SUBSTR(activity_diaries.time, 1, 2) AS INT) BETWEEN 2 AND 3 THEN '02:00 - 03:00'
					WHEN CAST(SUBSTR(activity_diaries.time, 1, 2) AS INT) BETWEEN 3 AND 4 THEN '03:00 - 04:00'
					WHEN CAST(SUBSTR(activity_diaries.time, 1, 2) AS INT) BETWEEN 4 AND 5 THEN '04:00 - 05:00'
					WHEN CAST(SUBSTR(activity_diaries.time, 1, 2) AS INT) BETWEEN 5 AND 6 THEN '05:00 - 06:00'
					WHEN CAST(SUBSTR(activity_diaries.time, 1, 2) AS INT) BETWEEN 6 AND 7 THEN '06:00 - 07:00'
					WHEN CAST(SUBSTR(activity_diaries.time, 1, 2) AS INT) BETWEEN 7 AND 8 THEN '07:00 - 08:00'
					WHEN CAST(SUBSTR(activity_diaries.time, 1, 2) AS INT) BETWEEN 8 AND 9 THEN '08:00 - 09:00'
					WHEN CAST(SUBSTR(activity_diaries.time, 1, 2) AS INT) BETWEEN 9 AND 10 THEN '09:00 - 10:00'
					WHEN CAST(SUBSTR(activity_diaries.time, 1, 2) AS INT) BETWEEN 10 AND 11 THEN '10:00 - 11:00'
					WHEN CAST(SUBSTR(activity_diaries.time, 1, 2) AS INT) BETWEEN 11 AND 12 THEN '11:00 - 12:00'
					WHEN CAST(SUBSTR(activity_diaries.time, 1, 2) AS INT) BETWEEN 12 AND 13 THEN '12:00 - 13:00'
					WHEN CAST(SUBSTR(activity_diaries.time, 1, 2) AS INT) BETWEEN 13 AND 14 THEN '13:00 - 14:00'
					WHEN CAST(SUBSTR(activity_diaries.time, 1, 2) AS INT) BETWEEN 14 AND 15 THEN '14:00 - 15:00'
					WHEN CAST(SUBSTR(activity_diaries.time, 1, 2) AS INT) BETWEEN 15 AND 16 THEN '15:00 - 16:00'
					WHEN CAST(SUBSTR(activity_diaries.time, 1, 2) AS INT) BETWEEN 16 AND 17 THEN '16:00 - 17:00'
					WHEN CAST(SUBSTR(activity_diaries.time, 1, 2) AS INT) BETWEEN 17 AND 18 THEN '17:00 - 18:00'
					WHEN CAST(SUBSTR(activity_diaries.time, 1, 2) AS INT) BETWEEN 18 AND 19 THEN '18:00 - 19:00'
					WHEN CAST(SUBSTR(activity_diaries.time, 1, 2) AS INT) BETWEEN 19 AND 20 THEN '19:00 - 20:00'
					WHEN CAST(SUBSTR(activity_diaries.time, 1, 2) AS INT) BETWEEN 20 AND 21 THEN '20:00 - 21:00'
					WHEN CAST(SUBSTR(activity_diaries.time, 1, 2) AS INT) BETWEEN 21 AND 22 THEN '21:00 - 22:00'
					WHEN CAST(SUBSTR(activity_diaries.time, 1, 2) AS INT) BETWEEN 22 AND 23 THEN '22:00 - 23:00'
					WHEN CAST(SUBSTR(activity_diaries.time, 1, 2) AS INT) BETWEEN 23 AND 24 THEN '23:00 - 00:00'
				END as TimeRange,
				COUNT(emotions.id) as Count`).
		Joins("JOIN emotions ON activity_diaries.emotion_id = emotions.id").
		Where("activity_diaries.diary_id = ? AND activity_diaries.date = ?", diaryID, dateParam).
		Group("TimeRange, emotions.id").
		Find(&emotions).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve data"})
		return
	}

	// ส่งข้อมูลกลับในรูปแบบ JSON
	c.JSON(http.StatusOK, gin.H{"data": emotions})
}


// GetEmotionsByDateAndDiaryID แสดงอารมณ์แยกตามวันและนับจำนวนอารมณ์ที่ซ้ำกัน
func GetActivityDiaryEmotionsByDateAndDiaryID(c *gin.Context) {
	// รับ DiaryID จาก Query
	diaryID := c.DefaultQuery("id", "")
	// รับ Date จาก Query
	dateParam := c.DefaultQuery("date", "")

	// ตรวจสอบว่า DiaryID ถูกส่งมาหรือไม่
	if diaryID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Diary ID is required"})
		return
	}

	// ตรวจสอบว่า Date ถูกส่งมาหรือไม่
	if dateParam == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Date is required"})
		return
	}

	// Query เพื่อดึงข้อมูลอารมณ์จากฐานข้อมูล
	var emotions []struct {
		EmotionID uint   `json:"EmotionID"`
		Name      string `json:"Name"`
		ColorCode string `json:"ColorCode"`
		Emoticon  string `json:"Emoticon"`
		Date      string `json:"Date"`
		Count     int    `json:"Count"`
	}

	if err := entity.DB().
		Table("activity_diaries").
		Select("emotions.id as EmotionID, emotions.name as Name, emotions.color_code as ColorCode, emotions.emoticon as Emoticon, activity_diaries.date as Date, COUNT(emotions.id) as Count").
		Joins("JOIN emotions ON activity_diaries.emotion_id = emotions.id").
		Where("activity_diaries.diary_id = ? AND activity_diaries.date = ?", diaryID, dateParam).
		Group("emotions.id, activity_diaries.date").
		Find(&emotions).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve data"})
		return
	}

	// ส่งข้อมูลกลับในรูปแบบ JSON
	c.JSON(http.StatusOK, gin.H{"data": emotions})
}

func GetActivityDiaryEmotionsByWeekAndDiaryID(c *gin.Context) {
	// รับ DiaryID จาก Query
	diaryID := c.DefaultQuery("id", "")
	// รับ Date จาก Query
	dateParam := c.DefaultQuery("date", "")

	// ตรวจสอบว่า DiaryID มีการส่งมาหรือไม่
	if diaryID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "DiaryID is required"})
		return
	}

	// ตรวจสอบว่า Date มีการส่งมาหรือไม่ (ถ้าไม่ส่งมาจะใช้วันที่ปัจจุบัน)
	var inputDate time.Time
	var err error

	if dateParam != "" {
		inputDate, err = time.Parse("02-01-2006", dateParam)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid date format, expected dd-mm-yyyy"})
			return
		}
	} else {
		inputDate = time.Now()
	}

	// Query เพื่อดึงข้อมูลอารมณ์จากฐานข้อมูล
	var emotions []struct {
		EmotionID uint   `json:"EmotionID"`
		Name      string `json:"Name"`
		ColorCode string `json:"ColorCode"`
		Emoticon  string `json:"Emoticon"`
		Date      string `json:"Date"`
		Count     int    `json:"Count"`
	}

	err = entity.DB().Model(&entity.ActivityDiary{}).
		Select("emotions.id as EmotionID, emotions.name as Name, emotions.color_code as ColorCode, emotions.emoticon as Emoticon, COUNT(emotions.id) as Count, activity_diaries.date as Date").
		Joins("JOIN emotions ON activity_diaries.emotion_id = emotions.id").
		Where("activity_diaries.diary_id = ?", diaryID).
		Group("emotions.id, emotions.name, emotions.color_code, emotions.emoticon, activity_diaries.date").
		Scan(&emotions).Error

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch data", "details": err.Error()})
		return
	}

	if len(emotions) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"message": "No emotions found for the given DiaryID"})
		return
	}

	// Group emotions by week
	weeklyEmotions := make(map[string][]struct {
		EmotionID uint   `json:"EmotionID"`
		Name      string `json:"Name"`
		ColorCode string `json:"ColorCode"`
		Emoticon  string `json:"Emoticon"`
		Date      string `json:"Date"`
		Count     int    `json:"Count"`
	})

	year, week := inputDate.ISOWeek()
	weekKey := fmt.Sprintf("%d-W%02d", year, week)

	for _, emotion := range emotions {
		emotionDate, err := time.Parse("02-01-2006", emotion.Date)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse emotion date", "details": err.Error()})
			return
		}

		emotionYear, emotionWeek := emotionDate.ISOWeek()
		if emotionYear == year && emotionWeek == week {
			weeklyEmotions[weekKey] = append(weeklyEmotions[weekKey], emotion)
		}
	}

	c.JSON(http.StatusOK, gin.H{"data": weeklyEmotions})
}

func GetWeeklyActivityDiarEmotionsByDiaryID(c *gin.Context) {
	// รับ DiaryID จาก Query
	diaryID := c.DefaultQuery("id", "")
	// รับ Date จาก Query
	dateParam := c.DefaultQuery("date", "")

	// ตรวจสอบว่า DiaryID มีการส่งมาหรือไม่
	if diaryID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "DiaryID is required"})
		return
	}

	// ตรวจสอบว่า Date มีการส่งมาหรือไม่ (ถ้าไม่ส่งมาจะใช้วันที่ปัจจุบัน)
	var inputDate time.Time
	var err error

	if dateParam != "" {
		// ถ้ามีการส่ง Date เข้ามา, แปลงเป็น time
		inputDate, err = time.Parse("02-01-2006", dateParam)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid date format, expected dd-mm-yyyy"})
			return
		}
	} else {
		// ถ้าไม่มีการส่ง Date จะใช้วันที่ปัจจุบัน
		inputDate = time.Now()
	}

	// คำนวณวันแรกและวันสุดท้ายของสัปดาห์
	year, week := inputDate.ISOWeek()
	// ย้อนกลับไปวันจันทร์ของสัปดาห์
	startOfWeek := firstDayOfISOWeek(year, week)
	// วันอาทิตย์ของสัปดาห์
	endOfWeek := startOfWeek.AddDate(0, 0, 6)

	// แปลงวันที่เริ่มต้นและสิ้นสุดเป็นรูปแบบ dd-mm-yyyy
	startDate := startOfWeek.Format("02-01-2006")
	endDate := endOfWeek.Format("02-01-2006")

	// Query เพื่อดึงข้อมูลอารมณ์จากฐานข้อมูล
	var emotions []struct {
		EmotionID uint   `json:"EmotionID"`
		Name      string `json:"Name"`
		ColorCode string `json:"ColorCode"`
		Emoticon  string `json:"Emoticon"`
		Count     int    `json:"Count"`
	}

	// สร้าง query
	result := entity.DB().
		Table("activity_diaries").
		Select(`
			emotions.id as EmotionID,
			emotions.name as Name,
			emotions.color_code as ColorCode,
			emotions.emoticon as Emoticon,
			COUNT(emotions.id) as Count
		`).
		Joins("JOIN emotions ON activity_diaries.emotion_id = emotions.id").
		Where(`
			activity_diaries.diary_id = ? AND
			activity_diaries.date >= ? AND activity_diaries.date <= ?
		`, 
			diaryID, 
			startDate,
			endDate,
		).
		Group("emotions.id") // Remove grouping by date, group only by emotion

	if err := result.Find(&emotions).Error; err != nil {
		// Log the error for debugging
		fmt.Printf("Database error: %v\n", err)
		// Log the generated SQL query
		fmt.Printf("Generated SQL: %v\n", result.Statement.SQL.String())
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to retrieve data",
			"details": err.Error(),
		})
		return
	}

	// หากไม่พบข้อมูล
	if len(emotions) == 0 {
		c.JSON(http.StatusNotFound, gin.H{
			"message": "No emotions found for the given DiaryID in this week",
			"week_info": gin.H{
				"start_date": startDate,
				"end_date":   endDate,
			},
		})
		return
	}

	weekKey := fmt.Sprintf("%d-W%02d", year, week)
	
	// Group emotions by week
	weeklyEmotions := make(map[string][]struct {
		EmotionID uint   `json:"EmotionID"`
		Name      string `json:"Name"`
		ColorCode string `json:"ColorCode"`
		Emoticon  string `json:"Emoticon"`
		Count     int    `json:"Count"`
	})

	weeklyEmotions[weekKey] = emotions

	// ส่งข้อมูลกลับในรูปแบบ JSON
	c.JSON(http.StatusOK, gin.H{
		"data": weeklyEmotions,
		"week_info": gin.H{
			"start_date": startDate,
			"end_date":   endDate,
		},
	})
}

// ฟังก์ชันสำหรับหาวันแรกของสัปดาห์ (วันจันทร์) จาก year และ week number
func firstDayOfISOWeek(year int, week int) time.Time {
	// วันที่ 1 มกราคมของปีที่กำหนด
	date := time.Date(year, 0, 1, 0, 0, 0, 0, time.UTC)
	
	// ปรับให้เป็นวันจันทร์แรกของปี
	isoYear, _ := date.ISOWeek()
	if isoYear < year {
		date = date.AddDate(0, 0, 7-int(date.Weekday()))
	} else if date.Weekday() != time.Monday {
		date = date.AddDate(0, 0, -int(date.Weekday())+1)
	}
	
	// เพิ่มจำนวนสัปดาห์ตามที่ต้องการ
	date = date.AddDate(0, 0, (week-1)*7)
	
	return date
}

func GetMonthlyActivityDiarEmotionsByDiaryID(c *gin.Context) {
    	// รับ DiaryID จาก Query
	diaryID := c.DefaultQuery("id", "")
	// รับ Date จาก Query
	dateParam := c.DefaultQuery("date", "")

	// ตรวจสอบว่า DiaryID มีการส่งมาหรือไม่
	if diaryID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "DiaryID is required"})
		return
	}

	// ตรวจสอบว่า Date มีการส่งมาหรือไม่ (ถ้าไม่ส่งมาจะใช้วันที่ปัจจุบัน)
	var inputDate time.Time
	var err error

	if dateParam != "" {
		inputDate, err = time.Parse("02-01-2006", dateParam)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid date format, expected dd-mm-yyyy"})
			return
		}
	} else {
		inputDate = time.Now()
	}

	// Query เพื่อดึงข้อมูลอารมณ์จากฐานข้อมูล
	var emotions []struct {
		EmotionID uint   `json:"EmotionID"`
		Name      string `json:"Name"`
		ColorCode string `json:"ColorCode"`
		Emoticon  string `json:"Emoticon"`
		Date      string `json:"Date"`
		Count     int    `json:"Count"`
	}

	err = entity.DB().Model(&entity.ActivityDiary{}).
		Select("emotions.id as EmotionID, emotions.name as Name, emotions.color_code as ColorCode, emotions.emoticon as Emoticon, COUNT(emotions.id) as Count, activity_diaries.date as Date").
		Joins("JOIN emotions ON activity_diaries.emotion_id = emotions.id").
		Where("activity_diaries.diary_id = ?", diaryID).
		Group("emotions.id, emotions.name, emotions.color_code, emotions.emoticon, activity_diaries.date").
		Scan(&emotions).Error

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch data", "details": err.Error()})
		return
	}

	if len(emotions) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"message": "No emotions found for the given DiaryID"})
		return
	}

	// Group emotions by month
	monthlyEmotions := make(map[string][]struct {
		EmotionID uint   `json:"EmotionID"`
		Name      string `json:"Name"`
		ColorCode string `json:"ColorCode"`
		Emoticon  string `json:"Emoticon"`
		Date      string `json:"Date"`
		Count     int    `json:"Count"`
	})

	monthKey := inputDate.Format("2006-01") // ใช้รูปแบบ เดือน-ปี

	for _, emotion := range emotions {
		emotionDate, err := time.Parse("02-01-2006", emotion.Date)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse emotion date", "details": err.Error()})
			return
		}

		emotionMonthKey := emotionDate.Format("2006-01")
		if emotionMonthKey == monthKey {
			monthlyEmotions[emotionMonthKey] = append(monthlyEmotions[emotionMonthKey], emotion)
		}
	}

	c.JSON(http.StatusOK, gin.H{"data": monthlyEmotions})
}

func GetAllActivityDiarEmotionsByDiaryID(c *gin.Context) {
    // รับ DiaryID จาก Query
    diaryID := c.DefaultQuery("id", "")

    // ตรวจสอบว่า DiaryID มีการส่งมาหรือไม่
    if diaryID == "" {
        c.JSON(http.StatusBadRequest, gin.H{"error": "DiaryID is required"})
        return
    }

    // Query เพื่อดึงข้อมูลอารมณ์จากฐานข้อมูล
    var emotions []struct {
        EmotionID uint   `json:"EmotionID"`
        Name      string `json:"Name"`
        ColorCode string `json:"ColorCode"`
        Emoticon  string `json:"Emoticon"`
        Count     int    `json:"Count"`
    }

    // สร้าง query
    result := entity.DB().
        Table("activity_diaries").
        Select(`
            emotions.id as EmotionID,
            emotions.name as Name,
            emotions.color_code as ColorCode,
            emotions.emoticon as Emoticon,
            COUNT(emotions.id) as Count
        `).
        Joins("JOIN emotions ON activity_diaries.emotion_id = emotions.id").
        Where("activity_diaries.diary_id = ?", diaryID).
        Group("emotions.id")

    if err := result.Find(&emotions).Error; err != nil {
        // Log the error for debugging
        fmt.Printf("Database error: %v\n", err)
        // Log the generated SQL query
        fmt.Printf("Generated SQL: %v\n", result.Statement.SQL.String())
        c.JSON(http.StatusInternalServerError, gin.H{
            "error": "Failed to retrieve data",
            "details": err.Error(),
        })
        return
    }

    // หากไม่พบข้อมูล
    if len(emotions) == 0 {
        c.JSON(http.StatusNotFound, gin.H{
            "message": "No emotions found for the given DiaryID",
        })
        return
    }

    // ส่งข้อมูลกลับในรูปแบบ JSON
    c.JSON(http.StatusOK, gin.H{
        "data": emotions,
    })
}
