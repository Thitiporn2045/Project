package controller

import (
	"fmt"
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
		IdNumber: patient.IdNumber,
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


	patient.TypeOfPatient.ID = patient.TypeID	//เพิ่มเพื่อให้มันสามารถอัพเดต Fk ได้

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

func ListPatientsForDashboard(c *gin.Context){ //psy
	psyID := c.Param("id")
	var results []struct {
        ID         uint   `json:"ID"`
		IdNumber  string  `json:"IdNumber" gorm:"column:id_number"` 
        FirstName   string `json:"Firstname" gorm:"column:firstname"`
    	LastName    string `json:"Lastname" gorm:"column:lastname"`
        Picture    string `json:"Picture"`
        Symtoms    string `json:"Symtoms"`
        DiaryStatus string `json:"Diary_Status"`
    }

    err := entity.DB().
        Table("patients").
        Select(`
            patients.id,
			patients.id_number,
            patients.firstname,
            patients.lastname,
            patients.picture,
            patients.symtoms,
            CASE 
                WHEN COUNT(diaries.id) > 0 AND SUM(CASE WHEN diaries.is_public = TRUE THEN 1 ELSE 0 END) > 0 THEN 'มีการแชร์'
                WHEN COUNT(diaries.id) > 0 THEN 'ไม่มีการแชร์'
                ELSE 'ไม่มีไดอารี่'
            END AS diary_status
        `).
        Joins("JOIN connection_requests ON connection_requests.pat_id = patients.id").
        Joins("LEFT JOIN diaries ON diaries.pat_id = patients.id").
        Where("connection_requests.psy_id = ? AND connection_requests.status = ?", psyID, "connected").
        Group("patients.id").
        Limit(4). // จำกัดจำนวนผู้ป่วยที่ส่งกลับ
        Find(&results).Error

    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
	fmt.Println("Results: ", results)


    c.JSON(http.StatusOK, gin.H{"data": results})

}