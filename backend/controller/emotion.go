package controller
import(
	"net/http"
	"github.com/gin-gonic/gin"
	"github.com/n6teen/Project-Thesis/entity"
)

func CreateEmotion(c *gin.Context) {
    var emotion entity.Emotion

    // Bind JSON data to emotion struct
    if err := c.ShouldBindJSON(&emotion); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
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
