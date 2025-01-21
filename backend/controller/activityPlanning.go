package controller

import (
	"fmt"
	"net/http"
	"time"

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

func GetPlanningEmotionsByDateTimeAndDiaryID(c *gin.Context) {
	// รับ DiaryID และ Date จาก Query
	diaryID := c.DefaultQuery("id", "")
	dateParam := c.DefaultQuery("date", "")

	// ตรวจสอบว่า DiaryID และ Date ถูกส่งมาหรือไม่
	if diaryID == "" || dateParam == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Diary ID and Date are required"})
		return
	}

	// Query เพื่อดึงข้อมูลอารมณ์จากฐานข้อมูลและแบ่งข้อมูลตามช่วงชั่วโมง
	type EmotionSummary struct {
		EmotionID      uint   `json:"EmotionID"`
		Name           string `json:"Name"`
		ColorCode      string `json:"ColorCode"`
		Emoticon       string `json:"Emoticon"`
		TimeOfDay      string `json:"TimeOfDay"`
		Count          int    `json:"Count"`
	}

	var emotions []EmotionSummary

	err := entity.DB().Model(&entity.ActivityPlanning{}).
		Select("emotions.id AS EmotionID, emotions.name AS Name, emotions.color_code AS ColorCode, COALESCE(emotions.emoticon, 'No Emoji') AS Emoticon, time_of_days.name AS TimeOfDay, COUNT(*) AS Count").
		Joins("LEFT JOIN emotions ON activity_plannings.emotion_id = emotions.id").
		Joins("JOIN time_of_days ON activity_plannings.time_of_day_id = time_of_days.id").
		Where("activity_plannings.diary_id = ? AND activity_plannings.date = ?", diaryID, dateParam).
		Group("emotions.id, time_of_days.name").
		Scan(&emotions).Error

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch emotions"})
		return
	}

	// Create a map to group emotions by TimeOfDay
	groupedEmotions := make(map[string][]EmotionSummary)

	for _, emotion := range emotions {
		// Group by TimeOfDay
		groupedEmotions[emotion.TimeOfDay] = append(groupedEmotions[emotion.TimeOfDay], emotion)
	}

	// Prepare final response
	var result []struct {
		TimeOfDay  string            `json:"TimeOfDay"`
		Emotions   []EmotionSummary `json:"Emotions"`
	}

	// Loop through the grouped emotions and format them
	for timeOfDay, emotionsGroup := range groupedEmotions {
		result = append(result, struct {
			TimeOfDay  string            `json:"TimeOfDay"`
			Emotions   []EmotionSummary `json:"Emotions"`
		}{
			TimeOfDay: timeOfDay,
			Emotions:  emotionsGroup,
		})
	}

	// ส่งข้อมูลกลับในรูปแบบ JSON
	c.JSON(http.StatusOK, gin.H{"data": result})
}

func GetPlanningEmotionsByDateAndDiaryID(c *gin.Context) {
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

	// เปลี่ยนจากการนับ emotions.id เป็นการนับ activity_plannings.id หรือ emotion.id
	if err := entity.DB().
		Table("activity_plannings").
		Select("emotions.id as EmotionID, emotions.name as Name, emotions.color_code as ColorCode, COALESCE(emotions.emoticon, 'No Emoji') as Emoticon, activity_plannings.date as Date, COUNT(activity_plannings.id) as Count").
		Joins("LEFT JOIN emotions ON activity_plannings.emotion_id = emotions.id").
		Where("activity_plannings.diary_id = ? AND activity_plannings.date = ?", diaryID, dateParam).
		Group("emotions.id, activity_plannings.date").
		Find(&emotions).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve data"})
		return
	}

	// ส่งข้อมูลกลับในรูปแบบ JSON
	c.JSON(http.StatusOK, gin.H{"data": emotions})
}

func GetPlanningEmotionsByWeekAndDiaryID(c *gin.Context) {
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

	// เปลี่ยนจากการ JOIN เป็น LEFT JOIN และใช้ COALESCE สำหรับอิโมจิที่ไม่มี
	err = entity.DB().Model(&entity.ActivityPlanning{}).
		Select("emotions.id as EmotionID, emotions.name as Name, emotions.color_code as ColorCode, COALESCE(emotions.emoticon, 'No Emoji') as Emoticon, COUNT(activity_plannings.id) as Count, activity_plannings.date as Date").
		Joins("LEFT JOIN emotions ON activity_plannings.emotion_id = emotions.id").
		Where("activity_plannings.diary_id = ?", diaryID).
		Group("emotions.id, emotions.name, emotions.color_code, emotions.emoticon, activity_plannings.date").
		Scan(&emotions).Error

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch data", "details": err.Error()})
		return
	}

	if len(emotions) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"message": "No emotions found for the given DiaryID"})
		return
	}

	// Group emotions by week (ไม่แยกตามวัน)
	weeklyEmotions := make(map[string][]struct {
		EmotionID uint   `json:"EmotionID"`
		Name      string `json:"Name"`
		ColorCode string `json:"ColorCode"`
		Emoticon  string `json:"Emoticon"`
		Count     int    `json:"Count"`
	})

	year, week := inputDate.ISOWeek()
	weekKey := fmt.Sprintf("%d-W%02d", year, week)

	// รวมข้อมูลอิโมจิทั้งหมดในสัปดาห์เดียวกัน
	for _, emotion := range emotions {
		// ใช้การแปลงวันที่ให้อยู่ในรูปแบบเดียวกัน (เดือน/วัน/ปี)
		emotionDate, err := time.Parse("02-01-2006", emotion.Date)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse emotion date", "details": err.Error()})
			return
		}

		// ตรวจสอบว่าอารมณ์เกิดในปีและสัปดาห์เดียวกัน
		emotionYear, emotionWeek := emotionDate.ISOWeek()
		if emotionYear == year && emotionWeek == week {
			// รวมอิโมจิในสัปดาห์เดียวกัน
			found := false
			for i, existingEmotion := range weeklyEmotions[weekKey] {
				if existingEmotion.Emoticon == emotion.Emoticon {
					// ถ้ามีอิโมจินี้แล้วเพิ่ม Count
					weeklyEmotions[weekKey][i].Count++
					found = true
					break
				}
			}

			// ถ้าไม่พบอิโมจิที่เหมือนกัน ให้เพิ่มเข้าไปใหม่
			if !found {
				weeklyEmotions[weekKey] = append(weeklyEmotions[weekKey], struct {
					EmotionID uint   `json:"EmotionID"`
					Name      string `json:"Name"`
					ColorCode string `json:"ColorCode"`
					Emoticon  string `json:"Emoticon"`
					Count     int    `json:"Count"`
				}{
					EmotionID: emotion.EmotionID,
					Name:      emotion.Name,
					ColorCode: emotion.ColorCode,
					Emoticon:  emotion.Emoticon,
					Count:     1, // เริ่มนับจาก 1
				})
			}
		}
	}

	c.JSON(http.StatusOK, gin.H{"data": weeklyEmotions})
}
func GetPlanningEmotionsByMonthAndDiaryID(c *gin.Context) {
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

	// เปลี่ยนจากการ JOIN เป็น LEFT JOIN และใช้ COALESCE สำหรับอิโมจิที่ไม่มี
	err = entity.DB().Model(&entity.ActivityPlanning{}).
		Select("emotions.id as EmotionID, emotions.name as Name, emotions.color_code as ColorCode, COALESCE(emotions.emoticon, 'No Emoji') as Emoticon, COUNT(activity_plannings.id) as Count, activity_plannings.date as Date").
		Joins("LEFT JOIN emotions ON activity_plannings.emotion_id = emotions.id").
		Where("activity_plannings.diary_id = ?", diaryID).
		Group("emotions.id, emotions.name, emotions.color_code, emotions.emoticon, activity_plannings.date").
		Scan(&emotions).Error

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch data", "details": err.Error()})
		return
	}

	if len(emotions) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"message": "No emotions found for the given DiaryID"})
		return
	}

	// Group emotions by month (ไม่แยกตามวัน)
	monthlyEmotions := make(map[string][]struct {
		EmotionID uint   `json:"EmotionID"`
		Name      string `json:"Name"`
		ColorCode string `json:"ColorCode"`
		Emoticon  string `json:"Emoticon"`
		Count     int    `json:"Count"`
	})

	// Get the year and month from the input date
	year, month, _ := inputDate.Date()
	monthKey := fmt.Sprintf("%d-%02d", year, month)

	// รวมอารมณ์ทั้งหมดในเดือนเดียวกัน
	for _, emotion := range emotions {
		emotionDate, err := time.Parse("02-01-2006", emotion.Date)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse emotion date", "details": err.Error()})
			return
		}

		// ตรวจสอบว่าอารมณ์เกิดในปีและเดือนเดียวกัน
		emotionYear, emotionMonth, _ := emotionDate.Date()
		if emotionYear == year && emotionMonth == month {
			// รวมอิโมจิในเดือนเดียวกัน
			found := false
			for i, existingEmotion := range monthlyEmotions[monthKey] {
				if existingEmotion.Emoticon == emotion.Emoticon {
					// ถ้ามีอิโมจินี้แล้วเพิ่ม Count
					monthlyEmotions[monthKey][i].Count++
					found = true
					break
				}
			}

			// ถ้าไม่พบอิโมจิที่เหมือนกัน ให้เพิ่มเข้าไปใหม่
			if !found {
				monthlyEmotions[monthKey] = append(monthlyEmotions[monthKey], struct {
					EmotionID uint   `json:"EmotionID"`
					Name      string `json:"Name"`
					ColorCode string `json:"ColorCode"`
					Emoticon  string `json:"Emoticon"`
					Count     int    `json:"Count"`
				}{
					EmotionID: emotion.EmotionID,
					Name:      emotion.Name,
					ColorCode: emotion.ColorCode,
					Emoticon:  emotion.Emoticon,
					Count:     1, // เริ่มนับจาก 1
				})
			}
		}
	}
	c.JSON(http.StatusOK, gin.H{"data": monthlyEmotions})
}

func GetAllPlanningEmotionsByDiaryID(c *gin.Context) {
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
        Table("activity_plannings").
        Select(`
            emotions.id as EmotionID,
            emotions.name as Name,
            emotions.color_code as ColorCode,
            emotions.emoticon as Emoticon,
            COUNT(emotions.id) as Count
        `).
        Joins("JOIN emotions ON activity_plannings.emotion_id = emotions.id").
        Where("activity_plannings.diary_id = ?", diaryID).
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
//=============== Psy ===========================================================================
func GetActivityPlanningByDiaryIDForPsy(c *gin.Context) {
    var planning []entity.ActivityPlanning

    diaryID := c.Param("id")
    if diaryID == "" {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Diary ID is required"})
        return
    }

    if err := entity.DB().
        Preload("TimeOfDay").
        Preload("Emotion").  
        Where("diary_id = ?", diaryID).
        Find(&planning).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    if len(planning) == 0 {
        c.JSON(http.StatusNotFound, gin.H{"error": "No planning found for the given Diary ID"})
        return
    }

    result := make(map[string][]map[string]string)
    for _, p := range planning {
        timeOfDay := p.TimeOfDay.Name // เช่น "เช้า", "กลางวัน", "เย็น"

        // เพิ่มข้อมูลกิจกรรมในรูปแบบ JSON
        entry := map[string]string{
            "Date":     p.Date, 
            "Time":     p.Time,     
            "Activity": p.Activity,                
            "Emotion":  p.Emotion.Name, 
            "Emoticon": p.Emotion.Emoticon,
            "ColorCode": p.Emotion.ColorCode,
            "TimeOfDayEmoticon": p.TimeOfDay.Emoticon,
            "TimeOfDayName": p.TimeOfDay.Name,

        }

        // เพิ่ม entry ไปในกลุ่มของ timeOfDay
        result[timeOfDay] = append(result[timeOfDay], entry)
    }

    // ส่งข้อมูลกลับในรูปแบบ JSON
    c.JSON(http.StatusOK, result)
}
