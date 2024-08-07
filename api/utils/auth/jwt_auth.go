package auth

import (
	"errors"
	"fmt"
	"log"
	"os"
	"strconv"
	"time"

	"github.com/golang-jwt/jwt"
	"github.com/joho/godotenv"
	"github.com/sunilkkhadka/artist-management-system/model"
)

type Claims struct {
	UserID uint   `json:"user_id"`
	Role   string `json:"role"`
	jwt.StandardClaims
}

type JwtEnvVars struct {
	JwtSecret         []byte
	JwtRefreshTime    int
	JwtExpirationTime int
}

var jwtConf JwtEnvVars

func init() {
	if err := godotenv.Load(); err != nil {
		log.Fatalf("Go Dot Env Initialization Error: %v", err)
	}

	err := LoadJwtEnv()
	if err != nil {
		log.Fatalf("JWT Initialization Error: %v", err)
	}
}

func LoadJwtEnv() error {
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		return errors.New("jwt secret key not found")
	}

	expirationTime, err := strconv.Atoi(os.Getenv("JWT_EXPIRATION_TIME"))
	if err != nil {
		return fmt.Errorf("invalid JWT expiration time: %w", err)
	}

	refreshTime, err := strconv.Atoi(os.Getenv("JWT_REFRESH_TIME"))
	if err != nil {
		return fmt.Errorf("invalid JWT refresh time: %w", err)
	}

	jwtConf = JwtEnvVars{
		JwtSecret:         []byte(secret),
		JwtRefreshTime:    refreshTime,
		JwtExpirationTime: expirationTime,
	}

	return nil
}

func GenerateToken(user model.User) (string, error) {
	claims := jwt.MapClaims{
		"user_id": user.ID,
		"role":    user.Role,
		"exp":     time.Now().Add(time.Minute * time.Duration(jwtConf.JwtExpirationTime)).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	accessToken, err := token.SignedString(jwtConf.JwtSecret)
	if err != nil {
		return "", fmt.Errorf("error generating access token: %w", err)
	}

	return accessToken, nil
}
