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

	TimeOfDayID *uint
	TimeOfDay TimeOfDay `gorm:foreignKey:TimeOfDayID`

	DiaryID *uint
	Diary Diary `gorm:"foreignKey:DiaryID"`

	EmotionID *uint
	Emotion Emotion `gorm:"foreignKey:EmotionID"`
}