# Build Stage
FROM node:22-slim AS builder
WORKDIR /app

# Install dependencies needed for compiling
COPY package*.json ./
RUN npm ci

# Copy application source files
COPY . .

# Compile front-end assets and bundle high-performance Express server
RUN npm run build

# Production Runner Stage
FROM node:22-slim AS runner
WORKDIR /app

# Set runtime environment
ENV NODE_ENV=production
ENV PORT=8080

# Copy package files and install only standard production-essential packages
COPY package*.json ./
RUN npm ci --omit=dev

# Copy Compiled production files from the builder stage
COPY --from=builder /app/dist ./dist

# Expose port (Cloud Run will override via environment variable, but good for documentation)
EXPOSE 8080

# Start command running our highly optimized standalone bundled CommonJS server
CMD ["npm", "run", "start"]
