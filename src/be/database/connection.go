package database

import (
	"be-pathfinder/config"
	"context"
	"fmt"

	"github.com/jackc/pgx/v5/pgxpool"
)

var Database *pgxpool.Pool

func Connect() {
	// Get configuration
	host := config.Config.Database.Host
	username := config.Config.Database.Username
	password := config.Config.Database.Password
	databaseName := config.Config.Database.Db
	port := config.Config.Database.Port

	// Create a DSN string
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s TimeZone=Asia/Jakarta", host, username, password, databaseName, port)

	ctx := context.Background()
	var err error

	// Create a connection pool
	Database, err = pgxpool.New(ctx, dsn)
	if err != nil {
		panic(fmt.Sprintf("Unable to ping database: %v\n", err))
	}
}
