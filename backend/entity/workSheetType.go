package entity

import (
	"gorm.io/gorm"
)

type WorksheetType struct{
	gorm.Model
	NumberType int
	Name string

	Diary []Diary `gorm:"foreignKey:WorksheetTypeID"`
}