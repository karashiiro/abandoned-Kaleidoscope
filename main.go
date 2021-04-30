package main

import (
	"embed"
	"fmt"
	"net"
	"net/http"
	"os"

	"github.com/karashiiro/Kaleidoscope/buildtime"
	log "github.com/sirupsen/logrus"
	"github.com/webview/webview"
)

//go:embed mirror/build/*
var mirror embed.FS

func initLogging() (*os.File, error) {
	log.SetReportCaller(true)
	log.SetFormatter(&log.JSONFormatter{})

	// Create log directory if it does not exist
	_, err := os.Stat("log/")
	if os.IsNotExist(err) {
		os.Mkdir("log/", 0644)
	}

	// Create and open log file
	var logFile *os.File
	logFile, err = os.OpenFile("log/kaleidoscope.log", os.O_RDWR|os.O_APPEND|os.O_CREATE, 0644)
	if err != nil {
		return nil, err
	}

	log.SetOutput(logFile)

	return logFile, nil
}

func main() {
	// Set up logger
	logFile, err := initLogging()
	if err != nil {
		log.Fatalln(err)
	}
	defer logFile.Close()

	// Serve from embedded filesystem
	listener, err := net.Listen("tcp", ":0") // Open a listener on any free port
	if err != nil {
		log.Fatalln(err)
	}

	port := listener.Addr().(*net.TCPAddr).Port

	go func() {
		err := http.Serve(listener, http.FileServer(http.FS(mirror)))
		if err != nil {
			log.Fatalln(err)
		}
	}()

	// Initialize webview
	w := webview.New(buildtime.Debug)
	defer w.Destroy()

	w.SetTitle("Kaleidoscope Mirror")
	w.SetSize(1280, 720, webview.HintNone)

	w.Navigate("http://localhost:" + fmt.Sprint(port) + "/mirror/build")
	w.Run()
}
