package entity
import(
	"gorm.io/gorm"
)

type Emotion struct{
	gorm.Model
	Name string
	Emoticon string
	ColorCode string
	PatID    uint `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`    

	ActivityDiary []ActivityDiary `gorm:"foreignKey:EmotionID"`
	ActivityPlanning []ActivityPlanning `gorm:"foreignKey:EmotionID"`
	CrossSectionals []CrossSectional `gorm:"many2many:cross_sectional_emotions;"`	
	BehavioralExp []BehavioralExp `gorm:"many2many:behavioral_exp_emotions"`
	Patient  Patient  `gorm:"foreignKey:PatID"` // Correct foreign key reference
	
}

