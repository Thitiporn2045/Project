package controller
import(
	"net/http"
	"github.com/gin-gonic/gin"
	"github.com/n6teen/Project-Thesis/entity"
)


func CreateCrossSectional(c *gin.Context) {
    var cross entity.CrossSectional

    // Bind JSON data to cross struct
    if err := c.ShouldBindJSON(&cross); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    // ตรวจสอบว่า DiaryID ถูกส่งมาหรือไม่
    if cross.DiaryID == nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "DiaryID is missing"})
        return
    }

    // ตรวจสอบว่า Diary มีอยู่ในฐานข้อมูลหรือไม่
    var diary entity.Diary
    if err := entity.DB().First(&diary, cross.DiaryID).Error; err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Diary not found"})
        return
    }

    // ตรวจสอบ Emotion IDs
    var emotions []entity.Emotion
    if err := entity.DB().Where("id IN ?", cross.Emotion).Find(&emotions).Error; err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Some emotions not found"})
        return
    }

    // ใช้ Transaction เพื่อเพิ่ม CrossSectional และความสัมพันธ์
    tx := entity.DB().Begin()
    if err := tx.Create(&cross).Error; err != nil {
        tx.Rollback()
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    if err := tx.Model(&cross).Association("Emotions").Replace(emotions); err != nil {
        tx.Rollback()
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to associate emotions"})
        return
    }
    tx.Commit()

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
