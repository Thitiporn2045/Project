package entity
import(
	"gorm.io/gorm"
)

type BehavioralExp struct{
	gorm.Model
	ThoughtToTest string
	Experiment string
	Outcome string
	NewThought string
	Date string

	DiaryID *uint `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	Diary Diary `gorm:"foreignKey:DiaryID"`

	Emotion   []Emotion `gorm:"many2many:behavioral_exp_emotions;"` 
}