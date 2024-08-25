package email

import (
	"bytes"
	"html/template"
	"log"
	"os"
	"strconv"

	"github.com/joho/godotenv"
	"github.com/sunilkkhadka/artist-management-system/pkg/utils/constants"
	"gopkg.in/gomail.v2"
)

var emailConfig *EmailConfig

type EmailConfig struct {
	Host     string
	Port     int
	Username string
	Password string
}

func LoadEmailConfig() *EmailConfig {

	err := godotenv.Load()
	if err != nil {
		log.Println("Error loading .env file")
	}

	emailPort, err := strconv.Atoi(os.Getenv("EMAIL_PORT"))
	if err != nil {
		log.Fatal(err)
	}

	return &EmailConfig{
		Host:     os.Getenv("EMAIL_HOST"),
		Port:     emailPort,
		Username: os.Getenv("EMAIL_USERNAME"),
		Password: os.Getenv("EMAIL_PASSWORD"),
	}
}

func init() {
	emailConfig = LoadEmailConfig()

}

func sendEmail(templatePath, senderEmail, receiverEmail, subject string, data any) {
	var body bytes.Buffer
	t, err := template.ParseFiles(templatePath)
	if err != nil {
		log.Fatal("Template not found")
	}
	t.Execute(&body, data)

	m := gomail.NewMessage()

	m.SetHeader("From", senderEmail)
	m.SetHeader("To", receiverEmail)
	m.SetHeader("Subject", subject)
	m.SetBody("text/html", body.String())

	dialer := gomail.NewDialer(emailConfig.Host, emailConfig.Port, emailConfig.Username, emailConfig.Password)
	if err := dialer.DialAndSend(m); err != nil {
		panic(err)
	}
}

func SendLoginEmail(name, receiverEmail, createdAt, userAgent string) {
	loginData := struct {
		Name   string
		Email  string
		Time   string
		Device string
	}{
		Name:   name,
		Email:  emailConfig.Username,
		Time:   createdAt,
		Device: userAgent,
	}

	sendEmail("resources/login.html", emailConfig.Username, receiverEmail, constants.LOGIN_TITLE, loginData)
}

func SendRegisterEmail(name, receiverEmail string) {
	registerData := struct {
		Name  string
		Email string
	}{
		Name:  name,
		Email: receiverEmail,
	}

	sendEmail("resources/register.html", emailConfig.Username, receiverEmail, constants.REGISTER_TITLE, registerData)
}

func SendContactAlertEmail(senderEmail, senderName, messageTitle, messageBody string) {
	message := struct {
		Email string
		Name  string
		Title string
		Body  string
	}{
		Name:  senderName,
		Email: senderEmail,
		Title: messageTitle,
		Body:  messageBody,
	}

	sendEmail("resources/contact-us.html", senderEmail, emailConfig.Username, constants.NEW_MESSAGE_TITLE, message)
}
