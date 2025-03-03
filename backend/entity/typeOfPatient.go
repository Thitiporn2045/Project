package entity
import(

	"gorm.io/gorm"
)

type TypeOfPatient struct{
	gorm.Model
	Name string `gorm:"uniqueIndex"`

	PsyID *uint  `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	Psychologist Psychologist `gorm:"foreignKey:PsyID"`

	Patient []Patient `gorm:"foreignKey:TypeID"`
}

