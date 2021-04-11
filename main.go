package main

import (
	"embed"
	"fmt"
	"net"
	"net/http"

	"github.com/karashiiro/Kaleidoscope/buildtime"
	"github.com/webview/webview"
)

//go:embed mirror
var mirror embed.FS

func main() {
	// Serve from embedded filesystem
	listener, err := net.Listen("tcp", ":0")
	if err != nil {
		panic(err)
	}

	port := listener.Addr().(*net.TCPAddr).Port

	go http.Serve(listener, nil)

	// Initialize webview
	w := webview.New(buildtime.Debug)
	defer w.Destroy()
	w.SetTitle("Kaleidoscope Mirror")
	w.SetSize(800, 600, webview.HintNone)
	w.Navigate("http://localhost:" + fmt.Sprint(port))
	w.Run()
}
