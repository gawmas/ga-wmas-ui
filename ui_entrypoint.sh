#!/bin/sh

# Define the environment file path
env_file="/usr/gawmas/src/app/src/environments/environment.ts"

# Ensure the environments directory exists
mkdir -p $(dirname "$env_file")

# Write the environment variables to the file
echo "export const env = {" > "$env_file"
echo "  production: ${PROD_MODE}," >> "$env_file"
echo "  API_URL: \"${UI_API_URL}\"," >> "$env_file"
echo "  ADMIN_API_URL: \"${UI_ADMIN_API_URL}\"" >> "$env_file"
echo "};" >> "$env_file"

# Give some feedback
echo "$(date +"%Y-%m-%d %H:%M:%S") Generated environment.ts with the following content:"
cat "$env_file"

# Start the Angular application
exec "$@"
