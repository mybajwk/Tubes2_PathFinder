package controller

import (
	"be-pathfinder/schema"
	"be-pathfinder/service"
	"be-pathfinder/utilities"
	"net/http"
	"strings"
	"sync"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator"
	"github.com/rs/zerolog/log"
)

func BfsScrapping(context *gin.Context) {

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

	var wg sync.WaitGroup
	var mu sync.Mutex
	semaphore := make(chan struct{}, 200)

	found := false
	check := make(map[string]bool)

	urls, f, countCompare, err := utilities.ScrapeWikipedia(request.Start, request.Start, service.Collectors[0], request.End)
	if err != nil {
		log.Err(err).Msg("Error scrap")
		context.JSON(http.StatusOK, gin.H{"success": false})

	}
	result := []schema.Data{}
	if f || request.Start == request.End {
		found = true
		result = append(result, schema.Data{Parent: request.Start})

	}
	count := 0
	for !found {
		newUrls := []schema.Data{}
		println("ini", len(urls))
		for i, url := range urls {
			if found && !request.IsMulti {
				var resArray [][]string
				for _, p := range result {
					arr := strings.Split(p.Parent, " ")
					arr = append(arr, request.End)
					resArray = append(resArray, arr)
				}
				context.JSON(http.StatusOK, gin.H{"success": true, "total": count, "total_compare": countCompare, "result": resArray})
				return
			}
			if check[url.Url] {
				continue
			}
			check[url.Url] = true
			count++
			wg.Add(1)
			semaphore <- struct{}{} // Acquire a token
			go func(url schema.Data, i int) {
				collector := <-service.CollectorPool // Take a collector from the pool
				defer wg.Done()
				defer func() { <-semaphore }()
				defer func() { service.CollectorPool <- collector }() // Return it back when done
				var tempUrls []schema.Data
				var cc int
				var f bool
				if value, ok := service.Data.Load(url.Url); ok {

					tempUrls = value.([]schema.Data)
					for _, p := range tempUrls {
						cc++
						if p.Url == request.End {
							f = true
							break
						}
					}
				} else {
					tempUrls, f, cc, err = utilities.ScrapeWikipedia(url.Parent, url.Url, collector, request.End)
					if err != nil {
						log.Err(err).Msgf("Error scrap %v", url)
					}
					service.Data.Store(url.Url, tempUrls)
				}

				mu.Lock()
				newUrls = append(newUrls, tempUrls...)
				if f {
					result = append(result, url)
					found = true
				}
				countCompare += cc
				mu.Unlock()
			}(url, i)
		}
		wg.Wait()

		urls = newUrls

		if found {
			break
		}
	}

	var resArray [][]string
	for _, p := range result {
		arr := strings.Split(p.Parent, " ")
		arr = append(arr, request.End)
		resArray = append(resArray, arr)
	}

	context.JSON(http.StatusOK, gin.H{"success": true, "total": count, "total_compare": countCompare, "result": resArray})
}
