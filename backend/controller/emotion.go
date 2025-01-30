package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/n6teen/Project-Thesis/entity"
	"gorm.io/gorm"
)

func CreateEmotion(c *gin.Context) {
    var emotion entity.Emotion

    // ผูกข้อมูล JSON เข้ากับ struct emotion
    if err := c.ShouldBindJSON(&emotion); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    // ตรวจสอบว่าอารมณ์นี้มีชื่อเดียวกันใน PatID เดียวกันหรือยัง
    var existingEmotion entity.Emotion
    result := entity.DB().Where("name = ? AND pat_id = ?", emotion.Name, emotion.PatID).First(&existingEmotion)
    if result.Error == nil {
        // ถ้าพบอิโมจิที่ชื่อเดียวกันใน PatID เดียวกัน
        c.JSON(http.StatusConflict, gin.H{"error": "มีชื่ออิโมจินี้อยู่แล้ว"})
        return
    }

    if result.Error != gorm.ErrRecordNotFound {
        // ถ้าเกิดข้อผิดพลาดอื่นๆ ที่ไม่ใช่ record not found
        c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
        return
    }

    // บันทึกข้อมูลลงในฐานข้อมูล
    if err := entity.DB().Create(&emotion).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{"data": emotion})
}



func GetEmotionByPatientID(c *gin.Context) {
	var emotion []entity.Emotion

	patID := c.Param("id")
    if err := entity.DB().Preload("Patient").Raw("SELECT * FROM emotions WHERE pat_id = ?",patID).Find(&emotion).Error;
    err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// If no notes were found, return a message
	if len(emotion) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"message": "No notes found for this emotion"})
		return
	}

	// Return the found notes
	c.JSON(http.StatusOK, gin.H{"data": emotion})
}


func UpdateEmotionByID(c *gin.Context) {
    var emotion entity.Emotion
	var result entity.Emotion

	if err := c.ShouldBindJSON(&emotion); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if tx := entity.DB().Where("id = ?", emotion.ID).First(&result); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "user not found"})
		return
	}

	if err := entity.DB().Save(&emotion).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": emotion})
	
}

func DeleteEmotion(c *gin.Context) {
	emotionID := c.Param("id")
	if tx := entity.DB().Exec("DELETE FROM emotions WHERE id = ?", emotionID); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "data not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": emotionID})
}
