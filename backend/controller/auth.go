package controller

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/n6teen/Project-Thesis/entity"
	service "github.com/n6teen/Project-Thesis/services"
	"golang.org/x/crypto/bcrypt"
)

type Loginpayload struct{
	Email string `json:"email"`
	Password string `json:"password"`
}

// logintoken response
type LoginResponse struct {
	Token string `json:"token"`
	ID    uint   `json:"id"`
	Email     string `json:"email"`

}

//get info form patient email and password
func LoginPatient(c *gin.Context){
	var payload Loginpayload
	var patient entity.Patient

	if error := c.ShouldBindJSON(&payload); error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": error.Error()})
		return
	}

	if err := entity.DB().Raw("SELECT * FROM patients WHERE email = ?", payload.Email).Scan(&patient).Error; err != nil {
		// Check if the error is due to no records found
		c.JSON(http.StatusBadRequest, gin.H{"error":err.Error() + "ไม่พบอีเมล"})
		return
	}

	// Check password
	err := bcrypt.CompareHashAndPassword([]byte(patient.Password), []byte(payload.Password))

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "อีเมลหรือรหัสผ่านไม่ถูกต้อง"})
		return
	}

	//format token
	jwtWrapper := service.JwtWrapper{
		SecretKey:       "SvNQpBN8y3qlVrsGAYYWoJJk56LtzFHx",
		Issuer:          "AuthService",
		ExpirationHours: 24,
	}

	signedToken, err := jwtWrapper.GenerateToken(patient.Email)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "error generating token"})
		return
	}
	tokenResponse := LoginResponse{
		Token: signedToken,
		ID:    patient.ID, 
	}
	c.JSON(http.StatusOK, gin.H{"data": tokenResponse})

}

//==============================================

func LoginPsychologist(c *gin.Context){
	var payload Loginpayload
	var psychologist entity.Psychologist

	if error := c.ShouldBindJSON(&payload); error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": error.Error()})
		return
	}

	if err := entity.DB().Raw("SELECT * FROM psychologists WHERE email = ?", payload.Email).Scan(&psychologist).Error; err != nil {
		// Check if the error is due to no records found
		c.JSON(http.StatusBadRequest, gin.H{"error":err.Error() + "ไม่พบอีเมล"})
		return
	}
	// Check if psychologist record was found
	if psychologist.ID == 0 {
   	 	c.JSON(http.StatusBadRequest, gin.H{"error": "ไม่พบอีเมลในระบบ"})
   	 	return
	}

	if !psychologist.IsApproved {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "บัญชีของคุณยังไม่ได้รับการอนุมัติจากแอดมิน โปรดรอการตรวจสอบ"})
		return
	}
	fmt.Printf("login password ",payload.Password)

	// Check password
	err := bcrypt.CompareHashAndPassword([]byte(psychologist.Password), []byte(payload.Password))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "อีเมลหรือรหัสผ่านไม่ถูกต้อง"})
		return
	}

	//format token
	jwtWrapper := service.JwtWrapper{
		SecretKey:       "SvNQpBN8y3qlVrsGAYYWoJJk56LtzFHx",
		Issuer:          "AuthService",
		ExpirationHours: 24,
	}

	signedToken, err := jwtWrapper.GenerateToken(psychologist.Email)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "error generating token"})
		return
	}
	tokenResponse := LoginResponse{
		Token: signedToken,
		ID:    psychologist.ID, 
	}
	c.JSON(http.StatusOK, gin.H{"data": tokenResponse})

}
