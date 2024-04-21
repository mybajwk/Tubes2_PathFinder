package main

import (
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

	routes.SetupApiRoute(router)
	var port string = os.Getenv("PORT")

	if port == "" {
		port = "3000"
	}
	router.Run(":" + port)
}

// func main() {
// 	var data sync.Map                                  //save map
// 	ctx, _ := context.WithCancel(context.Background()) // For graceful shutdown

// 	// Create a Collector specifically for Wikipedia
// 	c := colly.NewCollector(
// 		colly.AllowedDomains("en.wikipedia.org", "www.wikipedia.org"),
// 	)
// 	baseURL := "https://en.wikipedia.org"

// 	// Fetch the robots.txt file
// 	resp, err := http.Get(baseURL + "/robots.txt")
// 	if err != nil {
// 		log.Fatal("Failed to fetch robots.txt:", err)
// 	}
// 	defer resp.Body.Close()

// 	// Parse the robots.txt file
// 	robotsData, err := robotstxt.FromResponse(resp)
// 	if err != nil {
// 		log.Fatal("Failed to parse robots.txt:", err)
// 	}

// 	// Check if the user-agent is allowed to access a specific path
// 	group := robotsData.FindGroup("*") // "*" for any user-agent, or specify your user-agent

// 	c.OnRequest(func(r *colly.Request) {
// 		if !group.Test(r.URL.Path) {
// 			// Block the request if the path is disallowed
// 			fmt.Printf("Blocked by robots.txt: %s\n", r.URL)
// 			r.Abort()
// 		}
// 	})
// 	// Create a queue
// 	q, err := queue.New(
// 		10, // Number of consumer threads
// 		&queue.InMemoryQueueStorage{MaxSize: 10000},
// 	)
// 	if err != nil {
// 		log.Fatal("Failed to create a queue:", err)
// 	}

// 	// URLS
// 	startURL := "https://en.wikipedia.org/wiki/Joko_Widodo"
// 	targetURL := "https://en.wikipedia.org/wiki/Mia_Khalifa"

// 	// Visit links found on pages
// 	c.OnHTML("a[href]", func(e *colly.HTMLElement) {
// 		select {
// 		case <-ctx.Done(): // Check
// 			return
// 		default:
// 			link := e.Attr("href")
// 			// Normalize  URL
// 			absLink := e.Request.AbsoluteURL(link)

// 			// Filter link
// 			if strings.HasPrefix(absLink, "https://en.wikipedia.org/wiki/") && !strings.Contains(link, ":") {
// 				if _, loaded := data.LoadOrStore(absLink, true); !loaded { // Check if already visitted
// 					// fmt.Println(absLink)
// 					if absLink == targetURL {
// 						fmt.Println("Found the target page!", absLink)
// 						// cancel()
// 						// return
// 					}
// 					q.AddURL(absLink)
// 				}
// 			}
// 		}
// 	})

// 	// Handle errors
// 	c.OnError(func(r *colly.Response, err error) {
// 		log.Println("Request URL:", r.Request.URL, "failed with response:", r, "\nError:", err)
// 	})

// 	// Add to queue
// 	q.AddURL(startURL)
// 	data.Store(startURL, true)

// 	go func() {
// 		<-ctx.Done() // Wait for the context to be cancelled
// 	}()
// 	q.Run(c)
// }
