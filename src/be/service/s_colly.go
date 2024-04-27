package service

import (
	"sync"
	"time"

	"github.com/gocolly/colly/v2"
)

var Collectors [200]*colly.Collector
var CollectorPool chan *colly.Collector
var Data sync.Map

func InitColly(n int) {
	CollectorPool = make(chan *colly.Collector, n) // Initialize the pool with the capacity of n
	for i := 0; i < n; i++ {
		Collectors[i] = colly.NewCollector(
			colly.AllowedDomains("en.wikipedia.org", "www.wikipedia.org"),
			colly.AllowURLRevisit(),
			colly.Async(true),
			colly.CacheDir(""),
		)

		Collectors[i].UserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"
		Collectors[i].SetRequestTimeout(15 * time.Second)
		Collectors[i].Limit(&colly.LimitRule{
			DomainGlob:  "*wikipedia.org*", // Adjust according to your target domain
			Parallelism: 5,                 // Number of parallel requests to the domain
			// Delay:       0,1 * time.Second,   // Wait time between requests to the domain
		})
		CollectorPool <- Collectors[i] // Add the collector to the pool
	}
}
