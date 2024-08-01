package server

import (
	"database/sql"

	"github.com/gin-gonic/gin"
	"github.com/sunilkkhadka/artist-management-system/config"
	"github.com/sunilkkhadka/artist-management-system/server/db"
)

type Server struct {
	Cfg *config.Config
	Gin *gin.Engine
	DB  *sql.DB
}

func NewServer(cfg *config.Config) *Server {
	return &Server{
		Cfg: cfg,
		Gin: gin.Default(),
		DB:  db.InitDB(cfg.DB),
	}
}

func (server *Server) Run(address string) error {
	return server.Gin.Run(":" + address)
}
