package controller

import (
	"be-pathfinder/schema"
	"be-pathfinder/service"
	"be-pathfinder/utilities"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator"
	"github.com/rs/zerolog/log"
)

var (
	total         int
	total_compare int
	res           string
)

func dfs(nodeVisited *map[string]bool, childVisited *map[string]bool, nearbyNode *map[string][]string, parent *map[string][]string, source string, target string, currentDepth int) {
	if currentDepth > 0 {
		(*nodeVisited)[source] = true
		_, ok := (*nearbyNode)[source]
		if !ok {
			total++
			total_compare++
			utilities.OptimizeScrapeWikipedia(source, service.Collectors[0], nearbyNode)
			total_compare += len((*nearbyNode)[source])
		}
		// fmt.Println("curDepth: ", currentDepth, " source: ", source)
		if !(*childVisited)[source] {
			for _, node := range (*nearbyNode)[source] {
				// fmt.Println("Node: ", node)
				(*parent)[node] = append((*parent)[node], source)
				if target == node {
					println("lohe")
					(*nodeVisited)[node] = true

				} else if !(*nodeVisited)[node] {
					dfs(nodeVisited, childVisited, nearbyNode, parent, node, target, currentDepth-1)
				}
			}
			(*childVisited)[source] = true
		}
		(*nodeVisited)[source] = false
	}
}

func ids(nearbyNode *map[string][]string, source string, target string, currentDepth int) map[string][]string {
	fmt.Println()
	fmt.Println("depth: ", currentDepth)
	nodeVisited := make(map[string]bool)
	childVisited := make(map[string]bool)
	parent := make(map[string][]string) //menunjukkan nilai parent
	// nodeVisited[source] = true
	dfs(&nodeVisited, &childVisited, nearbyNode, &parent, source, target, currentDepth)
	if !(nodeVisited)[target] && currentDepth < 5 {
		// fmt.Println("Nearby Node: ", nearbyNode)
		parent = ids(nearbyNode, source, target, currentDepth+1)
	}
	fmt.Println()
	return parent
}

func printParent(parent map[string][]string, current string, target string) {
	// fmt.Println(current)
	res += current + " "
	if current != target {
		fmt.Println("parentnya: ", parent[current])
		for _, node := range parent[current] {
			printParent(parent, node, target)
		}
	}
}

func IdsScrapping(context *gin.Context) {
	var request schema.InputBodyRequest

	if err := context.ShouldBindJSON(&request); err != nil {
		log.Err(err).Msg("Error Bind JSON")
		context.JSON(http.StatusOK, gin.H{"success": false, "message": "Error Bind JSON"})
		return
	}

	validator := validator.New()
	if err := validator.Struct(request); err != nil {
		log.Err(err).Msg("Error Validator")
		context.JSON(http.StatusOK, gin.H{"success": false, "message": "Error Validator"})
		return
	}
	total = 0
	total_compare = 0

	nearbyNode := make(map[string][]string)
	source := request.Start
	target := request.End
	result := ids(&nearbyNode, source, target, 0)

	printParent(result, target, source)
	context.JSON(http.StatusOK, gin.H{"success": true, "total": total, "total_compare": total_compare, "result": res})

}
