CREATE TABLE url_mappings (
    "url" TEXT PRIMARY KEY,
    "related_urls" TEXT[]
);

CREATE INDEX idx_url ON url_mappings ("url");