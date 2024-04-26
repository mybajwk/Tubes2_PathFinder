package utilities

import (
	"be-pathfinder/schema"
	"regexp"

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
	uniq := make(map[string]bool)
	found := false

	count := 0

	var foundURLs []schema.Data
	defer func() {
		foundURLs = nil
		// uniq = nil
	}()

	combinedRegex := regexp.MustCompile(`^/wiki/([^#:\s]+)$`)

	c.OnHTML("a[href]", func(e *colly.HTMLElement) {
		link := e.Attr("href")
		// fmt.Println("tes")
		if combinedRegex.MatchString(link) {
			fullLink := "https://en.wikipedia.org" + link
			if !isExcluded(link) {
				if fullLink == end && !found {
					// println(url, "", fullLink)
					foundURLs = append(foundURLs, schema.Data{Url: fullLink, Parent: parent + " " + fullLink})
					found = true
					return
				} else if !uniq[fullLink] {
					uniq[fullLink] = true
					count++
					foundURLs = append(foundURLs, schema.Data{Url: fullLink, Parent: parent + " " + fullLink})
				}
			}
		}

	})

	// Start the scraping process
	err := c.Visit(url)
	c.Wait()
	if err != nil {
		return nil, false, count, err
	}

	// Return the found Wikipedia URLs
	return foundURLs, found, count, nil
}
