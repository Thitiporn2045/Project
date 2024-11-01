package controller

import (
	"net/http"
	"github.com/gin-gonic/gin"
	"github.com/n6teen/Project-Thesis/entity"
)

//Psy
func SendConnectionRequest(c *gin.Context) { //POST
    var connectionRequest entity.ConnectionRequest

    if err := c.ShouldBindJSON(&connectionRequest); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    // Check if the patient already has a psychologist
    var existingConnection entity.ConnectionRequest
    if tx := entity.DB().Where("pat_id = ? AND status = ?", connectionRequest.PatID,"connected").First(&existingConnection).Error; 
    tx == nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "ผู้ป่วยอยู่ในการดูแลของนักจิตวิทยาท่านอื่นแล้ว"})
        return
    }

    if err := entity.DB().Where("pat_id = ? AND psy_id = ? AND status = ?", connectionRequest.PatID, connectionRequest.PsyID, "not_connect").First(&existingConnection).Error; err == nil {
        
        existingConnection.Status = "pending" // เปลี่ยนจาก not_connect เป็น pending
        if err := entity.DB().Save(&existingConnection).Error; err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "เกิดข้อผิดพลาดในการอัปเดตคำขอ"})
            return
        }
        c.JSON(http.StatusOK, gin.H{"data": "อัปเดตคำขอเรียบร้อยแล้ว"})
        return
    }
    
    if err := entity.DB().Create(&connectionRequest).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "เกิดข้อผิดพลาดในการส่งคำขอ"})
        return
    }
    c.JSON(http.StatusOK, gin.H{"data": "ส่งคำขอแล้ว"})
}

func CancelConnectionRequest(c *gin.Context){//PATCH
    var cancelConnectionRequest entity.ConnectionRequest
    var result entity.ConnectionRequest

    if err := c.ShouldBindJSON(&cancelConnectionRequest); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
    if tx := entity.DB().Where("id = ?", cancelConnectionRequest.ID).First(&result); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "connectionRequest not found"})
		return
	}

    if err := entity.DB().Save(&cancelConnectionRequest).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "เกิดข้อผิดพลาดในการยกเลิกคำขอ"})
		return
	}
    c.JSON(http.StatusOK, gin.H{"data": cancelConnectionRequest})

}

func GetConnectionRequestById(c *gin.Context){//For add pats function
    var connectionRequest []entity.ConnectionRequest
    
    psyID := c.Param("id")
    if err := entity.DB().Preload("Psychologist").Preload("Patient").Raw("SELECT * FROM connection_requests WHERE psy_id = ?",psyID).Find(&connectionRequest).Error;
    err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

    c.JSON(http.StatusOK, gin.H{"data": connectionRequest})	

}


//ปุ่มลบผู้ป่วย ต้องทำฟังก์ชันอัปเดต เป็น not_connect ================================================================

//Pat
func ListConnectionPatientById(c *gin.Context){
    var connectionRequest []entity.ConnectionRequest

    patID := c.Param("id")
    if err := entity.DB().Preload("Psychologist").Preload("Patient").Raw("SELECT * FROM connection_requests WHERE pat_id = ? AND status = ?",patID, "pending").Find(&connectionRequest).Error;
    err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

    c.JSON(http.StatusOK, gin.H{"data": connectionRequest})	
}

func GetConnectionPatientById(c *gin.Context){
    var connectionRequest entity.ConnectionRequest

    patID := c.Param("id")
    if err := entity.DB().Preload("Psychologist").Preload("Patient").Raw("SELECT * FROM connection_requests WHERE pat_id = ? AND status = ?",patID, "connected").Find(&connectionRequest).Error;
    err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

    c.JSON(http.StatusOK, gin.H{"data": connectionRequest})	
}

func AcceptConnectionRequest(c *gin.Context){
    var acceptConnectionRequest entity.ConnectionRequest
    var result entity.ConnectionRequest

    if err := c.ShouldBindJSON(&acceptConnectionRequest); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

    // Check if the patient already has a psychologist
    var existingConnection entity.ConnectionRequest
    if tx := entity.DB().Where("pat_id = ? AND status = ?", acceptConnectionRequest.PatID,"connected").First(&existingConnection).Error; 
    tx == nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "ผู้ป่วยอยู่ในการดูแลของนักจิตวิทยาท่านอื่นแล้ว"})
        return
    }

    if tx := entity.DB().Where("id = ?", acceptConnectionRequest.ID).First(&result); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "connectionRequest not found"})
		return
	}

    acceptConnectionRequest.Status = "connected"

    if err := entity.DB().Save(&acceptConnectionRequest).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "เกิดข้อผิดพลาดในการยอมรับคำขอ"})
		return
	}
    c.JSON(http.StatusOK, gin.H{"data": acceptConnectionRequest})

}

func RejectConnectionRequest(c *gin.Context){
    var rejectConnectionRequest entity.ConnectionRequest
    var result entity.ConnectionRequest

    if err := c.ShouldBindJSON(&rejectConnectionRequest); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
    if tx := entity.DB().Where("id = ?", rejectConnectionRequest.ID).First(&result); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "connectionRequest not found"})
		return
	}

    rejectConnectionRequest.Status = "not_connect"

    if err := entity.DB().Save(&rejectConnectionRequest).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "เกิดข้อผิดพลาดในการปฏิเสธคำขอ"})
		return
	}
    c.JSON(http.StatusOK, gin.H{"data": rejectConnectionRequest})

}


//--------------------------
// func GetConnectionPsychologistById(c *gin.Context){//For add pats function
//     var connectionRequest entity.ConnectionRequest
    
//     patID := c.Param("id")
//     if err := entity.DB().Preload("Psychologist").Preload("Patient").Raw("SELECT * FROM connection_requests WHERE pat_id = ? AND status = ?",patID, "connected").Find(&connectionRequest).Error;
//     err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 		return
// 	}

//     c.JSON(http.StatusOK, gin.H{"data": connectionRequest})	

// }