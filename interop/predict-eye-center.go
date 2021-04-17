package interop

type PredictEyeCenterArgs struct {
	Image  []byte `json:"image"`
	Bounds struct {
		Left   int `json:"left"`
		Top    int `json:"top"`
		Right  int `json:"right"`
		Bottom int `json:"bottom"`
	} `json:"bounds"`
}
