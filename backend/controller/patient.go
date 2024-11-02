package controller

import(
	"net/http"
	"github.com/gin-gonic/gin"
	"github.com/n6teen/Project-Thesis/entity"
	"golang.org/x/crypto/bcrypt"

)

func CreatePatient(c *gin.Context) {

	var patient entity.Patient
	var patientGender entity.Gender

	if err := c.ShouldBindJSON(&patient); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	
		return
	}
	
	//hashpassword
	hashPassword, err := bcrypt.GenerateFromPassword([]byte(patient.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "error hash password"})
		return
	}
	a := entity.Patient{
		Firstname: patient.Firstname,
		Lastname: patient.Lastname,
		Dob: patient.Dob,
		GenderID: patient.GenderID,
		Gender: patientGender,
		Tel: patient.Tel,
		Password: patient.Password,
		Email: patient.Email,
		Picture: patient.Picture,
		IsTakeMedicine: patient.IsTakeMedicine,
	}
	// บันทึก
	a.Password = string(hashPassword)
	if err := entity.DB().Create(&a).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": a})	
} 


func GetPatient(c *gin.Context) {

	var patient entity.Patient
	id := c.Param("id")
	if err := entity.DB().Preload("Gender").Preload("TypeOfPatient").Raw("SELECT * FROM patients WHERE id = ?", id).Find(&patient).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"data": patient})	
}


func ListPatients(c *gin.Context) {

	var patients []entity.Patient
	if err := entity.DB().Preload("Gender").Preload("TypeOfPatient").Raw("SELECT * FROM patients").Find(&patients).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	
	}
	
	c.JSON(http.StatusOK, gin.H{"data": patients})	
}


func DeletePatient(c *gin.Context) {

	id := c.Param("id")
	
	if tx := entity.DB().Exec("DELETE FROM patients WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "patient not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": id})	
}


func UpdatePatient(c *gin.Context) {

	var patient entity.Patient
	var result entity.Patient

	
	if err := c.ShouldBindJSON(&patient); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if tx := entity.DB().Where("id = ?", patient.ID).First(&result); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "user not found"})
		return
	}
	if err := entity.DB().Save(&patient).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"data": patient})
	
}

func CheckOldPasswordPatient(c *gin.Context){
	var patient entity.Patient
	var result entity.Patient

	if err := c.ShouldBindJSON(&patient); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if tx := entity.DB().Where("id = ?", patient.ID).First(&result); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "psychologist not found"})
		return
	}
	
	err := bcrypt.CompareHashAndPassword([]byte(result.Password), []byte(patient.Password))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "รหัสผ่านเดิมไม่ถูกต้อง"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": patient})
}

func UpdatePasswordPatient(c *gin.Context) {

	var patient entity.Patient
	var result entity.Patient

	if err := c.ShouldBindJSON(&patient); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if tx := entity.DB().Where("id = ?", patient.ID).First(&result); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "patient not found"})
		return
	}
	if patient.Password != "" {
        hashedPassword, err := bcrypt.GenerateFromPassword([]byte(patient.Password), bcrypt.DefaultCost)
        if err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to hash password"})
            return
        }
        patient.Password = string(hashedPassword)
    }
	if err := entity.DB().Save(&patient).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"data": patient})
}