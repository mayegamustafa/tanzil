FROM node:20-alpine

# Install pnpm 9 (compatible with Node 20)
RUN npm install -g pnpm@9

WORKDIR /app

# Copy all files (Railway sets build context to repo root)
COPY . .

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build web app
RUN pnpm --filter web build

# Expose port
EXPOSE 3000

# Start web app
CMD ["pnpm", "start:web"]
