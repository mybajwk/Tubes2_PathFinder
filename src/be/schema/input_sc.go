package schema

type InputBodyRequest struct {
	Start   string `json:"start" validate:"required"`
	End     string `json:"end" validate:"required"`
	IsMulti bool   `json:"is_multi"`
}
