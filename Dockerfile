# Base image
FROM node:18.19-alpine3.19

# Set working directory
WORKDIR /usr/gawmas/src/app

# Copy app files
COPY . /usr/gawmas/src/app
COPY ui_entrypoint.sh /usr/local/bin/ui_entrypoint.sh

# Ensure entrypoint script is executable
RUN chmod +x /usr/local/bin/ui_entrypoint.sh

# Install dependencies
RUN npm install --save --legacy-peer-deps

# Set entrypoint to script, but keep CMD as the final command
ENTRYPOINT ["/usr/local/bin/ui_entrypoint.sh"]
CMD ["npm", "run", "docker"]
