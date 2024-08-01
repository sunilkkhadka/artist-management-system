package main

import (
	"log"

	"github.com/joho/godotenv"
	application "github.com/sunilkkhadka/artist-management-system"
	"github.com/sunilkkhadka/artist-management-system/config"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Fatal("Error loading .env file")
	}
	application.Start(config.NewConfig())

}
