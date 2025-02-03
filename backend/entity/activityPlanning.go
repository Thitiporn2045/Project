package entity
import(
	"gorm.io/gorm"
)

type ActivityPlanning struct{
	gorm.Model
	Date string
	Time string
	Activity string

	TimeOfDayID *uint
	TimeOfDay TimeOfDay `gorm:"foreignKey:TimeOfDayID"`

	DiaryID *uint `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	Diary Diary `gorm:"foreignKey:DiaryID"`

	EmotionID *uint
	Emotion Emotion `gorm:"foreignKey:EmotionID"`
}