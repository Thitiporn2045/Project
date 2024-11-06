package controller
import(
	"net/http"
	"github.com/gin-gonic/gin"
	"github.com/n6teen/Project-Thesis/entity"
)

func CreateNotePat(c *gin.Context) {
	var notePat entity.NotePat

	// Bind JSON data to notePat struct
	if err := c.ShouldBindJSON(&notePat); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Save notePat into the database
	if err := entity.DB().Create(&notePat).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": notePat})
}

func GetNotesByPatientID(c *gin.Context) {
	var notePat []entity.NotePat

	patID := c.Param("id")
    if err := entity.DB().Preload("Patient").Raw("SELECT * FROM note_pats WHERE pat_id = ?",patID).Find(&notePat).Error;
    err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// If no notes were found, return a message
	if len(notePat) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"message": "No notes found for this patient"})
		return
	}

	// Return the found notes
	c.JSON(http.StatusOK, gin.H{"data": notePat})
}


func UpdateNotePatient(c *gin.Context) {
	var notePat entity.NotePat
	var result entity.NotePat

	if err := c.ShouldBindJSON(&notePat); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if tx := entity.DB().Where("id = ?", notePat.ID).First(&result); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "user not found"})
		return
	}


	if err := entity.DB().Save(&notePat).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"data": notePat})
	
}



func DeleteNotePat(c *gin.Context) {
	noteID := c.Param("id")
	if tx := entity.DB().Exec("DELETE FROM note_pats WHERE id = ?", noteID); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "data not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": noteID})
}
