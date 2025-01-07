package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/n6teen/Project-Thesis/entity"
)


func CreateCrossSectional(c *gin.Context) {
    // var cross entity.CrossSectional
    var input struct {
        Situation       string   `json:"Situation"`
        Thought         string   `json:"Thought"`
        Behavior        string   `json:"Behavior"`
        BodilySensation string   `json:"BodilySensation"`
        TextEmotions    string    `json:"TextEmotions"`
        Date            string   `json:"Date"`
        DiaryID         uint     `json:"DiaryID"`
        EmotionIDs      []uint   `json:"EmotionID"` 
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

    cross := entity.CrossSectional{
        Situation:       input.Situation,
        Thought:         input.Thought,
        Behavior:        input.Behavior,
        BodilySensation: input.BodilySensation,
        TextEmotions:    input.TextEmotions,
        Date:            input.Date,
        DiaryID:         &input.DiaryID,
        Emotion:         emotions, 
    }

    if err := entity.DB().Create(&cross).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{"data": cross})
}

func GetCrossSectionalByDiaryID(c *gin.Context) {
    var crosses []entity.CrossSectional // เก็บข้อมูล CrossSectional หลายแถว

    // ดึงค่า DiaryID จาก Query Parameter
    diaryID := c.Query("id")
    if diaryID == "" {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Diary ID is required"})
        return
    }

    // ดึงข้อมูลทั้งหมดในตาราง CrossSectional ที่มี diary_id ตรงกัน
    if err := entity.DB().
        Where("diary_id = ?", diaryID).
        Find(&crosses).Error; err != nil { // Find ใช้สำหรับดึงข้อมูลหลายแถว
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve data"})
        return
    }

    // ส่งข้อมูลกลับในรูปแบบ JSON
    c.JSON(http.StatusOK, gin.H{"data": crosses})
}

func GetEmotionsByDiaryID(c *gin.Context) {
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
	err := entity.DB().Model(&entity.CrossSectional{}).
		Select("emotions.id as emotion_id, emotions.name as emotion_name, emotions.color_code").
		Joins("JOIN cross_sectional_emotions ON cross_sectionals.id = cross_sectional_emotions.cross_sectional_id").
		Joins("JOIN emotions ON emotions.id = cross_sectional_emotions.emotion_id").
		Where("cross_sectionals.diary_id = ?", diaryID).
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

func GetEmotionsHaveDateByDiaryID(c *gin.Context) {
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
		// เพิ่มฟิลด์วันที่ที่ต้องการดึง
		Date        string `json:"date"` // หรือใช้ประเภทวันที่ที่เหมาะสม เช่น time.Time
	}

	// Query เพื่อดึงข้อมูล
	err := entity.DB().Model(&entity.CrossSectional{}).
		Select("emotions.id as emotion_id, emotions.name as emotion_name, emotions.color_code, cross_sectionals.date as date").
		Joins("JOIN cross_sectional_emotions ON cross_sectionals.id = cross_sectional_emotions.cross_sectional_id").
		Joins("JOIN emotions ON emotions.id = cross_sectional_emotions.emotion_id").
		Where("cross_sectionals.diary_id = ?", diaryID).
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


func UpdateCrossSectional(c *gin.Context) {
    var input struct {
        ID              uint     `json:"id"`
        Situation       string   `json:"Situation"`
        Thought         string   `json:"Thought"`
        Behavior        string   `json:"Behavior"`
        BodilySensation string   `json:"BodilySensation"`
        TextEmotions    string   `json:"TextEmotions"`
        EmotionIDs      []uint   `json:"EmotionID"`
    }

    // รับ JSON จากผู้ใช้
    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    // ตรวจสอบว่า ID มีอยู่ในฐานข้อมูลหรือไม่
    var cross entity.CrossSectional
    if err := entity.DB().First(&cross, input.ID).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "CrossSectional not found"})
        return
    }

    // อัปเดตข้อมูลใน CrossSectional
    cross.Situation = input.Situation
    cross.Thought = input.Thought
    cross.Behavior = input.Behavior
    cross.BodilySensation = input.BodilySensation
    cross.TextEmotions = input.TextEmotions

    // ดึงข้อมูล Emotion ใหม่
    var emotions []entity.Emotion
    if err := entity.DB().Where("id IN ?", input.EmotionIDs).Find(&emotions).Error; err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Some emotions not found"})
        return
    }
    cross.Emotion = emotions

    // บันทึกการเปลี่ยนแปลง
    if err := entity.DB().Save(&cross).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{"data": cross})
}



//========================[Psychologist]==============================================
func GetCrossSectionalByDiaryIDForPsy(c *gin.Context) {
	var diary entity.Diary

	diaryID := c.Param("id")

	if err := entity.DB().
		Preload("Patient").
		Preload("Patient.Gender").
		Preload("CrossSectional.Emotion").       
		Preload("CrossSectional").             
		Where("id = ?", diaryID).             
		First(&diary).Error; err != nil {    
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	response := gin.H{
		"ID":       diary.ID,
		"Name":     diary.Name,
		"IsPublic": diary.IsPublic,
		"Start":    diary.Start,
		"End":      diary.End,
		"Patient": gin.H{
			"ID":   diary.Patient.ID,
			"Firstname": diary.Patient.Firstname,
			"Lastname": diary.Patient.Lastname,
			"gender": diary.Patient.Gender.Gender,
			"Picture": diary.Patient.Picture,
			"Dob": diary.Patient.Dob,
			"Tel": diary.Patient.Tel,
			"Email": diary.Patient.Email,
			"Symtoms": diary.Patient.Symtoms,
			"IdNumber": diary.Patient.IdNumber,
		},
		"CrossSectionals": func() []gin.H {
			crossSectionals := []gin.H{}
			for _, cs := range diary.CrossSectional {
				emotions := []gin.H{}
				for _, emotion := range cs.Emotion {
					emotions = append(emotions, gin.H{
						"ID":        emotion.ID,
						"Name":      emotion.Name,
						"Emoticon":  emotion.Emoticon,
						"ColorCode": emotion.ColorCode,
					})
				}
				crossSectionals = append(crossSectionals, gin.H{
					"ID":              cs.ID,
					"Situation":       cs.Situation,
					"Thought":         cs.Thought,
					"Behavior":        cs.Behavior,
					"BodilySensation": cs.BodilySensation,
					"TextEmotion":     cs.TextEmotions,
					"Date":            cs.Date,
					"Emotions":        emotions,
				})
			}
			return crossSectionals
		}(),
	}

	c.JSON(http.StatusOK, gin.H{"data": response})
}

