package entity
import (

	"gorm.io/gorm"
)

type TimeOfDay struct{
	gorm.Model
	Name string `gorm:"uniqueIndex"`
	Emoticon string
	ColorCode string

	ActivityPlanning []ActivityPlanning `gorm:"foreignKey:TimeOfDayID"`
}