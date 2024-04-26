-- name: SaveUrl :exec
INSERT INTO
    url_mappings(
        "url",
        "related_urls"
    )
VALUES(
    $1, $2
);


-- name: GetUrl :one
SELECT
    *
FROM
    url_mappings
WHERE
    "url" = $1;