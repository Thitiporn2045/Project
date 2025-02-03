package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/n6teen/Project-Thesis/entity"
)


func ListTypeofPatient (c *gin.Context) {
	var typeOfpatient []entity.TypeOfPatient

	psyID := c.Param("id")
	if err := entity.DB().Preload("Psychologist").Raw("SELECT * FROM type_of_patients where psy_id IS NULL OR psy_id = ?", psyID).Find(&typeOfpatient).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	
	}

	c.JSON(http.StatusOK, gin.H{"data": typeOfpatient})	

}

func CreateTypeofPatient (c *gin.Context) {

	var typeOfPatient entity.TypeOfPatient
	if err := c.ShouldBindJSON(&typeOfPatient); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

	if err := entity.DB().Create(&typeOfPatient).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "เกิดข้อผิดพลาด"})
        return
    }
    c.JSON(http.StatusOK, gin.H{"data": "เพิ่มหมวดหมู่สำเร็จ!"})
}

func DeleteTypeOfPatient(c *gin.Context) {
    id := c.Param("id")

    // Start a transaction to ensure both the update and delete happen atomically
    tx := entity.DB().Begin()
    if tx.Error != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Transaction failed to start"})
        return
    }

    // Update patients who have this type_id to NULL
    if err := tx.Exec("UPDATE patients SET type_id = NULL WHERE type_id = ?", id).Error; err != nil {
        tx.Rollback()
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update patients"})
        return
    }

    // Delete the type_of_patient
    if tx.Exec("DELETE FROM type_of_patients WHERE id = ?", id).RowsAffected == 0 {
        tx.Rollback()
        c.JSON(http.StatusBadRequest, gin.H{"error": "Type not found"})
        return
    }

    // Commit the transaction if everything is successful
    tx.Commit()

    c.JSON(http.StatusOK, gin.H{"data": id})
}


func UpdateTypeOfPatient (c *gin.Context) {
	var typeOfPatient entity.TypeOfPatient
	var result entity.TypeOfPatient

	if err := c.ShouldBindJSON(&typeOfPatient); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if tx := entity.DB().Where("id = ?", typeOfPatient.ID).First(&result); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "type not found"})
		return
	}
	if err := entity.DB().Save(&typeOfPatient).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"data": typeOfPatient})


}

//======== show pat data by type======

func ListConnectedPatientByType(c *gin.Context) {
	psyID := c.Param("id")
	var patients []entity.Patient

	err := entity.DB().Preload("TypeOfPatient").Preload("Gender").Preload("ConnectionRequest").
	Table("patients").
	Select(`patients.*`).
	Joins("LEFT JOIN type_of_patients ON type_of_patients.id = patients.type_id").
	Joins("JOIN connection_requests ON connection_requests.pat_id = patients.id").
	Where("connection_requests.psy_id = ? AND connection_requests.status = ?", psyID, "connected").
	Find(&patients).Error

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": patients})
}