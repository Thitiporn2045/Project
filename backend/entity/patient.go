package entity

import (

	"gorm.io/gorm"
)

type Patient struct{
	gorm.Model
	Firstname string
	Lastname string
	Dob string
	Tel string
	Email string `gorm:"uniqueIndex"`
	Password string
	Picture string
	Symtoms string
	IsTakeMedicine bool
	
	TypeID *uint 
	TypeOfPatient TypeOfPatient `gorm:"foreignKey:TypeID"`
	
	GenderID *uint
	Gender Gender `gorm:"foreignKey:GenderID"`

	Diary []Diary `gorm:"foreignKey:PatID"`
	ConnectionRequest []ConnectionRequest `gorm:"foreignKey:PatID"`
}