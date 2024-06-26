package main

import (
	"be-pathfinder/database"
	"be-pathfinder/routes"
	"be-pathfinder/service"
	"os"
	"runtime"

	"github.com/gin-contrib/gzip"
	"github.com/gin-gonic/gin"
)

func main() {
	runtime.GOMAXPROCS(runtime.NumCPU())
	router := gin.Default()
	router.Use(gzip.Gzip(gzip.DefaultCompression))
	// init
	service.InitColly(200)
	database.Connect()

	routes.SetupApiRoute(router)
	var port string = os.Getenv("PORT")

	if port == "" {
		port = "7780"
	}
	router.Run(":" + port)
}
