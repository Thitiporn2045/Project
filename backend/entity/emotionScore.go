package entity
import(
	"gorm.io/gorm"
)

type Emotion struct{
	gorm.Model
	Name string `gorm:"uniqueIndex"`
	Emoticon string
	ColorCode string
	PatID    uint     

	ActivityDiary []ActivityDiary `gorm:"foreignKey:EmotionID"`
	ActivityPlanning []ActivityPlanning `gorm:"foreignKey:EmotionID"`
	CrossSectional []CrossSectional `gorm:"foreignKey:EmotionID"`
	BehavioralExp []BehavioralExp `gorm:"foreignKey:EmotionID"`
	Patient  Patient  `gorm:"foreignKey:PatID"` // Correct foreign key reference
}