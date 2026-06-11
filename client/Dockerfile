# Use Node.js 20 base image
FROM node:20-slim AS base

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the Next.js application
# Note: Ensure environment variables are set during build if needed
RUN npm run build

# Expose the frontend port
EXPOSE 3003

# Start the application
CMD ["npm", "start"]
