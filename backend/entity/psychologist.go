package entity
import (

	"gorm.io/gorm"
)

type Psychologist struct{
	gorm.Model
	FirstName string
	LastName string
	Tel string
	Email string `gorm:"uniqueIndex"`
	Password string
	Picture string
	WorkingNumber string
	CertificateFile string
	IsApproved bool

	Patient []Patient `gorm:"foreignKey:PsyID"`
	TypeOfPatient []TypeOfPatient `gorm:"foreignKey:PsyID"`
	WorkSchedule []WorkSchedule `gorm:"foreignKey:PsyID"`
	ConnectionRequest []ConnectionRequest `gorm:"foreignKey:PsyID"`
	Comment []Comment `gorm:"foreignKey:PsyID"`
}