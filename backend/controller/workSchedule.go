package controller
import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/n6teen/Project-Thesis/entity"
)

func CreateWorkSchedule(c *gin.Context){
	var workSchedule entity.WorkSchedule

	if err := c.ShouldBindJSON(&workSchedule); err != nil{
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	
		return
	}
	if err := entity.DB().Create(&workSchedule).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": workSchedule})
}

func ListWorkSchedule(c *gin.Context) {

	var workSchedule []entity.WorkSchedule
	var psyID = c.Param("id")
	date := c.Query("date")
	if err := entity.DB().Raw("SELECT * FROM work_schedules WHERE psy_id = ? AND date = ?", psyID,date).Scan(&workSchedule).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	
	}
	
	c.JSON(http.StatusOK, gin.H{"data": workSchedule})	
}

func DeleteWorkschedule(c *gin.Context) {
	id := c.Param("id")

	if tx := entity.DB().Exec("DELETE FROM work_schedules WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "work schedule not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": id})	
}

