package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/n6teen/Project-Thesis/entity"
)

func ListCommentByDiaryId(c *gin.Context) {
	var comments []entity.Comment

	diaryID := c.Param("id")
	if err := entity.DB().Preload("Psychologist").Raw("SELECT * FROM comments where diary_id = ?", diaryID).Find(&comments).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return

	}

	c.JSON(http.StatusOK, gin.H{"data": comments})

}

func CreateComment(c *gin.Context) {

	var comment entity.Comment
	if err := c.ShouldBindJSON(&comment); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := entity.DB().Create(&comment).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "เกิดข้อผิดพลาด"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": "เพิ่มความคิดเห็นสำเร็จ!"})
}

func DeleteComment(c *gin.Context) {

	id := c.Param("id")

	if tx := entity.DB().Exec("DELETE FROM comments WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "comment not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": id})
}

func UpdateComment(c *gin.Context) {
	var comment entity.Comment
	var result entity.Comment

	if err := c.ShouldBindJSON(&comment); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if tx := entity.DB().Where("id = ?", comment.ID).First(&result); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "type not found"})
		return
	}
	if err := entity.DB().Save(&comment).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": comment})

}

//=========================== Quick Replies =========================

func ListQuickReplies(c *gin.Context) {
	var quickReplies []entity.QuickReplies

	psyID := c.Param("id")
	if err := entity.DB().Preload("Psychologist").Raw("SELECT * FROM quick_relies where psy_id = ?", psyID).Find(&quickReplies).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return

	}

	c.JSON(http.StatusOK, gin.H{"data": quickReplies})

}

func CreateQuickReply(c *gin.Context) {

	var quickReply entity.QuickReplies
	if err := c.ShouldBindJSON(&quickReply); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := entity.DB().Create(&quickReply).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "เกิดข้อผิดพลาด"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": "เพิ่มสำเร็จ!"})
}

func DeleteQuickReply(c *gin.Context) {

	id := c.Param("id")

	if tx := entity.DB().Exec("DELETE FROM quick_replies WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "item not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": id})
}

func UpdateQuickReply(c *gin.Context) {
	var quickReply entity.QuickReplies
	var result entity.QuickReplies

	if err := c.ShouldBindJSON(&quickReply); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if tx := entity.DB().Where("id = ?", quickReply.ID).First(&result); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "item not found"})
		return
	}
	if err := entity.DB().Save(&quickReply).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": quickReply})

}
