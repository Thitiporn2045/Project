package entity
import(
	"gorm.io/gorm"
)

type FeelGoodType struct{
	gorm.Model
	Name string `gorm:"uniqueIndex"`

	ActivityDiary []ActivityDiary `gorm:"foreignKey:FeelGoodTypeID"`
}