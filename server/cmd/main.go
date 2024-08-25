package main

import (
	"log"

	"fmt"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/sunilkkhadka/artist-management-system/internal/config"
	"github.com/sunilkkhadka/artist-management-system/internal/routes"
	"github.com/sunilkkhadka/artist-management-system/internal/server"

	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Fatal("Error loading .env file")
	}

	Start(config.NewConfig())
}

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

	routes.ConfigureRoutes(app)

	fmt.Println("PORT = ", cfg.HTTP.Port)

	err := app.Run(cfg.HTTP.Port)
	if err != nil {
		log.Fatal("Port is already in use")
	}
}
