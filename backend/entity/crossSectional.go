package entity
import(
	"gorm.io/gorm"
)

type CrossSectional struct{
	gorm.Model
	Situation string
	Thought string
	Behavior string
	BodilySensation string
	TextEmotions string
	Date string

	DiaryID *uint `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	Diary Diary `gorm:"foreignKey:DiaryID"`

	Emotion   []Emotion `gorm:"many2many:cross_sectional_emotions;"` 
}