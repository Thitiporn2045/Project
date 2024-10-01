package entity
import(
	"gorm.io/gorm"
)

type ActivityPlanning struct{
	gorm.Model
	Date string
	Time string
	Activity string
	IsDone bool

	DiaryID *uint
	Diary Diary `gorm:"foreignKey:DiaryID"`

	EmotionID *uint
	EmotionScore EmotionScore `gorm:"foreignKey:EmotionID"`
}