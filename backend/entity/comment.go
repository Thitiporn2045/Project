package entity
import(
	"gorm.io/gorm"
)

type Comment struct{
	gorm.Model
	Comment string

	PsyID *uint `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	Psychologist Psychologist `gorm:"foreignKey:PsyID"`

	DiaryID *uint `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	Diary Diary `gorm:"foreignKey:PsyID"`



}

type QuickReplies struct{
	gorm.Model
	Name string
	Message string

	PsyID *uint
	Psychologist Psychologist `gorm:"foreignKey:PsyID"`

}