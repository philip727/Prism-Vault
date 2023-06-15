package utils

import "os"

func GetEnvVar(vn string) string {
    var varExtension string
    if os.Getenv("PRODUCTION") == "1" {
        varExtension = "_PRODUCTIOn" 
    }

    return os.Getenv(vn + varExtension)
}
