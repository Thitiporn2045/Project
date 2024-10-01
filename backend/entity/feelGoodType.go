package entity
import(
	"gorm.io/gorm"
)

type FeelGoodType struct{
	gorm.Model
	Name string

	ActivityDiary []ActivityDiary `gorm:"foreignKey:FeelGoodTypeID"`
}