FROM node:20-alpine

# Install pnpm 9 (compatible with Node 20)
RUN npm install -g pnpm@9

WORKDIR /app

# Copy all files (Railway will set build context to root)
COPY . .

# Install dependencies
RUN pnpm --dir /app install --no-frozen-lockfile

# Build admin app
RUN pnpm --dir /app --filter admin build

# Expose port
EXPOSE 3000

# Start admin app
CMD ["pnpm", "--dir", "/app", "start:admin"]
