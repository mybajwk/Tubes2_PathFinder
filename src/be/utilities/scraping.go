package utilities

import (
	"be-pathfinder/database"
	"be-pathfinder/repository"
	"be-pathfinder/schema"
	"context"
	"regexp"
	"strings"

	"github.com/gocolly/colly/v2"
)

// func isValidLink(link string) bool {
// 	parsedURL, err := url.Parse(link)
// 	if err != nil {
// 		return false
// 	}
// 	return strings.HasPrefix(parsedURL.Path, "/wiki/")
// }

func isExcluded(link string) bool {
	if link == "/wiki/Main_Page" {
		return true
	}
	excludedNamespaces2 := []string{
		"Category:", "Wikipedia:", "File:", "Help:", "Portal:",
		"Special:", "Talk:", "User_template:", "Template_talk:", "Mainpage:", "Main_Page",
	}
	for _, ns := range excludedNamespaces2 {
		if regexp.MustCompile(`^` + regexp.QuoteMeta(ns)).MatchString(link) {
			return true
		}
	}
	return false
}

func ScrapeWikipedia(parent string, url string, c *colly.Collector, end string) ([]schema.Data, bool, int, error) {
	// defer wg.Done()
	ctx := context.Background()
	query := repository.New(database.Database)
	uniq := make(map[string]bool)
	found := false

	count := 0

	var foundURLs []schema.Data
	var urls []string
	defer func() {
		foundURLs = nil
		urls = nil
		// uniq = nil
	}()

	// check db
	dataUrls, err := query.GetUrl(ctx, url)
	if err == nil {
		for _, dataurl := range dataUrls.RelatedUrls {
			if dataurl == end && !found {
				foundURLs = append(foundURLs, schema.Data{Url: dataurl, Parent: parent + " " + dataurl})
				found = true
				// return
			} else if !uniq[dataurl] {
				count++
				foundURLs = append(foundURLs, schema.Data{Url: dataurl, Parent: parent + " " + dataurl})
			}
		}
		return foundURLs, found, count, nil
	}

	// not found do scrap

	combinedRegex := regexp.MustCompile(`^/wiki/([^#:\s]+)$`)

	c.OnHTML("a[href]", func(e *colly.HTMLElement) {
		link := e.Attr("href")
		// fmt.Println("tes")
		if combinedRegex.MatchString(link) {
			fullLink := "https://en.wikipedia.org" + link
			if isVisible(e) {
				if !isExcluded(link) {
					if fullLink == end && !found {
						// println(url, "", fullLink)
						foundURLs = append(foundURLs, schema.Data{Url: fullLink, Parent: parent + " " + fullLink})
						found = true
						// return
					} else if !uniq[fullLink] {
						if !found {
							count++
						}
						foundURLs = append(foundURLs, schema.Data{Url: fullLink, Parent: parent + " " + fullLink})
					}
					urls = append(urls, fullLink)
				}
			}
		}

	})

	// Start the scraping process
	err = c.Visit(url)
	c.Wait()
	if err != nil {
		return nil, false, count, err
	}

	// save to db

	data := repository.SaveUrlParams{
		Url:         url,
		RelatedUrls: urls,
	}
	_ = query.SaveUrl(ctx, data)

	// Return the found Wikipedia URLs
	return foundURLs, found, count, nil
}

func isVisible(e *colly.HTMLElement) bool {
	class := e.Attr("class")
	class = strings.ReplaceAll(class, " ", "")
	if strings.Contains(class, "nowraplinks") {
		return false
	}

	// Check parent elements for visibility
	for parent := e.DOM.Parent(); parent.Length() != 0; parent = parent.Parent() {
		parentClass, found := parent.Attr("class")
		parentClass = strings.ReplaceAll(parentClass, " ", "")
		if found && strings.Contains(parentClass, "nowraplinks") {
			// fmt.Println(e.Attr("href"))
			return false
		}
	}
	return true
}
