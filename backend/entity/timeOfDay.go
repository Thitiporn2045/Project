package entity
import (

	"gorm.io/gorm"
)

type TimeOfDay struct{
	gorm.Model
	Name string

	ActivityPlanning []ActivityPlanning `gorm:"foreignKey:TimeOfDayID"`
}