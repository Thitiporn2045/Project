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
			r.PATCH("/patients", controller.UpdatePatient)
			r.DELETE("/patients/:id", controller.DeletePatient)

			//Psychologist Routes
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
			

			//Connection Request Routes
			r.POST("/connection/send",controller.SendConnectionRequest)
			r.PATCH("/connection/cancel",controller.CancelConnectionRequest)
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