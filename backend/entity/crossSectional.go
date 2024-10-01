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
	Emotion string

	DiaryID *uint
	Diary Diary `gorm:"foreignKey:DiaryID"`

	EmotionID *uint
	EmotionScore EmotionScore `gorm:"foreignKey:EmotionID"`
}