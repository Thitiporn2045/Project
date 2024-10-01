package entity
import(
	"gorm.io/gorm"
)

type Gender struct {
	gorm.Model
	Gender string `gorm:"uniqueIndex"`

	Patient []Patient `gorm:"foreignKey:GenderID"`
}