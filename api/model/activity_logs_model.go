package model

type Activitylog struct {
	ID           uint   `json:"id"`
	UserID       uint   `json:"user_id"`
	URL          string `json:"url"`
	Action       string `json:"action"`
	Status       string `json:"status"`
	RequestData  string `json:"request_data"`
	ResponseData string `json:"response_data"`
}
