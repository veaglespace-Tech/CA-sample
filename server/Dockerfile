# Use Node.js 20 base image
FROM node:20-slim AS base

# Install openssl for Prisma
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm install

# Generate Prisma client
RUN npx prisma generate

# Copy source code
COPY . .

# Expose the backend port
EXPOSE 5003

# Start the server (auto-migrate on startup)
CMD ["sh", "-c", "npx prisma migrate deploy && node src/index.js"]

