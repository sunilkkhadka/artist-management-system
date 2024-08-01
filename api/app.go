package application

import (
	"fmt"
	"log"

	"github.com/sunilkkhadka/artist-management-system/config"
	"github.com/sunilkkhadka/artist-management-system/server"
)

func Start(cfg *config.Config) {
	app := server.NewServer(cfg)

	server.ConfigureRoutes(app)

	fmt.Println("PORT = ", cfg.HTTP.Port)

	err := app.Run(cfg.HTTP.Port)
	if err != nil {
		log.Fatal("Port is already in use")
	}
}
