FROM node:20-alpine

# Install pnpm
RUN npm install -g pnpm@latest

WORKDIR /app

# Copy root files
COPY ../../pnpm-lock.yaml ./
COPY ../../package.json ./
COPY ../../pnpm-workspace.yaml ./
COPY ../../.pnpmrc ./
COPY ../../turbo.json ./

# Copy all apps
COPY ../../apps ./apps

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build web app
RUN pnpm --filter web build

# Expose port
EXPOSE 3000

# Start web app
CMD ["pnpm", "start:web"]
