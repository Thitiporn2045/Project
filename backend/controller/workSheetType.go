package controller
import(
	"net/http"
	"github.com/gin-gonic/gin"
	"github.com/n6teen/Project-Thesis/entity"
)

func ListWorkSheetType(c *gin.Context){
	var workSchedule []entity.WorksheetType
	if err := entity.DB().Raw("SELECT * FROM worksheet_types").Scan(&workSchedule).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": workSchedule})
}
