package application

import (
	"fmt"
	"log"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/sunilkkhadka/artist-management-system/config"
	"github.com/sunilkkhadka/artist-management-system/server"
)

func Start(cfg *config.Config) {
	app := server.NewServer(cfg)

	app.Gin.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	server.ConfigureRoutes(app)

	fmt.Println("PORT = ", cfg.HTTP.Port)

	err := app.Run(cfg.HTTP.Port)
	if err != nil {
		log.Fatal("Port is already in use")
	}
}
