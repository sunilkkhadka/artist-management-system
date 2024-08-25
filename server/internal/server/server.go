package server

import (
	"database/sql"

	"github.com/gin-gonic/gin"
	"github.com/sunilkkhadka/artist-management-system/internal/config"
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
		DB:  InitDB(cfg.DB),
	}
}

func (server *Server) Run(address string) error {
	return server.Gin.Run(":" + address)
}
