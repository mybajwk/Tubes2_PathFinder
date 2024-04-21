package routes

import (
	"be-pathfinder/controller"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func SetupApiRoute(router *gin.Engine) {

	// router.Use(cors.Default())
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"*"}
	config.AllowHeaders = []string{"Authorization, content-type"}
	router.Use(cors.New(config))
	router.Use(gin.Recovery())

	setupProtectedRoute(router)

}

func setupProtectedRoute(router *gin.Engine) {
	protectedRoutes := router.Group("/api")

	protectedRoutes.POST("bfs", controller.BfsScrapping)
	protectedRoutes.POST("ids", controller.IdsScrapping)
}
