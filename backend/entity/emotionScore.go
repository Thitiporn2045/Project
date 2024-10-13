package entity
import(
	"gorm.io/gorm"
)

type Emotion struct{
	gorm.Model
	Name string `gorm:"uniqueIndex"`
	Emoticon string
	ColorCode string

	ActivityDiary []ActivityDiary `gorm:"foreignKey:EmotionID"`
	ActivityPlanning []ActivityPlanning `gorm:"foreignKey:EmotionID"`
	CrossSectional []CrossSectional `gorm:"foreignKey:EmotionID"`
}