package config

import (
	"fmt"
	"strings"

	"github.com/rs/zerolog/log"
	"github.com/spf13/viper"
)

// Schema struct
type Schema struct {
	Env      string `mapstructure:"env"`
	Database struct {
		Host     string `mapstructure:"host"`
		Port     string `mapstructure:"port"`
		Db       string `mapstructure:"db"`
		Username string `mapstructure:"username"`
		Password string `mapstructure:"password"`
	} `mapstructure:"database"`
}

// Config global parameter config
var Config Schema

// Auto load config
func init() {
	config := viper.New()
	config.SetConfigName("config")
	config.AddConfigPath(".")       // Look for config in current directory
	config.AddConfigPath("config/") // Optionally look for config in the working directory.

	config.SetEnvKeyReplacer(strings.NewReplacer(".", "_"))
	config.AutomaticEnv()

	err := config.ReadInConfig() // Find and read the config file
	if err != nil {              // Handle errors reading the config file
		panic(fmt.Errorf("fatal error config file: %s", err))
	}

	err = config.Unmarshal(&Config)
	if err != nil { // Handle errors reading the config file
		panic(fmt.Errorf("fatal error config file: %s", err))
	}
	// log
	log.Info().Msgf("Current Config: %+v", Config)
}
