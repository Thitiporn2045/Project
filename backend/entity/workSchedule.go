package entity
import(
	"gorm.io/gorm"
)

type WorkSchedule struct{
	gorm.Model
	Topic string
	Date string
	StartTime string
	EndTime string

	PsyID *uint  `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	Psychologist Psychologist `gorm:"foreignKey:PsyID"`
}