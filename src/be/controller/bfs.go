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
	var err error
	semaphore := make(chan struct{}, 200)

	found := false
	check := make(map[string]bool)
	var urls []schema.Data
	countCompare = 0
	// if value, ok := service.Data.Load(request.Start); ok {
	// 	urls = value.([]schema.Data)
	// 	for _, p := range urls {
	// 		countCompare++
	// 		if p.Url == request.End {
	// 			found = true
	// 			break
	// 		}
	// 	}
	// } else {
	urls, found, countCompare, err = utilities.ScrapeWikipedia(request.Start, request.Start, service.Collectors[0], request.End)
	if err != nil {
		log.Err(err).Msg("Error scrap")
		context.JSON(http.StatusOK, gin.H{"success": false})
	}
	service.Data.Store(request.Start, urls)
	// }
	result := []schema.Data{}
	if found || request.Start == request.End {
		result = append(result, schema.Data{Parent: request.Start})
	}
	count := 0
	for !found {
		newUrls := []schema.Data{}
		println("ini", len(urls))
		if len(urls) == 0 {
			log.Err(err).Msgf("Error scrap url not found")
			break
		}
		for i, url := range urls {
			if found && !request.IsMulti {
				var resArray [][]string
				for _, p := range result {
					arr := strings.Split(p.Parent, " ")
					arr = append(arr, request.End)
					resArray = append(resArray, arr)
				}
				context.JSON(http.StatusOK, gin.H{"success": true, "total": count, "total_compare": countCompare, "result": resArray[0:1]})
				return
			}
			if check[url.Url] {
				count++
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
				tempUrls, f, cc, err = utilities.ScrapeWikipedia(url.Parent, url.Url, collector, request.End)
				if err != nil {
					log.Err(err).Msgf("Error scrap %v", url)
				}

				mu.Lock()
				if !found {
					newUrls = append(newUrls, tempUrls...)
				}
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
		if arr[0] != request.End {
			arr = append(arr, request.End)
		}
		resArray = append(resArray, arr)
	}
	if request.IsMulti {
		context.JSON(http.StatusOK, gin.H{"success": true, "total": count, "total_compare": countCompare, "result": resArray})
	} else {
		context.JSON(http.StatusOK, gin.H{"success": true, "total": count, "total_compare": countCompare, "result": resArray[0:1]})
	}

}
