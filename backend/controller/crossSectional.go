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



// func GetEmotionByPatientID(c *gin.Context) {
// 	var emotion []entity.Emotion

// 	patID := c.Param("id")
//     if err := entity.DB().Preload("Patient").Raw("SELECT * FROM emotions WHERE pat_id = ?",patID).Find(&emotion).Error;
//     err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 		return
// 	}

// 	// If no notes were found, return a message
// 	if len(emotion) == 0 {
// 		c.JSON(http.StatusNotFound, gin.H{"message": "No notes found for this emotion"})
// 		return
// 	}

// 	// Return the found notes
// 	c.JSON(http.StatusOK, gin.H{"data": emotion})
// }


// func UpdateEmotionByID(c *gin.Context) {
//     var emotion entity.Emotion
// 	var result entity.Emotion

// 	if err := c.ShouldBindJSON(&emotion); err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 		return
// 	}
// 	if tx := entity.DB().Where("id = ?", emotion.ID).First(&result); tx.RowsAffected == 0 {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "user not found"})
// 		return
// 	}

// 	if err := entity.DB().Save(&emotion).Error; err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 		return
// 	}

// 	c.JSON(http.StatusOK, gin.H{"data": emotion})
	
// }

// func DeleteEmotion(c *gin.Context) {
// 	emotionID := c.Param("id")
// 	if tx := entity.DB().Exec("DELETE FROM emotions WHERE id = ?", emotionID); tx.RowsAffected == 0 {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "data not found"})
// 		return
// 	}

// 	c.JSON(http.StatusOK, gin.H{"data": emotionID})
// }
