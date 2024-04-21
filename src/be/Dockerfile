FROM golang:1.21 as base

FROM base as dev

RUN curl -sSfL https://raw.githubusercontent.com/cosmtrek/air/master/install.sh | sh -s -- -b $(go env GOPATH)/bin

WORKDIR /go/src/api
CMD ["air"]

# ------------------------------------------------------------

FROM base as none
CMD ["echo", "Sorry, I am disabled"]

# ------------------------------------------------------------

FROM golang:alpine as builder

WORKDIR /go/src/api
# Get dependancies - will also be cached if we won't change mod/sum
COPY go.mod /go/src/api/
COPY go.sum /go/src/api/
RUN go mod download

COPY . /go/src/api
RUN go build -o ./dist/api

FROM alpine:3.16.6 as prod
# Install Chromium and required dependencies
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont

# Set environment variables for Chromium
ENV CHROME_BIN=/usr/bin/chromium-browser \
    CHROME_PATH=/usr/lib/chromium/

RUN apk add --update ca-certificates
RUN apk add --no-cache tzdata && \
  cp -f /usr/share/zoneinfo/Asia/Jakarta /etc/localtime && \
  apk del tzdata

COPY --from=builder /go/src/api/dist/api .
COPY ./config/config.yaml ./config.yaml

COPY ./arial.ttf ./arial.ttf
EXPOSE 3000
ENTRYPOINT ["./api"]

# ------------------------------------------------------------

FROM alpine:3.16.6 as local
# Install Chromium and required dependencies
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont

# Set environment variables for Chromium
ENV CHROME_BIN=/usr/bin/chromium-browser \
    CHROME_PATH=/usr/lib/chromium/

RUN apk add --update ca-certificates
RUN apk add --no-cache tzdata && \
  cp -f /usr/share/zoneinfo/Asia/Jakarta /etc/localtime && \
  apk del tzdata

COPY --from=builder /go/src/api/dist/api .
COPY ./config/config.yaml ./config.yaml

COPY ./arial.ttf ./arial.ttf
EXPOSE 3000
ENTRYPOINT ["./api"]