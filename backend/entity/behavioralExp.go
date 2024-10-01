package entity
import(
	"gorm.io/gorm"
)

type BehavioralExp struct{
	gorm.Model
	ThoughtToTest string
	Experiment string
	Predict string
	Outcome string
	NewThought string

	DiaryID *uint
	Diary Diary `gorm:"foreignKey:DiaryID"`
}