FROM node:20-alpine

# Install pnpm
RUN npm install -g pnpm@latest

WORKDIR /app

# Copy all files (Railway will set build context to root)
COPY . .

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build web app
RUN pnpm --filter web build

# Expose port
EXPOSE 3000

# Start web app
CMD ["pnpm", "start:web"]
