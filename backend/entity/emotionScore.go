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
	CrossSectionals []CrossSectional `gorm:"many2many:cross_sectional_emotions;"`	
	BehavioralExp []BehavioralExp `gorm:"many2many:Behavioral_Exp_emotions"`
	Patient  Patient  `gorm:"foreignKey:PatID"` // Correct foreign key reference
}