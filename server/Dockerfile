# Backend Dockerfile - Project Monitor API
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source files
COPY . .

# Expose port 5001
EXPOSE 5001

# Start the server
CMD ["node", "index.js"]
