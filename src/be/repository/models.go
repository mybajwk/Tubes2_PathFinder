// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.25.0

package repository

import ()

type UrlMapping struct {
	Url         string   `json:"url"`
	RelatedUrls []string `json:"related_urls"`
}
