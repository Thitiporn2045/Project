package entity
import(
	"gorm.io/gorm"
)

type ActivityDiary struct{
	gorm.Model
	Date string
	Time string
	Activity string

	DiaryID *uint `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	Diary Diary `gorm:"foreignKey:DiaryID"`

	EmotionID *uint
	Emotion Emotion `gorm:"foreignKey:EmotionID"`

	// FeelGoodTypeID *uint
	// FeelGoodType FeelGoodType `gorm:"foreignKey:FeelGoodTypeID"`
}