package entity
import(
	"gorm.io/gorm"
)

type Diary struct{
	gorm.Model
	Name string
	IsPublic bool

	PatID *uint
	Patient Patient `gorm:"foreignKey:PatID"`
	
	WorksheetTypeID *uint
	WorksheetType WorksheetType `gorm:"foreignKey:WorksheetTypeID"`


	BehavioralExp []BehavioralExp `gorm:"foreignKey:DiaryID"`
	ActivityPlanning []ActivityPlanning `gorm:"foreignKey:DiaryID"`
	CrossSectional []CrossSectional `gorm:"foreignKey:DiaryID"`
	ActivityDiary []ActivityDiary `gorm:"foreignKey:DiaryID"`
	Comment []Comment `gorm:"foreignKey:PsyID"`

}