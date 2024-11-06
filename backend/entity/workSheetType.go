package entity

import (
	"gorm.io/gorm"
)

type WorksheetType struct{
	gorm.Model
	NumberType int
	Picture string
	Name string
	Description string 

	Diary []Diary `gorm:"foreignKey:WorksheetTypeID"`
}