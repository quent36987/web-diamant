# Base image
FROM node:16-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci #--silent

# Copy source files
COPY . .

# Build the TypeScript code
RUN npm run build

# Expose the server port
EXPOSE 3005

# Start the server
CMD ["npm", "start"]
