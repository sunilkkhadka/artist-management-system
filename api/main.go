package main

import "github.com/gin-gonic/gin"

func main() {
	server := gin.Default()

	server.GET("/healthcheck", func(ctx *gin.Context) {
		ctx.JSON(200, map[string]string{
			"status":  "running",
			"message": "ok",
		})
	})

	server.Run()

}
