FROM node:20-alpine

# Install pnpm 9 (compatible with Node 20)
RUN npm install -g pnpm@9

WORKDIR /app

# Copy all files
COPY . .

# Install dependencies
RUN pnpm install --no-frozen-lockfile

# Build web app
RUN pnpm --filter web build

# Expose port
EXPOSE 3000

# Start web app
CMD ["pnpm", "--dir", "/app", "start:web"]
