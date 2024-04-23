package controller

import (
	"be-pathfinder/schema"
	"be-pathfinder/service"
	"be-pathfinder/utilities"
	"net/http"
	"sync"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator"
	"github.com/rs/zerolog/log"
)

type Graph struct {
	graph map[string][]string
	mu    sync.RWMutex
}

var found bool
var countCompare int
var count int
var isMulti bool

func NewGraph() *Graph {
	return &Graph{
		graph: make(map[string][]string),
	}
}

func (g *Graph) AddEdge(u, v string) {
	g.mu.Lock()
	defer g.mu.Unlock()
	if _, ok := g.graph[u]; !ok {
		g.graph[u] = make([]string, 0)
	}
	g.graph[u] = append(g.graph[u], v)
}

func (g *Graph) IDDFS(start string, goal string, maxDepth int) [][]string {
	var allPaths [][]string
	var arr []string
	arr = append(arr, start)
	var wg sync.WaitGroup
	var mu sync.Mutex
	semaphore := make(chan struct{}, 200)
	var err error

	check := make(map[string]bool)
	for depth := 1; depth <= maxDepth; depth++ {
		if found {
			break
		}
		println("aaaa", len(arr))
		// scrap all and create edge
		var newUrls []string
		for i, url := range arr {
			if check[url] {
				continue
			}
			check[url] = true
			wg.Add(1)
			semaphore <- struct{}{} // Acquire a token
			go func(url string, i int) {
				collector := <-service.CollectorPool // Take a collector from the pool
				defer wg.Done()
				defer func() { <-semaphore }()
				defer func() { service.CollectorPool <- collector }() // Return it back when done
				var tempUrls []string
				if value, ok := service.Data.Load(url); ok {
					temp := value.([]schema.Data)
					for _, x := range temp {
						tempUrls = append(tempUrls, x.Url)
					}
				} else {
					var temp []schema.Data
					temp, _, _, err = utilities.ScrapeWikipedia("", url, collector, goal)
					if err != nil {
						log.Err(err).Msgf("Error scrap %v", url)
					}
					for _, x := range temp {
						tempUrls = append(tempUrls, x.Url)
					}
					service.Data.Store(url, temp)
				}

				for _, x := range tempUrls {
					g.AddEdge(url, x)
				}

				mu.Lock()
				count++
				newUrls = append(newUrls, tempUrls...)
				mu.Unlock()
			}(url, i)
		}

		wg.Wait()
		println("ne")
		arr = newUrls
		visited := make(map[string]bool)
		path := make([]string, 0)
		g.DLS(start, goal, depth, visited, &path, &allPaths)
	}
	return allPaths
}

func (g *Graph) DLS(node string, goal string, depth int, visited map[string]bool, path *[]string, allPaths *[][]string) {
	g.mu.RLock()
	defer g.mu.RUnlock()

	*path = append(*path, node)
	visited[node] = true

	if node == goal {
		found = true
		println("hei")
		newPath := make([]string, len(*path))
		copy(newPath, *path)
		*allPaths = append(*allPaths, newPath)
		// disini???
	} else if depth > 0 {

		for _, neighbor := range g.graph[node] {
			// println("aaaa")
			if found && !isMulti {
				break
			}
			if !visited[neighbor] {
				countCompare++
				g.DLS(neighbor, goal, depth-1, visited, path, allPaths)
			}
		}
	}

	// Backtrack cuy
	*path = (*path)[:len(*path)-1]
	visited[node] = false
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
	g := NewGraph()
	found = false

	start := request.Start
	goal := request.End
	maxDepth := 5
	count = 0
	countCompare = 0
	isMulti = request.IsMulti

	paths := g.IDDFS(start, goal, maxDepth)

	context.JSON(http.StatusOK, gin.H{"success": true, "total": count, "total_compare": countCompare, "result": paths})
}
