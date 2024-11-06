package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/n6teen/Project-Thesis/entity"
)

// func ListPublicDiariesByPatientType(c *gin.Context) {
//     psyID := c.Param("id")
//     var diaries []entity.Diary

//     err := entity.DB().
// 		Preload("Patient").
//         Preload("Patient.TypeOfPatient").
//         Preload("Patient.Gender").
// 		Preload("WorksheetType").
//         Table("diaries").
//         Select("diaries.*").
//         Joins("JOIN patients ON patients.id = diaries.pat_id").
//         Joins("JOIN connection_requests ON connection_requests.pat_id = patients.id").
//         Where("connection_requests.psy_id = ? AND connection_requests.status = ? AND diaries.is_public = ?" , psyID, "connected", true).
//         Find(&diaries).Error

//     if err != nil {
//         c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
//         return
//     }

//     c.JSON(http.StatusOK, gin.H{"data": diaries})
// }

func ListPublicDiariesByPatientType(c *gin.Context) {
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
