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

var JwtConf JwtEnvVars

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

	JwtConf = JwtEnvVars{
		JwtSecret:         []byte(secret),
		JwtRefreshTime:    refreshTime,
		JwtExpirationTime: expirationTime,
	}

	return nil
}

func GenerateToken(id uint, role string) (string, string, error) {
	accessTokenClaims := jwt.MapClaims{
		"user_id": id,
		"role":    role,
		"exp":     time.Now().Add(time.Minute * time.Duration(JwtConf.JwtExpirationTime)).Unix(),
	}

	refreshTokenClaims := jwt.MapClaims{
		"user_id": id,
		"role":    role,
		"exp":     time.Now().Add(time.Hour * 24 * time.Duration(JwtConf.JwtRefreshTime)).Unix(),
	}

	accessToken := jwt.NewWithClaims(jwt.SigningMethodHS256, accessTokenClaims)
	refreshToken := jwt.NewWithClaims(jwt.SigningMethodHS256, refreshTokenClaims)

	accessTokenString, err := accessToken.SignedString(JwtConf.JwtSecret)
	if err != nil {
		return "", "", fmt.Errorf("error generating access token: %w", err)
	}

	refreshTokenString, err := refreshToken.SignedString(JwtConf.JwtSecret)
	if err != nil {
		return "", "", fmt.Errorf("error generating refresh token: %w", err)
	}

	return accessTokenString, refreshTokenString, nil
}

func ValidateToken(tokenStr string, secret []byte) (jwt.MapClaims, error) {
	token, err := jwt.Parse(tokenStr, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, jwt.ErrSignatureInvalid
		}
		return secret, nil
	})

	if err != nil {
		return nil, err
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok || !token.Valid {
		return nil, errors.New("invalid token")
	}

	return claims, nil
}

func RefreshToken() {

}
