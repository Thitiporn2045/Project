package entity
import(
	"gorm.io/gorm"
)

type ConnectionRequest struct{
	gorm.Model
	PatID *uint `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	PsyID *uint	`gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	Status string

	Patient Patient `gorm:"foreignKey:PatID"`
	Psychologist Psychologist `gorm:"foreignKey:PsyID"`
}