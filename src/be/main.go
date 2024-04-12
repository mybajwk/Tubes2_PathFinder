package main

import (
	"context"
	"fmt"
	"log"
	"strings"
	"sync"

	"github.com/gocolly/colly/v2"
	"github.com/gocolly/colly/v2/queue"
)

func main() {
	var data sync.Map                                  //save map
	ctx, _ := context.WithCancel(context.Background()) // For graceful shutdown

	// Create a Collector specifically for Wikipedia
	c := colly.NewCollector(
		colly.AllowedDomains("en.wikipedia.org", "www.wikipedia.org"),
	)

	// Create a queue
	q, err := queue.New(
		10, // Number of consumer threads
		&queue.InMemoryQueueStorage{MaxSize: 10000},
	)
	if err != nil {
		log.Fatal("Failed to create a queue:", err)
	}

	// URLS
	startURL := "https://en.wikipedia.org/wiki/Joko_Widodo"
	targetURL := "https://en.wikipedia.org/wiki/Fallout_(video_game)"

	// Visit links found on pages
	c.OnHTML("a[href]", func(e *colly.HTMLElement) {
		select {
		case <-ctx.Done(): // Check
			return
		default:
			link := e.Attr("href")
			// Normalize  URL
			absLink := e.Request.AbsoluteURL(link)

			// Filter link
			if strings.HasPrefix(absLink, "https://en.wikipedia.org/wiki/") && !strings.Contains(link, ":") {
				if _, loaded := data.LoadOrStore(absLink, true); !loaded { // Check if already visitted
					// fmt.Println(absLink)
					if absLink == targetURL {
						fmt.Println("Found the target page!", absLink)
						// cancel()
						// return
					}
					q.AddURL(absLink)
				}
			}
		}
	})

	// Handle errors
	c.OnError(func(r *colly.Response, err error) {
		log.Println("Request URL:", r.Request.URL, "failed with response:", r, "\nError:", err)
	})

	// Add to queue
	q.AddURL(startURL)
	data.Store(startURL, true)

	go func() {
		<-ctx.Done() // Wait for the context to be cancelled
	}()
	q.Run(c)
}
