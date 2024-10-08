package entity
import(
	"gorm.io/gorm"
)

type EmotionScore struct{
	gorm.Model
	Score int `gorm:"uniqueIndex"`

	ActivityDiary []ActivityDiary `gorm:"foreignKey:EmotionID"`
	ActivityPlanning []ActivityPlanning `gorm:"foreignKey:EmotionID"`
	CrossSectional []CrossSectional `gorm:"foreignKey:EmotionID"`
}