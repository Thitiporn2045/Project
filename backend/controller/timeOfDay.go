package controller
import(
	"net/http"
	"github.com/gin-gonic/gin"
	"github.com/n6teen/Project-Thesis/entity"
)

func ListTimeOfDays(c *gin.Context){
	var timeOfDay []entity.TimeOfDay
	if err := entity.DB().Raw("SELECT * FROM time_of_days").Scan(&timeOfDay).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": timeOfDay})
}
