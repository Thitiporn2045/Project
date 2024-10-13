package entity
import(
	"gorm.io/gorm"
)

type WorksheetType struct{
	gorm.Model
	Name string

	Diary []Diary `gorm:"foreignKey:WorksheetTypeID"`
}