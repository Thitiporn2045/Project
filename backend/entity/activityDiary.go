package entity
import(
	"gorm.io/gorm"
)

type ActivityDiary struct{
	gorm.Model
	Date string
	Time string
	Activity string

	DiaryID *uint
	Diary Diary `gorm:"foreignKey:DiaryID"`

	EmotionID *uint
	EmotionScore EmotionScore `gorm:"foreignKey:EmotionID"`

	FeelGoodTypeID *uint
	FeelGoodType FeelGoodType `gorm:"foreignKey:FeelGoodTypeID"`
}