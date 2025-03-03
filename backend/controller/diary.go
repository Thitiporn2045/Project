package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/n6teen/Project-Thesis/entity"
)


func ListPublicDiariesByPatientType(c *gin.Context) { //psy
    psyID := c.Param("id")
    var diaries []entity.Diary

    // Query diaries with related patient and worksheet types
    err := entity.DB().
        Preload("Patient").
        Preload("Patient.TypeOfPatient").
        Preload("Patient.Gender").
        Preload("WorksheetType").
        Table("diaries").
        Select("diaries.*").
        Joins("JOIN patients ON patients.id = diaries.pat_id").
        Joins("JOIN connection_requests ON connection_requests.pat_id = patients.id").
        Where("connection_requests.psy_id = ? AND connection_requests.status = ? AND diaries.is_public = ?", psyID, "connected", true).
        Find(&diaries).Error

    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    // Group diaries by patient
    groupedDiaries := make(map[uint]map[string]interface{})
    for _, diary := range diaries {
        patientID := diary.Patient.ID
        if _, exists := groupedDiaries[patientID]; !exists {
            // Initialize the map for a new patient
            groupedDiaries[patientID] = map[string]interface{}{
                "patient": map[string]interface{}{
                    "ID":            diary.Patient.ID,
                    "IdNumber":      diary.Patient.IdNumber,
                    "FirstName":     diary.Patient.Firstname,
                    "LastName":      diary.Patient.Lastname,
                    "TypeID":        diary.Patient.TypeID,
                    "TypeOfPatient": diary.Patient.TypeOfPatient.Name,
                    "Gender":        diary.Patient.Gender.Gender,
                },
                "diaries": []map[string]interface{}{},
            }
        }
        // Append the diary to the patient's diary list
        diaryData := map[string]interface{}{
            "ID":           diary.ID,
            "Name":         diary.Name,
            "Picture":      diary.Picture,
            "IsPublic":     diary.IsPublic,
            "WorksheetType": diary.WorksheetType.Name,
        }
        groupedDiaries[patientID]["diaries"] = append(groupedDiaries[patientID]["diaries"].([]map[string]interface{}), diaryData)
    }

    // Convert grouped data to a slice for JSON response
    var result []map[string]interface{}
    for _, data := range groupedDiaries {
        result = append(result, data)
    }

    c.JSON(http.StatusOK, gin.H{"data": result})
}

func ListPublicDiariesByPatientId(c *gin.Context){ //psy
    patID := c.Param("id")
    var diaries []entity.Diary

    if err := entity.DB().Preload("Patient").Preload("WorksheetType").Raw("SELECT * FROM diaries WHERE pat_id = ? AND is_public = ?",patID,true).Find(&diaries).Error;
    err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

    c.JSON(http.StatusOK, gin.H{"data": diaries})


}

func CreateDiaryPat(c *gin.Context) {
	var diaries entity.Diary

	// Bind JSON data to notePat struct
	if err := c.ShouldBindJSON(&diaries); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Save notePat into the database
	if err := entity.DB().Create(&diaries).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": diaries})
}


func GetDiaryByPatientID(c *gin.Context) {
	var diaries []entity.Diary

	patID := c.Param("id")
    if err := entity.DB().Preload("Patient").Preload("Patient.Gender").Preload("WorksheetType").Raw("SELECT * FROM diaries WHERE pat_id = ?",patID).Find(&diaries).Error;
    err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// If no notes were found, return a message
	if len(diaries) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"message": "No diaries found for this patient"})
		return
	}

	// Return the found notes
	c.JSON(http.StatusOK, gin.H{"data": diaries})
}

func GetDiaryByDiaryID(c *gin.Context) {
    var diary entity.Diary

    // ดึงค่า ID จาก Query Parameter
    diaryID := c.Query("id")
    if diaryID == "" {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Diary ID is required"})
        return
    }

    // ใช้คำสั่ง SQL ในการดึงข้อมูลเฉพาะ Diary ที่มี ID ตรงกัน
    if err := entity.DB().Preload("Patient").Preload("Patient.Gender").Preload("WorksheetType").Raw("SELECT * FROM diaries WHERE id = ?", diaryID).First(&diary).Error; err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    // Return the found diary
    c.JSON(http.StatusOK, gin.H{"data": diary})
}


func UpdateDiaryPat(c *gin.Context) {
	var diaries entity.Diary
	var result entity.Diary

	if err := c.ShouldBindJSON(&diaries); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if tx := entity.DB().Where("id = ?", diaries.ID).First(&result); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "user not found"})
		return
	}

	if err := entity.DB().Save(&diaries).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": diaries})
	
}

func ToggleDiaryIsPublic(c *gin.Context) {
    var diary entity.Diary

    // ดึง ID ของ Diary จากพารามิเตอร์
    diaryID := c.Param("id")

    // ค้นหา Diary โดยใช้ ID
    if err := entity.DB().Where("id = ?", diaryID).First(&diary).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Diary not found"})
        return
    }

    // สลับค่าของ IsPublic
    diary.IsPublic = !diary.IsPublic

    // บันทึกการเปลี่ยนแปลงลงในฐานข้อมูล
    if err := entity.DB().Save(&diary).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    // ส่งคืนข้อมูลที่อัปเดต
    c.JSON(http.StatusOK, gin.H{"data": diary})
}


func DeleteDiary(c *gin.Context) {
    diaries := c.Param("id") 
    if tx := entity.DB().Exec("DELETE FROM diaries WHERE id = ?", diaries); tx.RowsAffected == 0 {
        c.JSON(http.StatusBadRequest, gin.H{"error": "data not found"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"data": diaries})
}

func CountDiariesByWorksheetType(c *gin.Context) {
	var results []struct {
		WorksheetTypeID uint  `json:"worksheet_type_id"`
		Count           int64 `json:"count"`
	}

	// ใช้ GROUP BY เพื่อรวม Diary ตาม WorksheetTypeID และนับจำนวน
	if err := entity.DB().
		Table("diaries").
		Select("worksheet_type_id, COUNT(*) as count").
		Where("worksheet_type_id IS NOT NULL").
		Group("worksheet_type_id").
		Find(&results).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, results)
}

func CountDiariesByWorksheetTypeAndPatID(c *gin.Context) {
	var results []struct {
		WorksheetTypeID uint  `json:"worksheet_type_id"`
		Count           int64 `json:"count"`
	}

	// รับค่า patID จาก URL query หรือ params
    patID := c.Param("id")
	// หรือถ้าส่งมาเป็น query string ใช้ c.Query("patID")

	if patID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "patID is required"})
		return
	}

	// ใช้ GROUP BY เพื่อรวม Diary ตาม WorksheetTypeID และนับจำนวน โดยกรองตาม patID
	if err := entity.DB().
		Table("diaries").
		Select("worksheet_type_id, COUNT(*) as count").
		Where("worksheet_type_id IS NOT NULL AND pat_id = ?", patID).
		Group("worksheet_type_id").
		Find(&results).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, results)
}

func GetNotPrivateDiaryCount(c *gin.Context) {
	patID := c.Param("id") // รับ patID จากพารามิเตอร์ URL
	if patID == "" {
		c.String(http.StatusBadRequest, "0") // ถ้าไม่มี patID ให้ส่ง 0 กลับไป
		return
	}

	var count int64

	// นับจำนวน diaries ที่ is_public = 0 สำหรับ patID นี้
	err := entity.DB().
		Table("diaries").
		Where("is_public = ? AND pat_id = ?", 1, patID).
		Count(&count).Error

	if err != nil {
		c.String(http.StatusInternalServerError, "0") // ถ้ามี error ให้ส่ง 0 กลับไป
		return
	}

	c.String(http.StatusOK, "%d", count) // ส่งตัวเลข count กลับไปเป็น response
}
