package main

import (
	"fmt"
	"log"
	"net/url"
	"strings"
	"sync"

	"github.com/gocolly/colly/v2"
)

func maisn() {
	maxDepth := 5 // Maximum depth limit
	startURL := "https://en.wikipedia.org/wiki/Joko_Widodo"
	targetURL := "https://en.wikipedia.org/wiki/Mia_Khalifa"

	for depth := 1; depth <= maxDepth; depth++ {
		visited := sync.Map{} // Reset visited URLs for each iteration
		found := false

		// Define a new collector for each depth iteration
		c := colly.NewCollector(
			colly.AllowedDomains("en.wikipedia.org", "www.wikipedia.org"),
		)

		c.OnHTML("a[href]", func(e *colly.HTMLElement) {
			link := e.Attr("href")
			absLink := e.Request.AbsoluteURL(link)
			if isValidLink(absLink) && !found {
				if _, loaded := visited.LoadOrStore(absLink, true); !loaded {
					fmt.Printf("Depth: %d, visiting: %s\n", depth, absLink)
					if absLink == targetURL {
						fmt.Println("Found the target page!", absLink)
						found = true
						return
					}
					if depth > 1 { // Only visit links if we are not at the last depth level
						e.Request.Visit(absLink)
					}
				}
			}
		})

		// Visit the start URL
		err := c.Visit(startURL)
		if err != nil {
			log.Println("Failed to visit:", startURL, err)
			break
		}

		if found {
			break // Stop if the target URL has been found
		}
	}
}

// Check if the link is valid for visiting
func isValidLink(link string) bool {
	parsedURL, err := url.Parse(link)
	if err != nil {
		return false
	}
	return strings.HasPrefix(parsedURL.Path, "/wiki/") && !strings.Contains(parsedURL.Path, ":")
}
