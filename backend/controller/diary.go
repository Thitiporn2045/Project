package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/n6teen/Project-Thesis/entity"
)

func ListPublicDiariesByPatientType(c *gin.Context) {
    psyID := c.Param("id")
    var diaries []entity.Diary

    err := entity.DB().
		Preload("Patient").
        Preload("Patient.TypeOfPatient").
        Preload("Patient.Gender").
		Preload("WorksheetType").
        Table("diaries").
        Select("diaries.*").
        Joins("JOIN patients ON patients.id = diaries.pat_id").
        Joins("JOIN connection_requests ON connection_requests.pat_id = patients.id").
        Where("connection_requests.psy_id = ? AND connection_requests.status = ? AND diaries.is_public = ?", psyID, "connected", true).
        Find(&diaries).Error

    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{"data": diaries})
}