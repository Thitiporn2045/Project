package entity
import(
	"gorm.io/gorm"
)

type Diary struct{
	gorm.Model
	Name string
	IsPublic bool
	Picture string
	Start string
	End string

	PatID *uint `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	Patient Patient `gorm:"foreignKey:PatID"`
	
	WorksheetTypeID *uint
	WorksheetType WorksheetType `gorm:"foreignKey:WorksheetTypeID"`


	BehavioralExp []BehavioralExp `gorm:"foreignKey:DiaryID"`
	ActivityPlanning []ActivityPlanning `gorm:"foreignKey:DiaryID"`
	CrossSectional []CrossSectional `gorm:"foreignKey:DiaryID"`
	ActivityDiary []ActivityDiary `gorm:"foreignKey:DiaryID"`
	Comment []Comment `gorm:"foreignKey:PsyID"`

}