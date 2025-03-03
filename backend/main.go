package main

import (
	"github.com/gin-gonic/gin"
	"github.com/n6teen/Project-Thesis/controller"
	"github.com/n6teen/Project-Thesis/entity"
	middlewares "github.com/n6teen/Project-Thesis/middleware"
)
	
	
func main() {

	entity.SetupDatabase()
	r := gin.Default()
	r.Use(CORSMiddleware())
	
	r.POST("/loginPatient",controller.LoginPatient)
	r.POST("/patients", controller.CreatePatient)
	r.POST("/loginPsychologist", controller.LoginPsychologist)
	r.POST("/psychologists", controller.CreatePsychologist)

	r.GET("/gender",controller.ListGenders)
	router := r.Group("")
	{
		router.Use(middlewares.Authorizes())
		{
			//Patient Routes
			r.GET("/patients", controller.ListPatients)
			r.GET("/patient/:id", controller.GetPatient)
			r.GET("/pat/connection/:id", controller.GetConnectionPatientById)
			r.GET("/pat/getNote/:id", controller.GetNotesByPatientID)
			r.GET("/pat/workSheetType", controller.ListWorkSheetType)
			r.GET("/pat/getDiary/:id", controller.GetDiaryByPatientID)
			r.GET("/pat/Diary/Count", controller.CountDiariesByWorksheetType)
			r.GET("/pat/Diary/Count/ByPat/:id", controller.CountDiariesByWorksheetTypeAndPatID)
			r.GET("/pat/Diary/Count/NotPrivate/ByPat/:id", controller.GetNotPrivateDiaryCount)
			r.GET("/pat/getDiary/ByDiary", controller.GetDiaryByDiaryID)
			r.GET("/pat/get/Emotion/:id", controller.GetEmotionByPatientID)
			r.GET("/pat/get/CrossSectional/ByDiary", controller.GetCrossSectionalByDiaryID)
			r.GET("/pat/get/CrossSectional/Emotion/ByDiary", controller.GetEmotionsByDiaryID)
			r.GET("/pat/get/CrossSectional/Emotion/Date/ByDiary", controller.GetDateEmotionsByDiaryID)
			r.GET("/pat/get/CrossSectional/Emotion/Week/ByDiary", controller.GetWeekEmotionsByDiaryID)
			r.GET("/pat/get/CrossSectional/Emotion/Month/ByDiary", controller.GetMonthEmotionsByDiaryID)
			r.GET("/pat/get/CrossSectional/Date/Emotion/ByDiary", controller.GetEmotionsHaveDateByDiaryID)
			r.GET("/pat/get/Behavioral/ByDiary", controller.GetBehavioralExpByDiaryID)
			r.GET("/pat/get/Behavioral/Emotion/ByDiary", controller.GetEmotionsBehavioralExpByDiaryID)
			r.GET("/pat/get/Behavioral/Emotion/Date/ByDiary", controller.GetDateEmotionsBehavioralExpByDiaryID)
			r.GET("/pat/get/Behavioral/Emotion/Week/ByDiary", controller.GetWeekEmotionsBehavioralExpByDiaryID)
			r.GET("/pat/get/Behavioral/Emotion/Month/ByDiary", controller.GetMonthEmotionsBehavioralExpByDiaryID)
			r.GET("/pat/get/Behavioral/Date/Emotion/ByDiary", controller.GetEmotionsBehavioralExpHaveDateByDiaryID)
			r.GET("/pat/get/ActivityDiary/ByDiary", controller.GetActivityDiaryByDiaryID)
			r.GET("/pat/get/ActivityDiary/Date/ByDiary", controller.GetActivityDiaryEmotionsByDateAndDiaryID)
			r.GET("/pat/get/ActivityDiary/DateTime/ByDiary", controller.GetActivityDiaryEmotionsByDateTimeAndDiaryID)
			r.GET("/pat/get/ActivityDiary/Week/ByDiary", controller.GetActivityDiaryEmotionsByWeekAndDiaryID)
			r.GET("/pat/get/ActivityDiary/WeekTime/ByDiary", controller.GetWeeklyActivityDiarEmotionsByDiaryID)
			r.GET("/pat/get/ActivityDiary/Month/ByDiary", controller.GetMonthlyActivityDiarEmotionsByDiaryID)
			r.GET("/pat/get/ActivityDiary/All/ByDiary", controller.GetAllActivityDiarEmotionsByDiaryID)
			r.GET("/pat/get/ActivityPlanning/ByDiary", controller.GetActivityPlanningByDiaryID)
			r.GET("/pat/get/ActivityPlanning/Date/ByDiary", controller.GetPlanningEmotionsByDateAndDiaryID)
			r.GET("/pat/get/ActivityPlanning/DateTime/ByDiary", controller.GetPlanningEmotionsByDateTimeAndDiaryID)
			r.GET("/pat/get/ActivityPlanning/Week/ByDiary", controller.GetPlanningEmotionsByWeekAndDiaryID)
			r.GET("/pat/get/ActivityPlanning/Month/ByDiary", controller.GetPlanningEmotionsByMonthAndDiaryID)
			r.GET("/pat/get/ActivityPlanning/All/ByDiary", controller.GetAllPlanningEmotionsByDiaryID)

			
			r.GET("/pat/get/TimeOfDay", controller.ListTimeOfDays)
			r.GET("/pat/get/CrossSectional/WritingDates", controller.GetDiaryWritingDates)


			r.PATCH("/patients", controller.UpdatePatient)
			r.PATCH("/pat/update/Password",controller.UpdatePasswordPatient)
			r.PATCH("/pat/update/Note",controller.UpdateNotePatient)
			r.PATCH("/pat/update/DiaryPat", controller.UpdateDiaryPat)
			r.PATCH("/diaries/:id/toggle-public", controller.ToggleDiaryIsPublic)
			r.PATCH("/pat/update/Emotion", controller.UpdateEmotionByID)
			r.PATCH("/pat/update/CrossSectional", controller.UpdateCrossSectional)
			r.PATCH("/pat/update/Behavioral", controller.UpdateBehavioralExp)
			r.PATCH("/pat/update/ActivityDiary", controller.UpdateActivityDiary)
			r.PATCH("/pat/update/ActivityPlanning", controller.UpdateActivityPlanning)

			r.POST("/pat/checkPassword",controller.CheckOldPasswordPatient)
			r.POST("/pat/note",controller.CreateNotePat)
			r.POST("/pat/creatDiary",controller.CreateDiaryPat)	
			r.POST("/pat/creat/Emotion",controller.CreateEmotion)
			r.POST("/pat/creat/CrossSectional",controller.CreateCrossSectional)	
			r.POST("/pat/creat/Behavioral",controller.CreateBehavioralExp)	
			r.POST("/pat/creat/ActivityDiary",controller.CreateActivityDiary)	
			r.POST("/pat/creat/ActivityPlanning",controller.CreateActivityPlanning)	
			
			r.DELETE("/patients/:id", controller.DeletePatient)
			r.DELETE("/pat/delNote/:id", controller.DeleteNotePat)
			r.DELETE("/pat/del/Emotion/:id", controller.DeleteEmotion)
			r.DELETE("/pat/del/Diary/:id", controller.DeleteDiary)


			//Psychologist Routes
			r.GET("/patients/dash/:id",controller.ListPatientsForDashboard)

			r.GET("/psychologists", controller.ListPsychologists)
			r.GET("/psychologist/:id", controller.GetPsychologist)
			r.PATCH("/psychologists", controller.UpdatePsychologist)
			r.DELETE("/psychologist/:id", controller.DeletePsychologist)

			r.POST("/checkPassword",controller.CheckOldPasswordPsychologist)
			r.PATCH("/updatepassword",controller.UpdatePasswordPsychologist)

			r.GET("/typeOfPatients/:id",controller.ListTypeofPatient)
			r.GET("/typeOfpatient/listPats/:id",controller.ListConnectedPatientByType)
			r.POST("/typeOfPatient",controller.CreateTypeofPatient)
			r.PATCH("/typeOfPatient",controller.UpdateTypeOfPatient)
			r.DELETE("/typeOfPatient/:id",controller.DeleteTypeOfPatient)

			r.GET("/diaries/psy/:id",controller.ListPublicDiariesByPatientType)
			r.GET("/diary/psy/:id",controller.ListPublicDiariesByPatientId)
			r.GET("/crossSectional/psy/:id",controller.GetCrossSectionalByDiaryIDForPsy)
			r.GET("/activity/psy/:id",controller.GetActivityPlanningByDiaryIDForPsy)

			r.GET("/comments/:id",controller.ListCommentByDiaryId)
			r.POST("/comment",controller.CreateComment)
			r.PATCH("/comment",controller.UpdateComment)
			r.DELETE("/comment/:id",controller.DeleteComment)

			r.GET("/quickReplies/:id",controller.ListQuickReplies)
			r.POST("/quickReply",controller.CreateQuickReply)
			r.PATCH("/quickReply",controller.UpdateQuickReply)
			r.DELETE("/quickReply/:id",controller.DeleteQuickReply)

			r.GET("/workSchedules/:id",controller.ListWorkSchedule)
			r.POST("/workSchedule",controller.CreateWorkSchedule)
			r.DELETE("/workSchedule/:id",controller.DeleteWorkschedule)


			//Connection Request Routes
			r.POST("/connection/send",controller.SendConnectionRequest)
			r.PATCH("/connection/cancel",controller.CancelConnectionRequest)
			r.PATCH("/connection/:pat_id/:psy_id",controller.DisconnectPatient)
			r.PATCH("/connection/accept",controller.AcceptConnectionRequest)
			r.PATCH("/connection/reject",controller.RejectConnectionRequest)
			r.GET("/connection/psy/:id",controller.GetConnectionRequestById)
			r.GET("/connection/pat/:id",controller.ListConnectionPatientById)

		}
	}
	

	// Run the server
	r.Run()

}
	
	
func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE, PATCH")


		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()

	}

}