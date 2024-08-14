package middleware

import (
	"bytes"
	"database/sql"
	"encoding/json"
	"io/ioutil"
	"log"
	"math"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sunilkkhadka/artist-management-system/model"
	"github.com/sunilkkhadka/artist-management-system/request"
	"github.com/sunilkkhadka/artist-management-system/utils/constants"
)

type LoginRequest struct {
	Email string `json:"email" binding:"required,email" example:"user@example.com"`
}

var httpVerbToActionMap = map[string]string{
	http.MethodPost:   "create",
	http.MethodPut:    "edit",
	http.MethodDelete: "delete",
	http.MethodGet:    "view",
}

func ActivityLogs(db *sql.DB) gin.HandlerFunc {
	return func(ctx *gin.Context) {

		// Extract id from context
		userId, _ := ctx.Get(constants.USER_ID)

		// // Get HTTP method and the action
		httpMethod := ctx.Request.Method
		action := httpVerbToActionMap[httpMethod]

		// // Get request data from context
		var requestData interface{}
		requestData, _ = ctx.GetRawData()

		// // Set request data in the context for subsequent handlers
		ctx.Request.Body = ioutil.NopCloser(bytes.NewReader(requestData.([]byte)))

		// // Remove password from request data from register endpoint
		if ctx.Request.URL.String() == "/v1/register" {
			var user request.RegisterUserRequest
			err := json.Unmarshal(requestData.([]byte), &user)
			if err != nil {
				log.Fatalf("Couldn't unmarshal the data for register request: %v", err)
			}

			requestData, err = json.Marshal(user)
			if err != nil {
				log.Fatal("Couldn't marshal data for reigster request")
			}
		}

		// // Remove password from request data from login endpoint
		if ctx.Request.URL.String() == "/v1/login" {
			var user LoginRequest
			err := json.Unmarshal(requestData.([]byte), &user)
			if err != nil {
				log.Fatal("Couldn't unmarshal the data for login request")
			}

			requestData, err = json.Marshal(user)
			if err != nil {
				log.Fatal("Couldn't marshal data for login request")
			}
		}

		// // Prepare activity log data
		activityLog := model.Activitylog{
			UserID:      0,
			Action:      action,
			URL:         ctx.Request.URL.String(),
			Status:      "",
			RequestData: string(requestData.([]byte)),
		}

		// // Verfiy if id exists or not
		if userId != nil {
			activityLog.UserID = uint(math.Floor(userId.(float64)))
		} else {
			activityLog.UserID = 0
		}

		// // Call the next method
		ctx.Next()

		// // Check response status code
		statusCode := ctx.Writer.Status()
		if statusCode >= 400 {
			activityLog.Status = "failed"
		} else {
			activityLog.Status = "success"
		}

		// // Get response data from context
		responseData, exists := ctx.Get(constants.ACTIVITY_LOG)
		if exists {
			data, _ := json.Marshal(responseData)
			activityLog.ResponseData = string(data)
		}

		// // Save in database
		stmt, err := db.Prepare("INSERT INTO activitylogs (user_id, url, action, status, request_data, response_data, created_at, updated_at) VALUES (?,?,?,?,?,?,NOW(),NOW())")
		if err != nil {
			log.Fatal("couldn't prepare statement")
		}
		defer stmt.Close()

		_, err = stmt.Exec(activityLog.UserID, activityLog.URL, activityLog.Action, activityLog.Status, activityLog.RequestData, activityLog.ResponseData)
		if err != nil {
			log.Fatalf("couldn't store activity log in the database: %v", err)
		}

	}
}
