// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.25.0
// source: query.sql

package repository

import (
	"context"
)

const getUrl = `-- name: GetUrl :one
SELECT
    url, related_urls
FROM
    url_mappings
WHERE
    "url" = $1
`

func (q *Queries) GetUrl(ctx context.Context, url string) (UrlMapping, error) {
	row := q.db.QueryRow(ctx, getUrl, url)
	var i UrlMapping
	err := row.Scan(&i.Url, &i.RelatedUrls)
	return i, err
}

const saveUrl = `-- name: SaveUrl :exec
INSERT INTO
    url_mappings(
        "url",
        "related_urls"
    )
VALUES(
    $1, $2
)
`

type SaveUrlParams struct {
	Url         string   `json:"url"`
	RelatedUrls []string `json:"related_urls"`
}

func (q *Queries) SaveUrl(ctx context.Context, arg SaveUrlParams) error {
	_, err := q.db.Exec(ctx, saveUrl, arg.Url, arg.RelatedUrls)
	return err
}
