package controller

import(
	"net/http"
	"github.com/gin-gonic/gin"
	"github.com/n6teen/Project-Thesis/entity"
	"golang.org/x/crypto/bcrypt"
)

func CreatePsychologist(c *gin.Context){
	var psychologist entity.Psychologist

	if err := c.ShouldBindJSON(&psychologist); err != nil{
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	
		return
	}

	hashPassword, err := bcrypt.GenerateFromPassword([]byte(psychologist.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "error hash password"})
		return
	}
	a := entity.Psychologist{
		FirstName: psychologist.FirstName,
		LastName: psychologist.LastName,
		Tel: psychologist.Tel,
		Email: psychologist.Email,
		Password: psychologist.Password,
		WorkingNumber: psychologist.WorkingNumber,
		CertificateFile: psychologist.CertificateFile,
		IsApproved: false,
	}

	a.Password = string(hashPassword)
	if err := entity.DB().Create(&a).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": a})	

}

func GetPsychologist(c *gin.Context){
	var psychologist entity.Psychologist

	id := c.Param("id")
	if err := entity.DB().Raw("SELECT * FROM psychologists WHERE id = ?", id).Scan(&psychologist).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"data": psychologist})
}

func ListPsychologists(c *gin.Context) {

	var psychologists []entity.Psychologist
	if err := entity.DB().Raw("SELECT * FROM psychologists").Scan(&psychologists).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	
	}
	
	c.JSON(http.StatusOK, gin.H{"data": psychologists})	
}

func DeletePsychologist(c *gin.Context) {

	id := c.Param("id")
	
	if tx := entity.DB().Exec("DELETE FROM psychologists WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "psychologist not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": id})	
}


func UpdatePsychologist(c *gin.Context) {

	var psychologist entity.Psychologist
	
	if err := c.ShouldBindJSON(&psychologist); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if tx := entity.DB().Where("id = ?", psychologist.ID).First(&psychologist); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "psychologist not found"})
		return
	}
	if err := entity.DB().Save(&psychologist).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"data": psychologist})
	
}
