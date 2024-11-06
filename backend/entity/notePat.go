package entity
import(
	"gorm.io/gorm"
)

type NotePat struct {
	gorm.Model
	Title    string   
	Content  string   
	PatID    uint     
	Patient  Patient  `gorm:"foreignKey:PatID"` // Correct foreign key reference
}