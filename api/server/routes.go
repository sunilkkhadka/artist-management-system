package server

import "github.com/gin-gonic/gin"

func ConfigureRoutes(server *Server) {
	server.Gin.GET("/", func(context *gin.Context) {
		context.JSON(200, map[string]any{
			"message": "Server is running..",
		})
	})
}
